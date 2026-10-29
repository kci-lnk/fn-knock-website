import { nextTick, onBeforeUnmount, onMounted, ref, watch, type CSSProperties, type Ref } from 'vue'

export type DownloadMenuKey = 'fnos' | 'openwrt'

export const useDownloadMenu = (downloadActionsRef: Ref<HTMLElement | null>) => {
  const activeDownloadMenu = ref<DownloadMenuKey | null>(null)
  const menuStyle = ref<CSSProperties>({})
  let openedByHover = false
  let closeTimer: number | undefined
  let positionFrame: number | undefined
  let resizeObserver: ResizeObserver | undefined

  const positionMenu = () => {
    const item = downloadActionsRef.value?.querySelector<HTMLElement>(
      '.download-action-item.is-active',
    )
    const trigger = item?.querySelector<HTMLElement>('button[aria-controls]')
    const panel = item?.querySelector<HTMLElement>('.download-menu')
    if (!item || !trigger || !panel) return

    const anchor = trigger.getBoundingClientRect()
    const origin = item.getBoundingClientRect()
    const viewport = window.visualViewport
    const viewportLeft = viewport?.offsetLeft ?? 0
    const viewportTop = viewport?.offsetTop ?? 0
    const viewportWidth = viewport?.width ?? document.documentElement.clientWidth
    const maxWidth = Math.max(0, viewportWidth - 32)
    const width = Math.min(panel.getBoundingClientRect().width, maxWidth)
    const viewportHeight = viewport?.height ?? window.innerHeight
    const headerBottom =
      document.querySelector('header.app-header')?.getBoundingClientRect().bottom ?? 0
    const topBoundary = Math.max(viewportTop + 16, headerBottom + 16)
    const bottomBoundary = viewportTop + viewportHeight - 16
    if (anchor.height > 0 && (anchor.bottom <= topBoundary || anchor.top >= bottomBoundary)) {
      close()
      return
    }
    const below = Math.max(0, bottomBoundary - anchor.bottom - 8)
    const above = Math.max(0, anchor.top - topBoundary - 8)
    const placeAbove = below < Math.min(panel.scrollHeight, 240) && above > below
    const available = placeAbove ? above : below
    const height = Math.min(panel.scrollHeight + 2, available)
    const left = Math.max(
      viewportLeft + 16,
      Math.min(anchor.left, viewportLeft + viewportWidth - width - 16),
    )
    menuStyle.value = {
      left: `${left - origin.left}px`,
      top: `${(placeAbove ? anchor.top - 8 - height : anchor.bottom + 8) - origin.top}px`,
      maxHeight: `${available}px`,
      maxWidth: `${maxWidth}px`,
    }
  }
  const schedulePosition = () => {
    if (!activeDownloadMenu.value) return
    if (positionFrame !== undefined) cancelAnimationFrame(positionFrame)
    positionFrame = requestAnimationFrame(() => {
      positionFrame = undefined
      positionMenu()
    })
  }
  watch(activeDownloadMenu, async (menu) => {
    resizeObserver?.disconnect()
    if (!menu) return
    await nextTick()
    positionMenu()
    const item = downloadActionsRef.value?.querySelector('.download-action-item.is-active')
    if (item) resizeObserver?.observe(item)
    const panel = item?.querySelector('.download-menu')
    if (panel) resizeObserver?.observe(panel)
  })

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
    openedByHover = false
    activeDownloadMenu.value = null
  }
  const scheduleClose = () => {
    cancelClose()
    closeTimer = window.setTimeout(() => {
      if (!downloadActionsRef.value?.contains(document.activeElement)) close()
    }, 120)
  }
  const handlePointerEnter = (menu: DownloadMenuKey, event: PointerEvent) => {
    if (event.pointerType === 'mouse' && activeDownloadMenu.value !== menu) {
      openedByHover = true
      open(menu)
    } else if (event.pointerType === 'mouse') cancelClose()
  }
  const handlePointerLeave = (event: PointerEvent) => {
    if (event.pointerType === 'mouse') scheduleClose()
  }
  const toggle = (menu: DownloadMenuKey) => {
    if (activeDownloadMenu.value === menu && openedByHover) {
      openedByHover = false
      cancelClose()
    } else if (activeDownloadMenu.value === menu) close()
    else {
      openedByHover = false
      open(menu)
    }
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
    resizeObserver = new ResizeObserver(schedulePosition)
    window.addEventListener('resize', schedulePosition)
    window.addEventListener('scroll', schedulePosition, true)
    window.visualViewport?.addEventListener('resize', schedulePosition)
    window.visualViewport?.addEventListener('scroll', schedulePosition)
    document.addEventListener('click', handleDocumentClick)
    document.addEventListener('keydown', handleKeydown)
  })
  onBeforeUnmount(() => {
    resizeObserver?.disconnect()
    if (positionFrame !== undefined) cancelAnimationFrame(positionFrame)
    window.removeEventListener('resize', schedulePosition)
    window.removeEventListener('scroll', schedulePosition, true)
    window.visualViewport?.removeEventListener('resize', schedulePosition)
    window.visualViewport?.removeEventListener('scroll', schedulePosition)
    document.removeEventListener('click', handleDocumentClick)
    document.removeEventListener('keydown', handleKeydown)
    cancelClose()
  })

  return {
    menuStyle,
    activeDownloadMenu,
    closeDownloadMenus: close,
    handleDownloadButtonClick: toggle,
    handleDownloadFocusIn: handleFocusIn,
    handleDownloadFocusOut: handleFocusOut,
    handleDownloadPointerEnter: handlePointerEnter,
    handleDownloadPointerLeave: handlePointerLeave,
  }
}
