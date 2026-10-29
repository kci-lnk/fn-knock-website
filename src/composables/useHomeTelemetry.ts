import { computed, onBeforeUnmount, onMounted, ref, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'

const INITIAL_UPTIME_SECONDS = 4_365
const DESKTOP_QUERY = '(min-width: 1024px)'

export const useHomeTelemetry = (previewRef: Ref<HTMLElement | null>) => {
  const { t } = useI18n()
  const startedAt = Date.now() - INITIAL_UPTIME_SECONDS * 1_000
  const uptimeSeconds = ref(INITIAL_UPTIME_SECONDS)
  const blockedCount = ref(142)
  const liveInBand = ref('2.4 MB/s')
  const liveOutBand = ref('851 KB/s')
  const totalInGb = ref(52.4)
  const totalOutGb = ref(11.1)
  const trafficBars = ref([42, 56, 48, 72, 62, 79, 52, 67, 58, 74, 61, 83])
  const totalInBand = computed(() => `${totalInGb.value.toFixed(1)} GB`)
  const totalOutBand = computed(() => `${totalOutGb.value.toFixed(1)} GB`)
  const formattedUptime = computed(() => {
    const hrs = Math.floor(uptimeSeconds.value / 3600)
    const mins = Math.floor((uptimeSeconds.value % 3600) / 60)
    const secs = uptimeSeconds.value % 60
    return t('home.architecture.uptime', { hours: hrs, minutes: mins, seconds: secs })
  })
  let clockTimer: number | undefined
  let telemetryTimer: number | undefined
  let desktopMedia: MediaQueryList | undefined
  let reducedMotionMedia: MediaQueryList | undefined
  let observer: IntersectionObserver | undefined
  let isInViewport = false

  const updateClock = () => {
    uptimeSeconds.value = Math.floor((Date.now() - startedAt) / 1_000)
  }

  const updateTelemetry = () => {
    if (Math.random() > 0.68) blockedCount.value += Math.floor(Math.random() * 3) + 1
    liveInBand.value = `${(2 + Math.random() * 1.6).toFixed(1)} MB/s`
    liveOutBand.value = `${Math.floor(620 + Math.random() * 360)} KB/s`
    totalInGb.value += 0.01 + Math.random() * 0.04
    totalOutGb.value += 0.005 + Math.random() * 0.02
    trafficBars.value = [...trafficBars.value.slice(1), Math.floor(38 + Math.random() * 48)]
  }

  const stopTimers = () => {
    if (clockTimer) window.clearInterval(clockTimer)
    if (telemetryTimer) window.clearInterval(telemetryTimer)
    clockTimer = undefined
    telemetryTimer = undefined
  }

  const syncTimers = () => {
    const shouldRun =
      document.visibilityState !== 'hidden' &&
      desktopMedia?.matches &&
      !reducedMotionMedia?.matches &&
      isInViewport
    stopTimers()
    if (!shouldRun) return
    updateClock()
    clockTimer = window.setInterval(updateClock, 1_000)
    telemetryTimer = window.setInterval(updateTelemetry, 3_500)
  }

  onMounted(() => {
    desktopMedia = window.matchMedia?.(DESKTOP_QUERY)
    reducedMotionMedia = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    desktopMedia?.addEventListener('change', syncTimers)
    reducedMotionMedia?.addEventListener('change', syncTimers)
    document.addEventListener('visibilitychange', syncTimers)
    if (previewRef.value && typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(([entry]) => {
        isInViewport = entry?.isIntersecting ?? false
        syncTimers()
      })
      observer.observe(previewRef.value)
    }
    syncTimers()
  })

  onBeforeUnmount(() => {
    stopTimers()
    desktopMedia?.removeEventListener('change', syncTimers)
    reducedMotionMedia?.removeEventListener('change', syncTimers)
    observer?.disconnect()
    document.removeEventListener('visibilitychange', syncTimers)
  })

  return {
    blockedCount,
    formattedUptime,
    liveInBand,
    liveOutBand,
    totalInBand,
    totalOutBand,
    trafficBars,
  }
}
