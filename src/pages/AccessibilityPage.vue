<script setup lang="ts">
import { ArrowLeft, CheckCircle2, ExternalLink } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { siteConfig } from '@/config/site'

const { t } = useI18n()
const githubIssuesUrl = `${siteConfig.githubUrl}/issues`
const qqGroupUrl = `mqqapi://card/show_pslcard?src_type=internal&version=1&uin=${siteConfig.qqGroupNumber}&card_type=group&source=qrcode`
</script>

<template>
  <section class="accessibility-page" aria-labelledby="accessibility-title">
    <div class="accessibility-shell">
      <RouterLink class="back-link" :to="{ name: 'home' }">
        <ArrowLeft aria-hidden="true" />
        {{ t('common.backWebsite') }}
      </RouterLink>

      <header class="accessibility-hero">
        <p class="eyebrow">{{ t('accessibility.eyebrow') }}</p>
        <h1 id="accessibility-title">{{ t('accessibility.title') }}</h1>
        <p class="hero-lead">{{ t('accessibility.lead') }}</p>
      </header>

      <section
        class="conformance-summary"
        aria-labelledby="conformance-title"
        data-testid="conformance-claim"
      >
        <p class="conformance-badge">
          <CheckCircle2 aria-hidden="true" />
          {{ t('accessibility.claim.badge') }}
        </p>
        <h2 id="conformance-title">{{ t('accessibility.claim.title') }}</h2>
        <p>
          {{ t('accessibility.claim.prefix') }}
          <a href="https://www.w3.org/TR/WCAG22/" target="_blank" rel="noopener noreferrer">
            {{ t('accessibility.claim.standard') }}
            <ExternalLink aria-hidden="true" />
          </a>
          {{ t('accessibility.claim.suffix') }}
        </p>

        <dl class="claim-details" :aria-label="t('accessibility.claim.detailsLabel')">
          <div>
            <dt>{{ t('accessibility.claim.levelLabel') }}</dt>
            <dd>{{ t('accessibility.claim.levelValue') }}</dd>
          </div>
          <div>
            <dt>{{ t('accessibility.claim.dateLabel') }}</dt>
            <dd>{{ t('accessibility.claim.dateValue') }}</dd>
          </div>
          <div>
            <dt>{{ t('accessibility.claim.productLabel') }}</dt>
            <dd>{{ t('accessibility.claim.productValue') }}</dd>
          </div>
          <div>
            <dt>{{ t('accessibility.claim.websiteLabel') }}</dt>
            <dd>
              <a href="https://www.fnknock.cn/" target="_blank" rel="noopener noreferrer">
                www.fnknock.cn
                <ExternalLink aria-hidden="true" />
              </a>
            </dd>
          </div>
        </dl>
      </section>

      <article class="statement-content">
        <section class="statement-section" aria-labelledby="commitment-title">
          <h2 id="commitment-title">{{ t('accessibility.commitment.title') }}</h2>
          <p>{{ t('accessibility.commitment.body') }}</p>
        </section>

        <section class="statement-section" aria-labelledby="features-title">
          <h2 id="features-title">{{ t('accessibility.features.title') }}</h2>
          <p>{{ t('accessibility.features.intro') }}</p>
          <ul class="feature-list">
            <li>
              <strong>{{ t('accessibility.features.keyboardTitle') }}</strong>
              <span>{{ t('accessibility.features.keyboardBody') }}</span>
            </li>
            <li>
              <strong>{{ t('accessibility.features.focusTitle') }}</strong>
              <span>{{ t('accessibility.features.focusBody') }}</span>
            </li>
            <li>
              <strong>{{ t('accessibility.features.screenReaderTitle') }}</strong>
              <span>{{ t('accessibility.features.screenReaderBody') }}</span>
            </li>
            <li>
              <strong>{{ t('accessibility.features.statusTitle') }}</strong>
              <span>{{ t('accessibility.features.statusBody') }}</span>
            </li>
            <li>
              <strong>{{ t('accessibility.features.motionTitle') }}</strong>
              <span>{{ t('accessibility.features.motionBody') }}</span>
            </li>
            <li>
              <strong>{{ t('accessibility.features.responsiveTitle') }}</strong>
              <span>{{ t('accessibility.features.responsiveBody') }}</span>
            </li>
          </ul>
        </section>

        <section class="statement-section" aria-labelledby="scope-title">
          <h2 id="scope-title">{{ t('accessibility.scope.title') }}</h2>
          <p>{{ t('accessibility.scope.body') }}</p>
          <h3>{{ t('accessibility.scope.includedTitle') }}</h3>
          <ul class="scope-list">
            <li>{{ t('accessibility.scope.website') }}</li>
            <li>{{ t('accessibility.scope.product') }}</li>
          </ul>
          <h3>{{ t('accessibility.scope.excludedTitle') }}</h3>
          <p>{{ t('accessibility.scope.excluded') }}</p>
        </section>

        <section class="statement-section" aria-labelledby="technical-title">
          <h2 id="technical-title">{{ t('accessibility.technical.title') }}</h2>
          <p>{{ t('accessibility.technical.body') }}</p>
          <ul class="technology-list" :aria-label="t('accessibility.technical.listLabel')">
            <li>HTML</li>
            <li>CSS</li>
            <li>JavaScript</li>
            <li>WAI-ARIA</li>
          </ul>
          <h3>{{ t('accessibility.technical.assessmentTitle') }}</h3>
          <p>{{ t('accessibility.technical.assessmentBody') }}</p>
        </section>

        <section class="statement-section" aria-labelledby="limitations-title">
          <h2 id="limitations-title">{{ t('accessibility.limitations.title') }}</h2>
          <p>{{ t('accessibility.limitations.body') }}</p>
        </section>

        <section class="statement-section" aria-labelledby="maintenance-title">
          <h2 id="maintenance-title">{{ t('accessibility.maintenance.title') }}</h2>
          <p>{{ t('accessibility.maintenance.body') }}</p>
        </section>

        <section class="statement-section feedback-section" aria-labelledby="feedback-title">
          <h2 id="feedback-title">{{ t('accessibility.feedback.title') }}</h2>
          <p>{{ t('accessibility.feedback.body') }}</p>
          <div class="feedback-links">
            <a :href="githubIssuesUrl" target="_blank" rel="noopener noreferrer">
              {{ t('accessibility.feedback.github') }}
              <ExternalLink aria-hidden="true" />
            </a>
            <a :href="qqGroupUrl">
              {{ t('accessibility.feedback.qq', { number: siteConfig.qqGroupNumber }) }}
            </a>
          </div>
          <p class="privacy-notice">{{ t('accessibility.feedback.privacy') }}</p>
        </section>
      </article>
    </div>
  </section>
</template>

<style scoped>
.accessibility-page {
  color: #1e293b;
  min-height: 70vh;
}

.accessibility-shell {
  margin-inline: auto;
  max-width: 54rem;
  padding: 3rem 1rem 5rem;
}

.back-link {
  align-items: center;
  color: #475569;
  display: inline-flex;
  font-size: 0.9rem;
  font-weight: 650;
  gap: 0.45rem;
  text-decoration: none;
  transition: color 160ms ease;
}

.back-link:hover {
  color: #155eef;
}

.back-link svg {
  height: 1rem;
  width: 1rem;
}

.accessibility-hero {
  padding: 3.5rem 0 2rem;
}

.eyebrow {
  color: #2563eb;
  font-size: 0.75rem;
  font-weight: 750;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.accessibility-hero h1 {
  color: #101828;
  font-size: clamp(2.25rem, 6vw, 3.5rem);
  font-weight: 750;
  letter-spacing: -0.045em;
  line-height: 1.08;
  margin-top: 0.65rem;
}

.hero-lead {
  color: #5f6b7a;
  line-height: 1.75;
  margin-top: 1rem;
  max-width: 40rem;
}

.conformance-summary {
  background: #f8fafc;
  border: 1px solid #dce4ee;
  border-left: 4px solid #16845b;
  border-radius: 0.75rem;
  padding: 1.5rem;
}

.conformance-badge {
  align-items: center;
  color: #12724d;
  display: flex;
  font-size: 0.75rem;
  font-weight: 700;
  gap: 0.45rem;
}

.conformance-badge svg {
  height: 1rem;
  width: 1rem;
}

.conformance-summary h2 {
  color: #172033;
  font-size: clamp(1.35rem, 3vw, 1.65rem);
  letter-spacing: -0.025em;
  line-height: 1.25;
  margin-top: 0.6rem;
}

.conformance-summary > p:not(.conformance-badge) {
  color: #526071;
  line-height: 1.75;
  margin-top: 0.75rem;
}

.conformance-summary a,
.claim-details a {
  align-items: center;
  color: #1d4ed8;
  display: inline-flex;
  font-weight: 650;
  gap: 0.25rem;
  text-underline-offset: 0.2em;
}

.conformance-summary a svg,
.claim-details a svg {
  height: 0.85rem;
  width: 0.85rem;
}

.claim-details {
  display: grid;
  gap: 1rem 1.5rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  border-top: 1px solid #dce4ee;
  margin-top: 1.25rem;
  padding-top: 1.25rem;
}

.claim-details dt {
  color: #64748b;
  font-size: 0.75rem;
  font-weight: 650;
}

.claim-details dd {
  color: #1e293b;
  font-size: 0.92rem;
  font-weight: 650;
  line-height: 1.5;
  margin-top: 0.25rem;
}

.statement-content {
  margin-top: 3rem;
}

.statement-section {
  border-top: 1px solid #e2e8f0;
  padding: 2rem 0;
}

.statement-section h2 {
  color: #111827;
  font-size: clamp(1.3rem, 3vw, 1.55rem);
  letter-spacing: -0.025em;
  line-height: 1.25;
}

.statement-section h3 {
  color: #1e293b;
  font-size: 0.95rem;
  font-weight: 720;
  margin-top: 1.5rem;
}

.statement-section p,
.statement-section li,
.feature-list span {
  color: #5b6778;
  line-height: 1.75;
}

.statement-section > p {
  margin-top: 0.9rem;
}

.feature-list {
  list-style: disc;
  margin: 1rem 0 0 1.2rem;
}

.feature-list li {
  border-top: 1px solid #edf0f4;
  display: list-item;
  padding: 0.8rem 0 0.8rem 0.2rem;
}

.feature-list strong {
  color: #1e293b;
  display: block;
  font-size: 0.92rem;
}

.feature-list span {
  display: block;
  margin-top: 0.2rem;
}

.scope-list {
  list-style: disc;
  margin: 0.6rem 0 0 1.2rem;
}

.technology-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem 1.1rem;
  margin: 1rem 0 1.5rem;
}

.technology-list li {
  color: #1d4ed8;
  font-size: 0.85rem;
  font-weight: 700;
}

.feedback-section {
  background: #f8fafc;
  border: 1px solid #dce4ee;
  border-radius: 0.75rem;
  padding: 1.5rem;
}

.feedback-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.25rem;
  margin-top: 1rem;
}

.feedback-links a {
  align-items: center;
  color: #1e40af;
  display: inline-flex;
  font-size: 0.86rem;
  font-weight: 700;
  gap: 0.35rem;
  text-underline-offset: 0.2em;
}

.feedback-links svg {
  height: 0.95rem;
  width: 0.95rem;
}

.privacy-notice {
  border-top: 1px solid #dce4ee;
  color: #64748b;
  font-size: 0.75rem;
  line-height: 1.6;
  margin-top: 1.15rem;
  padding-top: 1rem;
}

.back-link:focus-visible,
.conformance-summary a:focus-visible,
.feedback-links a:focus-visible {
  border-radius: 0.25rem;
  outline: 3px solid #f59e0b;
  outline-offset: 3px;
}

@media (max-width: 640px) {
  .accessibility-shell {
    padding-bottom: 3.5rem;
    padding-top: 2rem;
  }

  .accessibility-hero {
    padding-top: 2.75rem;
  }

  .claim-details {
    grid-template-columns: 1fr;
  }

  .statement-content {
    margin-top: 2.5rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .back-link {
    transition: none;
  }
}
</style>
