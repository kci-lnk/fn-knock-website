#!/usr/bin/env node

import { createHash } from 'node:crypto'
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync, mkdirSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const siteDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const rootDir = resolve(
  process.env.FN_KNOCK_SOURCE_DIR ?? join(siteDir, '..', 'fn-knock-turborepo'),
)
const goDir = resolve(
  process.env.FN_KNOCK_GO_REAUTH_PROXY_DIR ?? join(siteDir, '..', 'Go-Reauth-Proxy'),
)
const acmeshRsDir = resolve(process.env.FN_KNOCK_ACMESH_RS_DIR ?? join(siteDir, '..', 'acmesh-rs'))
const outputPath = join(siteDir, 'public/sbom/third-party-software-disclosure.cdx.json')

const requiredFiles = [
  join(rootDir, 'package-lock.json'),
  join(rootDir, 'apps/server-admin-rs/Cargo.lock'),
  join(rootDir, 'apps/fn-knock-desktop/native/Cargo.lock'),
  join(goDir, 'go.mod'),
  join(acmeshRsDir, 'Cargo.lock'),
]
for (const path of requiredFiles) {
  if (!existsSync(path)) {
    throw new Error(
      `Required SBOM input is missing: ${path}. Set FN_KNOCK_GO_REAUTH_PROXY_DIR or FN_KNOCK_ACMESH_RS_DIR when the companion repositories are elsewhere.`,
    )
  }
}

const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'))
const run = (command, args, cwd = rootDir) =>
  execFileSync(command, args, {
    cwd,
    encoding: 'utf8',
    maxBuffer: 256 * 1024 * 1024,
  }).trim()
const sha256File = (path) => createHash('sha256').update(readFileSync(path)).digest('hex')
const repoCommit = (cwd) => run('git', ['rev-parse', 'HEAD'], cwd)
const encodeSegment = (value) => encodeURIComponent(value)
const sorted = (values) => [...new Set(values)].sort()

const npmPurl = (name, version) => {
  if (name.startsWith('@')) {
    const [scope, packageName] = name.slice(1).split('/')
    return `pkg:npm/%40${encodeSegment(scope)}/${encodeSegment(packageName)}@${encodeSegment(version)}`
  }
  return `pkg:npm/${encodeSegment(name)}@${encodeSegment(version)}`
}
const cargoPurl = (name, version) => `pkg:cargo/${encodeSegment(name)}@${encodeSegment(version)}`
const goPurl = (name, version) =>
  `pkg:golang/${name.split('/').map(encodeSegment).join('/')}@${encodeSegment(version)}`

const normalizeLicense = (license) => {
  if (!license) return 'NOASSERTION'
  const value = Array.isArray(license) ? license.join(' OR ') : String(license)
  return value
    .replace(/\s*\/\s*/g, ' OR ')
    .replace(/\bApache 2(?:\.0)?\b/gi, 'Apache-2.0')
    .replace(/\bApache-2(?!\.)\b/g, 'Apache-2.0')
    .replace(/\bBSD-3-Clause OR MIT OR Apache-2\.0\b/g, 'BSD-3-Clause OR MIT OR Apache-2.0')
    .replace(/\s+OR\s+/g, ' OR ')
    .trim()
}

const componentMap = new Map()
const dependencyMap = new Map()

const propertyValue = (component, name) =>
  component.properties?.find((property) => property.name === name)?.value

const makeProperties = ({
  ecosystem,
  scopes = ['runtime'],
  relationship = 'transitive',
  usedBy = [],
  manifests = [],
  evidence = [],
  versionResolution,
}) => {
  const properties = [
    { name: 'fn-knock:ecosystem', value: ecosystem },
    { name: 'fn-knock:scope', value: sorted(scopes).join(',') },
    { name: 'fn-knock:relationship', value: relationship },
  ]
  if (usedBy.length) {
    properties.push({
      name: 'fn-knock:used-by',
      value: sorted(usedBy).join(', '),
    })
  }
  if (manifests.length) {
    properties.push({
      name: 'fn-knock:source-manifest',
      value: sorted(manifests).join(', '),
    })
  }
  if (evidence.length) {
    properties.push({
      name: 'fn-knock:evidence',
      value: sorted(evidence).join(', '),
    })
  }
  if (versionResolution) {
    properties.push({
      name: 'fn-knock:version-resolution',
      value: versionResolution,
    })
  }
  return properties
}

const mergeProperty = (current, incoming, name, separator = ',') => {
  const currentValue = propertyValue(current, name)
  const incomingValue = propertyValue(incoming, name)
  if (!incomingValue) return
  const values = sorted([
    ...(currentValue?.split(separator).map((value) => value.trim()) ?? []),
    ...incomingValue.split(separator).map((value) => value.trim()),
  ]).filter(Boolean)
  const property = current.properties.find((item) => item.name === name)
  if (property) property.value = values.join(separator === ',' ? ',' : ', ')
  else current.properties.push({ name, value: incomingValue })
}

const addComponent = (component) => {
  const ref = component['bom-ref']
  const current = componentMap.get(ref)
  if (!current) {
    componentMap.set(ref, component)
    dependencyMap.set(ref, dependencyMap.get(ref) ?? new Set())
    return component
  }
  for (const name of [
    'fn-knock:scope',
    'fn-knock:used-by',
    'fn-knock:source-manifest',
    'fn-knock:evidence',
  ]) {
    mergeProperty(current, component, name, name === 'fn-knock:scope' ? ',' : ', ')
  }
  if (propertyValue(component, 'fn-knock:relationship') === 'direct') {
    const relationship = current.properties.find((item) => item.name === 'fn-knock:relationship')
    relationship.value = 'direct'
  }
  return current
}

const addDependency = (from, to) => {
  if (from && to && from !== to) {
    const targets = dependencyMap.get(from) ?? new Set()
    targets.add(to)
    dependencyMap.set(from, targets)
  }
}

const externalReferences = ({ repository, homepage, distribution }) => {
  const references = []
  if (repository) references.push({ type: 'vcs', url: repository })
  if (homepage && homepage !== repository) {
    references.push({ type: 'website', url: homepage })
  }
  if (distribution) {
    references.push({ type: 'distribution', url: distribution })
  }
  return references.length ? references : undefined
}

const makeComponent = ({
  ref,
  type = 'library',
  name,
  version,
  license,
  purl,
  hashes,
  repository,
  homepage,
  distribution,
  ecosystem,
  scopes,
  relationship,
  usedBy,
  manifests,
  evidence,
  versionResolution,
  optional = false,
}) => {
  const component = {
    type,
    'bom-ref': ref,
    name,
    ...(version ? { version } : {}),
    ...(purl ? { purl } : {}),
    scope: optional ? 'optional' : 'required',
    licenses: [{ expression: normalizeLicense(license) }],
    ...(hashes?.length ? { hashes } : {}),
    ...(externalReferences({
      repository,
      homepage,
      distribution,
    })
      ? {
          externalReferences: externalReferences({
            repository,
            homepage,
            distribution,
          }),
        }
      : {}),
    properties: makeProperties({
      ecosystem,
      scopes,
      relationship,
      usedBy,
      manifests,
      evidence,
      versionResolution,
    }),
  }
  return addComponent(component)
}

const walkWorkspaceManifests = () => {
  const rootPackage = readJson(join(rootDir, 'package.json'))
  const paths = [join(rootDir, 'package.json')]
  for (const workspace of rootPackage.workspaces ?? []) {
    if (!workspace.includes('*')) {
      const path = join(rootDir, workspace, 'package.json')
      if (existsSync(path)) paths.push(path)
      continue
    }
    const base = join(rootDir, workspace.slice(0, workspace.indexOf('*')))
    for (const entry of readdirSync(base)) {
      const path = join(base, entry, 'package.json')
      if (existsSync(path)) paths.push(path)
    }
  }
  return paths
}

const npmDirect = new Map()
for (const manifestPath of walkWorkspaceManifests()) {
  const manifest = readJson(manifestPath)
  const label = manifest.name ?? relative(rootDir, dirname(manifestPath))
  for (const [field, scope] of [
    ['dependencies', 'runtime'],
    ['optionalDependencies', 'optional'],
    ['peerDependencies', 'runtime'],
    ['devDependencies', 'development'],
  ]) {
    for (const name of Object.keys(manifest[field] ?? {})) {
      const item = npmDirect.get(name) ?? {
        scopes: new Set(),
        usedBy: new Set(),
      }
      item.scopes.add(scope)
      item.usedBy.add(label)
      npmDirect.set(name, item)
    }
  }
}

const packageLock = readJson(join(rootDir, 'package-lock.json'))
for (const [path, entry] of Object.entries(packageLock.packages ?? {})) {
  if (!path.includes('node_modules/') || entry.link || !entry.version) continue
  const name = entry.name ?? path.slice(path.lastIndexOf('node_modules/') + 13)
  const ref = npmPurl(name, entry.version)
  const direct = npmDirect.get(name)
  const scopes = direct ? [...direct.scopes] : [entry.dev ? 'development' : 'runtime']
  if (entry.optional) scopes.push('optional')
  const hashes = []
  const integrity = entry.integrity?.match(/^sha(256|384|512)-(.+)$/i)
  if (integrity) {
    hashes.push({
      alg: `SHA-${integrity[1]}`,
      content: Buffer.from(integrity[2], 'base64').toString('hex'),
    })
  }
  makeComponent({
    ref,
    name,
    version: entry.version,
    license: entry.license,
    purl: ref,
    hashes,
    distribution: entry.resolved,
    homepage: `https://www.npmjs.com/package/${encodeURIComponent(name)}/v/${entry.version}`,
    ecosystem: 'npm',
    scopes,
    relationship: direct ? 'direct' : 'transitive',
    usedBy: direct ? [...direct.usedBy] : [],
    manifests: ['package-lock.json'],
    optional: scopes.includes('optional'),
  })
}

const parseCargoChecksums = (lockPath) => {
  const checksums = new Map()
  const blocks = readFileSync(lockPath, 'utf8').split('[[package]]')
  for (const block of blocks) {
    const name = block.match(/\nname = "([^"]+)"/)?.[1]
    const version = block.match(/\nversion = "([^"]+)"/)?.[1]
    const checksum = block.match(/\nchecksum = "([^"]+)"/)?.[1]
    if (name && version && checksum) checksums.set(`${name}@${version}`, checksum)
  }
  return checksums
}

const cargoProjects = [
  {
    label: 'server-admin-rs',
    manifest: join(rootDir, 'apps/server-admin-rs/Cargo.toml'),
    lock: join(rootDir, 'apps/server-admin-rs/Cargo.lock'),
  },
  {
    label: 'fn-knock-desktop',
    manifest: join(rootDir, 'apps/fn-knock-desktop/native/Cargo.toml'),
    lock: join(rootDir, 'apps/fn-knock-desktop/native/Cargo.lock'),
  },
  {
    label: 'rust-acmesh',
    manifest: join(acmeshRsDir, 'Cargo.toml'),
    lock: join(acmeshRsDir, 'Cargo.lock'),
  },
]

for (const project of cargoProjects) {
  const metadata = JSON.parse(
    run('cargo', [
      'metadata',
      '--format-version',
      '1',
      '--locked',
      '--manifest-path',
      project.manifest,
    ]),
  )
  const packages = new Map(metadata.packages.map((pkg) => [pkg.id, pkg]))
  const nodes = new Map(metadata.resolve.nodes.map((node) => [node.id, node]))
  const checksums = parseCargoChecksums(project.lock)
  const rootId = metadata.resolve.root
  const queue = [{ id: rootId, scope: 'runtime' }]
  const visited = new Set()

  while (queue.length) {
    const state = queue.shift()
    const visitKey = `${state.id}:${state.scope}`
    if (visited.has(visitKey)) continue
    visited.add(visitKey)
    const node = nodes.get(state.id)
    if (!node) continue
    for (const dependency of node.deps) {
      const kinds = dependency.dep_kinds?.length ? dependency.dep_kinds : [{ kind: null }]
      for (const depKind of kinds) {
        const scope =
          depKind.kind === 'dev' ? 'development' : depKind.kind === 'build' ? 'build' : state.scope
        queue.push({ id: dependency.pkg, scope })
        if (dependency.pkg === rootId) continue
        const pkg = packages.get(dependency.pkg)
        if (!pkg?.source) continue
        const ref = cargoPurl(pkg.name, pkg.version)
        const checksum = checksums.get(`${pkg.name}@${pkg.version}`)
        makeComponent({
          ref,
          name: pkg.name,
          version: pkg.version,
          license: pkg.license,
          purl: ref,
          hashes: checksum ? [{ alg: 'SHA-256', content: checksum }] : [],
          repository: pkg.repository,
          homepage: pkg.homepage,
          ecosystem: 'Cargo',
          scopes: [scope],
          relationship: state.id === rootId ? 'direct' : 'transitive',
          usedBy: [project.label],
          manifests: [relative(rootDir, project.lock)],
        })
        const from =
          state.id === rootId
            ? null
            : packages.get(state.id)?.source
              ? cargoPurl(packages.get(state.id).name, packages.get(state.id).version)
              : null
        addDependency(from, ref)
      }
    }
  }
}

const parseJsonStream = (text) => {
  const values = []
  let depth = 0
  let inString = false
  let escaped = false
  let start = -1
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index]
    if (inString) {
      if (escaped) escaped = false
      else if (char === '\\') escaped = true
      else if (char === '"') inString = false
      continue
    }
    if (char === '"') inString = true
    else if (char === '{') {
      if (depth === 0) start = index
      depth += 1
    } else if (char === '}') {
      depth -= 1
      if (depth === 0 && start >= 0) {
        values.push(JSON.parse(text.slice(start, index + 1)))
        start = -1
      }
    }
  }
  return values
}

const detectLicense = (dir) => {
  if (!dir || !existsSync(dir)) return 'NOASSERTION'
  const candidates = readdirSync(dir).filter((name) =>
    /^(licen[cs]e|copying|unlicense|notice)(\..*|-.*)?$/i.test(name),
  )
  const found = new Set()
  for (const name of candidates) {
    const path = join(dir, name)
    if (!statSync(path).isFile()) continue
    const text = readFileSync(path, 'utf8').toLowerCase()
    if (text.includes('mozilla public license') && text.includes('2.0')) {
      found.add('MPL-2.0')
    }
    if (text.includes('apache license') && text.includes('version 2.0')) {
      found.add('Apache-2.0')
    }
    if (text.includes('permission is hereby granted, free of charge')) {
      found.add('MIT')
    }
    if (
      text.includes('permission to use, copy, modify, and/or distribute') ||
      text.includes('permission to use, copy, modify, and distribute')
    ) {
      found.add('ISC')
    }
    if (text.includes('redistribution and use in source and binary forms')) {
      found.add(
        text.includes('neither the name') || text.includes('names of its contributors')
          ? 'BSD-3-Clause'
          : 'BSD-2-Clause',
      )
    }
    if (text.includes('this is free and unencumbered software released into the public domain')) {
      found.add('Unlicense')
    }
    if (text.includes('gnu general public license') && text.includes('version 3')) {
      found.add('GPL-3.0-only')
    }
  }
  return found.size ? sorted(found).join(' OR ') : 'NOASSERTION'
}

const goModules = parseJsonStream(run('go', ['list', '-m', '-json', 'all'], goDir))
const goSum = new Map()
for (const line of readFileSync(join(goDir, 'go.sum'), 'utf8').split('\n')) {
  const match = line.match(/^(\S+) (\S+) h1:(\S+)$/)
  if (match && !match[2].endsWith('/go.mod')) {
    goSum.set(`${match[1]}@${match[2]}`, match[3])
  }
}
const goRefs = new Map()
for (const module of goModules) {
  if (module.Main || !module.Version) continue
  let downloaded = module.Replace ?? module
  if (!downloaded.Dir) {
    downloaded = JSON.parse(
      run(
        'go',
        [
          'mod',
          'download',
          '-json',
          `${downloaded.Path ?? module.Path}@${downloaded.Version ?? module.Version}`,
        ],
        goDir,
      ),
    )
  }
  const ref = goPurl(module.Path, module.Version)
  goRefs.set(`${module.Path}@${module.Version}`, ref)
  const sum =
    downloaded.Sum?.replace(/^h1:/, '') ??
    module.Sum?.replace(/^h1:/, '') ??
    goSum.get(`${module.Path}@${module.Version}`)
  const repository = module.Path.startsWith('github.com/')
    ? `https://${module.Path.split('/').slice(0, 3).join('/')}`
    : undefined
  makeComponent({
    ref,
    name: module.Path,
    version: module.Version,
    license: detectLicense(downloaded.Dir),
    purl: ref,
    hashes: sum
      ? [
          {
            alg: 'SHA-256',
            content: Buffer.from(sum, 'base64').toString('hex'),
          },
        ]
      : [],
    repository,
    homepage: `https://pkg.go.dev/${module.Path}@${module.Version}`,
    ecosystem: 'Go',
    scopes: ['runtime'],
    relationship: module.Indirect ? 'transitive' : 'direct',
    usedBy: ['Go-Reauth-Proxy'],
    manifests: ['../Go-Reauth-Proxy/go.mod', '../Go-Reauth-Proxy/go.sum'],
  })
}
for (const line of run('go', ['mod', 'graph'], goDir).split('\n')) {
  const [from, to] = line.trim().split(/\s+/)
  addDependency(goRefs.get(from), goRefs.get(to))
}

const addManual = (component) =>
  makeComponent({
    type: 'library',
    scopes: ['runtime'],
    relationship: 'direct',
    usedBy: ['Fn-Knock'],
    manifests: [],
    ...component,
  })

addManual({
  ref: npmPurl('color4bg', '0.1.1'),
  name: 'Color4Bg',
  version: '0.1.1',
  purl: npmPurl('color4bg', '0.1.1'),
  license: 'MIT',
  repository: 'https://github.com/winterx/color4bg.js',
  ecosystem: 'Embedded',
  evidence: ['packages/admin-shared/src/assets/lib/AbstractShapeBg.min.js'],
  hashes: [
    {
      alg: 'SHA-256',
      content: sha256File(
        join(rootDir, 'packages/admin-shared/src/assets/lib/AbstractShapeBg.min.js'),
      ),
    },
  ],
})
addManual({
  ref: npmPurl('ogl', '1.0.6'),
  name: 'OGL',
  version: '1.0.6',
  purl: npmPurl('ogl', '1.0.6'),
  license: 'Unlicense',
  repository: 'https://github.com/oframe/ogl',
  ecosystem: 'Embedded',
  relationship: 'transitive',
  evidence: ['embedded in AbstractShapeBg.min.js'],
})
addManual({
  ref: npmPurl('seedrandom', '3.0.5'),
  name: 'seedrandom',
  version: '3.0.5',
  purl: npmPurl('seedrandom', '3.0.5'),
  license: 'MIT',
  repository: 'https://github.com/davidbau/seedrandom',
  ecosystem: 'Embedded',
  relationship: 'transitive',
  evidence: ['embedded in AbstractShapeBg.min.js'],
})
addManual({
  ref: 'pkg:generic/acme.sh@3.1.3',
  name: 'acme.sh',
  version: '3.1.3',
  purl: 'pkg:generic/acme.sh@3.1.3',
  license: 'GPL-3.0-only',
  repository: 'https://github.com/acmesh-official/acme.sh',
  ecosystem: 'Embedded',
  evidence: ['apps/server-admin-rs/resources/acmesh.zip'],
  hashes: [
    {
      alg: 'SHA-256',
      content: sha256File(join(rootDir, 'apps/server-admin-rs/resources/acmesh.zip')),
    },
  ],
})
addManual({
  ref: 'pkg:generic/frp@0.67.0',
  name: 'frp',
  version: '0.67.0',
  purl: 'pkg:generic/frp@0.67.0',
  license: 'Apache-2.0',
  repository: 'https://github.com/fatedier/frp',
  ecosystem: 'Optional runtime',
  scopes: ['optional'],
  optional: true,
  evidence: ['apps/server-admin-rs/src/shared/frp_utils.rs'],
})
addManual({
  ref: 'pkg:generic/cloudflared',
  name: 'cloudflared',
  license: 'Apache-2.0',
  repository: 'https://github.com/cloudflare/cloudflared',
  ecosystem: 'Optional runtime',
  scopes: ['optional'],
  optional: true,
  evidence: ['apps/server-admin-rs/src/system/assets/downloads.rs'],
  versionResolution: 'resolved at download time',
})
addManual({
  ref: 'pkg:generic/dnsmasq',
  name: 'dnsmasq',
  license: 'GPL-2.0-or-later',
  repository: 'https://thekelleys.org.uk/dnsmasq/doc.html',
  ecosystem: 'System',
  scopes: ['optional', 'system'],
  optional: true,
  evidence: ['apps/server-admin-rs/src/system/assets/dnsmasq.rs'],
  versionResolution: 'resolved by the host package manager',
})
addManual({
  ref: 'pkg:generic/alpine@3.23',
  type: 'operating-system',
  name: 'Alpine Linux',
  version: '3.23',
  purl: 'pkg:generic/alpine@3.23',
  license: 'MIT',
  repository: 'https://gitlab.alpinelinux.org/alpine',
  ecosystem: 'System',
  scopes: ['runtime', 'system'],
  evidence: ['deploy/docker/Dockerfile'],
})
for (const item of [
  ['bash', 'GPL-3.0-or-later', 'https://savannah.gnu.org/git/?group=bash'],
  ['ca-certificates', 'MPL-2.0', 'https://gitlab.alpinelinux.org/alpine/ca-certificates'],
  ['curl', 'curl', 'https://github.com/curl/curl'],
  ['OpenSSL', 'Apache-2.0', 'https://github.com/openssl/openssl'],
  ['tzdata', 'LicenseRef-Public-Domain', 'https://github.com/eggert/tz'],
  ['unzip', 'Info-ZIP', 'https://infozip.sourceforge.net/'],
]) {
  addManual({
    ref: `pkg:generic/${encodeSegment(item[0].toLowerCase())}`,
    name: item[0],
    license: item[1],
    repository: item[2],
    ecosystem: 'System',
    scopes: ['runtime', 'system'],
    evidence: ['deploy/docker/Dockerfile'],
    versionResolution: 'resolved from Alpine 3.23 at image build time',
  })
}

const rootVersion = readJson(join(rootDir, 'version.json')).version
const rootRef = `pkg:generic/fn-knock@${rootVersion}`
for (const component of componentMap.values()) {
  if (propertyValue(component, 'fn-knock:relationship') === 'direct') {
    addDependency(rootRef, component['bom-ref'])
  }
}

const components = [...componentMap.values()].sort((left, right) => {
  const leftKey = `${propertyValue(left, 'fn-knock:ecosystem')}|${left.name}|${left.version ?? ''}`
  const rightKey = `${propertyValue(right, 'fn-knock:ecosystem')}|${right.name}|${right.version ?? ''}`
  return leftKey.localeCompare(rightKey)
})
const fingerprint = createHash('sha256')
  .update(components.map((component) => component['bom-ref']).join('\n'))
  .digest('hex')
const uuid = [
  fingerprint.slice(0, 8),
  fingerprint.slice(8, 12),
  `5${fingerprint.slice(13, 16)}`,
  `8${fingerprint.slice(17, 20)}`,
  fingerprint.slice(20, 32),
].join('-')

const bom = {
  bomFormat: 'CycloneDX',
  specVersion: '1.6',
  serialNumber: `urn:uuid:${uuid}`,
  version: 1,
  metadata: {
    timestamp: new Date().toISOString(),
    tools: {
      components: [
        {
          type: 'application',
          name: 'Fn-Knock third-party disclosure generator',
          version: '1',
        },
      ],
    },
    component: {
      type: 'application',
      'bom-ref': rootRef,
      name: 'Fn-Knock',
      version: rootVersion,
      licenses: [{ license: { name: 'Proprietary' } }],
      externalReferences: [
        {
          type: 'vcs',
          url: 'https://github.com/kci-lnk/fn-knock-turborepo',
        },
      ],
    },
    properties: [
      { name: 'fn-knock:main-commit', value: repoCommit(rootDir) },
      { name: 'fn-knock:go-reauth-proxy-commit', value: repoCommit(goDir) },
      { name: 'fn-knock:acmesh-rs-commit', value: repoCommit(acmeshRsDir) },
      {
        name: 'fn-knock:coverage',
        value:
          'npm lock graph; Rust Cargo graphs for server-admin-rs, fn-knock-desktop and rust-acmesh; Go module graph for Go-Reauth-Proxy; embedded assets; optional downloads; declared Docker runtime packages',
      },
      {
        name: 'fn-knock:scope-note',
        value:
          'Host operating-system packages are not transitively enumerated. Components resolved by a deployment package manager or an unpinned download are explicitly marked as unresolved.',
      },
    ],
  },
  components,
  dependencies: [
    { ref: rootRef, dependsOn: sorted(dependencyMap.get(rootRef) ?? []) },
    ...components.map((component) => ({
      ref: component['bom-ref'],
      dependsOn: sorted(dependencyMap.get(component['bom-ref']) ?? []),
    })),
  ],
}

mkdirSync(dirname(outputPath), { recursive: true })
writeFileSync(outputPath, `${JSON.stringify(bom, null, 2)}\n`)

const totals = components.reduce((result, component) => {
  const ecosystem = propertyValue(component, 'fn-knock:ecosystem')
  result[ecosystem] = (result[ecosystem] ?? 0) + 1
  return result
}, {})
console.log(`Wrote ${relative(siteDir, outputPath)} with ${components.length} components`)
for (const [ecosystem, count] of Object.entries(totals).sort()) {
  console.log(`  ${ecosystem}: ${count}`)
}
