import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

export type DownloadMenuKey = 'fnos' | 'openwrt'

export const useDownloadMenu = (downloadActionsRef: Ref<HTMLElement | null>) => {
  const activeDownloadMenu = ref<DownloadMenuKey | null>(null)
  let closeTimer: number | undefined

  const cancelClose = () => {
    if (closeTimer) window.clearTimeout(closeTimer)
    closeTimer = undefined
  }
  const open = (menu: DownloadMenuKey) => {
    cancelClose()
    activeDownloadMenu.value = menu
  }
  const close = () => {
    cancelClose()
    activeDownloadMenu.value = null
  }
  const scheduleClose = () => {
    cancelClose()
    closeTimer = window.setTimeout(() => {
      if (!downloadActionsRef.value?.contains(document.activeElement)) close()
    }, 120)
  }
  const handlePointerEnter = (menu: DownloadMenuKey, event: PointerEvent) => {
    if (event.pointerType === 'mouse') open(menu)
  }
  const handlePointerLeave = (event: PointerEvent) => {
    if (event.pointerType === 'mouse') scheduleClose()
  }
  const toggle = (menu: DownloadMenuKey) => {
    if (activeDownloadMenu.value === menu) close()
    else open(menu)
  }
  const handleDocumentClick = (event: MouseEvent) => {
    if (!(event.target instanceof Node) || !downloadActionsRef.value?.contains(event.target))
      close()
  }
  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && activeDownloadMenu.value) {
      const trigger = downloadActionsRef.value?.querySelector<HTMLElement>('[aria-expanded="true"]')
      close()
      trigger?.focus()
    }
  }
  const handleFocusIn = () => cancelClose()
  const handleFocusOut = (event: FocusEvent) => {
    if (
      !(event.relatedTarget instanceof Node) ||
      !downloadActionsRef.value?.contains(event.relatedTarget)
    ) {
      scheduleClose()
    }
  }

  onMounted(() => {
    document.addEventListener('click', handleDocumentClick)
    document.addEventListener('keydown', handleKeydown)
  })
  onBeforeUnmount(() => {
    document.removeEventListener('click', handleDocumentClick)
    document.removeEventListener('keydown', handleKeydown)
    cancelClose()
  })

  return {
    activeDownloadMenu,
    closeDownloadMenus: close,
    handleDownloadButtonClick: toggle,
    handleDownloadFocusIn: handleFocusIn,
    handleDownloadFocusOut: handleFocusOut,
    handleDownloadPointerEnter: handlePointerEnter,
    handleDownloadPointerLeave: handlePointerLeave,
  }
}
