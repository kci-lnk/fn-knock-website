import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchLatestRelease } from './release'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('release service', () => {
  it('loads version and release notes from the metadata endpoint', async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(Response.json({ version: '2.0.9', release_notes: '2.0.9 update' }))
    vi.stubGlobal('fetch', fetchMock)

    await expect(fetchLatestRelease()).resolves.toEqual({
      version: '2.0.9',
      releaseNotes: '2.0.9 update',
    })
    expect(fetchMock).toHaveBeenCalledWith(
      'https://get.fnknock.cn/?info=release',
      expect.objectContaining({ headers: { Accept: 'application/json' } }),
    )
  })

  it('rejects malformed responses instead of publishing an empty version', async () => {
    vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValue(Response.json({ version: '' })))

    await expect(fetchLatestRelease()).rejects.toThrow('valid version')
  })
})
