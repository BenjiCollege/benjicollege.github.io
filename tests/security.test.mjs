import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { escapeHtml, publicHttpsUrl, safeRepoName } from '../scripts/security-utils.mjs'

test('repository metadata cannot become executable, credential-bearing or local links', () => {
  for (const url of ['javascript:alert(1)', 'data:text/html,<script>alert(1)</script>', 'http://example.com', 'https://u:password@example.com', 'https://127.0.0.1', 'https://2130706433', 'https://[::1]', 'https://localhost', 'https://app.local', 'https://app.internal', '//example.com', 'https://example.com:8080', null]) assert.equal(publicHttpsUrl(url), '', String(url))
  assert.equal(publicHttpsUrl('https://github.com/BenjiCollege/origin'), 'https://github.com/BenjiCollege/origin')
})

test('repository file names cannot traverse output directories', () => {
  for (const name of ['..', '.', '../secret', 'x/../../secret', 'x\\..\\secret', '/tmp/file', 'x%2fsecret', '', null]) assert.equal(safeRepoName(name), false, String(name))
  for (const name of ['origin', 'benjicollege.github.io', 'machita-salsa']) assert.equal(safeRepoName(name), true)
})

test('static fallback content escapes markup and quoted attributes', () => {
  assert.equal(escapeHtml('<img src=x onerror="alert(1)"> & \'test\''), '&lt;img src=x onerror=&quot;alert(1)&quot;&gt; &amp; &#39;test&#39;')
  assert.equal(escapeHtml('$& $` $\''), '$&amp; $` $&#39;')
})

test('all production entry pages enforce CSP and retain executable module links', async () => {
  const files = []
  async function walk(dir) {
    for (const item of await readdir(dir, { withFileTypes: true })) {
      const file = path.join(dir, item.name)
      if (item.isDirectory()) await walk(file)
      else if (item.name.endsWith('.html')) files.push(file)
    }
  }
  await walk('dist')
  assert.ok(files.length >= 3)
  assert.ok(files.includes(path.join('dist', 'index.html')))
  assert.ok(files.includes(path.join('dist', '404.html')))
  assert.ok(files.some(file => file.includes(`${path.sep}projects${path.sep}`)))
  for (const file of files) {
    const html = await readFile(file, 'utf8')
    const policy = html.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/)?.[1].replaceAll('&#39;', "'")
    assert.ok(policy, file)
    assert.match(policy, /script-src 'self';/)
    assert.match(policy, /object-src 'none';/)
    assert.match(policy, /frame-src 'none';/)
    assert.doesNotMatch(policy, /unsafe-eval/)
    if (path.basename(file) === '404.html') assert.doesNotMatch(html, /<script/i)
    else assert.match(html, /<script type="module"[^>]+src="\/assets\//)
  }
})
