<script setup lang="ts">
import { computed } from 'vue'
import { ArrowUpRight, RefreshCw } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import InlineChangelogText from '@/components/changelog/InlineChangelogText.vue'
import { retryLatestRelease, useLatestRelease } from '@/composables/useLatestRelease'
import { siteConfig } from '@/config/site'
import { parseChangelog } from '@/lib/changelog'

const { t } = useI18n()
const { releaseNotes, status, version } = useLatestRelease()
const changelog = computed(() => parseChangelog(releaseNotes.value))
const isWaiting = computed(() => status.value === 'idle' || status.value === 'loading')
</script>

<template>
  <section class="changelog-page">
    <div class="changelog-shell">
      <header class="changelog-header">
        <p class="product-name">fn-knock</p>
        <h1>{{ t('changelog.title') }}</h1>
        <p class="changelog-lead">{{ t('changelog.description') }}</p>

        <div class="changelog-meta">
          <p class="current-release" :aria-label="t('changelog.currentVersion', { version })">
            <span class="status-dot" aria-hidden="true" />
            <span>{{ t('changelog.latest') }}</span>
            <strong>v{{ version }}</strong>
          </p>
          <div class="release-links">
            <RouterLink :to="{ name: 'home', hash: '#downloads' }" class="official-download-link">
              {{ t('changelog.download') }}
            </RouterLink>
            <a
              :href="`${siteConfig.githubUrl}/releases`"
              target="_blank"
              rel="noopener noreferrer"
              class="github-releases-link"
            >
              {{ t('changelog.github') }}<ArrowUpRight aria-hidden="true" />
            </a>
          </div>
        </div>
      </header>

      <div v-if="isWaiting" class="changelog-state" role="status">
        <RefreshCw class="changelog-state__spinner" aria-hidden="true" />
        <p>{{ t('changelog.loading') }}</p>
      </div>

      <div
        v-else-if="status === 'error'"
        class="changelog-state changelog-state--error"
        role="alert"
      >
        <p>{{ t('changelog.error') }}</p>
        <button type="button" @click="retryLatestRelease">
          <RefreshCw aria-hidden="true" />{{ t('changelog.retry') }}
        </button>
      </div>

      <div
        v-else-if="!changelog.sections.length && !changelog.introduction.length"
        class="changelog-state"
      >
        <p>{{ t('changelog.empty') }}</p>
      </div>

      <div v-else class="changelog-content">
        <aside v-if="changelog.introduction.length" class="release-introduction">
          <h2>{{ t('changelog.notice') }}</h2>
          <div>
            <p v-for="(line, index) in changelog.introduction" :key="index">
              <InlineChangelogText :segments="line" />
            </p>
          </div>
        </aside>

        <ol class="release-list" :aria-label="t('changelog.timeline')">
          <li
            v-for="(section, sectionIndex) in changelog.sections"
            :key="`${section.version}-${sectionIndex}`"
            class="release-entry"
          >
            <article class="release-record">
              <header class="release-heading">
                <h2>v{{ section.version }}</h2>
                <p v-if="section.label">{{ section.label }}</p>
                <span v-if="sectionIndex === 0">{{ t('changelog.latestRelease') }}</span>
              </header>

              <div class="release-body">
                <ol v-if="section.items.length" class="release-items">
                  <li v-for="item in section.items" :key="item.number">
                    <span class="release-item-number">{{ item.number }}.</span>
                    <p><InlineChangelogText :segments="item.segments" /></p>
                  </li>
                </ol>

                <div v-if="section.paragraphs.length" class="release-notes">
                  <p v-for="(paragraph, index) in section.paragraphs" :key="index">
                    <InlineChangelogText :segments="paragraph" />
                  </p>
                </div>
              </div>
            </article>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>

<style scoped>
.changelog-page {
  min-height: 70vh;
}

.changelog-shell {
  margin-inline: auto;
  max-width: 58rem;
  padding: 4.5rem 1rem 6rem;
}

.changelog-header {
  border-bottom: 1px solid #dfe3e8;
  padding-bottom: 2.5rem;
}

.product-name {
  color: #2563eb;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.changelog-header h1 {
  color: #111827;
  font-size: clamp(2.25rem, 6vw, 3.5rem);
  font-weight: 750;
  letter-spacing: -0.045em;
  line-height: 1.08;
  margin-top: 0.55rem;
}

.changelog-lead {
  color: #5f6b7a;
  font-size: 1rem;
  line-height: 1.75;
  margin-top: 1rem;
  max-width: 38rem;
}

.changelog-meta {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem 1.5rem;
  justify-content: space-between;
  margin-top: 2rem;
}

.current-release {
  align-items: center;
  color: #687386;
  display: flex;
  font-size: 0.84rem;
  gap: 0.45rem;
}

.current-release strong {
  color: #1f2937;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.82rem;
  font-weight: 650;
}

.status-dot {
  background: #16a34a;
  border-radius: 50%;
  height: 0.45rem;
  width: 0.45rem;
}

.release-links {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem 1rem;
}

.official-download-link {
  background: #1d4ed8;
  border: 1px solid #1d4ed8;
  border-radius: 0.4rem;
  color: #fff;
  font-size: 0.82rem;
  font-weight: 650;
  padding: 0.5rem 0.72rem;
}

.official-download-link:hover {
  background: #1e40af;
  border-color: #1e40af;
}

.github-releases-link {
  align-items: center;
  color: #374151;
  display: inline-flex;
  font-size: 0.84rem;
  font-weight: 550;
  gap: 0.3rem;
  text-decoration: none;
}

.github-releases-link:hover {
  color: #1d4ed8;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.github-releases-link svg {
  height: 0.9rem;
  width: 0.9rem;
}

.changelog-state {
  align-items: center;
  border-bottom: 1px solid #dfe3e8;
  color: #687386;
  display: flex;
  font-size: 0.9rem;
  gap: 0.65rem;
  justify-content: center;
  min-height: 12rem;
  text-align: center;
}

.changelog-state__spinner {
  animation: changelog-spin 1s linear infinite;
  height: 1rem;
  width: 1rem;
}

.changelog-state--error {
  flex-direction: column;
}

.changelog-state button {
  align-items: center;
  background: #fff;
  border: 1px solid #cbd5e1;
  border-radius: 0.4rem;
  color: #1f2937;
  display: inline-flex;
  font-size: 0.82rem;
  font-weight: 650;
  gap: 0.4rem;
  padding: 0.5rem 0.7rem;
}

.changelog-state button:hover {
  border-color: #94a3b8;
}

.changelog-state button svg {
  height: 0.9rem;
  width: 0.9rem;
}

.changelog-content {
  padding-top: 2.75rem;
}

.release-introduction {
  border-left: 2px solid #94a3b8;
  display: grid;
  gap: 0.75rem 2rem;
  grid-template-columns: minmax(0, 1fr);
  padding-left: 1rem;
}

.release-introduction h2 {
  color: #1f2937;
  font-size: 0.86rem;
  font-weight: 700;
}

.release-introduction p {
  color: #5f6b7a;
  font-size: 0.86rem;
  line-height: 1.75;
}

.release-introduction p + p {
  margin-top: 0.35rem;
}

.release-list {
  border-top: 1px solid #dfe3e8;
  margin-top: 3rem;
}

.release-entry {
  border-bottom: 1px solid #dfe3e8;
  padding-block: 2.25rem;
}

.release-record {
  display: grid;
  gap: 1.25rem 2.5rem;
  grid-template-columns: minmax(0, 1fr);
}

.release-heading h2 {
  color: #111827;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.release-heading p {
  color: #687386;
  font-size: 0.75rem;
  line-height: 1.5;
  margin-top: 0.35rem;
}

.release-heading span {
  color: #1d4ed8;
  display: block;
  font-size: 0.72rem;
  font-weight: 650;
  margin-top: 0.55rem;
}

.release-items {
  display: grid;
  gap: 0.8rem;
}

.release-items li {
  align-items: start;
  color: #3f4a5a;
  display: grid;
  font-size: 0.9rem;
  gap: 0.45rem;
  grid-template-columns: 1.35rem minmax(0, 1fr);
  line-height: 1.7;
}

.release-item-number {
  color: #9aa3af;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.78rem;
  padding-top: 0.08rem;
  text-align: right;
}

.release-notes {
  border-top: 1px solid #e5e7eb;
  color: #6b4f2c;
  font-size: 0.84rem;
  line-height: 1.7;
  margin-top: 1.2rem;
  padding-top: 1rem;
}

.release-notes p + p {
  margin-top: 0.4rem;
}

:deep(.changelog-inline-link) {
  color: #1d4ed8;
  text-decoration: underline;
  text-decoration-color: rgb(29 78 216 / 0.35);
  text-underline-offset: 3px;
}

:deep(.changelog-inline-link:hover) {
  text-decoration-color: currentcolor;
}

@keyframes changelog-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (min-width: 640px) {
  .changelog-shell {
    padding-inline: 1.5rem;
  }

  .release-introduction {
    grid-template-columns: 7.5rem minmax(0, 1fr);
  }

  .release-record {
    grid-template-columns: 7.5rem minmax(0, 1fr);
  }
}

@media (prefers-reduced-motion: reduce) {
  .changelog-state__spinner {
    animation: none;
  }
}
</style>
