import { useEffect, useRef } from 'react'
import { isTouch, prefersReducedMotion } from '../lib/gsap'

// Hover ripple distortion via a raw WebGL fragment shader. Progressive
// enhancement: a normal <img> always renders; the canvas overlays it only when
// WebGL is available on a non-touch, motion-OK device. The render loop runs
// only while the effect is "alive" (hovering or settling back to rest).

const VERT = `
attribute vec2 p;
varying vec2 vUv;
void main(){ vUv = p * 0.5 + 0.5; gl_Position = vec4(p, 0.0, 1.0); }
`

const FRAG = `
precision mediump float;
varying vec2 vUv;
uniform sampler2D uTex;
uniform vec2 uRes;
uniform vec2 uImg;
uniform vec2 uMouse;
uniform float uTime;
uniform float uHover;

vec2 cover(vec2 uv){
  float rImg = uImg.x / uImg.y;
  float rRes = uRes.x / uRes.y;
  vec2 s = (rRes < rImg) ? vec2(rImg / rRes, 1.0) : vec2(1.0, rRes / rImg);
  return (uv - 0.5) / s + 0.5;
}

void main(){
  vec2 uv = vUv;
  vec2 d = uv - uMouse;
  float dist = length(d);
  // ripple radiating from the cursor + a gentle ambient wave
  float ripple = sin(dist * 22.0 - uTime * 4.0) * 0.012 * smoothstep(0.55, 0.0, dist);
  vec2 wave = vec2(
    sin(uv.y * 14.0 + uTime * 1.5),
    cos(uv.x * 14.0 + uTime * 1.5)
  ) * 0.006;
  uv += (normalize(d + 0.0001) * ripple + wave) * uHover;

  vec2 cuv = cover(uv);
  vec3 col = texture2D(uTex, cuv).rgb;
  // subtle chromatic split while distorting
  float ca = 0.004 * uHover;
  col.r = texture2D(uTex, cover(uv + vec2(ca, 0.0))).r;
  col.b = texture2D(uTex, cover(uv - vec2(ca, 0.0))).b;
  gl_FragColor = vec4(col, 1.0);
}
`

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!
  gl.shaderSource(sh, src)
  gl.compileShader(sh)
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    gl.deleteShader(sh)
    return null
  }
  return sh
}

type Props = { src: string; alt: string; className?: string }

export function WebGLImage({ src, alt, className }: Props) {
  const wrap = useRef<HTMLDivElement>(null)
  const img = useRef<HTMLImageElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (isTouch() || prefersReducedMotion()) return
    const cvs = canvas.current
    const image = img.current
    const host = wrap.current
    if (!cvs || !image || !host) return

    const gl = cvs.getContext('webgl', { antialias: true, premultipliedAlpha: false })
    if (!gl) return // fallback: plain <img> stays visible

    let raf = 0
    let disposed = false
    let hover = 0
    let target = 0
    const mouse = { x: 0.5, y: 0.5 }
    const start = performance.now()

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
    const pLoc = gl.getAttribLocation(prog, 'p')
    gl.enableVertexAttribArray(pLoc)
    gl.vertexAttribPointer(pLoc, 2, gl.FLOAT, false, 0, 0)

    const u = {
      tex: gl.getUniformLocation(prog, 'uTex'),
      res: gl.getUniformLocation(prog, 'uRes'),
      img: gl.getUniformLocation(prog, 'uImg'),
      mouse: gl.getUniformLocation(prog, 'uMouse'),
      time: gl.getUniformLocation(prog, 'uTime'),
      hover: gl.getUniformLocation(prog, 'uHover'),
    }

    // texture
    const tex = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

    let ready = false
    const upload = () => {
      gl.bindTexture(gl.TEXTURE_2D, tex)
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
      try {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image)
        gl.uniform2f(u.img, image.naturalWidth || 1, image.naturalHeight || 1)
        ready = true
      } catch {
        /* tainted/cross-origin — keep the plain img */
      }
    }
    if (image.complete && image.naturalWidth) upload()
    else image.addEventListener('load', upload, { once: true })

    const resize = () => {
      const r = host.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      cvs.width = Math.max(1, Math.round(r.width * dpr))
      cvs.height = Math.max(1, Math.round(r.height * dpr))
      gl.viewport(0, 0, cvs.width, cvs.height)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(host)

    const render = () => {
      if (disposed) return
      hover += (target - hover) * 0.08
      if (ready) {
        gl.useProgram(prog)
        gl.uniform1i(u.tex, 0)
        gl.uniform2f(u.res, cvs.width, cvs.height)
        gl.uniform2f(u.mouse, mouse.x, mouse.y)
        gl.uniform1f(u.time, (performance.now() - start) / 1000)
        gl.uniform1f(u.hover, hover)
        gl.drawArrays(gl.TRIANGLES, 0, 3)
      }
      // keep looping while active; idle out when settled at rest
      if (target > 0.001 || hover > 0.002) raf = requestAnimationFrame(render)
      else {
        raf = 0
        cvs.style.opacity = '0' // settled — reveal the crisp <img> again
      }
    }

    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect()
      mouse.x = (e.clientX - r.left) / r.width
      mouse.y = 1 - (e.clientY - r.top) / r.height
    }
    const onEnter = () => {
      target = 1
      cvs.style.opacity = '1'
      if (!raf) raf = requestAnimationFrame(render)
    }
    const onLeave = () => {
      target = 0
      if (!raf) raf = requestAnimationFrame(render)
    }

    host.addEventListener('pointermove', onMove)
    host.addEventListener('pointerenter', onEnter)
    host.addEventListener('pointerleave', onLeave)

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      ro.disconnect()
      host.removeEventListener('pointermove', onMove)
      host.removeEventListener('pointerenter', onEnter)
      host.removeEventListener('pointerleave', onLeave)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [src])

  return (
    <div ref={wrap} className={`relative ${className ?? ''}`}>
      <img ref={img} src={src} alt={alt} crossOrigin="anonymous" loading="lazy" className="h-full w-full object-cover object-top" />
      <canvas
        ref={canvas}
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full opacity-0 transition-opacity duration-300"
      />
    </div>
  )
}
