import React, { useState, useEffect, useRef } from 'react'

// Animation hook
const useInView = (threshold = 0.2) => {
  const ref = useRef(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        }
      },
      { threshold }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])

  return [ref, isInView]
}

// Animated component wrapper
const Reveal = ({ children, delay = 0, className = '' }) => {
  const [ref, isInView] = useInView()
  
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(30px)',
        transition: `all 0.6s ease ${delay}s`
      }}
    >
      {children}
    </div>
  )
}

// Counter animation
const Counter = ({ end, duration = 2000, suffix = '' }) => {
  const [count, setCount] = useState(0)
  const [ref, isInView] = useInView()

  useEffect(() => {
    if (!isInView) return
    
    let start = 0
    const increment = end / (duration / 16)
    
    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [isInView, end, duration])

  return <span ref={ref}>{count}{suffix}</span>
}

// Typewriter effect
const Typewriter = ({ text, speed = 50, delay = 0 }) => {
  const [displayText, setDisplayText] = useState('')
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      let i = 0
      const timer = setInterval(() => {
        if (i < text.length) {
          setDisplayText(text.slice(0, i + 1))
          i++
        } else {
          clearInterval(timer)
        }
      }, speed)
      
      return () => clearInterval(timer)
    }, delay)
    
    return () => clearTimeout(timeout)
  }, [text, speed, delay])

  return (
    <span>
      {displayText}
      <span style={{ 
        borderRight: '2px solid var(--primary)',
        animation: 'blink 1s infinite',
        marginLeft: '2px'
      }} />
      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </span>
  )
}

export default function App() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <Navigation scrolled={scrolled} />
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Education />
      <Contact />
      <Footer />
    </>
  )
}

// Navigation
function Navigation({ scrolled }) {
  return (
    <nav style={{ 
      background: scrolled ? 'rgba(2, 6, 23, 0.95)' : 'transparent',
      borderBottom: scrolled ? '1px solid var(--border)' : 'none'
    }}>
      <div className="container">
        <a href="#" className="nav-logo">GM</a>
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

// Hero Section
function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="hero-glow" />
      <div className="hero-glow-2" />
      <div className="container">
        <div className="hero-content">
          <Reveal>
            <span className="hero-badge">Disponible pour de nouvelles opportunités</span>
          </Reveal>
          
          <Reveal delay={0.1}>
            <h1>
              <span className="text-gradient">Gajanraj MOHANARAJ</span>
            </h1>
          </Reveal>
          
          <Reveal delay={0.2}>
            <p className="hero-subtitle">
              <Typewriter text="Consultant Cybersécurité & GRC" delay={800} />
            </p>
          </Reveal>
          
          <Reveal delay={0.3}>
            <p className="hero-description">
              Expert en gouvernance, risques et conformité avec 3 années d'expérience 
              en alternance. Spécialisé dans l'implémentation ISO 27001, la gestion 
              des risques tiers et les outils GRC pour les secteurs financier et défense.
            </p>
          </Reveal>

          <Reveal delay={0.4}>
            <div className="hero-stats">
              <div className="stat-item">
                <h3><Counter end={3} /></h3>
                <p>Années d'expérience</p>
              </div>
              <div className="stat-item">
                <h3><Counter end={2} /></h3>
                <p>Secteurs d'expertise</p>
              </div>
              <div className="stat-item">
                <h3><Counter end={10} suffix="+" /></h3>
                <p>Compétences techniques</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.5}>
            <div className="hero-buttons">
              <a href="#contact" className="btn btn-primary">Me contacter</a>
              <a href="#experience" className="btn btn-outline">Voir mon parcours</a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

// About Section
function About() {
  const items = [
    { icon: '📍', title: 'Localisation', value: 'Marly-La-Ville (95670)' },
    { icon: '🚗', title: 'Mobilité', value: 'Permis B, véhiculé' },
    { icon: '🌐', title: 'Langues', value: 'FR/Tamoul natif, Anglais C1' },
    { icon: '🎯', title: 'Intérêts', value: 'Guitare, MMA, Football' }
  ]

  return (
    <section id="about">
      <div className="container">
        <Reveal>
          <h2 className="text-gradient">À propos</h2>
        </Reveal>
        
        <div className="grid-2" style={{ alignItems: 'start', gap: '48px' }}>
          <Reveal delay={0.1}>
            <div>
              <p style={{ color: 'var(--gray)', lineHeight: 1.8, marginBottom: '24px' }}>
                Fort de trois années d'expérience en alternance dans l'informatique, 
                dont deux spécialisées en cybersécurité, j'ai développé une expertise 
                solide en gouvernance, risques et conformité (GRC).
              </p>
              <p style={{ color: 'var(--gray)', lineHeight: 1.8 }}>
                Actuellement consultant cybersécurité chez Wcomply, j'accompagne les 
                entreprises des secteurs financier et défense dans leur mise en conformité 
                et la sécurisation de leurs systèmes d'information.
              </p>
            </div>
          </Reveal>

          <div className="grid-2">
            {items.map((item, i) => (
              <Reveal key={i} delay={0.1 + i * 0.1}>
                <div className="card">
                  <span style={{ fontSize: '1.5rem', marginBottom: '12px', display: 'block' }}>
                    {item.icon}
                  </span>
                  <h4 style={{ marginBottom: '4px', fontSize: '0.9rem', color: 'var(--gray)' }}>
                    {item.title}
                  </h4>
                  <p style={{ fontWeight: 500 }}>{item.value}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// Skills Section
function Skills() {
  const categories = [
    {
      title: 'Cybersécurité & GRC',
      skills: [
        { name: 'ISO 27001', level: 95 },
        { name: 'ISO 27005', level: 85 },
        { name: 'EBIOS RM', level: 80 },
        { name: 'TPRM', level: 85 }
      ]
    },
    {
      title: 'Pentesting & Outils',
      skills: [
        { name: 'Metasploit', level: 90 },
        { name: 'Wireshark', level: 80 },
        { name: 'Linux Admin', level: 85 },
        { name: 'Analyse vulnérabilités', level: 80 }
      ]
    },
    {
      title: 'Développement',
      skills: [
        { name: 'PHP / Laravel', level: 85 },
        { name: 'React', level: 80 },
        { name: 'Node.js', level: 75 },
        { name: 'MySQL', level: 80 }
      ]
    },
    {
      title: 'Soft Skills',
      skills: [
        { name: 'Gestion de projet', level: 85 },
        { name: 'Communication', level: 90 },
        { name: 'Analyse des risques', level: 95 },
        { name: 'Travail en équipe', level: 95 }
      ]
    }
  ]

  return (
    <section id="skills" className="skills-section">
      <div className="container">
        <Reveal>
          <h2 className="text-gradient">Compétences</h2>
        </Reveal>
        
        <div className="grid-2">
          {categories.map((cat, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="skill-category">
                <h3>{cat.title}</h3>
                <div className="skill-grid">
                  {cat.skills.map((skill, j) => (
                    <SkillItem key={j} skill={skill} delay={i * 0.1 + j * 0.05} />
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

function SkillItem({ skill, delay }) {
  const [ref, isInView] = useInView()
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (isInView) {
      setTimeout(() => setWidth(skill.level), delay * 1000)
    }
  }, [isInView, skill.level, delay])

  return (
    <div ref={ref} className="skill-item" style={{ position: 'relative', overflow: 'hidden' }}>
      <div 
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: `${width}%`,
          background: 'rgba(14, 165, 233, 0.1)',
          transition: 'width 1s ease'
        }}
      />
      <span style={{ position: 'relative' }}>{skill.name}</span>
      <span style={{ position: 'relative' }}>{skill.level}%</span>
    </div>
  )
}

// Experience Section
function Experience() {
  const experiences = [
    {
      date: '2024 - Présent',
      title: 'Consultant Cybersécurité',
      company: 'Wcomply',
      description: 'Accompagnement des entreprises du secteur financier et défense dans leur mise en conformité et gestion des risques. Implémentation ISO 27001, déploiement TPRM, paramétrage du module RISK, audits internes.'
    },
    {
      date: '2023 - 2024',
      title: 'Développeur Full-Stack',
      company: 'Agence Créative',
      description: 'Développement d\'applications web sécurisées avec Symfony et Laravel. Collaboration cross-fonctionnelle avec les équipes design et marketing. Optimisation des performances et bonnes pratiques de sécurité.'
    }
  ]

  return (
    <section id="experience">
      <div className="container">
        <Reveal>
          <h2 className="text-gradient">Expérience Professionnelle</h2>
        </Reveal>
        
        <div className="timeline">
          {experiences.map((exp, i) => (
            <Reveal key={i} delay={i * 0.2}>
              <div className="timeline-item">
                <span className="timeline-date">{exp.date}</span>
                <h3>{exp.title}</h3>
                <p className="timeline-company">{exp.company}</p>
                <p className="timeline-description">{exp.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// Education Section
function Education() {
  const education = [
    {
      date: 'En cours',
      title: 'Master Expert Management SI & Data',
      school: 'Epitech',
      description: 'Formation spécialisée en protection et sécurité des systèmes d\'information, gouvernance et gestion des risques dans l\'environnement digital.'
    },
    {
      date: 'Complété',
      title: 'Développeur Back-end',
      school: 'Epitech',
      description: 'Formation technique approfondie en développement back-end avec focus sur les architectures sécurisées et les bonnes pratiques.'
    },
    {
      date: 'Complété',
      title: 'Bachelor Cybersécurité',
      school: 'ESGI',
      description: 'Formation complète en cybersécurité couvrant les aspects techniques, juridiques et managériaux. Spécialisation analyse des risques.'
    }
  ]

  return (
    <section id="education" className="skills-section">
      <div className="container">
        <Reveal>
          <h2 className="text-gradient">Formation</h2>
        </Reveal>
        
        <div className="timeline">
          {education.map((edu, i) => (
            <Reveal key={i} delay={i * 0.2}>
              <div className="timeline-item">
                <span className="timeline-date">{edu.date}</span>
                <h3>{edu.title}</h3>
                <p className="timeline-company">{edu.school}</p>
                <p className="timeline-description">{edu.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// Contact Section
function Contact() {
  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <Reveal>
          <h2 className="text-gradient">Contact</h2>
          <p style={{ color: 'var(--gray)', maxWidth: '500px', margin: '0 auto' }}>
            Prêt à sécuriser votre infrastructure ? Contactez-moi pour discuter 
            de vos besoins en cybersécurité et GRC.
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="contact-info">
            <div className="contact-item">
              <div className="contact-icon">📧</div>
              <span className="text-sm text-gray">Email</span>
              <span>contact@gajanraj.dev</span>
            </div>
            <div className="contact-item">
              <div className="contact-icon">📍</div>
              <span className="text-sm text-gray">Localisation</span>
              <span>Île-de-France, France</span>
            </div>
            <div className="contact-item">
              <div className="contact-icon">💼</div>
              <span className="text-sm text-gray">LinkedIn</span>
              <span>linkedin.com/in/gajanraj</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// Footer
function Footer() {
  return (
    <footer>
      <div className="container">
        <p>© 2024 Gajanraj MOHANARAJ — Consultant Cybersécurité & GRC</p>
      </div>
    </footer>
  )
}