<script setup lang="ts">
import { MessageCircle, X } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import BaseDialog from '@/components/ui/BaseDialog.vue'

defineProps<{ open: boolean; submitting: boolean; error: string }>()
const remember = defineModel<boolean>('remember', { required: true })
defineEmits<{ close: []; qqLogin: [] }>()
const { t } = useI18n()
</script>

<template>
  <BaseDialog
    :open="open"
    aria-labelledby="login-dialog-title"
    aria-describedby="login-dialog-description"
    initial-focus="#qq-login-button"
    panel-class="max-w-[26rem] rounded-2xl border border-white/70 bg-white p-5 shadow-[0_24px_90px_rgba(15,23,42,0.28)] sm:p-6"
    :close-on-backdrop="!submitting"
    :close-on-escape="!submitting"
    @close="$emit('close')"
  >
    <div class="flex items-start justify-between gap-4">
      <div>
        <h2 id="login-dialog-title" class="text-xl font-semibold tracking-tight text-slate-950">
          {{ t('auth.qqLogin') }}
        </h2>
        <p id="login-dialog-description" class="mt-1 text-sm leading-6 text-slate-500">
          {{ t('auth.description') }}
        </p>
      </div>
      <button
        type="button"
        :disabled="submitting"
        class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
        :aria-label="t('auth.close')"
        @click="$emit('close')"
      >
        <X class="h-4 w-4" />
      </button>
    </div>
    <div class="mt-5 space-y-4" :aria-busy="submitting">
      <label class="flex items-center gap-2 text-sm font-medium text-slate-600"
        ><input
          v-model="remember"
          type="checkbox"
          class="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
        />{{ t('auth.remember') }}</label
      >
      <p
        v-if="error"
        id="login-error"
        role="alert"
        class="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
      >
        {{ error }}
      </p>
      <button
        id="qq-login-button"
        type="button"
        :disabled="submitting"
        class="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#12b7f5] px-4 text-sm font-semibold text-white transition hover:bg-[#0aa8e4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#12b7f5] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        @click="$emit('qqLogin')"
      >
        <MessageCircle class="h-4 w-4" />{{
          submitting ? t('auth.redirecting') : t('auth.continue')
        }}
      </button>
      <p class="text-center text-xs leading-5 text-slate-500">
        {{ t('auth.consentPrefix') }}
        <RouterLink
          :to="{ name: 'legal', hash: '#terms' }"
          class="font-medium text-slate-700 underline-offset-2 hover:underline"
          @click="$emit('close')"
          >{{ t('footer.terms') }}</RouterLink
        >
        {{ t('auth.and') }}
        <RouterLink
          :to="{ name: 'legal', hash: '#privacy' }"
          class="font-medium text-slate-700 underline-offset-2 hover:underline"
          @click="$emit('close')"
          >{{ t('footer.privacy') }}</RouterLink
        >{{ t('auth.consentSuffix') }}
      </p>
    </div>
  </BaseDialog>
</template>
