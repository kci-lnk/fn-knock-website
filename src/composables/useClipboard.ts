import { onBeforeUnmount, ref, type MaybeRefOrGetter, toValue } from 'vue'

type ClipboardOptions = {
  resetAfter?: number
  fallback?: (text: string) => void
}

export const useClipboard = (source: MaybeRefOrGetter<string>, options: ClipboardOptions = {}) => {
  const copied = ref(false)
  let resetTimer: number | undefined

  const reset = () => {
    copied.value = false
    if (resetTimer) window.clearTimeout(resetTimer)
    resetTimer = undefined
  }

  const copy = async () => {
    const text = toValue(source)

    try {
      await navigator.clipboard.writeText(text)
      copied.value = true
      if (resetTimer) window.clearTimeout(resetTimer)
      resetTimer = window.setTimeout(reset, options.resetAfter ?? 1800)
      return true
    } catch {
      options.fallback?.(text)
      return false
    }
  }

  onBeforeUnmount(reset)

  return { copied, copy, reset }
}
