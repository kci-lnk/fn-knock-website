<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const canvas = ref<HTMLCanvasElement | null>(null)
const isReady = ref(false)

const vertexShaderSource = `
  attribute vec2 position;

  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`

const fragmentShaderSource = `
  precision highp float;

  uniform vec2 resolution;
  uniform float time;

  void main() {
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    p.y += 0.08;

    float radial = length(p) * 0.065;
    float movement = time * 0.38;
    float fade = 1.0 - smoothstep(0.08, 1.45, abs(p.y));

    float rx = p.x * (1.0 + radial);
    float gx = p.x;
    float bx = p.x * (1.0 - radial);

    float r = 0.017 / max(abs(p.y + sin((rx + movement) * 1.15) * 0.34), 0.012);
    float g = 0.021 / max(abs(p.y + sin((gx + movement) * 1.15) * 0.34), 0.012);
    float b = 0.026 / max(abs(p.y + sin((bx + movement) * 1.15) * 0.34), 0.012);

    vec3 wave = vec3(r * 0.38, g * 0.83, b * 1.22) * fade;
    vec3 base = vec3(0.008, 0.018, 0.047);
    float halo = 0.055 / (0.32 + length(p - vec2(0.55, 0.2)));
    vec3 color = base + wave + vec3(0.015, 0.035, 0.09) * halo;

    gl_FragColor = vec4(color, 1.0);
  }
`

let frameId = 0
let resizeObserver: ResizeObserver | null = null
let dispose: (() => void) | null = null

const compileShader = (gl: WebGLRenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    return null
  }
  return shader
}

onMounted(() => {
  const target = canvas.value
  if (!target) return

  let gl: WebGLRenderingContext | null = null
  try {
    gl = target.getContext('webgl', {
      alpha: false,
      antialias: false,
      depth: false,
      powerPreference: 'low-power',
      preserveDrawingBuffer: false,
    })
  } catch {
    return
  }
  if (!gl) return

  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
  if (!vertexShader || !fragmentShader) return

  const program = gl.createProgram()
  if (!program) return
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  gl.deleteShader(vertexShader)
  gl.deleteShader(fragmentShader)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program)
    return
  }

  const positionLocation = gl.getAttribLocation(program, 'position')
  const resolutionLocation = gl.getUniformLocation(program, 'resolution')
  const timeLocation = gl.getUniformLocation(program, 'time')
  const buffer = gl.createBuffer()
  if (!buffer || positionLocation < 0) return

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW,
  )
  gl.useProgram(program)
  gl.enableVertexAttribArray(positionLocation)
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 1.75)
    const width = Math.max(1, Math.floor(target.clientWidth * ratio))
    const height = Math.max(1, Math.floor(target.clientHeight * ratio))
    if (target.width !== width || target.height !== height) {
      target.width = width
      target.height = height
      gl.viewport(0, 0, width, height)
      gl.uniform2f(resolutionLocation, width, height)
    }
  }

  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  const startedAt = performance.now()
  const render = (timestamp: number) => {
    resize()
    gl.uniform1f(timeLocation, reducedMotion ? 5.5 : (timestamp - startedAt) / 1000)
    gl.drawArrays(gl.TRIANGLES, 0, 6)
    isReady.value = true
    if (!reducedMotion) frameId = window.requestAnimationFrame(render)
  }

  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(target)
  } else {
    window.addEventListener('resize', resize)
  }
  frameId = window.requestAnimationFrame(render)

  dispose = () => {
    window.cancelAnimationFrame(frameId)
    resizeObserver?.disconnect()
    window.removeEventListener('resize', resize)
    gl.deleteBuffer(buffer)
    gl.deleteProgram(program)
  }
})

onBeforeUnmount(() => dispose?.())
</script>

<template>
  <div class="wave-backdrop" :class="{ 'is-ready': isReady }" aria-hidden="true">
    <canvas ref="canvas" />
    <div class="wave-vignette" />
    <div class="wave-grid" />
  </div>
</template>

<style scoped>
.wave-backdrop {
  background:
    radial-gradient(circle at 72% 18%, rgb(20 112 255 / 0.16), transparent 34%),
    radial-gradient(circle at 16% 72%, rgb(115 50 255 / 0.12), transparent 32%), #02050d;
  bottom: 0;
  left: 0;
  overflow: hidden;
  pointer-events: none;
  position: fixed;
  right: 0;
  top: 4rem;
}

canvas {
  height: 100%;
  opacity: 0;
  transform: scale(1.08);
  transition: opacity 0.9s ease;
  width: 100%;
}

.is-ready canvas {
  opacity: 0.86;
}

.wave-vignette,
.wave-grid {
  inset: 0;
  position: absolute;
}

.wave-vignette {
  background:
    linear-gradient(180deg, rgb(2 5 13 / 0.08), rgb(2 5 13 / 0.6) 78%, #02050d 100%),
    radial-gradient(ellipse at center, transparent 14%, rgb(2 5 13 / 0.63) 78%);
}

.wave-grid {
  background-image:
    linear-gradient(rgb(133 198 255 / 0.028) 1px, transparent 1px),
    linear-gradient(90deg, rgb(133 198 255 / 0.028) 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image: linear-gradient(180deg, black, transparent 72%);
}

@media (prefers-reduced-motion: reduce) {
  canvas {
    transition: none;
  }
}
</style>
