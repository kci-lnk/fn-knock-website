import { readonly, reactive, toRefs } from 'vue'
import { fetchLatestRelease, type ReleaseDownloads } from '@/services/release'

type ReleaseStatus = 'idle' | 'loading' | 'success' | 'error'

const state = reactive({
  version: '',
  releaseNotes: '',
  downloads: {} as ReleaseDownloads,
  status: 'idle' as ReleaseStatus,
})

let pendingRequest: Promise<void> | null = null

export const loadLatestRelease = (): Promise<void> => {
  if (state.status === 'success') return Promise.resolve()
  if (pendingRequest) return pendingRequest

  state.status = 'loading'
  pendingRequest = fetchLatestRelease()
    .then((release) => {
      state.version = release.version
      state.releaseNotes = release.releaseNotes
      state.downloads = release.downloads
      state.status = 'success'
    })
    .catch(() => {
      state.status = 'error'
    })
    .finally(() => {
      pendingRequest = null
    })

  return pendingRequest
}

export const retryLatestRelease = (): Promise<void> => {
  if (pendingRequest) return pendingRequest
  state.status = 'idle'
  return loadLatestRelease()
}

export const useLatestRelease = () => toRefs(readonly(state))
