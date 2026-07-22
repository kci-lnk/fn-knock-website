import { onBeforeUnmount, onMounted, ref } from 'vue'
import { createApiUrl } from '@/config/site'
import { authApi, type AuthUser } from '@/services/auth'
import { translate } from '@/i18n'

export type { AuthUser } from '@/services/auth'

export const useAuth = () => {
  const isAuthLoading = ref(true)
  const isLoginDialogOpen = ref(false)
  const isSubmittingLogin = ref(false)
  const rememberMe = ref(true)
  const loginError = ref('')
  const authUser = ref<AuthUser | null>(null)
  const activeRequests = new Set<AbortController>()

  const createRequest = () => {
    const controller = new AbortController()
    activeRequests.add(controller)
    return controller
  }

  const syncAuthState = async () => {
    const request = createRequest()
    isAuthLoading.value = true
    try {
      const data = await authApi.getCurrentUser(request.signal)
      authUser.value = data.authenticated ? (data.user ?? null) : null
    } catch {
      authUser.value = null
    } finally {
      activeRequests.delete(request)
      isAuthLoading.value = false
    }
  }

  const openLoginDialog = () => {
    loginError.value = ''
    isLoginDialogOpen.value = true
  }

  const closeLoginDialog = () => {
    if (!isSubmittingLogin.value) isLoginDialogOpen.value = false
  }

  const startQqLogin = () => {
    if (isSubmittingLogin.value) return
    isSubmittingLogin.value = true
    window.location.href = createApiUrl(`/auth/qq/login${rememberMe.value ? '?remember=1' : ''}`)
  }

  const logout = async () => {
    const request = createRequest()
    try {
      await authApi.logout(request.signal)
      authUser.value = null
    } catch {
      // Preserve the known session when the server cannot confirm logout.
    } finally {
      activeRequests.delete(request)
    }
  }

  const handleInitialLoginQuery = () => {
    const url = new URL(window.location.href)
    if (url.searchParams.get('login_error')) {
      loginError.value = translate('auth.loginIncomplete')
      isLoginDialogOpen.value = true
    }
    if (url.searchParams.has('login') || url.searchParams.has('login_error')) {
      url.searchParams.delete('login')
      url.searchParams.delete('login_error')
      window.history.replaceState(
        window.history.state,
        '',
        `${url.pathname}${url.search}${url.hash}`,
      )
    }
  }

  onMounted(() => {
    void syncAuthState()
    handleInitialLoginQuery()
  })
  onBeforeUnmount(() => {
    activeRequests.forEach((request) => request.abort())
    activeRequests.clear()
  })

  return {
    authUser,
    closeLoginDialog,
    isAuthLoading,
    isLoginDialogOpen,
    isSubmittingLogin,
    loginError,
    logout,
    openLoginDialog,
    rememberMe,
    startQqLogin,
    syncAuthState,
  }
}
