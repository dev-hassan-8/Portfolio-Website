import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
  delay?: number
  id?: string
}

export function FadeIn({ children, className = '', delay = 0, id }: Props) {
  return (
    <motion.div
      id={id}
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, delay, ease: [0.25, 1, 0.5, 1] }}
    >
      {children}
    </motion.div>
  )
}
