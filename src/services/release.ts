import { siteConfig } from '@/config/site'

export const downloadPackageTypes = [
  'fpk',
  'ipk',
  'apk',
  'synology',
  'linux',
  'macos',
  'windows',
] as const

export type DownloadPackageType = (typeof downloadPackageTypes)[number]
export type ReleaseDownloads = Partial<Record<DownloadPackageType, Record<string, string>>>

export type ReleaseInfo = {
  version: string
  releaseNotes: string
  downloads: ReleaseDownloads
}

type ReleaseInfoResponse = {
  version?: unknown
  release_notes?: unknown
  packages?: unknown
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const parseReleaseDownloads = (packages: unknown): ReleaseDownloads => {
  if (!isRecord(packages)) return {}

  const downloads: ReleaseDownloads = {}
  for (const packageType of downloadPackageTypes) {
    const packagesByArchitecture = packages[packageType]
    if (!isRecord(packagesByArchitecture)) continue

    const architectureDownloads: Record<string, string> = {}
    for (const [architecture, packageInfo] of Object.entries(packagesByArchitecture)) {
      if (!isRecord(packageInfo) || typeof packageInfo.download_url !== 'string') continue

      const downloadUrl = packageInfo.download_url.trim()
      try {
        const parsedUrl = new URL(downloadUrl)
        if (parsedUrl.protocol === 'https:' && parsedUrl.hostname === 'cdn.fnknock.cn') {
          architectureDownloads[architecture] = parsedUrl.toString()
        }
      } catch {
        // Ignore malformed package entries while preserving the rest of the release manifest.
      }
    }

    if (Object.keys(architectureDownloads).length) downloads[packageType] = architectureDownloads
  }

  return downloads
}

const fetchRelease = async (signal: AbortSignal): Promise<ReleaseInfo> => {
  const response = await fetch(siteConfig.releaseApiUrl, {
    headers: { Accept: 'application/json' },
    signal,
  })

  if (!response.ok) {
    throw new Error(`Release request failed with status ${response.status}`)
  }

  const payload = (await response.json()) as ReleaseInfoResponse
  if (typeof payload.version !== 'string' || !payload.version.trim()) {
    throw new Error('Release response is missing a valid version')
  }
  if (typeof payload.release_notes !== 'string') {
    throw new Error('Release response is missing release notes')
  }

  return {
    version: payload.version.trim(),
    releaseNotes: payload.release_notes.trim(),
    downloads: parseReleaseDownloads(payload.packages),
  }
}

export const fetchLatestRelease = async (): Promise<ReleaseInfo> => {
  const controller = new AbortController()
  let timeout: ReturnType<typeof setTimeout> | undefined
  const deadline = new Promise<never>((_resolve, reject) => {
    timeout = setTimeout(() => {
      reject(new Error('Release request timed out'))
      controller.abort()
    }, 10_000)
  })

  try {
    // Include reading the response body in the deadline, not just the headers.
    return await Promise.race([fetchRelease(controller.signal), deadline])
  } finally {
    clearTimeout(timeout)
  }
}
