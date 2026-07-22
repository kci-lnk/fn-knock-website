import { readonly, reactive, toRefs } from 'vue'
import { fetchLatestRelease } from '@/services/release'

export const fallbackReleaseVersion = '2.0.8'

type ReleaseStatus = 'idle' | 'loading' | 'success' | 'error'

const state = reactive({
  version: fallbackReleaseVersion,
  releaseNotes: '',
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
  state.status = 'idle'
  return loadLatestRelease()
}

export const useLatestRelease = () => toRefs(readonly(state))
