import { siteConfig } from '@/config/site'

export type ReleaseInfo = {
  version: string
  releaseNotes: string
}

type ReleaseInfoResponse = {
  version?: unknown
  release_notes?: unknown
}

export const fetchLatestRelease = async (): Promise<ReleaseInfo> => {
  const response = await fetch(siteConfig.releaseApiUrl, {
    headers: { Accept: 'application/json' },
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
  }
}
