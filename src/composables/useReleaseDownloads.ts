import { useLatestRelease } from '@/composables/useLatestRelease'
import type { DownloadPackageType } from '@/services/release'

export const useReleaseDownloads = () => {
  const { downloads, status } = useLatestRelease()

  const resolveDownloadUrl = (packageType: DownloadPackageType, architecture: string) =>
    downloads.value[packageType]?.[architecture] ?? ''

  return { resolveDownloadUrl, status }
}
