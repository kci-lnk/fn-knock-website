import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchLatestRelease } from './release'

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('release service', () => {
  it('times out a stalled response body and clears the deadline', async () => {
    vi.useFakeTimers()
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => new Promise(() => {}),
      }),
    )
    const result = expect(fetchLatestRelease()).rejects.toThrow('timed out')
    await vi.advanceTimersByTimeAsync(10_000)
    await result
    expect(vi.getTimerCount()).toBe(0)
  })

  it('rejects HTTP failures without leaving a timeout behind', async () => {
    vi.useFakeTimers()
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 503 })))
    await expect(fetchLatestRelease()).rejects.toThrow('503')
    expect(vi.getTimerCount()).toBe(0)
  })

  it('loads version and release notes from the metadata endpoint', async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(Response.json({ version: '2.0.9', release_notes: '2.0.9 update' }))
    vi.stubGlobal('fetch', fetchMock)

    await expect(fetchLatestRelease()).resolves.toEqual({
      version: '2.0.9',
      releaseNotes: '2.0.9 update',
      downloads: {},
    })
    expect(fetchMock).toHaveBeenCalledWith(
      'https://cor.fnknock.cn/latest.json',
      expect.objectContaining({ headers: { Accept: 'application/json' } }),
    )
  })

  it('extracts direct CDN package URLs from the release manifest', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>().mockResolvedValue(
        Response.json({
          version: '2.3.3',
          release_notes: '2.3.3 update',
          packages: {
            fpk: {
              amd64: {
                download_url: 'https://cdn.fnknock.cn/files/2.3.3/fn-knock-2.3.3-fnos-amd64.fpk',
              },
            },
            macos: {
              arm64: {
                download_url:
                  'https://cdn.fnknock.cn/files/2.3.3/macos/arm64/fn-knock-macos-2.3.3-arm64.tar.gz',
              },
            },
            windows: {
              unsafe: { download_url: 'https://example.com/untrusted.exe' },
            },
          },
        }),
      ),
    )

    await expect(fetchLatestRelease()).resolves.toMatchObject({
      downloads: {
        fpk: {
          amd64: 'https://cdn.fnknock.cn/files/2.3.3/fn-knock-2.3.3-fnos-amd64.fpk',
        },
        macos: {
          arm64: 'https://cdn.fnknock.cn/files/2.3.3/macos/arm64/fn-knock-macos-2.3.3-arm64.tar.gz',
        },
      },
    })
  })

  it('rejects malformed responses instead of publishing an empty version', async () => {
    vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValue(Response.json({ version: '' })))

    await expect(fetchLatestRelease()).rejects.toThrow('valid version')
  })
})
