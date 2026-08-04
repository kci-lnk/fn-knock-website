import { nextTick } from 'vue'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import AppLayout from '@/pages/layouts/AppLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: AppLayout,
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/pages/HomePage.vue'),
        meta: { titleKey: 'meta.home' },
      },
      {
        path: 'linux',
        name: 'linux-install',
        component: () => import('@/pages/LinuxInstallPage.vue'),
        meta: { titleKey: 'meta.linux' },
      },
      {
        path: 'macos',
        name: 'macos-install',
        component: () => import('@/pages/MacInstallPage.vue'),
        meta: { titleKey: 'meta.macos' },
      },
      {
        path: 'docker',
        name: 'docker-install',
        component: () => import('@/pages/DockerInstallPage.vue'),
        meta: { titleKey: 'meta.docker' },
      },
      {
        path: 'windows',
        name: 'windows-install',
        component: () => import('@/pages/WindowsInstallPage.vue'),
        meta: { titleKey: 'meta.windows' },
      },
      {
        path: 'synology',
        name: 'synology-install',
        component: () => import('@/pages/SynologyInstallPage.vue'),
        meta: { titleKey: 'meta.synology' },
      },
      {
        path: 'legal',
        name: 'legal',
        component: () => import('@/pages/LegalPage.vue'),
        meta: { titleKey: 'meta.legal' },
      },
      {
        path: 'third-party-software',
        name: 'third-party-software',
        component: () => import('@/pages/ThirdPartySoftwarePage.vue'),
        meta: { titleKey: 'meta.thirdParty' },
      },
      {
        path: 'changelog',
        name: 'changelog',
        component: () => import('@/pages/ChangelogPage.vue'),
        meta: { titleKey: 'meta.changelog' },
      },
      {
        path: 'accessibility',
        name: 'accessibility',
        component: () => import('@/pages/AccessibilityPage.vue'),
        meta: { titleKey: 'meta.accessibility' },
      },
      {
        path: ':pathMatch(.*)*',
        name: 'not-found',
        component: () => import('@/pages/NotFoundPage.vue'),
        meta: { titleKey: 'meta.notFound' },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: (to, _from, savedPosition) => {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash }
    return { top: 0 }
  },
})

router.afterEach((to) => {
  void nextTick(() => {
    const previousTarget = document.querySelector<HTMLElement>('[data-router-focus]')
    previousTarget?.removeAttribute('tabindex')
    previousTarget?.removeAttribute('data-router-focus')

    let hashTarget: HTMLElement | null = null
    if (to.hash) {
      try {
        hashTarget = document.getElementById(decodeURIComponent(to.hash.slice(1)))
      } catch {
        hashTarget = document.getElementById(to.hash.slice(1))
      }
    }
    const focusTarget = hashTarget ?? document.querySelector<HTMLElement>('#main-content')
    if (!focusTarget) return

    if (hashTarget && !hashTarget.matches('[tabindex]')) {
      hashTarget.setAttribute('tabindex', '-1')
      hashTarget.setAttribute('data-router-focus', '')
    }
    focusTarget.focus({ preventScroll: true })
  })
})

export default router
