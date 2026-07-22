<script setup lang="ts">
import type { Component } from 'vue'
import { ArrowUpRight, Eye, LockKeyhole, Network, ShieldCheck } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import HomeDownloadActions from '@/components/home/HomeDownloadActions.vue'
import { useLatestRelease } from '@/composables/useLatestRelease'
import { heroPills, homeLinks, statCards, type StatIcon } from '@/config/home'

const statIcons: Record<StatIcon, Component> = {
  shield: ShieldCheck,
  lock: LockKeyhole,
  network: Network,
  eye: Eye,
}
const { t } = useI18n()
const { version } = useLatestRelease()
</script>

<template>
  <section class="hero-section relative isolate" aria-labelledby="home-title">
    <div class="hero-grid-layer" aria-hidden="true" />
    <div class="mx-auto max-w-6xl px-4 pb-14 pt-10 sm:px-6 lg:pb-20 lg:pt-14">
      <div class="flex justify-center">
        <RouterLink :to="{ name: 'changelog' }" class="release-pill">
          <span class="release-pulse" aria-hidden="true" />
          <span class="font-bold tracking-[0.08em] text-blue-700">V{{ version }}</span>
          <span class="hidden h-3 w-px bg-slate-300 sm:inline-block" aria-hidden="true" />
          <span class="min-w-0 truncate text-slate-600">{{ t('home.releaseBadge') }}</span>
          <ArrowUpRight class="h-3 w-3 shrink-0 text-violet-600" />
        </RouterLink>
      </div>

      <div class="mx-auto mt-8 max-w-4xl text-center">
        <div class="flex flex-wrap justify-center gap-2">
          <span
            v-for="pill in heroPills"
            :key="pill"
            class="rounded-full border border-slate-200/75 bg-white/72 px-3 py-1 text-xs font-semibold text-slate-600"
            >{{ t(`home.pills.${pill}`) }}</span
          >
        </div>
        <h1
          id="home-title"
          class="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl"
        >
          {{ t('home.title')
          }}<span class="animated-title-gradient">{{ t('home.titleAccent') }}</span>
        </h1>
        <p class="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
          <span class="font-bold text-slate-900">fn-knock</span>
          {{ t('home.introPrefix') }} {{ t('home.introSuffix') }}
        </p>
        <HomeDownloadActions />
      </div>

      <div class="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <article
          v-for="card in statCards"
          :key="card.id"
          class="glow-card relative rounded-lg border border-slate-200/75 bg-white/72 p-4 text-left shadow-[0_8px_24px_rgba(15,23,42,0.05)] transition duration-200 hover:bg-white/88 sm:p-5"
        >
          <div class="flex items-center justify-between gap-4">
            <span class="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">{{
              t(`home.stats.${card.id}.eyebrow`)
            }}</span>
            <span class="stat-icon" :data-tone="card.tone">
              <component :is="statIcons[card.icon]" class="h-4 w-4" />
            </span>
          </div>

          <h3 class="mt-4 text-lg font-bold tracking-tight text-slate-950">
            {{ t(`home.stats.${card.id}.title`) }}
          </h3>
          <p class="mt-2 text-sm leading-6 text-slate-500">
            {{ t(`home.stats.${card.id}.description`) }}
          </p>
        </article>
      </div>

      <div class="mt-8 flex justify-center">
        <a
          :href="homeLinks.tutorial"
          target="_blank"
          rel="noopener noreferrer"
          class="tutorial-link"
        >
          <span>{{ t('home.tutorial') }}</span
          >{{ t('home.tutorialTitle') }}
          <ArrowUpRight class="h-3.5 w-3.5 shrink-0" />
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-section {
  background:
    linear-gradient(135deg, rgb(37 99 235 / 0.07), transparent 42%),
    linear-gradient(45deg, transparent 48%, rgb(20 184 166 / 0.06), transparent 76%);
  overflow: visible;
  z-index: 1;
}
.hero-grid-layer {
  background-image:
    linear-gradient(to right, rgb(15 23 42 / 0.045) 1px, transparent 1px),
    linear-gradient(to bottom, rgb(15 23 42 / 0.045) 1px, transparent 1px);
  background-size: 56px 56px;
  inset: 0;
  mask-image: linear-gradient(to bottom, black, transparent 78%);
  opacity: 0.48;
  pointer-events: none;
  position: absolute;
  z-index: -2;
}
.release-pill {
  align-items: center;
  background: rgb(255 255 255 / 0.72);
  border: 1px solid rgb(226 232 240 / 0.88);
  border-radius: 9999px;
  box-shadow: 0 6px 18px rgb(15 23 42 / 0.055);
  color: inherit;
  display: inline-flex;
  font-size: 0.82rem;
  gap: 0.5rem;
  max-width: min(100%, 26rem);
  min-height: 2.1rem;
  padding: 0.32rem 0.62rem 0.32rem 0.5rem;
  transition:
    background-color 0.2s ease,
    box-shadow 0.2s ease;
}
.release-pill:hover {
  background: rgb(255 255 255 / 0.9);
  box-shadow: 0 8px 22px rgb(15 23 42 / 0.075);
}
.release-pill:focus-visible {
  outline: 2px solid rgb(37 99 235 / 0.42);
  outline-offset: 4px;
}
.release-pulse {
  background: #2563eb;
  border-radius: 9999px;
  box-shadow: 0 0 0 3px rgb(37 99 235 / 0.1);
  flex: 0 0 auto;
  height: 0.48rem;
  width: 0.48rem;
}
.animated-title-gradient {
  background: linear-gradient(90deg, #2563eb, #7c3aed);
  background-clip: text;
  color: transparent;
  display: inline-block;
}
.stat-icon {
  align-items: center;
  border-radius: 0.5rem;
  display: flex;
  height: 2rem;
  justify-content: center;
  width: 2rem;
}
.stat-icon[data-tone='blue'] {
  background: #eff6ff;
  color: #2563eb;
}
.stat-icon[data-tone='violet'] {
  background: #faf5ff;
  color: #9333ea;
}
.stat-icon[data-tone='emerald'] {
  background: #ecfdf5;
  color: #059669;
}
.stat-icon[data-tone='amber'] {
  background: #fffbeb;
  color: #d97706;
}
.tutorial-link {
  align-items: center;
  background: rgb(239 246 255 / 0.78);
  border: 1px solid rgb(191 219 254 / 0.82);
  border-radius: 0.5rem;
  color: #1d4ed8;
  display: inline-flex;
  gap: 0.55rem;
  max-width: 100%;
  min-height: 2.75rem;
  padding: 0.65rem 1rem;
  text-align: left;
  text-decoration: none;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;
}
.tutorial-link span {
  background: #2563eb;
  border-radius: 0.35rem;
  color: white;
  flex: 0 0 auto;
  font-size: 0.62rem;
  font-weight: 900;
  padding: 0.2rem 0.42rem;
  text-transform: uppercase;
}
.tutorial-link:hover {
  background: rgb(219 234 254 / 0.92);
  border-color: rgb(147 197 253 / 0.95);
  color: #1e40af;
}
@media (max-width: 640px) {
  .release-pill {
    font-size: 0.76rem;
  }
}
@media (prefers-reduced-motion: reduce) {
  .glow-card,
  .release-pill,
  .tutorial-link {
    transition: none;
  }
}
</style>
