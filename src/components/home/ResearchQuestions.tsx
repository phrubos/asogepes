'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import styles from './ResearchQuestions.module.css'

// Kutatási kérdések adatai
const questions = [
  {
    number: '01',
    question: 'Milyen hatással van az ásógép a talajra?',
    answer: 'Tartósabb lazaság, jobb víz- és hőgazdálkodás',
    link: '/eredmenyek',
    linkText: 'Eredmények'
  },
  {
    number: '02',
    question: 'Hogyan változik a talajszerkezet egy szezon alatt?',
    answer: 'Stabilan marad intenzív öntözés mellett is',
    link: '/kutatas',
    linkText: 'Kutatás'
  },
  {
    number: '03',
    question: 'Önmagában vagy kombinálva jobb az ásógép?',
    answer: 'A szántás + ásógép kombináció a legstabilabb',
    link: '/technologia',
    linkText: 'Technológia'
  },
  {
    number: '04',
    question: 'Melyik művelési módszer a leghatékonyabb?',
    answer: 'Az ásógépes kezelések egyértelműen jobbak',
    link: '/eredmenyek',
    linkText: 'Eredmények'
  },
]

// Animációs variánsok
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2
    }
  }
}

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
}

// Kártya komponens 3D tilt effekttel
function QuestionCard({ question, index }: { question: typeof questions[0], index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg)')
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    const rotateX = (y - centerY) / 25  // max ~8deg
    const rotateY = (centerX - x) / 25
    
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`)
  }

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)')
    setIsHovered(false)
  }

  return (
    <motion.div
      ref={cardRef}
      className={styles.card}
      variants={cardVariants}
      style={{ transform }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Számozás */}
      <div className={styles.numberWrapper}>
        <motion.span 
          className={styles.number}
          animate={{ 
            color: isHovered ? 'rgba(212, 168, 75, 0.4)' : 'rgba(255, 255, 255, 0.08)' 
          }}
          transition={{ duration: 0.3 }}
        >
          {question.number}
        </motion.span>
      </div>

      {/* Tartalom */}
      <div className={styles.content}>
        <h3 className={styles.question}>{question.question}</h3>
        <p className={styles.answer}>{question.answer}</p>
      </div>

      {/* Link */}
      <Link href={question.link} className={styles.link}>
        <span>{question.linkText}</span>
        <motion.span
          className={styles.arrow}
          animate={{ x: isHovered ? 6 : 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <ArrowRight size={18} />
        </motion.span>
      </Link>

      {/* Hover glow */}
      <motion.div 
        className={styles.glow}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  )
}

export default function ResearchQuestions() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className={styles.section} ref={ref}>
      <div className="container">
        {/* Header */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.sectionLabel}>Kutatási kérdések</span>
          <h2 className={styles.title}>Mire kerestük a választ?</h2>
        </motion.div>

        {/* Grid */}
        <motion.div
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {questions.map((q, index) => (
            <QuestionCard key={q.number} question={q} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
