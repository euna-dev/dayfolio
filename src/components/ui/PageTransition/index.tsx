import { motion, useReducedMotion } from 'motion/react'

interface PageTransitionProps {
  children: React.ReactNode
}

const fullVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 8 },
}

const reducedVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

export default function PageTransition({ children }: PageTransitionProps) {
  const shouldReduceMotion = useReducedMotion()
  const variants = shouldReduceMotion ? reducedVariants : fullVariants

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="w-full"
    >
      {children}
    </motion.div>
  )
}
