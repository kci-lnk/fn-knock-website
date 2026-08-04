export const downloadBaseUrl = 'https://get.fnknock.cn/'

type DownloadQuery = {
  type?: 'windows' | 'macos' | 'synology' | 'apk' | 'ipk'
  arch?: string
}

export const createDownloadUrl = ({ type, arch }: DownloadQuery = {}) => {
  const url = new URL(downloadBaseUrl)
  if (type) url.searchParams.set('type', type)
  if (arch) url.searchParams.set('arch', arch)
  return url.toString()
}
