import { useRef, useState } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '../lib/gsap'
import { confetti } from '../lib/confetti'
import { Icon } from './Icon'

// ─────────────────────────────────────────────────────────────────────────
//  SETUP (60 seconds, free): go to https://web3forms.com, enter your email,
//  and paste the access key it gives you below. Messages then arrive straight
//  in your inbox — no server needed. The key is safe to commit (it only routes
//  to your email; it can't read anything).
// ─────────────────────────────────────────────────────────────────────────
const WEB3FORMS_ACCESS_KEY: string = '12b4e4e2-09b1-4975-ac61-0d1f8f6c77bb'

type Status = 'idle' | 'sending' | 'success' | 'error'

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const root = useRef<HTMLDivElement>(null)
  const submitting = useRef(false)

  const configured = WEB3FORMS_ACCESS_KEY !== 'YOUR_WEB3FORMS_ACCESS_KEY'

  useGSAP(
    () => {
      if (status === 'success' && !prefersReducedMotion()) {
        gsap.fromTo(
          '.cf-success',
          { scale: 0.9, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)' },
        )
        confetti('center')
      }
    },
    { scope: root, dependencies: [status] },
  )

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    if (submitting.current || !form.reportValidity()) return
    const data = new FormData(form)
    if (data.get('botcheck')) return
    const name = String(data.get('name') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const message = String(data.get('message') ?? '').trim()
    if (!name || !email || !message || name.length > 100 || email.length > 254 || message.length > 5000 || /[\r\n]/.test(name + email)) {
      setErrorMsg('Please check your name, email, and message length.')
      setStatus('error')
      return
    }

    if (!configured) {
      setErrorMsg('The form is unavailable. Please use the email link beside it.')
      setStatus('error')
      return
    }

    submitting.current = true
    setStatus('sending')
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 15000)
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        signal: controller.signal,
        credentials: 'omit',
        referrerPolicy: 'strict-origin-when-cross-origin',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `Portfolio message from ${name}`,
          from_name: 'gerardocolegio.dev',
          name, email, message,
        }),
      })
      const json = await res.json()
      if (res.ok && json.success === true) {
        setStatus('success')
        form.reset()
      } else {
        throw new Error('Submission failed')
      }
    } catch {
      setErrorMsg('The message could not be confirmed. Please try again later or use the email link.')
      setStatus('error')
    } finally {
      window.clearTimeout(timeout)
      submitting.current = false
    }
  }

  if (status === 'success') {
    return (
      <div
        ref={root}
        className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-8 text-center"
      >
        <div className="cf-success">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-accent)] text-[var(--color-ink)]">
            <Icon name="send" size={24} />
          </div>
          <h3 className="font-display text-2xl font-bold">Message sent!</h3>
          <p className="mt-2 text-[var(--color-fg-dim)]">
            Thanks for reaching out — I'll get back to you soon.
          </p>
          <button
            onClick={() => setStatus('idle')}
            data-cursor
            className="mt-6 rounded-full border border-[var(--color-line)] px-5 py-2 text-sm transition-colors hover:border-[var(--color-accent)]"
          >
            Send another
          </button>
        </div>
      </div>
    )
  }

  const field =
    'w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-ink)] px-4 py-3 text-[var(--color-fg)] outline-none transition-colors placeholder:text-[var(--color-fg-dim)] focus:border-[var(--color-accent)]'

  return (
    <div ref={root}>
      <form onSubmit={onSubmit} aria-busy={status === 'sending'} className="space-y-4 rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-6 sm:p-8">
        {/* honeypot for bots */}
        <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-[var(--color-fg-dim)]">Name</span>
            <input name="name" autoComplete="name" required maxLength={100} placeholder="Jane Doe" className={field} />
          </label>
          <label className="block">
            <span className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-[var(--color-fg-dim)]">Email</span>
            <input name="email" autoComplete="email" type="email" required maxLength={254} placeholder="jane@company.com" className={field} />
          </label>
        </div>

        <label className="block">
          <span className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-[var(--color-fg-dim)]">Message</span>
          <textarea name="message" required maxLength={5000} rows={5} placeholder="Tell me about your project, role, or just say hi…" className={`${field} resize-none`} />
        </label>

        {status === 'error' && (
          <p role="alert" className="text-sm text-[var(--color-accent-3)]">{errorMsg}</p>
        )}
        <p className="text-xs text-[var(--color-fg-dim)]">Sending shares your name, email, and message with Web3Forms to deliver it to my inbox. Please avoid sensitive information.</p>

        <button
          type="submit"
          disabled={status === 'sending'}
          data-cursor
          className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-fg)] px-6 py-3.5 font-semibold text-[var(--color-ink)] transition-opacity disabled:opacity-60 sm:w-auto"
        >
          {status === 'sending' ? 'Sending…' : (<>Send message <Icon name="send" size={16} /></>)}
        </button>
      </form>
    </div>
  )
}
