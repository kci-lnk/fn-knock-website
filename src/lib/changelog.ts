export type ChangelogTextSegment = {
  text: string
  href?: string
}

export type ChangelogItem = {
  number: string
  segments: ChangelogTextSegment[]
}

export type ChangelogSection = {
  version: string
  label: string
  items: ChangelogItem[]
  paragraphs: ChangelogTextSegment[][]
}

export type ParsedChangelog = {
  introduction: ChangelogTextSegment[][]
  sections: ChangelogSection[]
}

const inlineLinkPattern = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s，、。；！？]+)/g

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

export const parseChangelogText = (value: string): ChangelogTextSegment[] => {
  const segments: ChangelogTextSegment[] = []
  let lastIndex = 0

  for (const match of value.matchAll(inlineLinkPattern)) {
    const index = match.index ?? 0
    if (index > lastIndex) segments.push({ text: value.slice(lastIndex, index) })

    const markdownLabel = match[1]
    const markdownHref = match[2]
    const plainHref = match[3]
    const href = markdownHref || plainHref || ''
    segments.push({ text: markdownLabel || plainHref || href, href })
    lastIndex = index + match[0].length
  }

  if (lastIndex < value.length) segments.push({ text: value.slice(lastIndex) })
  return segments.length ? segments : [{ text: value }]
}

export const parseChangelog = (value: string): ParsedChangelog => {
  const parsed: ParsedChangelog = { introduction: [], sections: [] }
  let currentSection: ChangelogSection | null = null

  for (const rawLine of value.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line) continue

    const releaseHeading = parseReleaseHeading(line)
    if (releaseHeading) {
      currentSection = {
        version: releaseHeading.version,
        label: releaseHeading.label,
        items: [],
        paragraphs: [],
      }
      parsed.sections.push(currentSection)
      continue
    }

    if (isMarkdownDivider(line)) continue

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
