import { useEffect } from 'react'

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function isFinePointerDesktop() {
  return window.matchMedia('(pointer: fine)').matches && window.innerWidth > 768
}

const TILT_SEL = '.project-card, .service-card, .timeline-card, .contact-card, .about-highlights'
const MAG_SEL = '.btn-primary, .btn-secondary, .btn-contact, .social-btn'
const HOVER_SEL = 'a, button, .filter-btn, .project-card, .service-card, .social-btn, input, textarea'

export function usePortfolioEffects() {
  useEffect(() => {
    const cleanups: Array<() => void> = []
    const reduced = prefersReducedMotion()
    const canFinePointer = !reduced && isFinePointerDesktop()

    if (canFinePointer) document.body.classList.add('fx-ready')
    else document.body.classList.remove('fx-ready')

    const navbar = document.getElementById('navbar')
    const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('.nav-link'))
    const sections = Array.from(document.querySelectorAll<HTMLElement>('section[id]'))

    let scrollBar = document.querySelector<HTMLElement>('.scroll-progress')
    if (!scrollBar) {
      scrollBar = document.createElement('div')
      scrollBar.className = 'scroll-progress'
      document.body.appendChild(scrollBar)
    }

    let scrollQueued = false
    const updateScrollUI = () => {
      scrollQueued = false
      navbar?.classList.toggle('scrolled', window.scrollY > 40)

      let current = ''
      for (const section of sections) {
        if (window.scrollY >= section.offsetTop - 100) current = section.id
      }
      for (const link of navLinks) {
        link.classList.toggle('active', link.getAttribute('href') === `#${current}`)
      }

      const max = document.documentElement.scrollHeight - window.innerHeight
      if (scrollBar && max > 0) {
        scrollBar.style.width = `${Math.min(100, (window.scrollY / max) * 100)}%`
      }
    }

    const onScroll = () => {
      if (scrollQueued) return
      scrollQueued = true
      requestAnimationFrame(updateScrollUI)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    updateScrollUI()
    cleanups.push(() => window.removeEventListener('scroll', onScroll))

    const particlesHost = document.getElementById('scene-particles')
    if (particlesHost) {
      particlesHost.replaceChildren()
      if (!reduced && canFinePointer) {
        const frag = document.createDocumentFragment()
        for (let i = 0; i < 12; i++) {
          const p = document.createElement('span')
          p.className = 'particle'
          p.style.left = `${Math.random() * 100}%`
          p.style.bottom = `${Math.random() * 20}%`
          p.style.setProperty('--dx', `${(Math.random() - 0.5) * 80}px`)
          p.style.animationDuration = `${12 + Math.random() * 10}s`
          p.style.animationDelay = `${Math.random() * 8}s`
          const size = `${2 + Math.random() * 3}px`
          p.style.width = size
          p.style.height = size
          frag.appendChild(p)
        }
        particlesHost.appendChild(frag)
      }
      cleanups.push(() => particlesHost.replaceChildren())
    }

    if (!canFinePointer) {
      const glow = document.getElementById('cursor-glow')
      if (glow) glow.style.display = 'none'
      return () => cleanups.forEach((fn) => fn())
    }

    const cursorGlow = document.getElementById('cursor-glow')
    const cursorDot = document.getElementById('cursor-dot')
    const cursorRing = document.getElementById('cursor-ring')
    const depthEls = Array.from(document.querySelectorAll<HTMLElement>('[data-depth]'))
    const heroContent = document.getElementById('hero-content')

    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let glowX = mouseX
    let glowY = mouseY
    let ringX = mouseX
    let ringY = mouseY
    let raf = 0
    let running = true
    let frameQueued = false
    let pendingEvent: MouseEvent | null = null
    let activeTilt: HTMLElement | null = null
    let activeMag: HTMLElement | null = null

    const ensureGlare = (el: HTMLElement) => {
      if (!el.querySelector(':scope > .card-glare')) {
        const glare = document.createElement('div')
        glare.className = 'card-glare'
        el.appendChild(glare)
      }
    }

    const resetTilt = (el: HTMLElement | null) => {
      if (!el) return
      el.classList.remove('is-tilting')
      el.style.transform = ''
    }

    const resetMag = (el: HTMLElement | null) => {
      if (!el) return
      el.style.transform = ''
    }

    const processPointerFrame = () => {
      frameQueued = false
      const e = pendingEvent
      if (!e) return

      mouseX = e.clientX
      mouseY = e.clientY
      if (cursorDot) {
        cursorDot.style.left = `${mouseX}px`
        cursorDot.style.top = `${mouseY}px`
      }

      const cx = e.clientX / window.innerWidth - 0.5
      const cy = e.clientY / window.innerHeight - 0.5
      for (const el of depthEls) {
        const depth = parseFloat(el.dataset.depth || '0.1')
        el.style.transform = `translate3d(${cx * depth * -100}px, ${cy * depth * -60}px, 0)`
      }
      if (heroContent) {
        heroContent.style.transform = `perspective(1000px) rotateY(${cx * 3}deg) rotateX(${cy * -2}deg)`
      }

      const target = e.target as Element | null
      const tiltCard = target?.closest?.(TILT_SEL) as HTMLElement | null
      if (tiltCard) {
        if (activeTilt && activeTilt !== tiltCard) resetTilt(activeTilt)
        activeTilt = tiltCard
        ensureGlare(tiltCard)
        const rect = tiltCard.getBoundingClientRect()
        const px = (e.clientX - rect.left) / rect.width
        const py = (e.clientY - rect.top) / rect.height
        tiltCard.classList.add('tilt-3d', 'is-tilting')
        tiltCard.style.transform = `perspective(1100px) rotateX(${(py - 0.5) * -12}deg) rotateY(${(px - 0.5) * 12}deg) translateY(-6px) scale(1.015)`
        tiltCard.style.setProperty('--gx', `${px * 100}%`)
        tiltCard.style.setProperty('--gy', `${py * 100}%`)
      } else if (activeTilt) {
        resetTilt(activeTilt)
        activeTilt = null
      }

      const magBtn = target?.closest?.(MAG_SEL) as HTMLElement | null
      if (magBtn) {
        if (activeMag && activeMag !== magBtn) resetMag(activeMag)
        activeMag = magBtn
        const rect = magBtn.getBoundingClientRect()
        const x = e.clientX - rect.left - rect.width / 2
        const y = e.clientY - rect.top - rect.height / 2
        magBtn.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px) scale(1.03)`
      } else if (activeMag) {
        resetMag(activeMag)
        activeMag = null
      }

      document.body.classList.toggle('cursor-hover', Boolean(target?.closest?.(HOVER_SEL)))
    }

    const onMove = (e: MouseEvent) => {
      pendingEvent = e
      if (frameQueued) return
      frameQueued = true
      requestAnimationFrame(processPointerFrame)
    }

    const animateCursors = () => {
      if (!running) return
      glowX += (mouseX - glowX) * 0.12
      glowY += (mouseY - glowY) * 0.12
      ringX += (mouseX - ringX) * 0.18
      ringY += (mouseY - ringY) * 0.18
      if (cursorGlow) {
        cursorGlow.style.left = `${glowX}px`
        cursorGlow.style.top = `${glowY}px`
      }
      if (cursorRing) {
        cursorRing.style.left = `${ringX}px`
        cursorRing.style.top = `${ringY}px`
      }
      raf = requestAnimationFrame(animateCursors)
    }

    const onDown = () => document.body.classList.add('cursor-click')
    const onUp = () => document.body.classList.remove('cursor-click')
    const onVisibility = () => {
      if (document.hidden) {
        running = false
        cancelAnimationFrame(raf)
      } else if (!running) {
        running = true
        animateCursors()
      }
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    document.addEventListener('visibilitychange', onVisibility)
    animateCursors()

    cleanups.push(() => {
      running = false
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.removeEventListener('visibilitychange', onVisibility)
      cancelAnimationFrame(raf)
      resetTilt(activeTilt)
      resetMag(activeMag)
      document.body.classList.remove('cursor-click', 'cursor-hover')
      if (heroContent) heroContent.style.transform = ''
      depthEls.forEach((el) => {
        el.style.transform = ''
      })
    })

    return () => cleanups.forEach((fn) => fn())
  }, [])
}
