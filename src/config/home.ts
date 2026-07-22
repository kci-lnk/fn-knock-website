import { createDownloadUrl, downloadBaseUrl } from '@/config/downloads'

export type OpenWrtPackageFormat = 'apk' | 'ipk'
export type StatTone = 'blue' | 'violet' | 'emerald' | 'amber'
export type StatIcon = 'shield' | 'lock' | 'network' | 'eye'
export type ConsoleIcon =
  'gauge' | 'network' | 'shield' | 'fingerprint' | 'key' | 'file' | 'globe' | 'settings'

export const homeLinks = {
  amd64Download: downloadBaseUrl,
  arm64Download: createDownloadUrl({ arch: 'arm64' }),
  dockerHub: 'https://hub.docker.com/r/kcilnk/fn-knock',
  tutorial: 'https://club.fnnas.com/forum.php?mod=viewthread&tid=61959',
} as const

export const fnOsDownloads = [
  {
    id: 'fnosX64',
    url: homeLinks.amd64Download,
  },
  {
    id: 'fnosArm',
    url: homeLinks.arm64Download,
  },
] as const

export const openWrtDownloads = [
  { id: 'openwrtX64', arch: 'x86_64' },
  {
    id: 'openwrtIpq',
    arch: 'aarch64_cortex-a53',
  },
  {
    id: 'openwrtArm64',
    arch: 'aarch64_generic',
  },
  {
    id: 'openwrtArm32',
    arch: 'arm_cortex-a7_neon-vfpv4',
  },
  {
    id: 'openwrtA5',
    arch: 'arm_cortex-a5_vfpv4',
  },
] as const

export const heroPills = ['auth', 'windows', 'docker', 'openwrt'] as const

export const statCards: ReadonlyArray<{
  id: 'audit' | 'waf' | 'proxy' | 'protect'
  icon: StatIcon
  tone: StatTone
}> = [
  {
    id: 'audit',
    icon: 'shield',
    tone: 'blue',
  },
  {
    id: 'waf',
    icon: 'lock',
    tone: 'violet',
  },
  {
    id: 'proxy',
    icon: 'network',
    tone: 'emerald',
  },
  {
    id: 'protect',
    icon: 'eye',
    tone: 'amber',
  },
]

export const consoleNavItems: ReadonlyArray<{
  id:
    | 'console'
    | 'mappings'
    | 'tunnel'
    | 'sessions'
    | 'whitelist'
    | 'certificates'
    | 'ddns'
    | 'system'
  icon: ConsoleIcon
  active?: boolean
}> = [
  { id: 'console', icon: 'gauge', active: true },
  { id: 'mappings', icon: 'network' },
  { id: 'tunnel', icon: 'shield' },
  { id: 'sessions', icon: 'fingerprint' },
  { id: 'whitelist', icon: 'key' },
  { id: 'certificates', icon: 'file' },
  { id: 'ddns', icon: 'globe' },
  { id: 'system', icon: 'settings' },
]

export const resolveOpenWrtDownloadUrl = (arch: string, format: OpenWrtPackageFormat) =>
  createDownloadUrl({ type: format, arch })
