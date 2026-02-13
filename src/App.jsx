import React, { useState, useEffect, useRef } from 'react'

/* ═══════════════════════════════════════════════════════════
   HOOKS & UTILS
   ═══════════════════════════════════════════════════════════ */

const useInView = (threshold = 0.2) => {
  const ref = useRef(null)
  const [isInView, setIsInView] = useState(false)
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setIsInView(true),
      { threshold }
    )
    ref.current && observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])
  
  return [ref, isInView]
}

const useParallax = (speed = 0.5) => {
  const [offset, setOffset] = useState(0)
  
  useEffect(() => {
    const handleScroll = () => setOffset(window.scrollY * speed)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed])
  
  return offset
}

const useMousePosition = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  
  useEffect(() => {
    const handleMove = (e) => {
      setPosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      })
    }
    window.addEventListener('mousemove', handleMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])
  
  return position
}

/* ═══════════════════════════════════════════════════════════
   ANIMATION COMPONENTS
   ═══════════════════════════════════════════════════════════ */

const Reveal = ({ children, delay = 0, y = 40 }) => {
  const [ref, isInView] = useInView(0.1)
  
  return (
    <div
      ref={ref}
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : `translateY(${y}px)`,
        transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`
      }}
    >
      {children}
    </div>
  )
}

const TextReveal = ({ children, delay = 0 }) => {
  const [ref, isInView] = useInView(0.1)
  
  return (
    <span
      ref={ref}
      style={{
        display: 'inline-block',
        overflow: 'hidden'
      }}
    >
      <span
        style={{
          display: 'inline-block',
          transform: isInView ? 'translateY(0)' : 'translateY(100%)',
          transition: `transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`
        }}
      >
        {children}
      </span>
    </span>
  )
}

const Counter = ({ end, duration = 2000, suffix = '' }) => {
  const [count, setCount] = useState(0)
  const [ref, isInView] = useInView()

  useEffect(() => {
    if (!isInView) return
    
    const start = performance.now()
    const animate = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(eased * end))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [isInView, end, duration])

  return <span ref={ref}>{count}{suffix}</span>
}

const Typewriter = ({ text, speed = 60, delay = 0 }) => {
  const [displayed, setDisplayed] = useState('')
  const [started, setStarted] = useState(false)
  
  useEffect(() => {
    const timeout = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(timeout)
  }, [delay])

  useEffect(() => {
    if (!started) return
    if (displayed.length < text.length) {
      const timeout = setTimeout(() => {
        setDisplayed(text.slice(0, displayed.length + 1))
      }, speed)
      return () => clearTimeout(timeout)
    }
  }, [started, displayed, text, speed])

  return (
    <>
      {displayed}
      <span className="cursor" style={{
        borderRight: '2px solid var(--accent)',
        marginLeft: '2px',
        animation: 'blink 0.8s step-end infinite'
      }} />
      <style>{`@keyframes blink { 50% { opacity: 0; } }`}</style>
    </>
  )
}

/* ═══════════════════════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════════════════════ */

export default function App() {
  const [scrolled, setScrolled] = useState(false)
  const parallax = useParallax(0.3)
  const mouse = useMousePosition()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Background Effects */}
      <div className="bg-grid" />
      <div className="bg-gradient" />
      <div className="bg-noise" />
      
      {/* Animated Orbs with parallax */}
      <div 
        className="orb orb-1" 
        style={{ transform: `translate(${mouse.x}px, ${mouse.y + parallax * 0.5}px)` }}
      />
      <div 
        className="orb orb-2" 
        style={{ transform: `translate(${-mouse.x}px, ${-mouse.y + parallax * 0.3}px)` }}
      />
      <div 
        className="orb orb-3" 
        style={{ transform: `translate(${mouse.x * 0.5}px, ${mouse.y * 0.5}px)` }}
      />

      <div className="app">
        <Navigation scrolled={scrolled} />
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Education />
        <Contact />
        <Footer />
      </div>
    </>
  )
}

/* ═══════════════════════════════════════════════════════════
   NAVIGATION
   ═══════════════════════════════════════════════════════════ */

function Navigation({ scrolled }) {
  return (
    <nav className={scrolled ? 'scrolled' : ''}>
      <div className="container">
        <a href="#" className="nav-logo">GM_</a>
        <ul className="nav-links">
          {['À propos', 'Compétences', 'Expérience', 'Formation', 'Contact'].map((item, i) => (
            <li key={i}>
              <a href={`#${item.toLowerCase().replace(/\s/g, '-').replace('à', 'a')}`}>
                {item}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

/* ═══════════════════════════════════════════════════════════
   HERO
   ═══════════════════════════════════════════════════════════ */

function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="container">
        <div className="hero-content">
          <Reveal>
            <span className="hero-badge">Open to opportunities</span>
          </Reveal>

          <h1>
            <span className="hero-title-line">
              <TextReveal delay={0.2}>Gajanraj</TextReveal>
            </span>
            <span className="hero-title-line text-gradient">
              <TextReveal delay={0.3}>MOHANARAJ</TextReveal>
            </span>
          </h1>

          <Reveal delay={0.4}>
            <p className="hero-subtitle">
              <Typewriter text="Consultant Cybersécurité & GRC" delay={1200} />
            </p>
          </Reveal>

          <Reveal delay={0.5}>
            <p className="hero-description">
              Expert en gouvernance, risques et conformité avec 3 années d'expérience.
              Spécialisé dans l'implémentation ISO 27001, la gestion des risques tiers
              et les outils GRC pour les secteurs financier et défense.
            </p>
          </Reveal>

          <Reveal delay={0.6}>
            <div className="hero-stats">
              <div className="stat">
                <div className="stat-value"><Counter end={3} /></div>
                <div className="stat-label">Years XP</div>
              </div>
              <div className="stat">
                <div className="stat-value"><Counter end={2} /></div>
                <div className="stat-label">Industries</div>
              </div>
              <div className="stat">
                <div className="stat-value"><Counter end={10} suffix="+" /></div>
                <div className="stat-label">Tech Skills</div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.7}>
            <div className="hero-cta">
              <a href="#contact" className="btn btn-primary">
                <span>Get in touch</span>
                <span>→</span>
              </a>
              <a href="#experience" className="btn btn-secondary">
                <span>View experience</span>
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   ABOUT
   ═══════════════════════════════════════════════════════════ */

function About() {
  const cards = [
    { icon: '📍', title: 'Location', text: 'Marly-La-Ville, France' },
    { icon: '🚗', title: 'Mobility', text: "Permis B, véhiculé" },
    { icon: '🌐', title: 'Languages', text: 'FR/Tamil native, EN C1' },
    { icon: '⚡', title: 'Interests', text: 'Guitar, MMA, Football' }
  ]

  return (
    <section id="a-propos">
      <div className="container">
        <Reveal>
          <span className="section-label">About</span>
          <h2>Background<br /><span className="text-gradient">& Profile</span></h2>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', marginTop: '48px', alignItems: 'start' }}>
          <Reveal delay={0.2}>
            <p style={{ color: 'var(--gray-2)', lineHeight: 2, fontSize: '1.05rem' }}>
              Fort de trois années d'expérience en alternance dans l'informatique,
              dont deux spécialisées en cybersécurité, j'ai développé une expertise
              solide en gouvernance, risques et conformité (GRC).
            </p>
            <p style={{ color: 'var(--gray-2)', lineHeight: 2, fontSize: '1.05rem', marginTop: '24px' }}>
              Actuellement consultant cybersécurité chez Wcomply, j'accompagne les
              entreprises des secteurs financier et défense dans leur mise en conformité
              et la sécurisation de leurs systèmes d'information.
            </p>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {cards.map((card, i) => (
              <Reveal key={i} delay={0.2 + i * 0.1}>
                <div className="card">
                  <div className="card-icon">{card.icon}</div>
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   SKILLS
   ═══════════════════════════════════════════════════════════ */

function Skills() {
  const categories = [
    {
      title: 'Cybersecurity & GRC',
      skills: [
        { name: 'ISO 27001', level: 95 },
        { name: 'ISO 27005', level: 85 },
        { name: 'EBIOS RM', level: 80 },
        { name: 'TPRM', level: 90 }
      ]
    },
    {
      title: 'Pentesting & Tools',
      skills: [
        { name: 'Metasploit', level: 88 },
        { name: 'Wireshark', level: 82 },
        { name: 'Linux Admin', level: 85 },
        { name: 'Vulnerability Analysis', level: 80 }
      ]
    },
    {
      title: 'Development',
      skills: [
        { name: 'PHP / Laravel', level: 85 },
        { name: 'React', level: 78 },
        { name: 'Node.js', level: 75 },
        { name: 'MySQL', level: 82 }
      ]
    },
    {
      title: 'Soft Skills',
      skills: [
        { name: 'Project Management', level: 88 },
        { name: 'Communication', level: 92 },
        { name: 'Risk Analysis', level: 95 },
        { name: 'Team Collaboration', level: 90 }
      ]
    }
  ]

  return (
    <section id="competences" className="skills-section">
      <div className="container">
        <Reveal>
          <span className="section-label">Skills</span>
          <h2>Technical<br /><span className="text-gradient">Expertise</span></h2>
        </Reveal>

        <div className="skills-grid" style={{ marginTop: '48px' }}>
          {categories.map((cat, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="skill-category">
                <h3>{cat.title}</h3>
                <div className="skill-list">
                  {cat.skills.map((skill, j) => (
                    <SkillBar key={j} skill={skill} delay={i * 0.1 + j * 0.05} />
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function SkillBar({ skill, delay }) {
  const [ref, isInView] = useInView(0.5)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (isInView) {
      const timeout = setTimeout(() => setWidth(skill.level), delay * 1000 + 200)
      return () => clearTimeout(timeout)
    }
  }, [isInView, skill.level, delay])

  return (
    <div ref={ref} className="skill-item">
      <div className="skill-bar" style={{ width: `${width}%` }} />
      <div className="skill-content">
        <span className="skill-name">{skill.name}</span>
        <span className="skill-level">{skill.level}%</span>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   EXPERIENCE
   ═══════════════════════════════════════════════════════════ */

function Experience() {
  const items = [
    {
      date: '2024 — Present',
      title: 'Cybersecurity Consultant',
      company: 'Wcomply',
      description: 'Accompagnement des entreprises du secteur financier et défense dans leur mise en conformité. Implémentation ISO 27001, déploiement TPRM, audits internes et gestion des risques.'
    },
    {
      date: '2023 — 2024',
      title: 'Full-Stack Developer',
      company: 'Creative Agency',
      description: "Développement d'applications web sécurisées avec Symfony et Laravel. Collaboration cross-fonctionnelle avec les équipes design et marketing. Focus sécurité applicative."
    }
  ]

  return (
    <section id="experience">
      <div className="container">
        <Reveal>
          <span className="section-label">Career</span>
          <h2>Professional<br /><span className="text-gradient">Experience</span></h2>
        </Reveal>

        <div className="timeline" style={{ marginTop: '48px' }}>
          {items.map((item, i) => (
            <Reveal key={i} delay={i * 0.2}>
              <div className="timeline-item">
                <div className="timeline-dot" />
                <span className="timeline-date">{item.date}</span>
                <h3>{item.title}</h3>
                <p className="timeline-company">{item.company}</p>
                <p className="timeline-description">{item.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   EDUCATION
   ═══════════════════════════════════════════════════════════ */

function Education() {
  const items = [
    {
      date: 'In Progress',
      title: 'Master Expert Management SI & Data',
      school: 'Epitech',
      description: 'Formation spécialisée en protection et sécurité des systèmes d\'information, gouvernance et gestion des risques.'
    },
    {
      date: 'Completed',
      title: 'Back-end Developer',
      school: 'Epitech',
      description: 'Formation technique approfondie en développement back-end avec focus sur les architectures sécurisées.'
    },
    {
      date: 'Completed',
      title: 'Bachelor Cybersécurité',
      school: 'ESGI',
      description: 'Formation complète couvrant les aspects techniques, juridiques et managériaux de la cybersécurité.'
    }
  ]

  return (
    <section id="formation" className="skills-section">
      <div className="container">
        <Reveal>
          <span className="section-label">Education</span>
          <h2>Academic<br /><span className="text-gradient">Background</span></h2>
        </Reveal>

        <div className="timeline" style={{ marginTop: '48px' }}>
          {items.map((item, i) => (
            <Reveal key={i} delay={i * 0.2}>
              <div className="timeline-item">
                <div className="timeline-dot" />
                <span className="timeline-date">{item.date}</span>
                <h3>{item.title}</h3>
                <p className="timeline-company">{item.school}</p>
                <p className="timeline-description">{item.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   CONTACT
   ═══════════════════════════════════════════════════════════ */

function Contact() {
  const items = [
    { icon: '✉', label: 'Email', value: 'contact@gajanraj.dev' },
    { icon: '📍', label: 'Location', value: 'Île-de-France' },
    { icon: '💼', label: 'LinkedIn', value: '/in/gajanraj' }
  ]

  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <Reveal>
          <span className="section-label">Contact</span>
          <h2>Let's work<br /><span className="text-gradient">together</span></h2>
        </Reveal>

        <Reveal delay={0.2}>
          <p style={{ color: 'var(--gray-2)', maxWidth: '500px', margin: '24px auto 0', lineHeight: 1.8 }}>
            Prêt à sécuriser votre infrastructure ? Contactez-moi pour discuter
            de vos besoins en cybersécurité et GRC.
          </p>
        </Reveal>

        <div className="contact-grid">
          {items.map((item, i) => (
            <Reveal key={i} delay={0.3 + i * 0.1}>
              <div className="contact-item">
                <div className="contact-icon">{item.icon}</div>
                <span className="contact-label">{item.label}</span>
                <span className="contact-value">{item.value}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════════════════ */

function Footer() {
  return (
    <footer>
      <div className="container">
        <p>© 2024 Gajanraj MOHANARAJ — Built with React</p>
      </div>
    </footer>
  )
}