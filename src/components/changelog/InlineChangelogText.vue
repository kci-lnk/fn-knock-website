<script setup lang="ts">
import type { ChangelogTextSegment } from '@/lib/changelog'

defineProps<{ segments: ChangelogTextSegment[] }>()
</script>

<template>
  <template v-for="(segment, index) in segments" :key="`${index}-${segment.text}`">
    <a
      v-if="segment.href"
      :href="segment.href"
      target="_blank"
      rel="noopener noreferrer"
      class="changelog-inline-link"
      ><strong v-if="segment.strong">{{ segment.text }}</strong
      ><template v-else>{{ segment.text }}</template></a
    ><strong v-else-if="segment.strong">{{ segment.text }}</strong
    ><span v-else>{{ segment.text }}</span>
  </template>
</template>
