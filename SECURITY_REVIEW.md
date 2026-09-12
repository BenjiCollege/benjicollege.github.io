# Security review — September 11, 2026

Status: review of the September 2026 portfolio changes; deployment status is tracked in GitHub Actions. This review covered the React application,
simulated chat, terminal, Markdown rendering, contact form, asset generators,
public assets, dependencies, and deployment workflow. It is not a penetration
test or a guarantee that the site is free of vulnerabilities. No contact emails
were sent and no provider account settings were changed.

## Findings addressed

| Area | Finding and change |
| --- | --- |
| Dependencies | The initial npm audit reported five advisories (four high, one moderate). Updated Sharp to 0.35.4 and affected transitive dependencies: browserslist 4.28.9, baseline-browser-mapping 2.11.22, postcss 8.5.28, and nanoid 3.3.19. Full and production-only audits now report zero known advisories. |
| Browser policy | Production HTML now receives a Content Security Policy restricting scripts to local files, disabling objects, frames, and workers, and limiting network connections to this site and Web3Forms. Inline styles remain necessary for React/GSAP animation; inline scripts and eval are not allowed. |
| Error page | Removed the 404 page's remote CDN script and inline JavaScript. Its creative effects now use CSS, with reduced-motion support. The generated 404 receives the same production policy. |
| Deployment | Pinned GitHub Actions to verified commit SHAs, disabled checkout credential persistence, restricted write permissions to the deployment job, added timeouts, and moved CI to Node 22. CI now runs dependency auditing and security regression checks. Added weekly Dependabot configuration. |
| Contact form | Added a synchronous duplicate-submission guard, field limits and validation, an explicit payload allowlist, a 15-second request timeout, fixed error messages, and a disclosure about Web3Forms. Client validation improves behavior but cannot replace provider-side abuse controls. |
| Project generator | Validates public repository ownership and names; excludes private repositories. Rejects unsafe demo URLs, restricts image-download hosts, blocks redirects, and bounds download size, duration, and decoded pixels. API credentials are not passed to image services. Failed captures use existing fallbacks. |
| Static pages | Escapes generated fallback HTML, validates external source URLs and output paths, and avoids replacement-string interpretation of metadata. |
| Local interactions | Bounded terminal input/history/output; rejected inherited object keys in chat navigation; made malformed hashes and unavailable localStorage safe. Added environment files and private-key formats to Git ignores. |

Commit pinning follows [GitHub's secure-use guidance](https://docs.github.com/en/actions/reference/security/secure-use).
The Sharp update addresses its [published security advisory](https://github.com/advisories/GHSA-rgj7-g3m4-5g8c).

## Verification performed

- TypeScript and production build passed. Four automated security test groups
  passed: unsafe URL rejection, repository path validation, HTML escaping, and
  production HTML policies (including the 404 page).
- Both `npm audit` and `npm audit --omit=dev` reported zero known advisories.
  Sharp also successfully resized a local image after the update.
- The built site was tested in a browser at desktop and mobile widths, in light
  mode and reduced motion. Chat commands, emote controls, pause, and help worked.
  No CSP violations or runtime errors were observed during those checks.
- An HTML injection payload entered into the simulated chat rendered literally;
  it did not create an image or script. Chat and terminal use React text rendering.
  The subsequently removed Writing feature no longer includes a Markdown renderer.
- A targeted credential-pattern scan checked 142 non-ignored text files and found
  no matches for private keys or the token formats checked. This was not an
  exhaustive secret scan and did not cover Git history.
- Checked 94 public images for EXIF GPS tags; none were found. No résumé documents
  or private repositories were added to public assets.
- GitHub Pages reports HTTPS enforcement enabled for the custom domain.

The simulated chat runs locally: it is not connected to Twitch or an LLM, does
not send visitors' messages to a server, and does not persist their conversation.
Its usernames are fictional. Twitch links open the actual BenjiCollege channel.

## Remaining controls and limitations

1. **Hosting headers.** The live site's response did not include CSP, HSTS,
   X-Content-Type-Options, X-Frame-Options, Referrer-Policy, or Permissions-Policy
   headers. The local build adds CSP and referrer-policy meta tags, but these are
   not deployed yet. Some protections, particularly `frame-ancestors` for framing
   protection, require HTTP headers and cannot be supplied by a meta policy.
   Configure supported headers at the host or an edge proxy if those controls
   are needed. No DNS or hosting migration was performed. See
   [MDN's CSP reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy).

2. **Contact abuse protection.** The Web3Forms access key is intentionally public,
   as described in its [FAQ](https://docs.web3forms.com/getting-started/faq).
   Keeping it in a Vite environment variable would not make it secret. Review
   provider spam/CAPTCHA settings and, if available for the account, its
   [domain restriction feature](https://docs.web3forms.com/getting-started/pro-features/restrict-to-domain).
   Those settings were not accessible in this review, so their current state and
   end-to-end email delivery remain unverified. Browser-only guards do not stop
   someone from calling the provider directly.

3. **Third parties.** Google Fonts still receives font requests; Web3Forms
   receives submitted contact details. Build-time screenshots use external image
   services. Self-host fonts if reducing third-party requests becomes a priority.
   No Twitch embed or tracking integration was added by the chat redesign.

4. **Performance.** Vite reports a main JavaScript chunk of roughly 552 kB
   (188 kB gzipped). Further splitting optional visual features may improve first
   load while preserving animation. This is a performance finding, not a
   demonstrated vulnerability.

5. **After deployment.** Recheck actual response headers, direct project URLs,
   the error page, and authorized contact delivery. Dependency advisories change;
   keep the audit gate and review Dependabot updates. Never put private credentials
   into `VITE_*` variables or public assets because browser bundles are public.

## Repeatable checks

```sh
npm ci
npm audit
npm audit --omit=dev
npm run build
npm run test:security
```

Run the security tests after building: they inspect generated HTML in `dist/`.
