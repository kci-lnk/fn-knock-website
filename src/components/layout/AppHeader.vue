<script setup lang="ts">
import { Github, LogIn } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import LanguageSelector from '@/components/layout/LanguageSelector.vue'
import type { AuthUser } from '@/composables/useAuth'
import { siteConfig } from '@/config/site'
import logo from '@/assets/favicon.svg'

withDefaults(defineProps<{ user: AuthUser | null; loading?: boolean; tone?: 'light' | 'dark' }>(), {
  tone: 'light',
})
defineEmits<{ login: []; logout: [] }>()
const { t } = useI18n()
</script>

<template>
  <a href="#main-content" class="skip-link print:hidden">{{ t('header.skip') }}</a>
  <header class="app-header sticky top-0 z-40 border-b print:hidden" :class="`app-header--${tone}`">
    <div
      class="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-2 px-3 py-3 sm:gap-3 sm:px-6 sm:py-0"
    >
      <RouterLink to="/" class="flex min-w-0 items-center gap-3" :aria-label="t('header.home')">
        <img :src="logo" alt="" class="h-9 w-9" />
        <span
          class="brand-name hidden truncate text-base font-semibold tracking-tight text-slate-950 sm:inline"
          >{{ t('header.brand') }}</span
        >
        <span
          class="brand-name mobile-brand-name truncate text-base font-semibold tracking-tight text-slate-950 sm:hidden"
          >Knock</span
        >
      </RouterLink>
      <div class="flex shrink-0 items-center gap-1.5 sm:gap-2">
        <Button
          as="a"
          variant="ghost"
          size="sm"
          :href="siteConfig.githubUrl"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="t('header.github')"
          class="github-button px-2.5 sm:px-4"
        >
          <Github class="h-4 w-4 shrink-0" /><span class="sr-only sm:not-sr-only">GitHub</span>
        </Button>
        <Button
          as="a"
          variant="ghost"
          :href="siteConfig.docsUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="docs-button px-2 sm:px-3"
        >
          <span class="sm:hidden">{{ t('header.docsShort') }}</span
          ><span class="hidden sm:inline">{{ t('header.docs') }}</span>
        </Button>
        <LanguageSelector :tone="tone" />
        <span
          v-if="loading"
          class="h-9 w-20 animate-pulse rounded-full bg-slate-200/70"
          role="status"
        >
          <span class="sr-only">{{ t('header.loadingAuth') }}</span>
        </span>
        <div
          v-else-if="user"
          class="flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-2 py-1 shadow-sm"
        >
          <img v-if="user.avatar" :src="user.avatar" alt="" class="h-7 w-7 rounded-full" />
          <span
            v-else
            class="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white"
            >{{ user.username.slice(0, 1).toUpperCase() }}</span
          >
          <span class="hidden max-w-24 truncate text-sm font-medium text-slate-800 sm:inline">{{
            user.username
          }}</span>
          <button
            type="button"
            class="min-h-7 rounded-full px-2 py-1 text-xs font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            @click="$emit('logout')"
          >
            {{ t('header.logout') }}
          </button>
        </div>
        <Button
          v-else
          variant="outline"
          size="sm"
          class="login-button px-2.5 sm:px-4"
          @click="$emit('login')"
        >
          <LogIn class="h-4 w-4 shrink-0" /><span>{{ t('header.login') }}</span>
        </Button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header--light {
  background: rgb(255 255 255 / 0.92);
  border-color: rgb(226 232 240 / 0.7);
}
.app-header--dark {
  backdrop-filter: blur(24px) saturate(140%);
  -webkit-backdrop-filter: blur(24px) saturate(140%);
  background: linear-gradient(180deg, #070d1a 0%, #040a15 100%);
  border-color: rgb(130 194 255 / 0.13);
  box-shadow:
    inset 0 -1px 0 rgb(255 255 255 / 0.025),
    0 12px 36px rgb(0 0 0 / 0.24);
}
.app-header--dark .brand-name {
  color: #e8f5ff;
}
.app-header--dark .docs-button {
  color: #a4b8cc;
}
.app-header--dark .docs-button:hover {
  background: rgb(131 186 255 / 0.09);
  color: #e5f4ff;
}
.skip-link {
  background: #0f172a;
  border-radius: 0 0 0.5rem 0.5rem;
  color: #fff;
  left: 1rem;
  padding: 0.65rem 1rem;
  position: fixed;
  top: 0;
  transform: translateY(-120%);
  transition: transform 0.15s ease;
  z-index: 100;
}
.skip-link:focus {
  transform: translateY(0);
}
.github-button {
  border: 1px solid rgb(10 10 10 / 0.92);
  background: #0a0a0a;
  color: #fafafa;
}
.github-button:hover {
  background: #1c1c1c;
  color: #fff;
}
.login-button {
  border-color: rgb(15 23 42 / 0.18);
  background: rgb(255 255 255 / 0.72);
}
.app-header--dark .login-button {
  background: rgb(111 168 226 / 0.08);
  border-color: rgb(151 203 255 / 0.18);
  color: #c5d9ec;
}
.app-header--dark .login-button:hover {
  background: rgb(111 168 226 / 0.14);
  color: #fff;
}
@media (max-width: 767px) {
  .github-button,
  .docs-button,
  .login-button {
    min-height: 2.75rem;
    min-width: 2.75rem;
  }
  .app-header button {
    min-height: 2.75rem;
  }
}
@media (max-width: 360px) {
  .mobile-brand-name {
    display: none;
  }
  .login-button :deep(svg) {
    display: none;
  }
}
</style>
