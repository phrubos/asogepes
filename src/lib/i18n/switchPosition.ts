/**
 * Keeps the reading position across the HU / EN switch. The two languages have their own root layouts,
 * so the switch is a full page load that would start at the top and then scroll to `?section=`.
 *
 * The old page stays fully visible until the new one can paint (the browser holds its last frame;
 * with cross-document view transitions, globals.css, the two crossfade). It only remembers the element
 * nearest the reading line. The new page is placed before its first paint, without waiting for React:
 * - SWITCH_HEAD_SCRIPT in <head> marks the switch and holds rendering until the end of <body> is parsed;
 * - SWITCH_END_SCRIPT after the content scrolls the remembered element back to the same screen position;
 * - restorePosition (after hydration and the web fonts) corrects any drift and clears the marks.
 */
const SWITCH_KEY = 'lang-switch-pos'
/** On <html>: "pending" until placed (body hidden as a fallback where rendering can't be held), then "placed" */
const SWITCH_ATTR = 'data-lang-switch'
/** On <html>: the header shows its scrolled look before React gives it the class (Navigation.module.css) */
const SCROLLED_ATTR = 'data-lang-switch-scrolled'
/** A saved position older than this is a stale tab, not a switch */
const SWITCH_TTL_MS = 15000
export const SWITCH_END_ID = 'lang-switch-end'
const EXPECT_ID = 'lang-switch-expect'

type Saved = {
  path: string
  /** the anchor element and its top on screen */
  id: string | null
  top: number
  /** anchor starting above the screen: where the reading line crosses it, as a share of its height
   *  (the translated text is longer or shorter, so a px offset into a long block would drift) */
  frac: number | null
  /** no anchor: share of the page scrolled */
  ratio: number
  scrolled: boolean
  t: number
}

/** Inline in <head> (no React yet). `<link rel=expect blocking=render>` must be parser-inserted to hold
 *  rendering, hence document.write; it only runs on a switch. */
export const SWITCH_HEAD_SCRIPT = `try{var s=JSON.parse(sessionStorage.getItem('${SWITCH_KEY}'));if(s&&s.path===location.pathname&&Date.now()-s.t<${SWITCH_TTL_MS}){history.scrollRestoration='manual';var h=document.documentElement;h.setAttribute('${SWITCH_ATTR}','pending');if(s.scrolled)h.setAttribute('${SCROLLED_ATTR}','');document.write('<link rel="expect" href="#${SWITCH_END_ID}" blocking="render" id="${EXPECT_ID}">')}}catch(e){}`

/** Inline right after the content, still before the first paint: the same sum as `targetOf` below */
export const SWITCH_END_SCRIPT = `(function(){var h=document.documentElement;if(h.getAttribute('${SWITCH_ATTR}')!=='pending')return;try{var s=JSON.parse(sessionStorage.getItem('${SWITCH_KEY}'));var el=s.id&&document.getElementById(s.id);var y;if(el){var r=el.getBoundingClientRect();y=s.frac!==null?r.top+scrollY+s.frac*r.height-innerHeight/3:r.top+scrollY-s.top}else y=s.ratio*(h.scrollHeight-innerHeight);var b=h.style.scrollBehavior;h.style.scrollBehavior='auto';scrollTo(0,Math.max(0,y));h.style.scrollBehavior=b}catch(e){}h.setAttribute('${SWITCH_ATTR}','placed');var l=document.getElementById('${EXPECT_ID}');if(l)l.remove()})()`

/** Ids that name content in both languages: hand-written, not React useId or SVG defs */
const anchorable = (el: Element) => /^[a-z][\w-]*$/i.test(el.id) && !el.closest('svg')

/** The reading line: a third down the screen */
const readingLine = () => window.innerHeight / 3

/** The id'd element whose top is nearest above the reading line */
function readingAnchor(): { id: string; top: number; frac: number | null } | null {
  const line = readingLine()
  let best: { id: string; top: number; frac: number | null } | null = null
  for (const el of Array.from(document.querySelectorAll('main [id]'))) {
    if (!anchorable(el)) continue
    const r = el.getBoundingClientRect()
    if (r.height === 0 || r.top > line || r.bottom <= line) continue
    if (!best || r.top > best.top) best = { id: el.id, top: r.top, frac: r.top < 0 ? (line - r.top) / r.height : null }
  }
  return best
}

export function savePosition(path: string) {
  const anchor = window.scrollY > 0 ? readingAnchor() : null
  const max = document.documentElement.scrollHeight - window.innerHeight
  const saved: Saved = {
    path,
    id: anchor?.id ?? null,
    top: anchor?.top ?? 0,
    frac: anchor?.frac ?? null,
    ratio: max > 0 ? window.scrollY / max : 0,
    // Navigation's threshold for its scrolled look
    scrolled: window.scrollY > 50,
    t: Date.now(),
  }
  try { sessionStorage.setItem(SWITCH_KEY, JSON.stringify(saved)) } catch { /* storage blocked: lands at the top */ }
}

function targetOf(saved: Saved, el: HTMLElement | null) {
  if (el) {
    const r = el.getBoundingClientRect()
    if (saved.frac !== null) return r.top + window.scrollY + saved.frac * r.height - readingLine()
    return r.top + window.scrollY - saved.top
  }
  return saved.ratio * (document.documentElement.scrollHeight - window.innerHeight)
}

function jumpTo(top: number) {
  const html = document.documentElement
  const previous = html.style.scrollBehavior
  html.style.scrollBehavior = 'auto'
  window.scrollTo(0, Math.max(0, top))
  html.style.scrollBehavior = previous
}

let restoring = false

/**
 * After hydration: the web fonts or a lazily rendered section (content-visibility) may have moved the
 * anchor a little since the end script placed it; put it back (usually a no-op), then clear the marks.
 */
export function restorePosition() {
  const html = document.documentElement
  // once per page load (React's dev double effect calls this twice)
  if (restoring || !html.hasAttribute(SWITCH_ATTR)) return
  restoring = true
  let saved: Saved | null = null
  try {
    saved = JSON.parse(sessionStorage.getItem(SWITCH_KEY) || 'null')
    sessionStorage.removeItem(SWITCH_KEY)
  } catch { /* storage blocked */ }

  const finish = () => {
    window.clearTimeout(failSafe)
    html.removeAttribute(SWITCH_ATTR)
    html.removeAttribute(SCROLLED_ATTR)
    document.getElementById(EXPECT_ID)?.remove()
  }
  // never leave the page marked (hidden while "pending"), whatever happens below
  const failSafe = window.setTimeout(finish, 3000)
  if (!saved) return finish()

  const s: Saved = saved
  const el = s.id ? document.getElementById(s.id) : null
  const target = () => targetOf(s, el)
  // the page may be too short to bring the element that high
  const reachable = () => Math.min(Math.max(0, target()), html.scrollHeight - window.innerHeight)

  // Pin the anchor every frame (something above may still grow after hydration, e.g. a font swap or a
  // filter read from the URL), so it never visibly drifts and snaps back; stop once the page has been
  // still for a while after the fonts, or as soon as the reader scrolls.
  let fontsReady = false
  let still = 0
  let frames = 0
  let stopped = false
  const stop = () => { stopped = true }
  const events = ['wheel', 'touchstart', 'keydown', 'mousedown'] as const
  events.forEach((e) => window.addEventListener(e, stop, { once: true, passive: true }))
  const pin = () => {
    if (!stopped && ++frames < 600) {
      const want = reachable()
      if (Math.abs(want - window.scrollY) > 1) { jumpTo(want); still = 0 } else still++
      if (!fontsReady || still < 10) return requestAnimationFrame(pin)
    }
    events.forEach((e) => window.removeEventListener(e, stop))
    finish()
  }
  // the end script didn't run (e.g. streamed content): place it now
  if (html.getAttribute(SWITCH_ATTR) === 'pending') {
    jumpTo(target())
    html.setAttribute(SWITCH_ATTR, 'placed')
  }
  const ready = () => { fontsReady = true }
  ;(document.fonts?.ready ?? Promise.resolve()).then(ready, ready)
  requestAnimationFrame(pin)
}

/** True while a language switch is being put in place (ScrollLayout then skips its `?section=` scroll) */
export const isRestoringSwitch = () =>
  typeof document !== 'undefined' && document.documentElement.hasAttribute(SWITCH_ATTR)
