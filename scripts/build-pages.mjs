import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import ts from 'typescript'
import { escapeHtml as escape, publicHttpsUrl } from './security-utils.mjs'

// Real static entry points keep story URLs reloadable on GitHub Pages, with
// per-page metadata and readable content even before JavaScript initializes.
const root = path.resolve(import.meta.dirname, '..')
const cache = path.join(root, '.vite', 'page-data')
await mkdir(cache, { recursive: true })
for (const name of ['projects.generated', 'projects']) {
  const source = await readFile(path.join(root, 'src', 'data', `${name}.ts`), 'utf8')
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText
    .replace("'./projects.generated'", "'./projects.generated.mjs'")
  await writeFile(path.join(cache, `${name}.mjs`), output)
}
const { projects } = await import(pathToFileURL(path.join(cache, 'projects.mjs')))
const template = await readFile(path.join(root, 'dist', 'index.html'), 'utf8')
// The standalone animated 404 uses CSS only, with the same production policy.
const policyTag = template.match(/<meta http-equiv="Content-Security-Policy"[^>]+>/)?.[0]
if (!policyTag) throw new Error('Production content policy is missing')
const notFound = await readFile(path.join(root, 'public', '404.html'), 'utf8')
await writeFile(path.join(root, 'dist', '404.html'), notFound.replace('<meta charset="UTF-8" />', () => `<meta charset="UTF-8" />\n    ${policyTag}\n    <meta name="referrer" content="strict-origin-when-cross-origin" />`))
const pages = [
  ...projects.map(p => ({ path: `/projects/${encodeURIComponent(p.slug)}/`, title: p.title, description: p.blurb, body: `<p>${escape(p.problem)}</p><h2>The approach</h2><p>${escape(p.approach)}</p><h2>Status & next steps</h2><p>${escape(p.next)}</p>${publicHttpsUrl(p.source) ? `<a href="${escape(publicHttpsUrl(p.source))}">Public source</a>` : ''}` })),
]
for (const page of pages) {
  if (!/^\/projects\/[A-Za-z0-9_%.-]+\/$/.test(page.path) || /\/(?:\.|\.\.)\/$/.test(page.path)) throw new Error('Invalid output path')
  const url = `https://gerardocolegio.dev${page.path}`
  const html = template
    .replace(/<title>.*?<\/title>/s, () => `<title>${escape(page.title)} — Gerardo Colegio</title>`)
    .replace(/(<meta\s+name="description"\s+content=")[^"]*/s, (_, prefix) => prefix + escape(page.description))
    .replace(/(<meta\s+property="og:title"\s+content=")[^"]*/s, (_, prefix) => prefix + escape(page.title))
    .replace(/(<meta\s+property="og:description"\s+content=")[^"]*/s, (_, prefix) => prefix + escape(page.description))
    .replace(/(<meta\s+property="og:url"\s+content=")[^"]*/s, (_, prefix) => prefix + url)
    .replace(/(<link\s+rel="canonical"\s+href=")[^"]*/s, (_, prefix) => prefix + url)
    .replace(/<div id="root">[\s\S]*?<\/body>/, () => `<div id="root"><main style="max-width:800px;margin:80px auto;padding:24px;font-family:system-ui"><a href="/">← Gerardo Colegio</a><h1>${escape(page.title)}</h1><p>${escape(page.description)}</p>${page.body}</main></div></body>`)
  const directory = path.join(root, 'dist', page.path)
  await mkdir(directory, { recursive: true })
  await writeFile(path.join(directory, 'index.html'), html)
}
await writeFile(path.join(root, 'dist', 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://gerardocolegio.dev/</loc></url>${pages.map(p => `<url><loc>https://gerardocolegio.dev${p.path}</loc></url>`).join('')}</urlset>`)
console.log(`Created ${pages.length} static story pages and sitemap.`)
