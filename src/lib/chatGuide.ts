import { projects } from '../data/projects'
import { experience } from '../data/experience'
import { socials, EMAIL } from '../data/socials'
import { projectPath } from './navigation'
import type { AccentName } from './accent'

export const STREAM_URL = 'https://www.twitch.tv/benjicollege'
export type ChatLink = { label: string; href: string }
export type GuideReply = {
  text: string
  links?: ChatLink[]
  action?: { type: 'clear' | 'raid' } | { type: 'theme'; color: AccentName }
}
const link = (label: string, id: string): ChatLink => ({ label, href: `/#${id}` })
const help: GuideReply = {
  text: 'Hey @You! I’m BenjiBot, your scripted portfolio guide. Ask “what are you building?” or “tell me about Origin.” Commands: !projects, !about, !skills, !experience, !stream, !contact, !github, !social, !photos, !goto, !theme, !raid, !clear. I know the work featured here; I don’t read private repos or live Twitch chat.',
  links: [link('Explore the work', 'projects'), { label: 'Benji’s Twitch channel ↗', href: STREAM_URL }],
}
const sections: Record<string, string> = {
  top: 'top', about: 'about', projects: 'projects', work: 'projects', experience: 'experience',
  resume: 'experience', journey: 'experience',
  building: 'github-stats', 'github-stats': 'github-stats', playground: 'playground',
  chat: 'chat', terminal: 'terminal', photography: 'photography', photos: 'photography', contact: 'contact',
}
const aliases: Record<string, string[]> = {
  'machita-salsa': ['machita', 'salsa'], 'affordable-piano-tuning': ['piano'],
  origin: ['origin'], verso: ['verso'], 'pokemon-overworld': ['overworld', 'pokemon', 'pokémon'],
  'benjicollege.github.io': ['this portfolio', 'this website', 'this site'],
}

/** Local, deterministic responses from public portfolio data. No remote chatbot. */
export function getGuideReply(input: string): GuideReply {
  const q = input.trim().toLowerCase().replace(/^[!/]/, '').replace(/[?!.]+$/, '')
  const [command, ...args] = q.split(/\s+/)
  if (/^(help|commands|menu)$/.test(q) || /\b(what can you do|how does this work|help me)\b/.test(q)) return help
  if (q === 'clear') return { text: 'Fresh chat! Ask me about a project, or type !help.', action: { type: 'clear' } }
  if (q === 'raid' || q === 'emotes') return { text: 'A little hype for Benji’s next build! Emote raid incoming.', action: { type: 'raid' } }
  if (command === 'theme') {
    const color = args[0]
    if (args.length === 1 && ['cyan', 'violet', 'pink', 'amber', 'green'].includes(color)) return { text: `Accent switched to ${color}. Chat has taste.`, action: { type: 'theme', color: color as AccentName } }
    return { text: 'Try !theme cyan, violet, pink, amber, or green. Light/dark and motion controls are in Settings.' }
  }
  if (command === 'goto') {
    const name = args.join(' ')
    const target = Object.hasOwn(sections, name) ? sections[name] : undefined
    return target ? { text: 'Here’s your shortcut. Pick it when you’re ready to leave chat.', links: [link(`Go to ${args.join(' ')} ↓`, target)] }
      : { text: 'Try !goto projects, experience, playground, terminal, photos, or contact.' }
  }
  if (/\b(private|confidential)\b/.test(q)) return { text: 'I only show public portfolio work here. Benji can discuss private projects directly.', links: [link('Talk to Benji', 'contact')] }
  if (/\b(stream|twitch|schedule|tft|teamfight|teamflowtactics)\b/.test(q)) return {
    text: 'Find Benji on Twitch as benjicollege. He’s a TFT Grandmaster and the creator of TeamFlowTactics, with an interest in game systems, tools, and creative coding. This is a simulated hangout; check Twitch for live status and any posted schedule.',
    links: [{ label: 'Watch benjicollege on Twitch ↗', href: STREAM_URL }, link('Explore the game and web projects', 'projects')],
  }
  const project = projects.find(p => [p.slug, ...(aliases[p.slug] ?? [])].some(alias => new RegExp(`(?:^|\\W)${alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:$|\\W)`, 'i').test(q)))
  if (project) return {
    text: `${project.title}: ${project.blurb} Built with ${project.tech.join(', ')}.${project.status === 'building' ? ' Still in development, not a released app.' : ''}`,
    links: [{ label: 'Read the project story →', href: projectPath(project.slug) }, ...(project.source ? [{ label: 'Public source ↗', href: project.source }] : [])],
  }
  if (/\b(building|working on|next|now|current projects)\b/.test(q)) return {
    text: `On the public workbench: ${projects.filter(p => p.status === 'building').map(p => `${p.title} — ${p.blurb}`).join(' ')} The project stories explain what’s working and what still needs validation.`,
    links: projects.filter(p => p.status === 'building').map(p => ({ label: p.title, href: projectPath(p.slug) })),
  }
  if (/\b(experience|resume|résumé|career|journey|apro|nology|education|jobs?)\b/.test(q)) return {
    text: `Benji’s path: ${experience.map(e => `${e.role} at ${e.company} (${e.start}${e.end ? ` – ${e.end}` : ''})`).join('; ')}. Education: Communications at TCU and Business Administration at South Texas College.`,
    links: [link('Open the career timeline', 'experience')],
  }
  if (/\b(skills?|stack|technolog(?:y|ies)|languages?|tools?)\b/.test(q)) return {
    text: 'Web: React, TypeScript, JavaScript, Node.js, Python, HTML/CSS. Creative UI: GSAP and canvas/WebGL. Public app projects explore SwiftUI. His cloud experience includes GCP, AWS, Jenkins, and Terraform.',
    links: [link('See the toolbox', 'stack'), link('Explore projects using these tools', 'projects')],
  }
  if (/\b(contact|hire|email|reach|collaborat\w*|connect)\b/.test(q)) return {
    text: `Got a project, role, or collaboration in mind? Reach Benji at ${EMAIL}, or use the contact section. This chat doesn’t send him messages.`,
    links: [{ label: 'Email Benji ↗', href: `mailto:${EMAIL}` }, link('Open contact form', 'contact')],
  }
  if (/\b(github|repos?|repositories|source)\b/.test(q)) return {
    text: 'Benji’s public code lives on GitHub as @BenjiCollege. The featured cards link to the source and explain each project’s status.',
    links: [{ label: 'BenjiCollege on GitHub ↗', href: 'https://github.com/BenjiCollege' }, link('Featured projects', 'projects')],
  }
  if (/\b(socials?|links|linkedin)\b/.test(q)) return {
    text: 'Here are Benji’s links. The Twitch channel is real; the chatters in this portfolio are fictional.',
    links: [{ label: 'Twitch ↗', href: STREAM_URL }, ...socials.filter(s => s.icon !== 'mail').map(s => ({ label: `${s.label} ↗`, href: s.href }))],
  }
  if (/\b(photos?|photography|camera)\b/.test(q)) return { text: 'Benji’s creative work also goes behind the camera. There’s a sports and behind-the-scenes collection on this page.', links: [link('Explore the photo reels', 'photography')] }
  if (/\b(projects?|built|work|portfolio)\b/.test(q) || q === 'ls') return {
    text: `Pick a side quest: ${projects.map(p => p.title).join(', ')}. Ask me about any of them by name.`,
    links: projects.map(p => ({ label: p.title, href: projectPath(p.slug) })),
  }
  if (/\b(about|who is|who are|benji|gerardo)\b/.test(q)) return { text: 'Gerardo “Benji” Colegio is a developer, photographer, and gamer. He works on web and membership experiences at APRO and builds playful websites, apps, and game experiments.', links: [link('Meet Benji', 'about'), link('Career timeline', 'experience')] }
  if (/^(hi|hey|hello|yo|o7|howdy)(\b|$)/.test(q)) return { text: 'Hey @You, welcome to Benji’s build room! Need a tour? Ask about projects, TFT, his experience, or how to get in touch. !help has the commands.' }
  if (/\b(thanks|thank you|ty|gg|pog|nice|cool)\b/.test(q)) return { text: 'o7 — glad you’re here! Try a project name, !stream, or !raid for a little chat chaos.' }
  return { text: 'I’m a scripted guide to Benji’s work, so I don’t have an answer for that yet. Try “what are you building?”, “tell me about Verso”, “how can I contact Benji?”, or !help.', links: [link('Browse the projects', 'projects')] }
}
