<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppFooter from '@/components/layout/AppFooter.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import LoginDialog from '@/components/layout/LoginDialog.vue'
import { useAuth } from '@/composables/useAuth'
import { loadLatestRelease } from '@/composables/useLatestRelease'

const {
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
} = useAuth()

const route = useRoute()
const isSynologyPage = computed(() => route.name === 'synology-install')

onMounted(() => {
  void loadLatestRelease()
})
</script>

<template>
  <div v-if="!isSynologyPage" class="animated-bg" aria-hidden="true" />
  <div class="min-h-screen bg-transparent text-foreground" :class="{ dark: isSynologyPage }">
    <AppHeader
      :user="authUser"
      :loading="isAuthLoading"
      :tone="isSynologyPage ? 'dark' : 'light'"
      @login="openLoginDialog"
      @logout="logout"
    />
    <LoginDialog
      v-model:remember="rememberMe"
      :open="isLoginDialogOpen"
      :submitting="isSubmittingLogin"
      :error="loginError"
      @close="closeLoginDialog"
      @qq-login="startQqLogin"
    />
    <main id="main-content" tabindex="-1"><RouterView /></main>
    <AppFooter :tone="isSynologyPage ? 'dark' : 'light'" />
  </div>
</template>
