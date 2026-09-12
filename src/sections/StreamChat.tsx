import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from 'react'
import { Reveal } from '../components/Reveal'
import { useReducedMotion } from '../lib/preferences'
import { getGuideReply, STREAM_URL, type ChatLink } from '../lib/chatGuide'
import { setAccent } from '../lib/accent'

const emotes = ['dogJAM', 'NODDERS', 'happie', 'ppConga', 'hamsterBOUNCE', 'GIGACHAD', 'danseparty', 'o7', 'xdd', 'Considering', 'GlazedDonut']
const stillOnly = new Set(['o7', 'xdd', 'Considering', 'GlazedDonut'])
function Emote({ name, animated, decorative = false }: { name: string; animated: boolean; decorative?: boolean }) {
  const file = animated ? `${name}.${stillOnly.has(name) ? 'png' : 'gif'}` : `${name}-still.webp`
  return <img src={`/emotes/${file}`} alt={decorative ? '' : name} title={decorative ? undefined : name} width="40" height="40" loading="lazy" decoding="async" draggable={false} className="chat-emote" />
}

type Message = { id: number; user: string; text: string; emotes: string[]; color: number; badge?: string; links?: ChatLink[]; time: string; reply?: boolean }
type ChatEntry = Omit<Message, 'id' | 'time'>
const timestamp = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
const script: ChatEntry[] = [
  { user: 'LobbyLurker', text: 'welcome to Benji’s build room. TFT brain, developer tabs.', emotes: ['happie'], color: 0 },
  { user: 'TraitTracker', text: 'one more TFT game, then we fix the CSS. surely.', emotes: ['Considering'], color: 1 },
  { user: 'BenjiBot', badge: 'BOT', text: 'New here? Type !help or ask about a project. I can point you to Benji’s work, stream, résumé, or contact info.', emotes: ['o7'], color: 2 },
  { user: 'SalsaScout', text: 'Machita turns the cart into a WhatsApp order. practical side quest.', emotes: ['NODDERS'], color: 3 },
  { user: 'PatchNotePixie', text: 'Origin for the workouts. Verso for the ideas between sets.', emotes: ['GIGACHAD'], color: 0 },
  { user: 'PianoPal', text: 'the piano website has a playable keyboard. brb making noise', emotes: ['dogJAM'], color: 1 },
  { user: 'CanvasCamper', text: '27 trainer sprites in Overworld and I still can’t pick one', emotes: ['xdd'], color: 2 },
  { user: 'CommitCritter', text: 'Benji’s portfolio commit message: add a little more whimsy', emotes: ['happie'], color: 3 },
  { user: 'EconEnjoyer', text: 'saving gold in TFT. spending all my time in the animation playground.', emotes: ['Considering'], color: 0 },
  { user: 'EmoteExpress', text: 'CONGA LINE FOR THE NEXT BUILD', emotes: ['ppConga', 'ppConga'], color: 1 },
  { user: 'SideQuestNPC', text: 'new quest: ask BenjiBot about Machita, Origin, or Verso', emotes: ['o7'], color: 2 },
  { user: 'BenjiBot', badge: 'BOT', text: 'Want the actual stream? !stream links to twitch.tv/benjicollege. This room is a portfolio simulation.', emotes: ['dogJAM'], color: 2 },
]
type Particle = { id: number; name: string; x: number; drift: number; rotation: number; delay: number }

export function StreamChat() {
  const root = useRef<HTMLElement>(null)
  const messageList = useRef<HTMLOListElement>(null)
  const reduced = useReducedMotion()
  const [paused, setPaused] = useState(false)
  const [visible, setVisible] = useState(false)
  const [pageVisible, setPageVisible] = useState(!document.hidden)
  const [messages, setMessages] = useState<Message[]>(() => script.slice(0, 5).map((m, id) => ({ ...m, id, time: timestamp() })))
  const [particles, setParticles] = useState<Particle[]>([])
  const [draft, setDraft] = useState('')
  const [emotePicker, setEmotePicker] = useState(false)
  const [chatOnly, setChatOnly] = useState(false)
  const [notice, setNotice] = useState('')
  const [following, setFollowing] = useState(true)
  const followLatest = useRef(true)
  const [guideAnnouncement, setGuideAnnouncement] = useState('')
  const sequence = useRef(5)
  const id = useRef(10)
  const particleId = useRef(0)
  const running = !paused && !reduced && visible && pageVisible

  useEffect(() => {
    // Move only the message pane; never scroll the portfolio to follow chat.
    const list = messageList.current
    if (list && followLatest.current) list.scrollTop = list.scrollHeight
  }, [messages])

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.1 })
    observer.observe(root.current!)
    const change = () => setPageVisible(!document.hidden)
    document.addEventListener('visibilitychange', change)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', change) }
  }, [])

  const append = (message: ChatEntry) => {
    const next = { ...message, id: id.current++, time: timestamp() }
    setMessages(previous => [...previous, next].slice(-100))
  }
  const burst = (name?: string) => {
    if (!running) return
    const next = Array.from({ length: 16 }, (_, i) => ({
      id: particleId.current++, name: name ?? emotes[i % emotes.length],
      x: 8 + Math.random() * 84, drift: -80 + Math.random() * 160,
      rotation: -30 + Math.random() * 60, delay: Math.random() * 0.4,
    }))
    setParticles(previous => [...previous, ...next].slice(-32))
  }

  useEffect(() => {
    if (!running) { setParticles([]); return }
    const interval = window.setInterval(() => {
      const step = sequence.current++
      append(script[step % script.length])
      if (step % 4 === 0) burst()
    }, 2400)
    return () => window.clearInterval(interval)
    // append/burst only use setters and refs; running is the timer's lifecycle.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running])

  const sendEmote = (name: string) => {
    append({ user: 'You', text: '', emotes: [name, name, name], color: 0 })
    burst(name)
    setNotice(`${name} added to this local demo.`)
  }
  const raid = () => {
    append({ user: 'EmoteExpress', badge: 'DEMO', text: 'A tiny imaginary raid has arrived!', emotes: ['ppConga', 'dogJAM', 'happie'], color: 1 })
    burst()
    setNotice('Demo emote raid added!')
  }
  const jumpToLatest = () => {
    followLatest.current = true
    setFollowing(true)
    const list = messageList.current
    if (list) list.scrollTop = list.scrollHeight
  }
  const askGuide = (raw: string) => {
    const input = raw.trim().slice(0, 240)
    if (!input) return
    const reply = getGuideReply(input)
    jumpToLatest()
    if (reply.action?.type === 'clear') setMessages([])
    append({ user: 'You', text: input, emotes: [], color: 0 })
    append({ user: 'BenjiBot', badge: 'BOT', text: reply.text, links: reply.links, emotes: ['o7'], color: 2, reply: true })
    if (reply.action?.type === 'raid') burst()
    if (reply.action?.type === 'theme') setAccent(reply.action.color)
    setGuideAnnouncement(`BenjiBot replies: ${reply.text}`)
  }
  const send = (event: FormEvent) => {
    event.preventDefault()
    if (!draft.trim()) return
    askGuide(draft)
    setDraft('')
  }

  return (
    <section ref={root} id="chat" aria-labelledby="chat-title" className="mx-auto max-w-[1440px] px-4 py-24 sm:px-6 md:py-32">
      <Reveal className="mb-10">
        <p className="mb-4 font-mono text-xs uppercase tracking-[.3em] text-[var(--color-accent-2)]">// welcome to the channel</p>
        <h2 id="chat-title" className="heading">The <span className="text-gradient">BenjiCollege</span> experience.</h2>
        <p className="mt-5 max-w-2xl text-[var(--color-fg-dim)]">A little piece of my stream, right here. Games, projects, and a chat that always has something to say. Ask BenjiBot for a tour.</p>
      </Reveal>
      <div className={`twitch-shell ${chatOnly ? 'twitch-chat-only' : ''} ${running ? 'stream-running' : 'stream-still'}`}>
        {!chatOnly && <div className="twitch-channel" data-lenis-prevent>
          <div className="twitch-player">
            <img className="twitch-poster" src="/about/hero.jpg" alt="Benji’s illustrated creative workspace" loading="lazy" />
            <div className="twitch-player-shade" />
            <span className="twitch-preview-label">PORTFOLIO PREVIEW · SIMULATED CHAT</span>
            <div className="twitch-player-title">
              <p>BENJICOLLEGE</p>
              <h3>One more game.<br />One more <span>idea.</span></h3>
              <a href={STREAM_URL} target="_blank" rel="noopener noreferrer" className="twitch-button">↗ Open my Twitch channel</a>
            </div>
            <div className="twitch-player-controls">
              <span>TFT · games · creative coding</span>
              <button onClick={raid} title="Start a simulated emote raid" aria-label="Emote raid">✦</button>
            </div>
            <div aria-hidden="true" className="emote-shower">
              {particles.map(p => <span key={p.id} className="emote-particle" style={{ left: `${p.x}%`, '--drift': `${p.drift}px`, '--spin': `${p.rotation}deg`, animationDelay: `${p.delay}s` } as CSSProperties} onAnimationEnd={() => setParticles(previous => previous.filter(item => item.id !== p.id))}><Emote name={p.name} animated={running} decorative /></span>)}
            </div>
          </div>
          <div className="twitch-channel-info">
            <img src="/about/me.jpeg" alt="Benji Colegio" width="64" height="64" loading="lazy" />
            <div className="twitch-channel-copy">
              <h3>BenjiCollege <span title="Portfolio simulation">✦</span></h3>
              <p>Games, code &amp; creative side quests | Come hang out</p>
              <a href={STREAM_URL} target="_blank" rel="noopener noreferrer">Teamfight Tactics · Software &amp; Game Development ↗</a>
              <div className="twitch-tags"><span>English</span><span>Español</span><span>TFT</span><span>Creative</span></div>
            </div>
          </div>
          <details className="twitch-about-channel">
            <summary>About BenjiCollege</summary>
            <p>Developer, TFT Grandmaster, photographer, and serial side-quest starter. Explore what I’m building or find me on Twitch.</p>
            <div><a href="/#projects">Explore my projects →</a><a href="/#experience">My journey →</a></div>
            <p className="twitch-disclaimer">This is an interactive portfolio preview, not a live video or Twitch connection. The channel link takes you to my real stream.</p>
          </details>
        </div>}
        <div className="twitch-chat">
          <header className="twitch-chat-header">
            <button onClick={() => setChatOnly(value => !value)} aria-label={chatOnly ? 'Show channel preview' : 'Expand chat'} title={chatOnly ? 'Show channel preview' : 'Expand chat'}>{chatOnly ? '⇥' : '⇤'}</button>
            <h3>Stream Chat</h3>
            <button onClick={() => askGuide('!help')} aria-label="Chat help" title="Chat help">?</button>
          </header>
          <div className="twitch-regulars" aria-label="Fictional chat regulars">
            <span className="twitch-regular-star" aria-hidden="true">✦</span>
            <div><strong>BenjiBot</strong><span>your channel guide</span></div>
            <div className="twitch-regular-friends"><span>◆ TraitTracker</span><span>◆ EmoteExpress</span></div>
          </div>
          <p id="chat-explanation" className="twitch-chat-notice">Welcome to benjicollege’s chat room!<small>Simulated chat · scripted guide · local messages</small></p>
          <ol ref={messageList} tabIndex={0} aria-label="Simulated chat history" aria-live="off" className="chat-messages" data-lenis-prevent onScroll={() => {
            const list = messageList.current!
            const atBottom = list.scrollHeight - list.clientHeight - list.scrollTop < 24
            followLatest.current = atBottom
            setFollowing(atBottom)
          }} onFocusCapture={() => { followLatest.current = false; setFollowing(false) }}>
            {messages.map(message => <li key={message.id} className={`chat-line chat-color-${message.color}${message.reply ? ' chat-guide-reply' : ''}`}>
              <span className="chat-time">{message.time} </span>
              {message.badge && <span className="chat-badge" title={message.badge === 'BOT' ? 'Scripted channel guide' : 'Simulated chatter'}>{message.badge}</span>}
              <span className="chat-username">{message.user}: </span>
              <span>{message.text} </span>
              {message.emotes.map((name, index) => <Emote key={name + index} name={name} animated={running} />)}
              {message.links && <div className="chat-reply-links">{message.links.map(item => <a key={item.href} href={item.href} target={item.href.startsWith('https://') ? '_blank' : undefined} rel={item.href.startsWith('https://') ? 'noopener noreferrer' : undefined}>{item.label}</a>)}</div>}
            </li>)}
          </ol>
          <div className="twitch-chat-bottom">
            <button onClick={jumpToLatest} disabled={following} className="chat-jump">{following ? (running ? 'Chat is moving · scroll up to read' : 'Chat paused · BenjiBot still replies') : '↓ More messages below · jump to latest'}</button>
            {emotePicker && <div id="chat-emotes" aria-label="Send a demo emote" className="twitch-emote-picker">
              {emotes.map(name => <button key={name} aria-label={`Spam ${name} emotes`} title={name} className="emote-button" onClick={() => sendEmote(name)}><Emote name={name} animated={running} decorative /></button>)}
            </div>}
            <div aria-label="Ask BenjiBot" className="chat-prompts">
              {['!help', '!projects', '!stream', '!contact'].map(command => <button key={command} onClick={() => askGuide(command)}>{command}</button>)}
            </div>
            <form onSubmit={send} aria-describedby="chat-explanation">
              <div className="twitch-composer">
                <input aria-label="Local demo chat message" maxLength={240} value={draft} onChange={event => setDraft(event.target.value)} placeholder="Send a message" />
                <button type="button" onClick={() => setEmotePicker(value => !value)} aria-label="Choose emotes" aria-expanded={emotePicker} aria-controls={emotePicker ? 'chat-emotes' : undefined}>☺</button>
              </div>
              <div className="twitch-chat-tools">
                <button type="button" onClick={raid} aria-label="Emote raid" title="Emote raid"><span className="twitch-diamond">◈</span></button>
                <button type="button" onClick={() => { setPaused(value => !value); setNotice(paused ? 'Chat resumed.' : 'Chat and emotes paused.') }} aria-pressed={paused || reduced} disabled={reduced} className="twitch-pause" title="Pause animations and automatic chat">{reduced ? 'Still mode' : paused ? '▶ Resume' : 'Ⅱ Pause'}</button>
                <button type="submit" disabled={!draft.trim()} className="twitch-button twitch-send">Chat</button>
              </div>
            </form>
            <p role="status" className="sr-only">{notice}</p>
            <p role="status" aria-live="polite" className="sr-only">{guideAnnouncement}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
