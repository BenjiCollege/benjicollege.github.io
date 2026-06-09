// One-shot image optimizer. Reads full-res originals from assets/img/ and
// writes resized, recompressed copies into public/ at the SAME relative paths
// and extensions, so no component/code references need to change.
//
//   node scripts/optimize-images.mjs
//
// Re-runnable: it always reads from the pristine assets/img/ originals.
import sharp from 'sharp'
import { readdir, mkdir, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const SRC = path.join(ROOT, 'assets', 'img')
const OUT = path.join(ROOT, 'public')

let savedBytes = 0
let count = 0

async function emit(srcRel, outRel, { width, kind }) {
  const srcPath = path.join(SRC, srcRel)
  const outPath = path.join(OUT, outRel)
  if (!existsSync(srcPath)) {
    console.warn('  ! missing source:', srcRel)
    return
  }
  await mkdir(path.dirname(outPath), { recursive: true })
  const before = existsSync(outPath) ? (await stat(outPath)).size : 0

  let pipe = sharp(srcPath).rotate().resize({
    width,
    withoutEnlargement: true,
  })
  if (kind === 'png') {
    pipe = pipe.png({ compressionLevel: 9, palette: true, quality: 90 })
  } else {
    pipe = pipe.jpeg({ quality: 72, mozjpeg: true })
  }
  await pipe.toFile(outPath)

  const after = (await stat(outPath)).size
  savedBytes += before - after
  count++
  const kb = (n) => `${(n / 1024).toFixed(0)}KB`
  console.log(`  ${outRel}  ${kb(before)} → ${kb(after)}`)
}

// Screenshots are sharp-edged UI → keep PNG (palette quantized) for crisp text.
const projectsPng = [
  'bakery-website',
  'calculator-website',
  'pokeGuess-website',
  'photography-website',
  'pythonTerminal-game',
  'draftAPI-website',
  'Chroma-Lair',
]

async function run() {
  console.log('Hero / about:')
  // Hero background — big art, served as a wide JPEG (/about/hero.jpg).
  await emit('Chroma-Lair_3840x2160.png', 'about/hero.jpg', {
    width: 2000,
    kind: 'jpg',
  })
  await emit('me.jpeg', 'about/me.jpeg', { width: 1000, kind: 'jpg' })

  console.log('Projects:')
  for (const name of projectsPng) {
    await emit(`${name}.png`, `projects/${name}.png`, { width: 1100, kind: 'png' })
  }
  await emit('SwitchLair.jpg', 'projects/SwitchLair.jpg', { width: 1100, kind: 'jpg' })

  console.log('Photography — onset:')
  for (let i = 1; i <= 33; i++) {
    await emit(`onset/image${i}.jpg`, `photography/onset/image${i}.jpg`, {
      width: 1280,
      kind: 'jpg',
    })
  }

  console.log('Photography — sports:')
  const sports = await readdir(path.join(SRC, 'sports'))
  for (const f of sports.filter((f) => /\.jpe?g$/i.test(f))) {
    await emit(`sports/${f}`, `photography/sports/${f}`, { width: 1280, kind: 'jpg' })
  }

  console.log(
    `\nDone. ${count} images. Saved ~${(savedBytes / 1024 / 1024).toFixed(1)} MB.`,
  )
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
