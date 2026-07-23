<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { ArrowLeft, ChevronDown, Download, ExternalLink } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

interface BomProperty {
  name: string
  value: string
}

interface BomComponent {
  'bom-ref': string
  name: string
  version?: string
  licenses?: Array<{ expression?: string; license?: { id?: string; name?: string } }>
  externalReferences?: Array<{ type: string; url: string }>
  properties?: BomProperty[]
}

interface CycloneDxBom {
  metadata: {
    timestamp: string
    properties?: BomProperty[]
  }
  components: BomComponent[]
}

const disclosureUrl = `${import.meta.env.BASE_URL}sbom/third-party-software-disclosure.cdx.json`
const { locale, t } = useI18n()
const bom = ref<CycloneDxBom | null>(null)
const loadError = ref('')
const search = ref('')
const ecosystem = ref('all')
const scope = ref('all')
const relationship = ref('all')
const page = ref(1)
const pageSize = 50

const property = (component: BomComponent, name: string) =>
  component.properties?.find((item) => item.name === name)?.value ?? ''

const license = (component: BomComponent) =>
  component.licenses
    ?.map((item) => item.expression ?? item.license?.id ?? item.license?.name)
    .filter(Boolean)
    .join(' OR ') || 'NOASSERTION'

const sourceUrl = (component: BomComponent) =>
  component.externalReferences?.find((item) => item.type === 'vcs')?.url ??
  component.externalReferences?.find((item) => item.type === 'website')?.url ??
  component.externalReferences?.find((item) => item.type === 'distribution')?.url

const components = computed(() => bom.value?.components ?? [])
const ecosystems = computed(() =>
  [...new Set(components.value.map((item) => property(item, 'fn-knock:ecosystem')))]
    .filter(Boolean)
    .sort(),
)

const filteredComponents = computed(() => {
  const query = search.value.trim().toLowerCase()

  return components.value.filter((component) => {
    const componentEcosystem = property(component, 'fn-knock:ecosystem')
    const componentScopes = property(component, 'fn-knock:scope').split(',')
    const componentRelationship = property(component, 'fn-knock:relationship')

    if (ecosystem.value !== 'all' && componentEcosystem !== ecosystem.value) return false
    if (scope.value !== 'all' && !componentScopes.includes(scope.value)) return false
    if (relationship.value !== 'all' && componentRelationship !== relationship.value) return false
    if (!query) return true

    return [
      component.name,
      component.version,
      license(component),
      componentEcosystem,
      property(component, 'fn-knock:used-by'),
    ].some((value) => value?.toLowerCase().includes(query))
  })
})

const pageCount = computed(() => Math.max(1, Math.ceil(filteredComponents.value.length / pageSize)))
const pageComponents = computed(() => {
  const start = (page.value - 1) * pageSize
  return filteredComponents.value.slice(start, start + pageSize)
})
const firstVisible = computed(() =>
  filteredComponents.value.length ? (page.value - 1) * pageSize + 1 : 0,
)
const lastVisible = computed(() => Math.min(page.value * pageSize, filteredComponents.value.length))
const generatedAt = computed(() => {
  if (!bom.value?.metadata.timestamp) return ''
  return new Intl.DateTimeFormat(locale.value, {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date(bom.value.metadata.timestamp))
})

const scopeLabel = (value: string) =>
  ['runtime', 'build', 'development', 'optional', 'system'].includes(value)
    ? t(`sbom.${value}`)
    : value

watch([search, ecosystem, scope, relationship], () => {
  page.value = 1
})
watch(pageCount, (count) => {
  if (page.value > count) page.value = count
})

onMounted(async () => {
  try {
    const response = await fetch(disclosureUrl)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    bom.value = (await response.json()) as CycloneDxBom
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : t('sbom.loadGeneric')
  }
})
</script>

<template>
  <div class="disclosure-page">
    <div class="disclosure-shell">
      <div class="disclosure-toolbar">
        <RouterLink class="back-link" :to="{ name: 'home' }">
          <ArrowLeft aria-hidden="true" />
          {{ t('common.backWebsite') }}
        </RouterLink>
        <a class="download-link" :href="disclosureUrl" download>
          <Download aria-hidden="true" />
          {{ t('sbom.download') }}
        </a>
      </div>

      <header class="disclosure-hero">
        <h1>{{ t('sbom.title') }}</h1>
        <p class="hero-lead">{{ t('sbom.lead') }}</p>
        <p v-if="generatedAt" class="generated-at">
          {{ t('sbom.generated', { date: generatedAt }) }}
        </p>
      </header>

      <section class="inventory" aria-labelledby="inventory-title">
        <div class="inventory-heading">
          <h2 id="inventory-title">{{ t('sbom.inventory') }}</h2>
          <p role="status" aria-live="polite">
            {{
              t('sbom.matches', {
                count: filteredComponents.length.toLocaleString(locale),
              })
            }}
          </p>
        </div>

        <form class="filters" role="search" :aria-label="t('sbom.filters')" @submit.prevent>
          <label for="component-search" class="search-field">
            <span class="sr-only">{{ t('sbom.search') }}</span>
            <input
              id="component-search"
              v-model="search"
              type="search"
              :placeholder="t('sbom.searchPlaceholder')"
            />
          </label>
          <label for="ecosystem-filter" class="select-field">
            <span class="sr-only">{{ t('sbom.ecosystemFilter') }}</span>
            <select id="ecosystem-filter" v-model="ecosystem">
              <option value="all">{{ t('sbom.allEcosystems') }}</option>
              <option v-for="item in ecosystems" :key="item" :value="item">{{ item }}</option>
            </select>
            <ChevronDown aria-hidden="true" />
          </label>
          <label for="scope-filter" class="select-field">
            <span class="sr-only">{{ t('sbom.scopeFilter') }}</span>
            <select id="scope-filter" v-model="scope">
              <option value="all">{{ t('sbom.allScopes') }}</option>
              <option value="runtime">{{ t('sbom.runtime') }}</option>
              <option value="build">{{ t('sbom.build') }}</option>
              <option value="development">{{ t('sbom.development') }}</option>
              <option value="optional">{{ t('sbom.optional') }}</option>
              <option value="system">{{ t('sbom.system') }}</option>
            </select>
            <ChevronDown aria-hidden="true" />
          </label>
          <label for="relationship-filter" class="select-field">
            <span class="sr-only">{{ t('sbom.relationshipFilter') }}</span>
            <select id="relationship-filter" v-model="relationship">
              <option value="all">{{ t('sbom.allRelationships') }}</option>
              <option value="direct">{{ t('sbom.directDependency') }}</option>
              <option value="transitive">{{ t('sbom.transitiveDependency') }}</option>
            </select>
            <ChevronDown aria-hidden="true" />
          </label>
        </form>

        <div v-if="loadError" class="load-error" role="alert">
          <div>
            <strong>{{ t('sbom.loadFailed') }}</strong>
            <span>{{ loadError }}</span>
          </div>
        </div>

        <div v-else class="table-frame">
          <div class="table-scroll" role="region" aria-labelledby="inventory-title" tabindex="0">
            <table>
              <caption class="sr-only">
                {{
                  t('sbom.inventory')
                }}
              </caption>
              <thead>
                <tr>
                  <th scope="col">{{ t('sbom.project') }}</th>
                  <th scope="col">{{ t('sbom.version') }}</th>
                  <th scope="col">{{ t('sbom.ecosystem') }}</th>
                  <th scope="col">{{ t('sbom.license') }}</th>
                  <th scope="col">{{ t('sbom.scope') }}</th>
                  <th scope="col">{{ t('sbom.relationship') }}</th>
                  <th scope="col" :aria-label="t('sbom.source')"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="component in pageComponents" :key="component['bom-ref']">
                  <td>
                    <strong class="project-name">{{ component.name }}</strong>
                    <span v-if="property(component, 'fn-knock:used-by')" class="used-by">
                      {{ property(component, 'fn-knock:used-by') }}
                    </span>
                  </td>
                  <td class="mono">{{ component.version || t('sbom.dynamic') }}</td>
                  <td>
                    <span class="pill pill--ecosystem">
                      {{ property(component, 'fn-knock:ecosystem') }}
                    </span>
                  </td>
                  <td class="mono license-cell">{{ license(component) }}</td>
                  <td>
                    <div class="scope-list">
                      <span
                        v-for="item in property(component, 'fn-knock:scope').split(',')"
                        :key="item"
                        class="scope-tag"
                      >
                        {{ scopeLabel(item) }}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span
                      class="pill"
                      :class="{
                        'pill--direct': property(component, 'fn-knock:relationship') === 'direct',
                      }"
                    >
                      {{
                        property(component, 'fn-knock:relationship') === 'direct'
                          ? t('sbom.direct')
                          : t('sbom.transitive')
                      }}
                    </span>
                  </td>
                  <td class="source-cell">
                    <a
                      v-if="sourceUrl(component)"
                      :href="sourceUrl(component)"
                      target="_blank"
                      rel="noopener noreferrer"
                      :aria-label="t('sbom.openSource', { name: component.name })"
                    >
                      <ExternalLink aria-hidden="true" />
                    </a>
                    <span v-else>—</span>
                  </td>
                </tr>
                <tr v-if="!pageComponents.length">
                  <td colspan="7" class="empty-state">
                    {{ bom ? t('sbom.empty') : t('sbom.loading') }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="pagination">
            <p role="status" aria-live="polite">
              {{
                t('sbom.pagination', {
                  first: firstVisible,
                  last: lastVisible,
                  count: filteredComponents.length.toLocaleString(locale),
                })
              }}
            </p>
            <div>
              <button type="button" :disabled="page <= 1" @click="page -= 1">
                {{ t('common.previous') }}
              </button>
              <span>{{ page }} / {{ pageCount }}</span>
              <button type="button" :disabled="page >= pageCount" @click="page += 1">
                {{ t('common.next') }}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.disclosure-page {
  color: var(--foreground);
}

.disclosure-shell {
  box-sizing: border-box;
  width: min(100%, 72rem);
  margin: 0 auto;
  padding: 2.5rem max(1rem, env(safe-area-inset-right)) max(5rem, env(safe-area-inset-bottom))
    max(1rem, env(safe-area-inset-left));
}

.disclosure-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 3rem;
}

.back-link,
.download-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--muted-foreground);
  font-size: 0.8125rem;
  font-weight: 600;
  transition:
    color 160ms ease,
    border-color 160ms ease,
    background 160ms ease;
}

.back-link:hover {
  color: var(--foreground);
}

.back-link svg,
.download-link svg {
  width: 1rem;
  height: 1rem;
}

.download-link {
  color: var(--foreground);
}

.download-link:hover {
  color: var(--muted-foreground);
}

.disclosure-hero {
  max-width: 48rem;
  margin-bottom: 2rem;
}

.disclosure-hero h1 {
  margin: 0;
  font-size: clamp(2rem, 5vw, 3.2rem);
  font-weight: 720;
  letter-spacing: -0.04em;
  line-height: 1.12;
}

.hero-lead {
  margin: 1rem 0 0;
  color: var(--muted-foreground);
  font-size: 0.95rem;
  line-height: 1.8;
}

.generated-at {
  margin: 1rem 0 0;
  color: #64748b;
  font-size: 0.75rem;
}

.inventory {
  border-top: 1px solid var(--border);
}

.inventory-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
  padding: 2rem 0 1rem;
}

.inventory-heading h2 {
  margin: 0;
  font-size: 1.35rem;
  font-weight: 720;
  letter-spacing: -0.025em;
}

.inventory-heading > p {
  margin: 0;
  color: var(--muted-foreground);
  font-size: 0.75rem;
}

.filters {
  display: grid;
  grid-template-columns: minmax(15rem, 1fr) repeat(3, minmax(8.5rem, 0.35fr));
  gap: 0.65rem;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  padding: 0.75rem 0;
}

.filters input,
.filters select {
  width: 100%;
  height: 2.5rem;
  box-sizing: border-box;
  border: 1px solid #d8dee7;
  border-radius: 0.5rem;
  background: rgb(255 255 255 / 88%);
  color: var(--foreground);
  font: inherit;
  font-size: 0.78rem;
  outline: none;
  transition:
    background-color 150ms ease,
    border-color 150ms ease,
    box-shadow 150ms ease;
}

.filters input:hover,
.filters select:hover {
  border-color: #b8c1cd;
  background: #fff;
}

.filters input:focus,
.filters select:focus {
  border-color: #64748b;
  background: #fff;
  box-shadow: 0 0 0 3px rgb(100 116 139 / 9%);
}

.filters select {
  appearance: none;
  padding: 0 2.25rem 0 0.8rem;
  cursor: pointer;
}

.search-field input {
  padding: 0 0.75rem;
}

.select-field {
  position: relative;
  display: block;
}

.select-field svg {
  position: absolute;
  top: 50%;
  right: 0.75rem;
  width: 0.9rem;
  height: 0.9rem;
  color: #94a3b8;
  pointer-events: none;
  transform: translateY(-50%);
  transition: color 150ms ease;
}

.select-field:focus-within svg,
.select-field:hover svg {
  color: #475569;
}

.table-scroll {
  overflow-x: auto;
  outline: none;
}

.table-scroll:focus-visible {
  border-radius: 0.5rem;
  box-shadow: 0 0 0 3px color-mix(in oklch, var(--ring) 28%, transparent);
}

table {
  width: 100%;
  min-width: 66rem;
  border-collapse: collapse;
  font-size: 0.78rem;
}

th,
td {
  border-bottom: 1px solid rgb(226 232 240 / 78%);
  padding: 0.8rem 0.5rem;
  text-align: left;
  vertical-align: middle;
}

th {
  color: #64748b;
  font-size: 0.67rem;
  font-weight: 700;
  letter-spacing: 0.04em;
}

tbody tr:hover {
  background: rgb(248 250 252 / 55%);
}

tbody tr:last-child td {
  border-bottom: 0;
}

th:first-child {
  width: 25%;
}

.project-name {
  display: block;
  max-width: 20rem;
  overflow-wrap: anywhere;
  font-size: 0.8rem;
  font-weight: 650;
}

.used-by {
  display: block;
  max-width: 20rem;
  margin-top: 0.25rem;
  overflow: hidden;
  color: #94a3b8;
  font-size: 0.68rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.7rem;
}

.license-cell {
  max-width: 15rem;
  line-height: 1.55;
  overflow-wrap: anywhere;
}

.pill,
.scope-tag {
  display: inline-flex;
  align-items: center;
  padding: 0;
  font-size: 0.65rem;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
}

.pill {
  color: #64748b;
}

.pill--direct {
  color: #0f172a;
  font-weight: 650;
}

.pill--ecosystem {
  color: #475569;
}

.scope-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.scope-tag {
  color: #475569;
}

.scope-tag + .scope-tag::before {
  margin-right: 0.25rem;
  color: #cbd5e1;
  content: '·';
}

.source-cell {
  width: 2.5rem;
  color: #94a3b8;
  text-align: right;
}

.source-cell a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  transition: color 150ms ease;
}

.source-cell a:hover {
  color: #0f172a;
}

.source-cell svg {
  width: 0.9rem;
  height: 0.9rem;
}

.empty-state {
  height: 9rem;
  color: var(--muted-foreground);
  text-align: center;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border-top: 1px solid var(--border);
  padding: 0.8rem 0;
}

.pagination p,
.pagination span {
  margin: 0;
  color: var(--muted-foreground);
  font-size: 0.7rem;
  font-variant-numeric: tabular-nums;
}

.pagination div {
  display: flex;
  align-items: center;
  gap: 0.7rem;
}

.pagination button {
  border: 1px solid #dbe1e8;
  border-radius: 0.3rem;
  background: #fff;
  padding: 0.42rem 0.68rem;
  color: #334155;
  font-size: 0.7rem;
  font-weight: 600;
  cursor: pointer;
}

.pagination button:hover:not(:disabled) {
  border-color: #94a3b8;
}

.pagination button:disabled {
  cursor: not-allowed;
  opacity: 0.42;
}

.load-error {
  display: flex;
  min-height: 9rem;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  color: #991b1b;
}

.load-error strong,
.load-error span {
  display: block;
}

.load-error span {
  margin-top: 0.2rem;
  color: #b91c1c;
  font-size: 0.75rem;
}

@media (max-width: 64rem) {
  .filters {
    grid-template-columns: 1fr 1fr;
  }

  .search-field {
    grid-column: 1 / -1;
  }
}

@media (max-width: 42rem) {
  .disclosure-shell {
    padding-top: 2rem;
  }

  .disclosure-toolbar {
    align-items: flex-start;
    margin-bottom: 2.75rem;
  }

  .download-link {
    font-size: 0.72rem;
  }

  .inventory-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .filters {
    grid-template-columns: 1fr;
  }

  .search-field {
    grid-column: auto;
  }

  .pagination {
    align-items: flex-start;
    flex-direction: column;
  }

  .pagination div {
    width: 100%;
    justify-content: space-between;
  }
}

@media print {
  .disclosure-toolbar,
  .filters,
  .pagination {
    display: none;
  }

  .disclosure-shell {
    width: 100%;
    padding: 0;
  }

  .inventory {
    border: 0;
    box-shadow: none;
  }
}
</style>
