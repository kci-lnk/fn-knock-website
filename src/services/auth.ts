import { createApiUrl } from '@/config/site'
import { translate } from '@/i18n'

export type AuthUser = {
  id: string
  username: string
  provider: 'qq'
  avatar?: string
}

type AuthResponse = {
  authenticated: boolean
  user?: AuthUser | null
  message?: string
}

const REQUEST_TIMEOUT = 15_000

const request = async (
  path: string,
  init: RequestInit,
  fallbackMessage: string,
  externalSignal?: AbortSignal,
) => {
  const controller = new AbortController()
  const abort = () => controller.abort()
  externalSignal?.addEventListener('abort', abort, { once: true })
  const timeout = window.setTimeout(abort, REQUEST_TIMEOUT)

  try {
    const response = await fetch(createApiUrl(path), {
      ...init,
      credentials: 'include',
      signal: controller.signal,
    })
    const text = await response.text()
    let data: AuthResponse | null = null

    if (text) {
      try {
        data = JSON.parse(text) as AuthResponse
      } catch {
        throw new Error(fallbackMessage)
      }
    }

    if (!response.ok) throw new Error(data?.message ?? fallbackMessage)
    if (!data) throw new Error(fallbackMessage)
    return data
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error(translate('auth.timeout'), { cause: error })
    }
    throw error
  } finally {
    window.clearTimeout(timeout)
    externalSignal?.removeEventListener('abort', abort)
  }
}

export const authApi = {
  getCurrentUser: (signal?: AbortSignal) =>
    request('/auth/me', { method: 'GET' }, translate('auth.statusUnavailable'), signal),
  logout: (signal?: AbortSignal) =>
    request('/auth/logout', { method: 'POST' }, translate('auth.logoutFailed'), signal),
}
