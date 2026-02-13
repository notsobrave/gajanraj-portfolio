import React, { useState, useEffect, useRef } from 'react'

/* ═══════════════════════════════════════════════════════════
   HOOKS
   ═══════════════════════════════════════════════════════════ */

const useInView = (threshold = 0.15) => {
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

/* ═══════════════════════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════════════════════ */

const Reveal = ({ children, delay = 0 }) => {
  const [ref, isInView] = useInView()
  
  return (
    <div
      ref={ref}
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(24px)',
        transition: `all 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`
      }}
    >
      {children}
    </div>
  )
}

const Counter = ({ end, suffix = '' }) => {
  const [count, setCount] = useState(0)
  const [ref, isInView] = useInView()

  useEffect(() => {
    if (!isInView) return
    const duration = 1500
    const start = performance.now()
    
    const animate = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [isInView, end])

  return <span ref={ref}>{count}{suffix}</span>
}

/* ═══════════════════════════════════════════════════════════
   APP
   ═══════════════════════════════════════════════════════════ */

export default function App() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <div className="bg-grid" />
      <div className="bg-glow">
        <div className="glow-orb glow-orb-1" />
        <div className="glow-orb glow-orb-2" />
      </div>

      <div className="app">
        <Nav scrolled={scrolled} />
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

function Nav({ scrolled }) {
  return (
    <nav className={scrolled ? 'scrolled' : ''}>
      <div className="container">
        <a href="#" className="nav-logo">gajanraj.dev</a>
        <ul className="nav-links">
          <li><a href="#about">À propos</a></li>
          <li><a href="#skills">Compétences</a></li>
          <li><a href="#experience">Expérience</a></li>
          <li><a href="#education">Formation</a></li>
          <li><a href="#contact">Contact</a></li>
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
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <Reveal>
            <span className="hero-badge">Disponible pour nouvelles opportunités</span>
          </Reveal>

          <Reveal delay={0.1}>
            <h1>
              <span className="hero-name-line">Gajanraj</span>
              <span className="hero-name-line text-accent">Mohanaraj</span>
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="hero-subtitle">Consultant Cybersécurité & GRC</p>
          </Reveal>

          <Reveal delay={0.3}>
            <p className="hero-description">
              Expert en gouvernance, risques et conformité avec 3 années d'expérience.
              Spécialisé dans l'implémentation ISO 27001, la gestion des risques tiers
              et les outils GRC pour les secteurs financier et défense.
            </p>
          </Reveal>

          <Reveal delay={0.4}>
            <div className="hero-stats">
              <div className="stat">
                <div className="stat-value"><Counter end={3} /></div>
                <div className="stat-label">Années d'expérience</div>
              </div>
              <div className="stat">
                <div className="stat-value"><Counter end={2} /></div>
                <div className="stat-label">Secteurs</div>
              </div>
              <div className="stat">
                <div className="stat-value"><Counter end={10} suffix="+" /></div>
                <div className="stat-label">Compétences</div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.5}>
            <div className="hero-cta">
              <a href="#contact" className="btn btn-primary">Me contacter</a>
              <a href="#experience" className="btn btn-secondary">Voir mon parcours</a>
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
  const infos = [
    { icon: '📍', title: 'Localisation', value: 'Marly-La-Ville (95)' },
    { icon: '🚗', title: 'Mobilité', value: 'Permis B, véhiculé' },
    { icon: '🌐', title: 'Langues', value: 'FR, Tamil, EN (C1)' },
    { icon: '⚡', title: 'Centres d\'intérêt', value: 'Guitare, MMA, Football' }
  ]

  return (
    <section id="about">
      <div className="container">
        <Reveal>
          <div className="section-header">
            <span className="section-label">À propos</span>
            <h2>Profil & Parcours</h2>
          </div>
        </Reveal>

        <div className="about-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '64px', alignItems: 'start' }}>
          <Reveal delay={0.1}>
            <div>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.9, marginBottom: '20px' }}>
                Fort de trois années d'expérience en alternance dans l'informatique,
                dont deux spécialisées en cybersécurité, j'ai développé une expertise
                solide en gouvernance, risques et conformité (GRC).
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.9 }}>
                Actuellement consultant cybersécurité chez Wcomply, j'accompagne les
                entreprises des secteurs financier et défense dans leur mise en conformité
                et la sécurisation de leurs systèmes d'information.
              </p>
            </div>
          </Reveal>

          <div className="about-cards" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {infos.map((info, i) => (
              <Reveal key={i} delay={0.15 + i * 0.05}>
                <div className="card">
                  <div className="card-icon">{info.icon}</div>
                  <h3>{info.title}</h3>
                  <p>{info.value}</p>
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
      title: 'Cybersécurité & GRC',
      skills: [
        { name: 'ISO 27001 / 27005', level: 'expert' },
        { name: 'EBIOS RM', level: 'advanced' },
        { name: 'TPRM (Third Party Risk)', level: 'expert' },
        { name: 'Audits de conformité', level: 'advanced' }
      ]
    },
    {
      title: 'Outils & Pentesting',
      skills: [
        { name: 'Metasploit', level: 'advanced' },
        { name: 'Wireshark', level: 'advanced' },
        { name: 'Administration Linux', level: 'advanced' },
        { name: 'Analyse de vulnérabilités', level: 'intermediate' }
      ]
    },
    {
      title: 'Développement',
      skills: [
        { name: 'PHP / Laravel / Symfony', level: 'advanced' },
        { name: 'React / JavaScript', level: 'intermediate' },
        { name: 'Node.js', level: 'intermediate' },
        { name: 'MySQL / PostgreSQL', level: 'advanced' }
      ]
    },
    {
      title: 'Transversal',
      skills: [
        { name: 'Gestion de projet', level: 'advanced' },
        { name: 'Analyse des risques', level: 'expert' },
        { name: 'Communication', level: 'expert' },
        { name: 'Travail en équipe', level: 'expert' }
      ]
    }
  ]

  const levelLabels = {
    expert: 'Expert',
    advanced: 'Avancé',
    intermediate: 'Intermédiaire'
  }

  return (
    <section id="skills" className="skills-section">
      <div className="container">
        <Reveal>
          <div className="section-header">
            <span className="section-label">Compétences</span>
            <h2>Expertise technique</h2>
          </div>
        </Reveal>

        <div className="skills-grid">
          {categories.map((cat, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="skill-category">
                <h3>{cat.title}</h3>
                <div className="skill-list">
                  {cat.skills.map((skill, j) => (
                    <div key={j} className="skill-item">
                      <span className="skill-name">{skill.name}</span>
                      <span className={`skill-level ${skill.level}`}>
                        {levelLabels[skill.level]}
                      </span>
                    </div>
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

/* ═══════════════════════════════════════════════════════════
   EXPERIENCE
   ═══════════════════════════════════════════════════════════ */

function Experience() {
  const items = [
    {
      date: '2024 — Présent',
      title: 'Consultant Cybersécurité',
      company: 'Wcomply',
      description: 'Accompagnement des entreprises du secteur financier et défense dans leur mise en conformité. Implémentation ISO 27001, déploiement TPRM, audits internes et gestion des risques.'
    },
    {
      date: '2023 — 2024',
      title: 'Développeur Full-Stack',
      company: 'Agence Créative',
      description: 'Développement d\'applications web sécurisées avec Symfony et Laravel. Collaboration avec les équipes design et marketing. Focus sur la sécurité applicative.'
    }
  ]

  return (
    <section id="experience">
      <div className="container">
        <Reveal>
          <div className="section-header">
            <span className="section-label">Parcours</span>
            <h2>Expérience professionnelle</h2>
          </div>
        </Reveal>

        <div className="timeline">
          {items.map((item, i) => (
            <Reveal key={i} delay={i * 0.15}>
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
      date: 'En cours',
      title: 'Master Expert Management SI & Data',
      school: 'Epitech',
      description: 'Formation spécialisée en protection et sécurité des systèmes d\'information, gouvernance et gestion des risques.'
    },
    {
      date: 'Obtenu',
      title: 'Développeur Back-end',
      school: 'Epitech',
      description: 'Formation technique en développement back-end avec focus sur les architectures sécurisées.'
    },
    {
      date: 'Obtenu',
      title: 'Bachelor Cybersécurité',
      school: 'ESGI',
      description: 'Formation couvrant les aspects techniques, juridiques et managériaux de la cybersécurité.'
    }
  ]

  return (
    <section id="education" className="skills-section">
      <div className="container">
        <Reveal>
          <div className="section-header">
            <span className="section-label">Formation</span>
            <h2>Parcours académique</h2>
          </div>
        </Reveal>

        <div className="timeline">
          {items.map((item, i) => (
            <Reveal key={i} delay={i * 0.15}>
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
    { icon: '📍', label: 'Localisation', value: 'Île-de-France' },
    { icon: '💼', label: 'LinkedIn', value: '/in/gajanraj' }
  ]

  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <Reveal>
          <div className="section-header" style={{ textAlign: 'center' }}>
            <span className="section-label" style={{ justifyContent: 'center' }}>Contact</span>
            <h2>Travaillons ensemble</h2>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p style={{ color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto', lineHeight: 1.8, textAlign: 'center' }}>
            Vous avez un projet en cybersécurité ou besoin d'un accompagnement GRC ?
            N'hésitez pas à me contacter.
          </p>
        </Reveal>

        <div className="contact-grid">
          {items.map((item, i) => (
            <Reveal key={i} delay={0.2 + i * 0.1}>
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
        <p>© 2025 Gajanraj Mohanaraj</p>
      </div>
    </footer>
  )
}