// Auto-pull GitHub projects into the portfolio.
//
//   npm run generate-projects
//
// For each top repo it grabs: name, description, languages, demo URL, stars,
// and a screenshot — the LIVE demo (via a screenshot service) when the repo has
// a homepage set, otherwise GitHub's auto-generated repo-card image. Images are
// downloaded + optimized into public/projects/. Results are written to
// src/data/projects.generated.ts.
//
// Curate which repos show (and add problem/approach/highlights) in
// src/data/projects.ts — those edits survive re-runs.
//
// Optional: set GITHUB_TOKEN in your env for higher API rate limits.

import sharp from 'sharp'
import { writeFile, mkdir, access } from 'node:fs/promises'
import path from 'node:path'
import { publicHttpsUrl, safeRepoName } from './security-utils.mjs'

const USER = 'BenjiCollege'
const TOP_N = 30
const metadataOnly = process.argv.includes('--metadata-only')
// Repos to never feature: the portfolio itself + the GitHub profile-README repo.
const EXCLUDE = new Set(['bs-portfolio', 'benjicollege'])

const ROOT = path.resolve(import.meta.dirname, '..')
const OUT_DIR = path.join(ROOT, 'public', 'projects')

const gh = (extra = {}) => ({
  headers: {
    Accept: 'application/vnd.github+json',
    ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
    ...extra,
  },
})

async function getRepos() {
  const res = await fetch(`https://api.github.com/users/${USER}/repos?per_page=100&sort=pushed`, { ...gh(), signal: AbortSignal.timeout(15000), redirect: 'error' })
  if (!res.ok) throw new Error(`GitHub repos fetch failed (${res.status}). ${res.status === 403 ? 'Rate-limited — set GITHUB_TOKEN.' : ''}`)
  const repos = await res.json()
  return repos
    .filter((r) => safeRepoName(r.name) && r.owner?.login?.toLowerCase() === USER.toLowerCase() && r.private === false && !r.fork && !r.archived && !EXCLUDE.has(r.name.toLowerCase()))
    .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
    .slice(0, TOP_N)
}

async function getLanguages(repo) {
  try {
    // Never send GITHUB_TOKEN to an endpoint supplied by metadata or a redirect.
    const res = await fetch(`https://api.github.com/repos/${USER}/${encodeURIComponent(repo.name)}/languages`, { ...gh(), signal: AbortSignal.timeout(15000), redirect: 'error' })
    if (!res.ok) return []
    return Object.keys(await res.json()).slice(0, 4)
  } catch {
    return []
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function fetchImage(url, attempts = 3) {
  if (!['image.thum.io', 'opengraph.githubassets.com'].includes(new URL(url).hostname)) throw new Error('Unexpected image host')
  for (let i = 0; i < attempts; i++) {
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 20000)
    try {
      const res = await fetch(url, {
        redirect: 'error',
        signal: ctrl.signal,
        headers: {
          // many image hosts reject non-browser user agents
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
          Accept: 'image/avif,image/webp,image/png,image/*,*/*;q=0.8',
        },
      })
      const maxBytes = 5 * 1024 * 1024
      if (res.ok && /^image\/(png|jpeg|webp|avif)(?:;|$)/i.test(res.headers.get('content-type') ?? '') && Number(res.headers.get('content-length') ?? 0) <= maxBytes && res.body) {
        const chunks = []
        let size = 0
        for await (const chunk of res.body) {
          size += chunk.length
          if (size > maxBytes) { ctrl.abort(); throw new Error('Image exceeds size limit') }
          chunks.push(chunk)
        }
        if (size > 2000) return Buffer.concat(chunks)
      } else {
        await res.body?.cancel()
      }
    } catch {
      /* retry */
    } finally {
      clearTimeout(timer)
    }
    if (i < attempts - 1) await sleep(1200)
  }
  return null
}

async function getScreenshot(repo) {
  const demo = publicHttpsUrl(repo.homepage)
  if (demo) {
    // free, no-auth live-site screenshot service
    const shot = await fetchImage(`https://image.thum.io/get/width/1200/crop/760/noanimate/${demo}`)
    if (shot) return { buf: shot, kind: 'live' }
  }
  // fallback: GitHub's repo social-card image (always exists for public repos)
  const card = await fetchImage(`https://opengraph.githubassets.com/${Date.now()}/${USER}/${repo.name}`)
  if (card) return { buf: card, kind: 'repo-card' }
  return null
}

function titleCase(name) {
  return name
    .replace(/[-_.]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\bApi\b/g, 'API')
    .trim()
}

async function run() {
  await mkdir(OUT_DIR, { recursive: true })
  console.log(`Fetching top ${TOP_N} repos for @${USER}…\n`)
  const repos = await getRepos()

  const projects = []
  for (const repo of repos) {
    const tech = await getLanguages(repo)
    const shot = metadataOnly ? null : await getScreenshot(repo)

    let image = ''
    try {
      const file = `gh-${repo.name.toLowerCase()}.png`
      await access(path.join(OUT_DIR, file))
      image = `/projects/${file}`
    } catch { /* A typographic project cover is the fallback. */ }
    if (shot) {
      const file = `gh-${repo.name.toLowerCase()}.png`
      await sharp(shot.buf, { limitInputPixels: 16_000_000 })
        .resize({ width: 1100, withoutEnlargement: true })
        .png({ compressionLevel: 9, quality: 90, palette: true })
        .toFile(path.join(OUT_DIR, file))
      image = `/projects/${file}`
    }

    projects.push({
      slug: repo.name,
      title: titleCase(repo.name),
      blurb: repo.description || '',
      tech,
      image,
      live: publicHttpsUrl(repo.homepage),
      source: `https://github.com/${USER}/${encodeURIComponent(repo.name)}`,
      stars: repo.stargazers_count,
    })
    console.log(`  ✓ ${repo.name.padEnd(28)} ${tech.join(', ') || '—'}  [${shot?.kind ?? 'no image'}]`)
    if (!metadataOnly) await sleep(400) // be gentle with the image hosts
  }

  const file = `// AUTO-GENERATED by scripts/generate-projects.mjs — do not edit by hand.
// Re-run: npm run generate-projects.  Curate + add details in projects.ts.

export type GeneratedProject = {
  slug: string
  title: string
  blurb: string
  tech: string[]
  image: string
  live: string
  source: string
  stars: number
}

export const generatedProjects: GeneratedProject[] = ${JSON.stringify(projects, null, 2)}
`
  await writeFile(path.join(ROOT, 'src', 'data', 'projects.generated.ts'), file)
  console.log(`\nWrote ${projects.length} projects → src/data/projects.generated.ts`)
}

run().catch((e) => {
  console.error('\nError: ' + e.message)
  process.exit(1)
})
