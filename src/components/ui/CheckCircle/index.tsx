import { motion, useReducedMotion } from 'motion/react'

interface CheckCircleProps {
  done: boolean
  onToggle: () => void
  size?: number
}

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M3 8L6.5 11.5L13 4.5"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function CheckCircle({ done, onToggle, size = 32 }: CheckCircleProps) {
  const shouldReduceMotion = useReducedMotion()

  const springTransition = {
    type: 'spring' as const,
    stiffness: 400,
    damping: 15,
  }

  const tapAnimation = shouldReduceMotion ? {} : { scale: 1.2 }
  const animateState = shouldReduceMotion
    ? { scale: 1 }
    : { scale: done ? [1, 1.2, 1] : 1 }

  return (
    <motion.button
      onClick={onToggle}
      animate={animateState}
      whileTap={tapAnimation}
      transition={springTransition}
      aria-pressed={done}
      aria-label={done ? '체크 해제' : '체크'}
      style={{ width: size, height: size }}
      className={[
        'rounded-full flex items-center justify-center flex-shrink-0',
        done
          ? 'bg-done'
          : 'bg-transparent border-2 border-ink-faint',
      ].join(' ')}
    >
      {done && <CheckIcon />}
    </motion.button>
  )
}
