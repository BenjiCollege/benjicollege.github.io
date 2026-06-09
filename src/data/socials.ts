// ─────────────────────────────────────────────────────────────────────────
//  SOCIALS — verify these are current. Pulled from the old site.
//  `icon` keys map to the inline SVGs in components/Icon.tsx.
// ─────────────────────────────────────────────────────────────────────────

export type Social = {
  label: string
  href: string
  handle: string
  icon: 'github' | 'linkedin' | 'instagram' | 'twitter' | 'codepen' | 'mail'
}

export const EMAIL = 'bcolegio12@gmail.com'

export const socials: Social[] = [
  {
    label: 'GitHub',
    href: 'https://github.com/BenjiCollege',
    handle: '@BenjiCollege',
    icon: 'github',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/gerardo-colegio/',
    handle: 'gerardo-colegio',
    icon: 'linkedin',
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/benji.college/',
    handle: '@benji.college',
    icon: 'instagram',
  },
  {
    label: 'Twitter / X',
    href: 'https://twitter.com/BenjiColegio',
    handle: '@BenjiColegio',
    icon: 'twitter',
  },
  {
    label: 'CodePen',
    href: 'https://codepen.io/benjicollege',
    handle: '@benjicollege',
    icon: 'codepen',
  },
  {
    label: 'Email',
    href: `mailto:${EMAIL}`,
    handle: EMAIL,
    icon: 'mail',
  },
]
