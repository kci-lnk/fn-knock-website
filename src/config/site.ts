const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() || 'https://api.fnknock.cn/'
const releaseApiUrl =
  import.meta.env.VITE_RELEASE_API_URL?.trim() || 'https://cor.fnknock.cn/latest.json'

export const siteConfig = {
  docsUrl: 'https://docs.fnknock.cn',
  githubUrl: 'https://github.com/kci-lnk/fn-knock-turborepo',
  apiBaseUrl,
  releaseApiUrl,
  qqGroupNumber: '1081609274',
  icpNumber: '鄂ICP备2025102714号-3',
} as const

export const createApiUrl = (path: string) => new URL(path, siteConfig.apiBaseUrl).toString()
