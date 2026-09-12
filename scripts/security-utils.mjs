export function publicHttpsUrl(value) {
  if (typeof value !== 'string') return ''
  try {
    const url = new URL(value)
    // Metadata can link to public DNS names, never credentials or local hosts.
    const host = url.hostname.toLowerCase()
    if (url.protocol !== 'https:' || url.username || url.password || url.port || !host.includes('.') || /^[\d.]+$/.test(host) || host.includes(':') || /(?:^|\.)(?:localhost|local|internal|test|invalid)$/.test(host)) return ''
    return url.href
  } catch { return '' }
}

export function safeRepoName(value) {
  return typeof value === 'string' && /^[A-Za-z0-9][A-Za-z0-9._-]{0,99}$/.test(value) && value !== '.' && value !== '..'
}

export function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
}
