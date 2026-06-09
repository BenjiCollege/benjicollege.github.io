import { useEffect, useRef } from 'react'
import { isTouch, prefersReducedMotion } from '../lib/gsap'

// A slow, living "nebula" behind everything — domain-warped fbm noise tinted in
// the brand palette over a near-black base. One half-resolution full-screen
// canvas; pauses when the tab is hidden; renders a single static frame under
// reduced-motion. Kept subtle so text stays readable.

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec3 uA; // accent
uniform vec3 uB; // accent-2
uniform vec3 uC; // accent-3

// hash + value noise + fbm
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(hash(i), hash(i+vec2(1,0)), u.x),
             mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for(int i=0;i<5;i++){ v += a*noise(p); p *= 2.0; a *= 0.5; }
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes.xy;
  vec2 p = uv * 2.4;
  p.x *= uRes.x / uRes.y;
  float t = uTime * 0.04;

  // domain warp
  vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3) - t));
  vec2 r = vec2(fbm(p + 1.8*q + vec2(1.7, 9.2)), fbm(p + 1.8*q + vec2(8.3, 2.8)));
  float f = fbm(p + 2.0*r);

  vec3 base = vec3(0.051, 0.067, 0.090); // ~ --color-bg
  vec3 col = base;
  col = mix(col, uA, smoothstep(0.35, 0.95, f) * 0.5);
  col = mix(col, uB, smoothstep(0.55, 1.0, length(r)) * 0.45);
  col = mix(col, uC, smoothstep(0.6, 1.0, q.x) * 0.3);

  // vignette so edges stay calm
  float vig = smoothstep(1.25, 0.25, length(uv - 0.5));
  col = mix(base, col, 0.55 * vig);

  gl_FragColor = vec4(col, 1.0);
}
`

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  const n = parseInt(h, 16)
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
}

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!
  gl.shaderSource(s, src)
  gl.compileShader(s)
  return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null
}

export function AuroraBackground() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (isTouch()) return // skip the GPU cost on phones; CSS bg shows instead
    const cvs = ref.current!
    const gl = cvs.getContext('webgl', { antialias: false, depth: false })
    if (!gl) return

    const vs = compile(gl, gl.VERTEX_SHADER, VERT)
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
    if (!vs || !fs) return
    const prog = gl.createProgram()!
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'p')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    const u = {
      res: gl.getUniformLocation(prog, 'uRes'),
      time: gl.getUniformLocation(prog, 'uTime'),
      a: gl.getUniformLocation(prog, 'uA'),
      b: gl.getUniformLocation(prog, 'uB'),
      c: gl.getUniformLocation(prog, 'uC'),
    }

    const readAccent = () => {
      const cs = getComputedStyle(document.documentElement)
      gl.uniform3fv(u.a, hexToRgb(cs.getPropertyValue('--color-accent').trim() || '#2ee6d6'))
      gl.uniform3fv(u.b, hexToRgb(cs.getPropertyValue('--color-accent-2').trim() || '#7c5cff'))
      gl.uniform3fv(u.c, hexToRgb(cs.getPropertyValue('--color-accent-3').trim() || '#ff5c8a'))
    }

    const SCALE = 0.5 // render at half-res; it's a soft blur anyway
    const resize = () => {
      cvs.width = Math.max(2, Math.floor(window.innerWidth * SCALE))
      cvs.height = Math.max(2, Math.floor(window.innerHeight * SCALE))
      gl.viewport(0, 0, cvs.width, cvs.height)
      gl.uniform2f(u.res, cvs.width, cvs.height)
    }
    resize()
    readAccent()
    window.addEventListener('resize', resize)
    window.addEventListener('accentchange', readAccent)

    const reduce = prefersReducedMotion()
    let raf = 0
    let running = true
    const start = performance.now()
    const draw = () => {
      gl.uniform1f(u.time, reduce ? 12 : (performance.now() - start) / 1000)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      if (running && !reduce) raf = requestAnimationFrame(draw)
    }
    draw()

    const onVis = () => {
      if (document.hidden) {
        running = false
        cancelAnimationFrame(raf)
      } else if (!reduce) {
        running = true
        draw()
      }
    }
    document.addEventListener('visibilitychange', onVis)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('accentchange', readAccent)
      document.removeEventListener('visibilitychange', onVis)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [])

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="fixed inset-0 -z-10 h-full w-full"
      style={{ background: 'var(--color-bg)' }}
    />
  )
}
