<script setup lang="ts">
import { useI18n } from 'vue-i18n'

export type PortItem = { port: string; name: string; scope: string; note: string }

withDefaults(
  defineProps<{
    items: readonly PortItem[]
    tone?: 'blue' | 'warm' | 'dark'
    scopeLabel?: string
    caption?: string
  }>(),
  {
    tone: 'blue',
  },
)
const { t } = useI18n()
</script>

<template>
  <div
    class="port-table-region overflow-x-auto"
    :class="`port-table--${tone}`"
    role="region"
    :aria-label="caption || t('common.defaultPorts')"
    tabindex="0"
  >
    <table>
      <caption class="sr-only">
        {{
          caption || t('common.defaultPorts')
        }}
      </caption>
      <thead>
        <tr>
          <th scope="col">{{ t('common.port') }}</th>
          <th scope="col">{{ t('common.service') }}</th>
          <th scope="col">{{ scopeLabel || t('common.defaultScope') }}</th>
          <th scope="col">{{ t('common.description') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.port">
          <td>
            <code>{{ item.port }}</code>
          </td>
          <th scope="row">{{ item.name }}</th>
          <td>{{ item.scope }}</td>
          <td>{{ item.note }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.port-table-region {
  border-bottom: 1px solid var(--port-border);
  border-top: 1px solid var(--port-border-strong);
  outline: none;
}
.port-table-region:focus-visible {
  border-radius: 0.25rem;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--port-code) 20%, transparent);
}
.port-table--blue {
  --port-border: #cbd5e1;
  --port-border-strong: #64748b;
  --port-row-border: #e2e8f0;
  --port-code: #0067b8;
  --port-name: #334155;
  --port-text: #728095;
  --port-head: #94a3b8;
}
.port-table--warm {
  --port-border: #d8d4cc;
  --port-border-strong: #827d74;
  --port-row-border: #e3dfd8;
  --port-code: #4d4942;
  --port-name: #302f2a;
  --port-text: #716d66;
  --port-head: #918c83;
}
.port-table--dark {
  --port-border: rgb(153 196 233 / 0.13);
  --port-border-strong: rgb(153 196 233 / 0.24);
  --port-row-border: rgb(153 196 233 / 0.1);
  --port-code: #73d1ff;
  --port-name: #d6eaff;
  --port-text: #879cb4;
  --port-head: #637c97;
}
table {
  border-collapse: collapse;
  min-width: 42rem;
  table-layout: fixed;
  width: 100%;
}
thead th {
  color: var(--port-head);
  font-size: 0.68rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  padding: 0.7rem 0.25rem;
  text-align: left;
}
thead th:nth-child(1) {
  width: 5rem;
}
thead th:nth-child(2) {
  width: 24%;
}
thead th:nth-child(3) {
  width: 20%;
}
tbody tr {
  border-top: 1px solid var(--port-row-border);
}
tbody td,
tbody th {
  color: var(--port-text);
  font-size: 0.8rem;
  font-weight: 400;
  line-height: 1.6;
  padding: 1rem 0.25rem;
  text-align: left;
  vertical-align: top;
}
tbody th {
  color: var(--port-name);
  font-size: 0.88rem;
  font-weight: 650;
}
code {
  color: var(--port-code);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.82rem;
  font-variant-numeric: tabular-nums;
}
</style>
