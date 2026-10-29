<script setup lang="ts">
import { useTemplateRef, type Component } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  Activity,
  Cloud,
  FileText,
  Fingerprint,
  Gauge,
  Globe2,
  KeyRound,
  Network,
  Router,
  Settings,
  ShieldCheck,
} from 'lucide-vue-next'
import { useHomeTelemetry } from '@/composables/useHomeTelemetry'
import { consoleNavItems, type ConsoleIcon } from '@/config/home'

const icons: Record<ConsoleIcon, Component> = {
  gauge: Gauge,
  network: Network,
  shield: ShieldCheck,
  fingerprint: Fingerprint,
  key: KeyRound,
  file: FileText,
  globe: Globe2,
  settings: Settings,
}
const { t } = useI18n()
const previewRef = useTemplateRef<HTMLElement>('previewRef')
const previewBars = [42, 56, 48, 72, 62, 79, 52, 67, 58, 74, 61, 83]

const {
  blockedCount,
  formattedUptime,
  liveInBand,
  liveOutBand,
  totalInBand,
  totalOutBand,
  trafficBars,
} = useHomeTelemetry(previewRef)
</script>

<template>
  <section
    class="relative isolate px-4 pb-16 sm:px-6 lg:pb-24"
    aria-labelledby="architecture-title"
  >
    <div class="mx-auto max-w-6xl">
      <div class="mb-10 text-center">
        <p class="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
          {{ t('home.architecture.eyebrow') }}
        </p>
        <h2
          id="architecture-title"
          class="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl"
        >
          {{ t('home.architecture.title') }}
        </h2>
        <p class="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600">
          {{ t('home.architecture.description') }}
        </p>
      </div>

      <figure class="mobile-preview dashboard-shell lg:hidden">
        <figcaption class="preview-caption">{{ t('downloadFeedback.preview') }}</figcaption>
        <div class="mobile-preview-content">
          <dl class="mobile-metrics">
            <div>
              <dt>{{ t('home.architecture.inbound') }}</dt>
              <dd>2.4 <span>MB/s</span></dd>
            </div>
            <div>
              <dt>{{ t('home.architecture.outbound') }}</dt>
              <dd>851 <span>KB/s</span></dd>
            </div>
          </dl>
          <div
            class="telemetry-chart mobile-chart"
            role="img"
            :aria-label="t('home.architecture.chartLabel')"
          >
            <span
              v-for="(bar, index) in previewBars"
              :key="index"
              class="telemetry-bar"
              :style="{ '--bar-scale': bar / 100 }"
            />
          </div>
        </div>
      </figure>

      <figure
        ref="previewRef"
        class="dashboard-shell hidden overflow-hidden rounded-lg border border-slate-200/75 bg-white/86 shadow-[0_14px_44px_rgba(15,23,42,0.08)] lg:block"
      >
        <figcaption class="preview-caption">{{ t('downloadFeedback.preview') }}</figcaption>
        <div
          class="flex flex-col gap-4 border-b border-slate-200/70 bg-slate-50/80 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
        >
          <div class="flex min-w-0 items-center gap-3">
            <span class="flex shrink-0 items-center gap-1.5" aria-hidden="true">
              <span class="h-3 w-3 rounded-full bg-red-400" />
              <span class="h-3 w-3 rounded-full bg-amber-400" />
              <span class="h-3 w-3 rounded-full bg-emerald-400" />
            </span>
            <span class="truncate text-xs font-bold text-slate-500">Knock</span>
          </div>
          <div class="flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <span class="inline-flex items-center gap-1.5">
              <span class="h-2.5 w-2.5 rounded-full bg-emerald-500" aria-hidden="true" />
              {{ t('home.architecture.running')
              }}<strong class="text-slate-700">{{ formattedUptime }}</strong>
            </span>
            <span class="hidden h-4 w-px bg-slate-300 sm:block" aria-hidden="true" />
            <span
              >{{ t('home.architecture.blocked')
              }}<strong class="text-red-600">{{ blockedCount }}</strong></span
            >
          </div>
        </div>

        <div class="grid min-h-[560px] lg:grid-cols-[15rem_minmax(0,1fr)]">
          <aside
            class="border-b border-slate-200/70 bg-slate-50/55 p-4 lg:border-b-0 lg:border-r"
            :aria-label="t('home.architecture.navLabel')"
          >
            <div class="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-1">
              <div
                v-for="item in consoleNavItems"
                :key="item.id"
                class="console-nav-item"
                :class="{ 'is-active': item.active }"
              >
                <component :is="icons[item.icon]" class="h-4 w-4" />
                <span>{{ t(`home.architecture.nav.${item.id}`) }}</span>
              </div>
            </div>
          </aside>

          <div class="space-y-6 p-4 sm:p-6 lg:p-8">
            <div
              class="flex flex-col gap-4 border-b border-slate-200/70 pb-5 lg:flex-row lg:items-center lg:justify-between"
            >
              <div class="flex min-w-0 flex-wrap gap-5 text-sm font-bold">
                <span class="tab-label is-active">{{ t('home.architecture.realtime') }}</span
                ><span class="tab-label">{{ t('home.architecture.events') }}</span
                ><span class="tab-label">{{ t('home.architecture.performance') }}</span>
              </div>
              <div class="time-segment" role="group" :aria-label="t('home.architecture.timeRange')">
                <span class="is-active">{{ t('home.architecture.min15') }}</span
                ><span>{{ t('home.architecture.min30') }}</span
                ><span>{{ t('home.architecture.hour6') }}</span
                ><span>{{ t('home.architecture.hour24') }}</span>
              </div>
            </div>

            <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <article class="metric-card">
                <div>
                  <span>{{ t('home.architecture.inbound') }}</span
                  ><Activity class="h-4 w-4 text-emerald-500" />
                </div>
                <strong>{{ liveInBand }}</strong>
                <p>{{ t('home.architecture.inboundHelp') }}</p>
              </article>
              <article class="metric-card">
                <div>
                  <span>{{ t('home.architecture.outbound') }}</span
                  ><Activity class="h-4 w-4 text-blue-500" />
                </div>
                <strong>{{ liveOutBand }}</strong>
                <p>{{ t('home.architecture.outboundHelp') }}</p>
              </article>
              <article class="metric-card">
                <div>
                  <span>{{ t('home.architecture.totalInbound') }}</span
                  ><Router class="h-4 w-4 text-violet-500" />
                </div>
                <strong>{{ totalInBand }}</strong>
                <p>{{ t('home.architecture.totalInboundHelp') }}</p>
              </article>
              <article class="metric-card">
                <div>
                  <span>{{ t('home.architecture.totalOutbound') }}</span
                  ><Cloud class="h-4 w-4 text-sky-500" />
                </div>
                <strong>{{ totalOutBand }}</strong>
                <p>{{ t('home.architecture.totalOutboundHelp') }}</p>
              </article>
            </div>

            <div class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
              <article class="panel-card">
                <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3>{{ t('home.architecture.chart') }}</h3>
                    <p>{{ t('home.architecture.chartHelp') }}</p>
                  </div>
                  <div class="flex items-center gap-3 text-xs font-bold text-slate-500">
                    <span class="inline-flex items-center gap-1.5"
                      ><span class="h-2.5 w-2.5 rounded-sm bg-blue-500" />{{
                        t('home.architecture.in')
                      }}</span
                    ><span class="inline-flex items-center gap-1.5"
                      ><span class="h-2.5 w-2.5 rounded-sm bg-violet-500" />{{
                        t('home.architecture.out')
                      }}</span
                    >
                  </div>
                </div>
                <div
                  class="telemetry-chart mt-6"
                  role="img"
                  :aria-label="t('home.architecture.chartLabel')"
                >
                  <span
                    v-for="(bar, index) in trafficBars"
                    :key="index"
                    class="telemetry-bar"
                    :style="{ '--bar-scale': bar / 100 }"
                  />
                </div>
              </article>

              <article class="panel-card">
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <h3>{{ t('home.architecture.security') }}</h3>
                    <p>{{ t('home.architecture.securityHelp') }}</p>
                  </div>
                  <span
                    class="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700"
                    >ACTIVE</span
                  >
                </div>
                <div class="mt-5 grid grid-cols-2 gap-3">
                  <div class="mini-metric">
                    <span>{{ t('home.architecture.maliciousLogin') }}</span
                    ><strong>{{ Math.floor(blockedCount / 34) }}</strong>
                  </div>
                  <div class="mini-metric">
                    <span>{{ t('home.architecture.scanners') }}</span
                    ><strong>{{ Math.floor(blockedCount / 11) }}</strong>
                  </div>
                </div>
                <div class="ddns-card mt-4">
                  <div>
                    <span>{{ t('home.architecture.ddnsStatus') }}</span
                    ><strong>{{ t('home.architecture.resolved') }}</strong>
                  </div>
                  <p>Cloudflare · 12.22.87.133</p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </figure>
    </div>
  </section>
</template>

<style scoped>
.preview-caption {
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  color: #475569;
  font-size: 0.8125rem;
  line-height: 1.6;
  padding: 0.75rem 1rem;
  text-align: left;
}
.mobile-preview {
  background: rgb(255 255 255 / 0.86);
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  overflow: hidden;
}
.mobile-preview-content {
  padding: 1rem;
}
.mobile-metrics {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}
.mobile-metrics dt {
  color: #475569;
  font-size: 0.8125rem;
}
.mobile-metrics dd {
  font-size: clamp(1.25rem, 5vw, 1.75rem);
  font-weight: 700;
  margin-top: 0.5rem;
}
.mobile-metrics dd span {
  font-size: 0.8125rem;
  font-weight: 500;
}
.telemetry-chart.mobile-chart {
  height: 9rem;
  gap: 0.3rem;
  margin-top: 1.25rem;
}
.mobile-chart .telemetry-bar {
  transition: none;
}

.dashboard-shell {
  font-variant-numeric: tabular-nums;
  color: #0f172a;
}
.console-nav-item {
  align-items: center;
  border-radius: 0.5rem;
  color: #475569;
  display: flex;
  font-size: 0.78rem;
  font-weight: 800;
  gap: 0.6rem;
  min-height: 2.75rem;
  padding: 0.65rem 0.75rem;
  text-align: left;
  width: 100%;
}
.console-nav-item.is-active {
  background: #0f172a;
  color: #fff;
}
.tab-label {
  color: #64748b;
}
.tab-label.is-active {
  color: #2563eb;
}
.time-segment {
  background: #f1f5f9;
  border-radius: 0.5rem;
  display: grid;
  gap: 0.25rem;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  max-width: 100%;
  min-height: 2.35rem;
  padding: 0.25rem;
  width: min(100%, 24rem);
}
.time-segment span {
  align-items: center;
  border-radius: 0.35rem;
  color: #64748b;
  display: flex;
  font-size: 0.73rem;
  font-weight: 800;
  justify-content: center;
}
.time-segment span.is-active {
  background: #fff;
  box-shadow: 0 4px 12px rgb(15 23 42 / 0.06);
  color: #0f172a;
}
.metric-card,
.panel-card {
  background: rgb(248 250 252 / 0.68);
  border: 1px solid rgb(226 232 240 / 0.86);
  border-radius: 0.5rem;
}
.metric-card {
  min-height: 9.4rem;
  padding: 1.2rem;
}
.metric-card div {
  align-items: center;
  display: flex;
  justify-content: space-between;
}
.metric-card span,
.panel-card p,
.mini-metric span {
  color: #64748b;
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.metric-card strong {
  color: #0f172a;
  display: block;
  font-size: clamp(1.55rem, 3vw, 2.1rem);
  font-weight: 750;
  margin-top: 1.1rem;
}
.metric-card p {
  color: #64748b;
  font-size: 0.75rem;
  margin-top: 0.3rem;
}
.panel-card {
  padding: 1.25rem;
}
.panel-card h3 {
  color: #0f172a;
  font-size: 0.85rem;
  font-weight: 750;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.telemetry-chart {
  align-items: end;
  background:
    linear-gradient(to top, rgb(37 99 235 / 0.08) 1px, transparent 1px),
    linear-gradient(to right, rgb(15 23 42 / 0.05) 1px, transparent 1px);
  background-size:
    100% 25%,
    8.33% 100%;
  border-radius: 0.5rem;
  display: grid;
  gap: 0.45rem;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  height: 13.5rem;
  overflow: hidden;
  padding: 1rem;
}
.telemetry-bar {
  --bar-scale: 0.5;
  background: linear-gradient(180deg, #3b82f6, #7c3aed);
  border-radius: 9999px 9999px 0.2rem 0.2rem;
  height: 100%;
  transform: scaleY(var(--bar-scale));
  transform-origin: bottom;
  transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}
.mini-metric,
.ddns-card {
  background: rgb(255 255 255 / 0.82);
  border: 1px solid rgb(226 232 240 / 0.8);
  border-radius: 0.5rem;
}
.mini-metric {
  min-height: 5.5rem;
  padding: 0.9rem;
  text-align: center;
}
.mini-metric strong {
  color: #0f172a;
  display: block;
  font-size: 1.55rem;
  font-weight: 750;
  margin-top: 0.35rem;
}
.ddns-card {
  padding: 1rem;
}
.ddns-card div {
  align-items: center;
  display: flex;
  justify-content: space-between;
}
.ddns-card span {
  color: #334155;
  font-size: 0.78rem;
  font-weight: 800;
}
.ddns-card strong {
  background: #ecfdf5;
  border-radius: 9999px;
  color: #047857;
  font-size: 0.75rem;
  font-weight: 750;
  padding: 0.18rem 0.55rem;
}
.ddns-card p {
  margin-top: 0.65rem;
  text-transform: none;
}
@media (prefers-reduced-motion: reduce) {
  .telemetry-bar {
    transition: none;
  }
}
</style>
