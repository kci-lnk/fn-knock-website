import { describe, expect, it } from 'vitest'
import { parseChangelog, parseChangelogText } from './changelog'

describe('changelog parser', () => {
  it('groups release headings and numbered changes', () => {
    const parsed = parseChangelog(`Official notice

2.0.8更新：
1、First change
2、Second change

2.0.7 Major Release 更新:
1. Previous change`)

    expect(parsed.introduction[0]).toEqual([{ text: 'Official notice' }])
    expect(parsed.sections.map((section) => section.version)).toEqual(['2.0.8', '2.0.7'])
    expect(parsed.sections[1]?.label).toBe('Major Release')
    expect(parsed.sections[0]?.items.map((item) => item.number)).toEqual(['1', '2'])
    expect(parsed.sections[1]?.items[0]?.segments).toEqual([{ text: 'Previous change' }])
  })

  it('parses the current markdown release format', () => {
    const parsed = parseChangelog(`# fn-knock 2.0.9

- Fix advanced authentication settings
- Improve the Windows installer

---

# fn-knock 2.0.8

- Previous release`)

    expect(parsed.introduction).toEqual([])
    expect(parsed.sections.map((section) => section.version)).toEqual(['2.0.9', '2.0.8'])
    expect(parsed.sections[0]?.items.map((item) => item.number)).toEqual(['1', '2'])
    expect(parsed.sections[0]?.items[0]?.segments).toEqual([
      { text: 'Fix advanced authentication settings' },
    ])
    expect(parsed.sections[1]?.items[0]?.segments).toEqual([{ text: 'Previous release' }])
    expect(parsed.sections.every((section) => section.paragraphs.length === 0)).toBe(true)
  })

  it('ignores non-release markdown headings', () => {
    const parsed = parseChangelog(`## 新增功能

2.3.2更新：
1、新增第三方导航面板同步功能

## 修复问题
2、修复导航面板显示问题`)

    expect(parsed.introduction).toEqual([])
    expect(parsed.sections[0]?.paragraphs).toEqual([])
    expect(parsed.sections[0]?.items.map((item) => item.segments)).toEqual([
      [{ text: '新增第三方导航面板同步功能' }],
      [{ text: '修复导航面板显示问题' }],
    ])
  })

  it('parses GitHub-style alerts without leaking blockquote markers', () => {
    const parsed = parseChangelog(`# fn-knock 2.2.5

> [!IMPORTANT]
> **这是一个紧急修复版本。** 建议受影响的群晖（Synology）用户尽快升级。

- 修复群晖（Synology）平台无法启动的问题。
- 减少安装包体积。`)

    expect(parsed.sections[0]?.alerts).toEqual([
      {
        kind: 'important',
        paragraphs: [
          [
            { text: '这是一个紧急修复版本。', strong: true },
            { text: ' 建议受影响的群晖（Synology）用户尽快升级。' },
          ],
        ],
      },
    ])
    expect(parsed.sections[0]?.paragraphs).toEqual([])
    expect(parsed.sections[0]?.items).toHaveLength(2)
  })

  it('turns markdown and plain URLs into safe link segments', () => {
    expect(
      parseChangelogText('[Website](https://www.fnknock.cn/) and https://docs.fnknock.cn/'),
    ).toEqual([
      { text: 'Website', href: 'https://www.fnknock.cn/' },
      { text: ' and ' },
      { text: 'https://docs.fnknock.cn/', href: 'https://docs.fnknock.cn/' },
    ])
  })

  it('parses the lightweight bold syntax used by release notices', () => {
    expect(
      parseChangelogText('[**用户协议与隐私政策**](https://www.fnknock.cn/legal) 和 **重要提示**'),
    ).toEqual([
      {
        text: '用户协议与隐私政策',
        href: 'https://www.fnknock.cn/legal',
        strong: true,
      },
      { text: ' 和 ' },
      { text: '重要提示', strong: true },
    ])
  })

  it('keeps a link inside bold text clickable', () => {
    expect(parseChangelogText('**[官网](https://www.fnknock.cn/)**')).toEqual([
      { text: '官网', href: 'https://www.fnknock.cn/', strong: true },
    ])
  })
})
