export type ChangelogTextSegment = {
  text: string
  href?: string
  strong?: boolean
}

export type ChangelogItem = {
  number: string
  segments: ChangelogTextSegment[]
}

export type ChangelogAlertKind = 'note' | 'tip' | 'important' | 'warning' | 'caution'

export type ChangelogAlert = {
  kind: ChangelogAlertKind
  paragraphs: ChangelogTextSegment[][]
}

export type ChangelogSection = {
  version: string
  label: string
  items: ChangelogItem[]
  paragraphs: ChangelogTextSegment[][]
  alerts: ChangelogAlert[]
}

export type ParsedChangelog = {
  introduction: ChangelogTextSegment[][]
  sections: ChangelogSection[]
}

const inlineTokenPattern =
  /(\*\*|__)(.+?)\1|\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s，、。；！？]+)/g

const parseReleaseHeading = (line: string): Pick<ChangelogSection, 'version' | 'label'> | null => {
  const markdownHeading = line.match(/^#{1,6}\s+(?:fn-knock\s+)?v?(\d+(?:\.\d+){2})(?:\s+(.+))?$/i)
  if (markdownHeading) {
    return {
      version: markdownHeading[1]!,
      label: markdownHeading[2]?.trim() ?? '',
    }
  }

  const legacyHeading = line.match(/^(\d+(?:\.\d+){2})(.*?)\s*更新[：:]?$/)
  if (legacyHeading) {
    return {
      version: legacyHeading[1]!,
      label: legacyHeading[2]!.trim(),
    }
  }

  return null
}

const isMarkdownDivider = (line: string) => /^(?:-{3,}|\*{3,}|_{3,})$/.test(line)

const isMarkdownHeading = (line: string) => /^#{1,6}\s+/.test(line)

const parseAlertParagraphs = (lines: string[]): ChangelogTextSegment[][] => {
  const paragraphs: ChangelogTextSegment[][] = []
  let paragraph: string[] = []

  const flushParagraph = () => {
    if (!paragraph.length) return
    paragraphs.push(parseChangelogText(paragraph.join(' ')))
    paragraph = []
  }

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) {
      flushParagraph()
      continue
    }
    paragraph.push(trimmed)
  }

  flushParagraph()
  return paragraphs
}

export const parseChangelogText = (value: string): ChangelogTextSegment[] => {
  const segments: ChangelogTextSegment[] = []
  let lastIndex = 0

  for (const match of value.matchAll(inlineTokenPattern)) {
    const index = match.index ?? 0
    if (index > lastIndex) segments.push({ text: value.slice(lastIndex, index) })

    const strongText = match[2]
    const markdownLabel = match[3]
    const markdownHref = match[4]
    const plainHref = match[5]

    if (strongText !== undefined) {
      segments.push(
        ...parseChangelogText(strongText).map((segment) => ({ ...segment, strong: true })),
      )
    } else if (markdownLabel !== undefined && markdownHref !== undefined) {
      segments.push(
        ...parseChangelogText(markdownLabel).map((segment) => ({
          ...segment,
          href: markdownHref,
        })),
      )
    } else if (plainHref !== undefined) {
      segments.push({ text: plainHref, href: plainHref })
    }

    lastIndex = index + match[0].length
  }

  if (lastIndex < value.length) segments.push({ text: value.slice(lastIndex) })
  return segments.length ? segments : [{ text: value }]
}

export const parseChangelog = (value: string): ParsedChangelog => {
  const parsed: ParsedChangelog = { introduction: [], sections: [] }
  let currentSection: ChangelogSection | null = null
  const lines = value.split(/\r?\n/)

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const rawLine = lines[lineIndex] ?? ''
    const line = rawLine.trim()
    if (!line) continue

    const releaseHeading = parseReleaseHeading(line)
    if (releaseHeading) {
      currentSection = {
        version: releaseHeading.version,
        label: releaseHeading.label,
        items: [],
        paragraphs: [],
        alerts: [],
      }
      parsed.sections.push(currentSection)
      continue
    }

    if (isMarkdownDivider(line)) continue

    // Version headings are handled above; discard all other Markdown headings
    // instead of rendering their raw `#` markers as changelog text.
    if (isMarkdownHeading(line)) continue

    const alertHeading = line.match(/^>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*$/i)
    if (alertHeading && currentSection) {
      const alertLines: string[] = []
      while (lineIndex + 1 < lines.length) {
        const quotedLine = (lines[lineIndex + 1] ?? '').match(/^\s*>\s?(.*)$/)
        if (!quotedLine) break
        alertLines.push(quotedLine[1] ?? '')
        lineIndex += 1
      }

      currentSection.alerts.push({
        kind: (alertHeading[1] ?? 'note').toLowerCase() as ChangelogAlertKind,
        paragraphs: parseAlertParagraphs(alertLines),
      })
      continue
    }

    const numberedItem = line.match(/^(\d+)[、.．]\s*(.+)$/)
    if (numberedItem && currentSection) {
      currentSection.items.push({
        number: numberedItem[1]!,
        segments: parseChangelogText(numberedItem[2]!),
      })
      continue
    }

    const bulletItem = line.match(/^[-*+•]\s+(.+)$/)
    if (bulletItem && currentSection) {
      currentSection.items.push({
        number: String(currentSection.items.length + 1),
        segments: parseChangelogText(bulletItem[1]!),
      })
      continue
    }

    const segments = parseChangelogText(line)
    if (currentSection) currentSection.paragraphs.push(segments)
    else parsed.introduction.push(segments)
  }

  return parsed
}
