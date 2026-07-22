<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { useDialog } from '@/composables/useDialog'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    open: boolean
    ariaLabelledby?: string
    ariaDescribedby?: string
    initialFocus?: string
    closeOnBackdrop?: boolean
    closeOnEscape?: boolean
    backdropClass?: string
    panelClass?: string
    role?: 'dialog' | 'alertdialog'
  }>(),
  {
    closeOnBackdrop: true,
    closeOnEscape: true,
    role: 'dialog',
  },
)

const emit = defineEmits<{ close: [] }>()
const dialogRef = useTemplateRef<HTMLElement>('dialogRef')

const { requestClose } = useDialog({
  open: () => props.open,
  dialogRef,
  initialFocus: () => props.initialFocus,
  closeOnEscape: () => props.closeOnEscape,
  onClose: () => emit('close'),
})

const handleBackdropClick = () => {
  if (props.closeOnBackdrop) requestClose()
}
</script>

<template>
  <Teleport to="body">
    <Transition name="base-dialog">
      <div
        v-if="open"
        class="base-dialog__viewport"
        :class="backdropClass"
        role="presentation"
        @click.self="handleBackdropClick"
      >
        <div
          ref="dialogRef"
          v-bind="$attrs"
          class="base-dialog__panel"
          :class="panelClass"
          :role="role"
          aria-modal="true"
          :aria-labelledby="ariaLabelledby"
          :aria-describedby="ariaDescribedby"
          tabindex="-1"
        >
          <slot :close="requestClose" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.base-dialog__viewport {
  align-items: center;
  background: rgb(2 6 23 / 0.48);
  display: flex;
  inset: 0;
  justify-content: center;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: max(1rem, env(safe-area-inset-top)) max(1rem, env(safe-area-inset-right))
    max(1rem, env(safe-area-inset-bottom)) max(1rem, env(safe-area-inset-left));
  position: fixed;
  z-index: 1000;
}

.base-dialog__panel {
  max-height: calc(100vh - 2rem);
  max-height: calc(100dvh - 2rem);
  overflow-y: auto;
  overscroll-behavior: contain;
  width: 100%;
}

.base-dialog-enter-active,
.base-dialog-leave-active {
  transition: opacity 0.16s ease;
}

.base-dialog-enter-from,
.base-dialog-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .base-dialog-enter-active,
  .base-dialog-leave-active {
    transition: none;
  }
}
</style>
