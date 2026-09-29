import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FadeIn } from './components/FadeIn'
import { usePortfolioEffects } from './hooks/usePortfolioEffects'
import { phrases, projects, skills, techPills, FORMSUBMIT_ENDPOINT } from './data/content'

function useTypedText(items: string[]) {
  const [text, setText] = useState('')
  useEffect(() => {
    let phraseIndex = 0
    let charIndex = 0
    let deleting = false
    let timer = 0
    let alive = true

    const tick = () => {
      if (!alive) return
      const current = items[phraseIndex]
      if (deleting) {
        charIndex -= 1
        setText(current.substring(0, charIndex))
      } else {
        charIndex += 1
        setText(current.substring(0, charIndex))
      }

      let delay = deleting ? 50 : 100
      if (!deleting && charIndex === current.length) {
        delay = 1800
        deleting = true
      } else if (deleting && charIndex === 0) {
        deleting = false
        phraseIndex = (phraseIndex + 1) % items.length
        delay = 400
      }
      timer = window.setTimeout(tick, delay)
    }

    tick()
    return () => {
      alive = false
      window.clearTimeout(timer)
    }
  }, [items])

  return text
}

function useCountUp(target: number, run: boolean) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!run) return
    const duration = 1800
    const step = target / (duration / 16)
    let current = 0
    const id = window.setInterval(() => {
      current += step
      if (current >= target) {
        setValue(target)
        window.clearInterval(id)
      } else setValue(Math.floor(current))
    }, 16)
    return () => window.clearInterval(id)
  }, [run, target])
  return value
}

export default function App() {
  usePortfolioEffects()
  const typed = useTypedText(phrases)
  const [menuOpen, setMenuOpen] = useState(false)
  const [filter, setFilter] = useState('all')
  const [statsInView, setStatsInView] = useState(false)
  const [skillsInView, setSkillsInView] = useState(false)
  const [formSuccess, setFormSuccess] = useState(false)
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [isDark, setIsDark] = useState(true)
  const formTimers = useRef<number[]>([])

  const years = useCountUp(2, statsInView)
  const live = useCountUp(6, statsInView)
  const clients = useCountUp(5, statsInView)

  const filtered = useMemo(
    () =>
      filter === 'all'
        ? projects
        : projects.filter((p) => p.category.includes(filter)),
    [filter],
  )

  const closeMenu = () => setMenuOpen(false)

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'light') {
      setIsDark(false)
      document.documentElement.setAttribute('data-theme', 'light')
    }
    return () => {
      formTimers.current.forEach((id) => window.clearTimeout(id))
      document.body.classList.remove('cursor-click', 'cursor-hover')
    }
  }, [])

  const toggleTheme = () => {
    const nextDark = !isDark
    setIsDark(nextDark)
    document.documentElement.setAttribute('data-theme', nextDark ? 'dark' : 'light')
    localStorage.setItem('theme', nextDark ? 'dark' : 'light')
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const name = String(data.get('name') || '').trim()
    const email = String(data.get('email') || '').trim()
    const subject = String(data.get('subject') || '').trim()
    const message = String(data.get('message') || '').trim()
    if (!name || !email || !subject || !message) {
      setFormError('Please fill in all fields.')
      return
    }

    setSubmitting(true)
    setFormError('')
    setFormSuccess(false)

    try {
      const res = await fetch(FORMSUBMIT_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
          _subject: `Portfolio contact: ${subject}`,
          _template: 'table',
          _captcha: 'false',
        }),
      })
      if (!res.ok) throw new Error('Failed to send')
      setFormSuccess(true)
      form.reset()
      const hideTimer = window.setTimeout(() => setFormSuccess(false), 5000)
      formTimers.current.push(hideTimer)
    } catch {
      setFormError('Could not send right now. Email me directly at freshfind.shop1@gmail.com')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <div className="cursor-glow" id="cursor-glow" />
      <div className="cursor-dot" id="cursor-dot" aria-hidden />
      <div className="cursor-ring" id="cursor-ring" aria-hidden />

      <div className="scene-3d" id="scene-3d" aria-hidden>
        <div className="scene-grid" />
        <div className="scene-orb orb-a" data-depth="0.15" />
        <div className="scene-orb orb-b" data-depth="0.25" />
        <div className="scene-orb orb-c" data-depth="0.1" />
        <div className="scene-particles" id="scene-particles" />
      </div>

      <header className="navbar" id="navbar">
        <div className="nav-container">
          <a href="#home" className="logo" onClick={closeMenu}>
            <span className="logo-name">Hassan-Amin</span>
            <span className="logo-dot">.</span>
          </a>
          <nav className="nav-links">
            {[
              ['home', 'Home'],
              ['about', 'About me'],
              ['experience', 'Experience'],
              ['services', 'Services'],
              ['work', 'My Work'],
              ['contact', 'Contact me'],
            ].map(([id, label]) => (
              <a key={id} href={`#${id}`} className={`nav-link${id === 'home' ? ' active' : ''}`}>
                {label}
              </a>
            ))}
          </nav>
          <div className="nav-right">
            <button
              className="theme-toggle"
              aria-label="Toggle theme"
              onClick={toggleTheme}
            >
              <span className="theme-icon">{isDark ? '☀️' : '🌙'}</span>
            </button>
            <a href="#contact" className="btn-contact">
              Contact <span>↗</span>
            </a>
            <button
              className={`hamburger${menuOpen ? ' open' : ''}`}
              aria-label="Open menu"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
        <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
          {[
            ['home', 'Home'],
            ['about', 'About me'],
            ['experience', 'Experience'],
            ['services', 'Services'],
            ['work', 'My Work'],
            ['contact', 'Contact me'],
          ].map(([id, label]) => (
            <a key={id} href={`#${id}`} className="mobile-link" onClick={closeMenu}>
              {label}
            </a>
          ))}
        </div>
      </header>

      <section className="hero" id="home">
        <div className="hero-glow glow-1" data-depth="0.08" />
        <div className="hero-glow glow-2" data-depth="0.12" />
        <div className="hero-mesh" aria-hidden />
        <div className="hero-float-shapes" aria-hidden>
          <span className="float-shape s1" />
          <span className="float-shape s2" />
          <span className="float-shape s3" />
          <span className="float-shape s4" />
        </div>

        <div className="hero-content" id="hero-content">
          <motion.div
            className="profile-pic-wrapper tilt-3d"
            id="profile-wrapper"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <div className="profile-ring" />
            <div className="profile-glow-ring" />
            <img src="/Img/1.png" alt="Muhammad Hassan Amin" className="profile-pic" />
          </motion.div>

          <p className="hero-greeting">
            Hi! I&apos;m <strong>Muhammad Hassan Amin</strong>
          </p>
          <h1 className="hero-headline">
            <span className="typed-text">{typed}</span>
            <span className="cursor">|</span>
          </h1>
          <p className="hero-desc">
            Performance-driven <strong>Frontend &amp; Full-Stack Engineer</strong> specializing in{' '}
            <strong>Next.js</strong>, <strong>React</strong>, and <strong>TypeScript</strong> — building scalable,
            responsive platforms with strong Core Web Vitals, clean APIs, and AI-augmented delivery.
          </p>
          <div className="hero-buttons">
            <a href="#contact" className="btn-primary">
              contact me <span className="btn-arrow">→</span>
            </a>
            <a href="/Document/Muhammad_Hassan_Amin.docx" className="btn-secondary" download>
              my resume <span className="btn-icon">⬇</span>
            </a>
          </div>

          <motion.div
            className="stats-row"
            id="stats-row"
            onViewportEnter={() => setStatsInView(true)}
            viewport={{ once: true, amount: 0.5 }}
          >
            <div className="stat-item">
              <span className="stat-num">{years}</span>
              <span className="stat-suffix">+</span>
              <span className="stat-label">Years Experience</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-num">{live}</span>
              <span className="stat-suffix">+</span>
              <span className="stat-label">Live Projects</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-num">{clients}</span>
              <span className="stat-suffix">+</span>
              <span className="stat-label">Happy Clients</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="about-section" id="about">
        <div className="section-container">
          <FadeIn><div className="section-tag">About Me</div></FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="section-title">Who <span className="gradient-text">Am I?</span></h2>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="section-subtitle">
              Engineer, builder, and lifelong learner crafting products that feel fast and intentional.
            </p>
          </FadeIn>

          <div className="about-layout">
            <div className="about-intro">
              <FadeIn className="about-intro-main">
                <h3 className="about-name">Muhammad Hassan Amin</h3>
                <p className="about-role gradient-text">Frontend &amp; Full-Stack Engineer</p>
                <p className="about-bio">
                  I build scalable, responsive, and secure web applications with a focus on{' '}
                  <strong>Next.js (App Router, SSR/SSG)</strong>, <strong>React.js</strong>, and{' '}
                  <strong>TypeScript</strong>, backed by <strong>Node.js</strong>, <strong>FastAPI</strong>,{' '}
                  <strong>Laravel</strong>, and relational databases (<strong>PostgreSQL</strong>, <strong>MySQL</strong>).
                  Currently a <strong>Frontend Engineer at Microrage Solutions</strong>, I ship modular design systems
                  and optimize for Core Web Vitals and SEO.
                </p>
                <p className="about-bio">
                  Pursuing <strong>BS Computer Science at Superior University, Lahore</strong>, I combine on-site industry
                  experience with solid engineering fundamentals — and leverage AI-assisted workflows to accelerate
                  delivery without sacrificing code quality.
                </p>
              </FadeIn>

              <FadeIn delay={0.15} className="about-highlights tilt-3d">
                <div className="about-highlight-card">
                  <span className="about-hl-num">2+</span>
                  <span className="about-hl-label">Years Experience</span>
                </div>
                <div className="about-highlight-card">
                  <span className="about-hl-num">6+</span>
                  <span className="about-hl-label">Live Products</span>
                </div>
                <div className="about-highlight-card">
                  <span className="about-hl-num">3.26</span>
                  <span className="about-hl-label">CGPA · BSCS</span>
                </div>
                <div className="about-highlight-card accent">
                  <span className="about-hl-tag">Now</span>
                  <span className="about-hl-label">Microrage Solutions · Frontend Engineer</span>
                </div>
              </FadeIn>
            </div>

            <FadeIn delay={0.1} className="tech-pills">
              {techPills.map((pill) => (
                <span className="tech-pill" key={pill}>{pill}</span>
              ))}
            </FadeIn>

            <motion.div
              className="skills-list"
              id="skills-list"
              onViewportEnter={() => setSkillsInView(true)}
              viewport={{ once: true, amount: 0.4 }}
            >
              {skills.map((skill) => (
                <div className="skill-item" key={skill.label}>
                  <div className="skill-header">
                    <span>{skill.label}</span>
                    <span>{skill.width}%</span>
                  </div>
                  <div className="skill-bar">
                    <div
                      className="skill-fill"
                      style={{ width: skillsInView ? `${skill.width}%` : '0%' }}
                    />
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="experience-section" id="experience">
        <div className="section-container">
          <FadeIn><div className="section-tag">Career &amp; Education</div></FadeIn>
          <FadeIn delay={0.1}><h2 className="section-title">My <span className="gradient-text">Journey</span></h2></FadeIn>
          <FadeIn delay={0.15}>
            <p className="section-subtitle">
              Professional experience and academic background that shaped how I ship products.
            </p>
          </FadeIn>

          <div className="timeline-grid">
            <div className="timeline-col">
              <h3 className="timeline-heading">Work Experience</h3>
              <FadeIn className="timeline-card current-role">
                <span className="timeline-badge">Current · Lahore, Pakistan</span>
                <h4 className="timeline-title">Frontend Engineer</h4>
                <p className="timeline-company">Microrage Solutions · Full-time (On-site)</p>
                <p className="timeline-desc">
                  Architected high-performance web platforms with Next.js 14, React.js, and TypeScript for strong Core
                  Web Vitals and SEO. Built a modular Tailwind UI component library, integrated REST and real-time
                  backends, and implemented scalable state with Redux Toolkit and Zustand — partnering with design and
                  backend teams from concept to production.
                </p>
              </FadeIn>
              <FadeIn delay={0.1} className="timeline-card">
                <span className="timeline-badge">Previous Role · Lahore, Pakistan</span>
                <h4 className="timeline-title">Full-Stack Developer</h4>
                <p className="timeline-company">Stars IT Developer</p>
                <p className="timeline-desc">
                  Engineered responsive web platforms and landing pages with modern UI/UX and accessibility standards.
                  Developed backend logic, database schemas, and REST endpoints with PHP (Laravel), Python, and MySQL —
                  including query and indexing improvements for lower latency and higher uptime.
                </p>
              </FadeIn>
            </div>
            <div className="timeline-col">
              <h3 className="timeline-heading">Education</h3>
              <FadeIn className="timeline-card">
                <span className="timeline-badge">Expected May 2027</span>
                <h4 className="timeline-title">Bachelor of Science in Computer Science (BSCS)</h4>
                <p className="timeline-company">Superior University, Lahore — CGPA: 3.26 (6th Semester)</p>
                <p className="timeline-desc">
                  Core computer science, software engineering, algorithms, databases, OOP, and modern full-stack web
                  architectures.
                </p>
              </FadeIn>
              <FadeIn delay={0.08} className="timeline-card">
                <span className="timeline-badge">2021 — 2022</span>
                <h4 className="timeline-title">Intermediate (Pre-Engineering)</h4>
                <p className="timeline-company">KIPS College, Lahore — Grade: B+</p>
                <p className="timeline-desc">
                  Analytical foundation in mathematics, physics, and computer science principles.
                </p>
              </FadeIn>
              <FadeIn delay={0.16} className="timeline-card">
                <span className="timeline-badge">2016 — 2020</span>
                <h4 className="timeline-title">Matriculation (Computer Science)</h4>
                <p className="timeline-company">Qazi Grammar Boys High School, Lahore — Grade: A+</p>
                <p className="timeline-desc">Strong early grounding in computer science fundamentals.</p>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      <section className="services-section" id="services">
        <div className="section-container">
          <FadeIn><div className="section-tag">What I Do</div></FadeIn>
          <FadeIn delay={0.1}><h2 className="section-title">My <span className="gradient-text">Services</span></h2></FadeIn>
          <FadeIn delay={0.15}>
            <p className="section-subtitle">
              Modern product engineering — from polished interfaces to reliable APIs and deployment.
            </p>
          </FadeIn>
          <div className="services-grid">
            {[
              ['▲', 'Next.js & Full-Stack Apps', 'End-to-end products with Next.js App Router, React, TypeScript, and scalable backends on Node.js, FastAPI, or Laravel.'],
              ['◆', 'Frontend Systems & UI', 'Atomic UI libraries, Tailwind design systems, Redux Toolkit / Zustand state, and interfaces tuned for Core Web Vitals.'],
              ['⚙️', 'Backend & REST APIs', 'Secure, high-performance APIs and business logic with Node/Express, FastAPI, Laravel, and clean client-side error handling.'],
              ['🗄️', 'Database Architecture', 'PostgreSQL and MySQL schema design, indexing, and query optimization for integrity and low-latency reads.'],
              ['📱', 'Responsive & Mobile', 'Flawless UX across devices — plus Flutter/Dart when native-quality mobile experiences are part of the product.'],
              ['🚀', 'Performance & Deployment', 'SEO, Core Web Vitals, CI/CD, and production shipping on GitHub and Vercel with AI-assisted engineering workflows.'],
            ].map(([icon, title, desc], i) => (
              <FadeIn key={title} delay={i * 0.05} className="service-card">
                <div className="service-icon">{icon}</div>
                <h3 className="service-title">{title}</h3>
                <p className="service-desc">{desc}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="work-section" id="work">
        <div className="section-container">
          <FadeIn><div className="section-tag">Portfolio</div></FadeIn>
          <FadeIn delay={0.1}><h2 className="section-title">My <span className="gradient-text">Work</span></h2></FadeIn>
          <FadeIn delay={0.15}>
            <p className="section-subtitle">
              Live production demos hosted on Vercel — open any project to explore the real product.
            </p>
          </FadeIn>

          <div className="filter-btns">
            {[
              ['all', 'All'],
              ['web', 'Web'],
              ['react', 'React'],
              ['ai', 'AI'],
            ].map(([key, label]) => (
              <button
                key={key}
                className={`filter-btn${filter === key ? ' active' : ''}`}
                onClick={() => setFilter(key)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="projects-grid">
            <AnimatePresence mode="sync">
              {filtered.map((project, i) => (
                <motion.div
                  key={project.id}
                  className="project-card"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.28, delay: Math.min(i * 0.03, 0.18) }}
                >
                  <div className="project-img-wrap">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={`${project.name} preview`}
                        className="project-thumb"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    ) : null}
                    <div className={`project-placeholder ${project.placeholder}`}>
                      <span>{project.emoji}</span>
                      <p>{project.label}</p>
                    </div>
                    <div className="project-overlay">
                      <a href={project.url} target="_blank" rel="noopener noreferrer" className="project-link">
                        View Live ↗
                      </a>
                    </div>
                  </div>
                  <div className="project-info">
                    <h3 className="project-name">{project.name}</h3>
                    <p className="project-desc-small">{project.description}</p>
                    <p className="project-tech">{project.tech}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="section-container">
          <FadeIn><div className="section-tag">Get In Touch</div></FadeIn>
          <FadeIn delay={0.1}><h2 className="section-title">Contact <span className="gradient-text">Me</span></h2></FadeIn>
          <FadeIn delay={0.15}>
            <p className="section-subtitle">
              Open to frontend and full-stack roles — let&apos;s build something impactful.
            </p>
          </FadeIn>

          <div className="contact-grid">
            <FadeIn className="contact-info">
              <div className="contact-card">
                <div className="contact-icon">📧</div>
                <div>
                  <p className="contact-label">Email</p>
                  <a href="mailto:freshfind.shop1@gmail.com" className="contact-value">
                    freshfind.shop1@gmail.com
                  </a>
                </div>
              </div>
              <div className="contact-card">
                <div className="contact-icon">📞</div>
                <div>
                  <p className="contact-label">Phone</p>
                  <a href="tel:+923392039990" className="contact-value">+92 339 2039990</a>
                </div>
              </div>
              <div className="contact-card">
                <div className="contact-icon">📍</div>
                <div>
                  <p className="contact-label">Location</p>
                  <p className="contact-value">Lahore, Pakistan</p>
                </div>
              </div>
              <div className="social-links">
                <a href="https://github.com/dev-hassan-8" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="GitHub">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" /></svg>
                </a>
                <a href="https://www.linkedin.com/in/hassvnamin" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="LinkedIn">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                </a>
                <a href="https://www.instagram.com/hassnamyn/" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" /></svg>
                </a>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <form className="contact-form" onSubmit={onSubmit} noValidate>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name-input">Full Name</label>
                    <input type="text" id="name-input" name="name" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email-input">Email Address</label>
                    <input type="email" id="email-input" name="email" required />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="subject-input">Subject</label>
                  <input type="text" id="subject-input" name="subject" placeholder="Job opportunity or project" required />
                </div>
                <div className="form-group">
                  <label htmlFor="message-input">Message</label>
                  <textarea id="message-input" name="message" rows={5} placeholder="Tell me about the role or project..." required />
                </div>
                <button type="submit" className="btn-primary w-full" disabled={submitting}>
                  {submitting ? 'Sending…' : <>Send Message <span className="btn-arrow">→</span></>}
                </button>
                <p className={`form-success${formSuccess ? ' visible' : ''}`}>
                  Message sent! I&apos;ll get back to you soon.
                </p>
                {formError ? <p className="form-error visible">{formError}</p> : null}
              </form>
            </FadeIn>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-top">
            <a href="#home" className="logo">
              <span className="logo-name">Hassan-Amin</span>
              <span className="logo-dot">.</span>
            </a>
            <p className="footer-tagline">Building high-performance digital products that ship.</p>
          </div>
          <div className="footer-divider" />
          <div className="footer-bottom">
            <p className="footer-copy">© 2026 Muhammad Hassan Amin. All rights reserved.</p>
            <div className="footer-links">
              <a href="#home">Home</a>
              <a href="#about">About</a>
              <a href="#experience">Experience</a>
              <a href="#services">Services</a>
              <a href="#work">Work</a>
              <a href="#contact">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
