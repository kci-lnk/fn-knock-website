import { nextTick, onBeforeUnmount, toValue, watch, type MaybeRefOrGetter, type Ref } from 'vue'

type UseDialogOptions = {
  open: MaybeRefOrGetter<boolean>
  dialogRef: Ref<HTMLElement | null>
  onClose: () => void
  initialFocus?: MaybeRefOrGetter<string | undefined>
  closeOnEscape?: MaybeRefOrGetter<boolean | undefined>
}

const focusableSelector = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'audio[controls]',
  'video[controls]',
  'details > summary:first-of-type',
  'iframe',
  'object',
  'embed',
  '[contenteditable]:not([contenteditable="false"])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

const dialogStack: symbol[] = []
let scrollLockCount = 0
let savedBodyOverflow = ''
let savedBodyPaddingRight = ''
let savedAppAriaHidden: string | null = null
let savedAppInert = false

const isElementAvailable = (element: HTMLElement) => {
  if (
    element.matches(':disabled') ||
    element.closest('[inert]') ||
    element.closest('[aria-hidden="true"]')
  )
    return false

  const style = window.getComputedStyle(element)
  return (
    style.display !== 'none' && style.visibility !== 'hidden' && element.getClientRects().length > 0
  )
}

const getFocusableElements = (dialog: HTMLElement) =>
  Array.from(dialog.querySelectorAll(focusableSelector)).filter(
    (element): element is HTMLElement =>
      element instanceof HTMLElement && element.tabIndex >= 0 && isElementAvailable(element),
  )

const lockBodyScroll = () => {
  if (scrollLockCount === 0) {
    const { body, documentElement } = document
    savedBodyOverflow = body.style.overflow
    savedBodyPaddingRight = body.style.paddingRight

    const scrollbarWidth = Math.max(0, window.innerWidth - documentElement.clientWidth)
    const bodyPaddingRight = Number.parseFloat(window.getComputedStyle(body).paddingRight) || 0

    body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) body.style.paddingRight = `${bodyPaddingRight + scrollbarWidth}px`

    const app = document.querySelector<HTMLElement>('#app')
    if (app) {
      savedAppInert = app.inert
      savedAppAriaHidden = app.getAttribute('aria-hidden')
      app.inert = true
      app.setAttribute('aria-hidden', 'true')
    }
  }

  scrollLockCount += 1
}

const unlockBodyScroll = () => {
  if (scrollLockCount === 0) return

  scrollLockCount -= 1
  if (scrollLockCount === 0) {
    document.body.style.overflow = savedBodyOverflow
    document.body.style.paddingRight = savedBodyPaddingRight
    const app = document.querySelector<HTMLElement>('#app')
    if (app) {
      app.inert = savedAppInert
      if (savedAppAriaHidden === null) app.removeAttribute('aria-hidden')
      else app.setAttribute('aria-hidden', savedAppAriaHidden)
    }
  }
}

export const useDialog = (options: UseDialogOptions) => {
  const dialogId = Symbol('dialog')
  let active = false
  let activationVersion = 0
  let restoreFocusTarget: HTMLElement | null = null

  const isTopDialog = () => dialogStack[dialogStack.length - 1] === dialogId

  const focusInitialElement = () => {
    const dialog = options.dialogRef.value
    if (!dialog) return

    let initialElement: HTMLElement | null = null
    const initialFocusSelector = toValue(options.initialFocus)

    if (initialFocusSelector) {
      try {
        initialElement = dialog.querySelector<HTMLElement>(initialFocusSelector)
      } catch {
        // Ignore invalid consumer-provided selectors and use the normal fallback order.
      }
    }

    if (!initialElement || !isElementAvailable(initialElement)) {
      initialElement = dialog.querySelector<HTMLElement>('[data-autofocus], [autofocus]')
    }
    if (!initialElement || !isElementAvailable(initialElement)) {
      initialElement = getFocusableElements(dialog)[0] ?? dialog
    }

    initialElement.focus({ preventScroll: true })
  }

  const handleKeydown = (event: KeyboardEvent) => {
    if (!active || !isTopDialog()) return

    if (event.key === 'Escape' && toValue(options.closeOnEscape) !== false) {
      event.preventDefault()
      event.stopPropagation()
      options.onClose()
      return
    }

    if (event.key !== 'Tab') return

    const dialog = options.dialogRef.value
    if (!dialog) return

    const focusableElements = getFocusableElements(dialog)
    if (focusableElements.length === 0) {
      event.preventDefault()
      dialog.focus({ preventScroll: true })
      return
    }

    const firstElement = focusableElements[0]!
    const lastElement = focusableElements[focusableElements.length - 1]!
    const activeElement = document.activeElement
    const focusIsInside = activeElement instanceof Node && dialog.contains(activeElement)

    if (event.shiftKey && (!focusIsInside || activeElement === firstElement)) {
      event.preventDefault()
      lastElement.focus({ preventScroll: true })
    } else if (!event.shiftKey && (!focusIsInside || activeElement === lastElement)) {
      event.preventDefault()
      firstElement.focus({ preventScroll: true })
    }
  }

  const handleFocusIn = (event: FocusEvent) => {
    if (!active || !isTopDialog()) return

    const dialog = options.dialogRef.value
    if (dialog && event.target instanceof Node && !dialog.contains(event.target)) {
      focusInitialElement()
    }
  }

  const activate = async () => {
    if (active) return

    active = true
    const version = ++activationVersion
    restoreFocusTarget =
      document.activeElement instanceof HTMLElement ? document.activeElement : null
    dialogStack.push(dialogId)
    lockBodyScroll()
    document.addEventListener('keydown', handleKeydown)
    document.addEventListener('focusin', handleFocusIn)

    await nextTick()
    if (active && version === activationVersion && toValue(options.open) && isTopDialog()) {
      focusInitialElement()
    }
  }

  const deactivate = () => {
    if (!active) return

    active = false
    activationVersion += 1
    document.removeEventListener('keydown', handleKeydown)
    document.removeEventListener('focusin', handleFocusIn)

    const stackIndex = dialogStack.lastIndexOf(dialogId)
    if (stackIndex >= 0) dialogStack.splice(stackIndex, 1)
    unlockBodyScroll()

    const target = restoreFocusTarget
    restoreFocusTarget = null
    void nextTick(() => {
      if (target?.isConnected) target.focus({ preventScroll: true })
    })
  }

  watch(
    () => toValue(options.open),
    (open) => {
      if (open) void activate()
      else deactivate()
    },
    { immediate: true, flush: 'post' },
  )

  onBeforeUnmount(deactivate)

  return {
    focusDialog: focusInitialElement,
    requestClose: () => {
      if (toValue(options.open)) options.onClose()
    },
  }
}
