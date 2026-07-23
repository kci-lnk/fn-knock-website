<script setup lang="ts">
import { computed, ref } from 'vue'
import { Check, Clipboard } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { useClipboard } from '@/composables/useClipboard'

type CommandMethod = 'curl' | 'wget'

const commands: Record<CommandMethod, string> = {
  wget: 'wget -qO- https://cdn.fnknock.cn/install.sh | { if [ "$(id -u)" -eq 0 ]; then sh; else sudo sh; fi; }',
  curl: 'curl -fsSL https://cdn.fnknock.cn/install.sh | { if [ "$(id -u)" -eq 0 ]; then sh; else sudo sh; fi; }',
}
const activeCommand = ref<CommandMethod>('wget')
const { t } = useI18n()
const command = computed(() => commands[activeCommand.value])
const { copied, copy, reset } = useClipboard(command, {
  fallback: (text) => window.prompt(t('install.linux.copyPrompt'), text),
})
const copyLabel = computed(() =>
  copied.value ? t('install.linux.copied') : t('install.linux.copy'),
)
const selectCommand = (method: CommandMethod) => {
  activeCommand.value = method
  reset()
}
</script>

<template>
  <section class="install-command mt-9 max-w-5xl" :aria-label="t('install.linux.commandLabel')">
    <div class="command-toolbar">
      <div class="command-window-title">
        <span class="command-window-dots" aria-hidden="true"
          ><span class="command-window-dot command-window-dot--close" /><span
            class="command-window-dot command-window-dot--minimize" /><span
            class="command-window-dot command-window-dot--maximize"
        /></span>
        <span class="command-toolbar-label">Terminal</span>
        <span class="command-toolbar-context">{{ t('install.linux.commandContext') }}</span>
      </div>
      <div class="command-toolbar-actions">
        <div class="command-tabs" role="group" :aria-label="t('install.linux.chooseCommand')">
          <button
            v-for="method in Object.keys(commands) as CommandMethod[]"
            :key="method"
            type="button"
            :aria-pressed="activeCommand === method"
            :class="{ 'is-active': activeCommand === method }"
            @click="selectCommand(method)"
          >
            {{ method }}
          </button>
        </div>
        <button type="button" class="copy-command" :aria-label="copyLabel" @click="copy">
          <Check v-if="copied" class="h-4 w-4" aria-hidden="true" /><Clipboard
            v-else
            class="h-4 w-4"
            aria-hidden="true"
          />
          <span aria-live="polite">{{ copyLabel }}</span>
        </button>
      </div>
    </div>
    <div
      class="command-body overflow-x-auto"
      role="region"
      tabindex="0"
      :aria-label="t('install.linux.currentCommand')"
    >
      <code class="command-code"
        ><span class="command-prompt">$</span><span class="command-text">{{ command }}</span
        ><span class="command-cursor" aria-hidden="true"
      /></code>
    </div>
    <p class="command-hint">
      {{ t('install.linux.commandHint') }}
    </p>
  </section>
</template>

<style scoped>
.install-command {
  background: #0d0d0f;
  border: 1px solid #3f3f46;
  border-radius: 0.9rem;
  box-shadow:
    0 18px 44px rgb(15 23 42 / 0.15),
    0 2px 6px rgb(15 23 42 / 0.08);
  overflow: hidden;
}
.command-toolbar {
  align-items: center;
  background: linear-gradient(180deg, #222225, #1b1b1e);
  border-bottom: 1px solid #36363a;
  color: #a1a1aa;
  display: flex;
  font-size: 0.75rem;
  font-weight: 700;
  justify-content: space-between;
  min-height: 3.5rem;
  padding: 0.7rem 0.85rem;
}
.command-window-title {
  align-items: center;
  display: flex;
  gap: 0.65rem;
  min-width: 0;
}
.command-window-dots {
  align-items: center;
  display: inline-flex;
  flex-shrink: 0;
  gap: 0.4rem;
}
.command-window-dot {
  border-radius: 999px;
  display: block;
  height: 0.68rem;
  width: 0.68rem;
}
.command-window-dot--close {
  background: #ff5f57;
}
.command-window-dot--minimize {
  background: #febc2e;
}
.command-window-dot--maximize {
  background: #28c840;
}
.command-toolbar-label {
  color: #e4e4e7;
  font-weight: 650;
  letter-spacing: 0.01em;
}
.command-toolbar-context {
  color: #71717a;
  font-size: 0.7rem;
  font-weight: 500;
  white-space: nowrap;
}
.command-toolbar-actions {
  align-items: center;
  display: flex;
  gap: 0.65rem;
}
.command-tabs {
  align-items: center;
  background: #111113;
  border: 1px solid #3f3f46;
  border-radius: 0.45rem;
  display: inline-flex;
  gap: 0.15rem;
  padding: 0.16rem;
}
.command-tabs button {
  border-radius: 0.3rem;
  color: #71717a;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.7rem;
  font-weight: 700;
  min-width: 2.9rem;
  padding: 0.26rem 0.45rem;
  transition:
    background-color 0.18s ease,
    color 0.18s ease,
    box-shadow 0.18s ease;
}
.command-tabs button:hover {
  color: #d4d4d8;
}
.command-tabs button.is-active {
  background: #2f2f34;
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.25);
  color: #f4f4f5;
}
.copy-command {
  align-items: center;
  color: #a1a1aa;
  display: inline-flex;
  font-size: 0.75rem;
  font-weight: 700;
  gap: 0.35rem;
  padding: 0.3rem 0.2rem;
  transition: color 0.18s ease;
}
.copy-command:hover {
  color: #f4f4f5;
}
.command-body {
  -ms-overflow-style: none;
  align-items: center;
  background: radial-gradient(circle at 18% 0%, rgb(56 189 248 / 0.06), transparent 34%), #0d0d0f;
  display: flex;
  min-height: 6.1rem;
  padding: 1.15rem 1.25rem;
  scrollbar-width: none;
}
.command-body::-webkit-scrollbar {
  display: none;
}
.command-body:focus-visible {
  box-shadow: inset 0 0 0 2px #38bdf8;
  outline: none;
}
.command-hint {
  background: #111113;
  border-top: 1px solid #2b2b30;
  color: #a1a1aa;
  font-size: 0.75rem;
  line-height: 1.6;
  padding: 0.7rem 1.25rem 0.8rem;
}
.command-hint strong {
  color: #d4d4d8;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}
.command-code {
  align-items: center;
  color: #f4f4f5;
  display: inline-flex;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: clamp(0.82rem, 1.45vw, 1.08rem);
  gap: 0.65rem;
  line-height: 1.5;
  white-space: nowrap;
}
.command-prompt {
  color: #30d158;
  font-size: 1.15em;
  font-weight: 700;
}
.command-cursor {
  animation: terminalCursorBlink 1.1s steps(2, jump-none) infinite;
  background: #30d158;
  display: inline-block;
  height: 1.15em;
  opacity: 0.85;
  width: 0.08em;
}
@keyframes terminalCursorBlink {
  0%,
  45% {
    opacity: 0.85;
  }
  46%,
  100% {
    opacity: 0;
  }
}
@media (max-width: 640px) {
  .command-toolbar {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.75rem;
    min-height: 5.5rem;
    padding-inline: 1rem;
  }
  .command-toolbar-context {
    display: none;
  }
  .command-toolbar-actions {
    justify-content: space-between;
    width: 100%;
  }
  .command-body {
    min-height: 5.8rem;
    padding: 1rem;
  }
  .copy-command {
    font-size: 0.8rem;
  }
}
@media (prefers-reduced-motion: reduce) {
  .command-cursor {
    animation: none;
  }
  .command-tabs button,
  .copy-command {
    transition: none;
  }
}
</style>
