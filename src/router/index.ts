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

router.afterEach(() => {
  void nextTick(() =>
    document.querySelector<HTMLElement>('#main-content')?.focus({ preventScroll: true }),
  )
})

export default router
