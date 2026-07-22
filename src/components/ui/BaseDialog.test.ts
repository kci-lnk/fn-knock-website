import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import BaseDialog from './BaseDialog.vue'

let wrapper: VueWrapper | undefined

const getElement = <T extends Element>(selector: string) => {
  const element = document.querySelector<T>(selector)
  if (!element) throw new Error(`Expected element matching ${selector}`)
  return element
}

const settleDialog = async () => {
  await nextTick()
  await flushPromises()
}

const mountOpenDialog = async () => {
  const trigger = getElement<HTMLButtonElement>('#dialog-trigger')
  trigger.focus()

  wrapper = mount(BaseDialog, {
    attachTo: '#mount-target',
    props: {
      open: true,
      ariaLabelledby: 'dialog-title',
      ariaDescribedby: 'dialog-description',
      initialFocus: '#second-action',
    },
    slots: {
      default: () => [
        h('h2', { id: 'dialog-title' }, 'Dialog title'),
        h('p', { id: 'dialog-description' }, 'Dialog description'),
        h('button', { id: 'first-action', type: 'button' }, 'First action'),
        h('button', { id: 'second-action', type: 'button' }, 'Second action'),
        h('button', { id: 'last-action', type: 'button' }, 'Last action'),
      ],
    },
  })

  await settleDialog()

  return {
    app: getElement<HTMLElement>('#app'),
    dialog: getElement<HTMLElement>('[role="dialog"]'),
    trigger,
    wrapper,
  }
}

beforeEach(() => {
  document.body.removeAttribute('style')
  document.body.innerHTML = `
    <div id="app">
      <button id="dialog-trigger" type="button">Open dialog</button>
      <div id="mount-target"></div>
    </div>
  `

  vi.spyOn(HTMLElement.prototype, 'getClientRects').mockReturnValue([
    new DOMRect(0, 0, 1, 1),
  ] as unknown as DOMRectList)
})

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
  document.body.innerHTML = ''
  document.body.removeAttribute('style')
  vi.restoreAllMocks()
})

describe('BaseDialog', () => {
  it('teleports the dialog to body and forwards its accessible name and description', async () => {
    const { app, dialog } = await mountOpenDialog()

    expect(document.body.contains(dialog)).toBe(true)
    expect(app.contains(dialog)).toBe(false)
    expect(dialog.getAttribute('aria-modal')).toBe('true')
    expect(dialog.getAttribute('aria-labelledby')).toBe('dialog-title')
    expect(dialog.getAttribute('aria-describedby')).toBe('dialog-description')
  })

  it('moves focus to the configured initial element when opened', async () => {
    await mountOpenDialog()

    expect(document.activeElement).toBe(getElement('#second-action'))
  })

  it('wraps Tab and Shift+Tab focus within the dialog', async () => {
    await mountOpenDialog()
    const firstAction = getElement<HTMLButtonElement>('#first-action')
    const lastAction = getElement<HTMLButtonElement>('#last-action')

    lastAction.focus()
    const tabEvent = new KeyboardEvent('keydown', {
      key: 'Tab',
      bubbles: true,
      cancelable: true,
    })
    document.dispatchEvent(tabEvent)

    expect(tabEvent.defaultPrevented).toBe(true)
    expect(document.activeElement).toBe(firstAction)

    const shiftTabEvent = new KeyboardEvent('keydown', {
      key: 'Tab',
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    })
    document.dispatchEvent(shiftTabEvent)

    expect(shiftTabEvent.defaultPrevented).toBe(true)
    expect(document.activeElement).toBe(lastAction)
  })

  it('requests close when Escape is pressed', async () => {
    const { wrapper: dialogWrapper } = await mountOpenDialog()
    const escapeEvent = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true,
      cancelable: true,
    })

    document.dispatchEvent(escapeEvent)

    expect(escapeEvent.defaultPrevented).toBe(true)
    expect(dialogWrapper.emitted('close')).toEqual([[]])
  })

  it('locks body scrolling and makes the application inert only while open', async () => {
    document.body.style.overflow = 'auto'
    const app = getElement<HTMLElement>('#app')
    app.inert = false
    app.setAttribute('aria-hidden', 'false')
    const { wrapper: dialogWrapper } = await mountOpenDialog()

    expect(document.body.style.overflow).toBe('hidden')
    expect(app.inert).toBe(true)
    expect(app.getAttribute('aria-hidden')).toBe('true')

    await dialogWrapper.setProps({ open: false })
    await settleDialog()

    expect(document.body.style.overflow).toBe('auto')
    expect(app.inert).toBe(false)
    expect(app.getAttribute('aria-hidden')).toBe('false')
  })

  it('restores focus to the opener when closed', async () => {
    const { trigger, wrapper: dialogWrapper } = await mountOpenDialog()
    expect(document.activeElement).not.toBe(trigger)

    await dialogWrapper.setProps({ open: false })
    await settleDialog()

    expect(document.activeElement).toBe(trigger)
  })
})
