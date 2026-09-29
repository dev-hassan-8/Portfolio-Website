import { useEffect } from 'react'

export function usePortfolioEffects() {
  useEffect(() => {
    const navbar = document.getElementById('navbar')
    const navLinks = document.querySelectorAll('.nav-link')
    const sections = document.querySelectorAll('section[id]')
    const canFinePointer =
      window.matchMedia('(pointer: fine)').matches && window.innerWidth > 768

    if (!canFinePointer) {
      document.body.classList.remove('fx-ready')
    } else {
      document.body.classList.add('fx-ready')
    }

    const onScroll = () => {
      if (!navbar) return
      if (window.scrollY > 40) navbar.classList.add('scrolled')
      else navbar.classList.remove('scrolled')

      let current = ''
      sections.forEach((section) => {
        const el = section as HTMLElement
        if (window.scrollY >= el.offsetTop - 100) current = el.id
      })
      navLinks.forEach((link) => {
        link.classList.remove('active')
        if (link.getAttribute('href') === `#${current}`) link.classList.add('active')
      })

      const max = document.documentElement.scrollHeight - window.innerHeight
      const bar = document.querySelector('.scroll-progress') as HTMLElement | null
      if (bar && max > 0) bar.style.width = `${(window.scrollY / max) * 100}%`
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    let scrollBar = document.querySelector('.scroll-progress') as HTMLElement | null
    if (!scrollBar) {
      scrollBar = document.createElement('div')
      scrollBar.className = 'scroll-progress'
      document.body.appendChild(scrollBar)
    }

    const particlesHost = document.getElementById('scene-particles')
    if (particlesHost && particlesHost.childElementCount === 0) {
      const count = window.innerWidth < 768 ? 12 : 28
      for (let i = 0; i < count; i++) {
        const p = document.createElement('span')
        p.className = 'particle'
        p.style.left = `${Math.random() * 100}%`
        p.style.bottom = `${Math.random() * 20}%`
        p.style.setProperty('--dx', `${(Math.random() - 0.5) * 120}px`)
        p.style.animationDuration = `${8 + Math.random() * 14}s`
        p.style.animationDelay = `${Math.random() * 10}s`
        const size = `${2 + Math.random() * 4}px`
        p.style.width = size
        p.style.height = size
        particlesHost.appendChild(p)
      }
    }

    const cursorGlow = document.getElementById('cursor-glow')
    const cursorDot = document.getElementById('cursor-dot')
    const cursorRing = document.getElementById('cursor-ring')
    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let glowX = mouseX
    let glowY = mouseY
    let ringX = mouseX
    let ringY = mouseY
    let raf = 0

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      if (cursorDot) {
        cursorDot.style.left = `${mouseX}px`
        cursorDot.style.top = `${mouseY}px`
      }

      if (canFinePointer) {
        const cx = e.clientX / window.innerWidth - 0.5
        const cy = e.clientY / window.innerHeight - 0.5
        document.querySelectorAll('[data-depth]').forEach((el) => {
          const depth = parseFloat(el.getAttribute('data-depth') || '0.1')
          ;(el as HTMLElement).style.transform = `translate3d(${cx * depth * -120}px, ${cy * depth * -80}px, 0)`
        })
        const heroContent = document.getElementById('hero-content')
        if (heroContent) {
          heroContent.style.transform = `perspective(1000px) rotateY(${cx * 4}deg) rotateX(${cy * -3}deg)`
        }
      }
    }

    const animateCursors = () => {
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

    if (canFinePointer) {
      window.addEventListener('mousemove', onMove, { passive: true })
      window.addEventListener('mousedown', () => document.body.classList.add('cursor-click'))
      window.addEventListener('mouseup', () => document.body.classList.remove('cursor-click'))
      document
        .querySelectorAll('a, button, .filter-btn, .project-card, .service-card, .social-btn, input, textarea')
        .forEach((el) => {
          el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'))
          el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'))
        })
      animateCursors()
    } else if (cursorGlow) {
      cursorGlow.style.display = 'none'
    }

    const tiltCards = document.querySelectorAll(
      '.project-card, .service-card, .timeline-card, .contact-card, .about-highlights, .tilt-3d',
    )
    const cleanups: Array<() => void> = []

    tiltCards.forEach((card) => {
      const el = card as HTMLElement
      el.classList.add('tilt-3d')
      if (!el.querySelector('.card-glare')) {
        const glare = document.createElement('div')
        glare.className = 'card-glare'
        el.appendChild(glare)
      }
      const onCardMove = (e: MouseEvent) => {
        if (!canFinePointer) return
        const rect = el.getBoundingClientRect()
        const px = (e.clientX - rect.left) / rect.width
        const py = (e.clientY - rect.top) / rect.height
        el.classList.add('is-tilting')
        el.style.transform = `perspective(1100px) rotateX(${(py - 0.5) * -16}deg) rotateY(${(px - 0.5) * 16}deg) translateY(-8px) scale(1.02)`
        el.style.setProperty('--gx', `${px * 100}%`)
        el.style.setProperty('--gy', `${py * 100}%`)
      }
      const onLeave = () => {
        el.classList.remove('is-tilting')
        el.style.transform = ''
      }
      el.addEventListener('mousemove', onCardMove)
      el.addEventListener('mouseleave', onLeave)
      cleanups.push(() => {
        el.removeEventListener('mousemove', onCardMove)
        el.removeEventListener('mouseleave', onLeave)
      })
    })

    const magneticBtns = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-contact, .social-btn')
    magneticBtns.forEach((btn) => {
      const el = btn as HTMLElement
      const onBtnMove = (e: MouseEvent) => {
        if (!canFinePointer) return
        const rect = el.getBoundingClientRect()
        const x = e.clientX - rect.left - rect.width / 2
        const y = e.clientY - rect.top - rect.height / 2
        el.style.transform = `translate(${x * 0.28}px, ${y * 0.28}px) scale(1.04)`
      }
      const onBtnLeave = () => {
        el.style.transform = ''
      }
      el.addEventListener('mousemove', onBtnMove)
      el.addEventListener('mouseleave', onBtnLeave)
      cleanups.push(() => {
        el.removeEventListener('mousemove', onBtnMove)
        el.removeEventListener('mouseleave', onBtnLeave)
      })
    })

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
      cleanups.forEach((fn) => fn())
    }
  }, [])
}
