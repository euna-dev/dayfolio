import { motion, useReducedMotion } from 'motion/react'

interface CheckCircleProps {
  done: boolean
  onToggle: () => void
  size?: number
}

export function CheckCircle({ done, onToggle, size = 24 }: CheckCircleProps) {
  const shouldReduceMotion = useReducedMotion()

  const spring = {
    type: 'spring' as const,
    stiffness: 500,
    damping: 22,
  }

  return (
    <motion.button
      type="button"
      onClick={onToggle}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.88 }}
      transition={spring}
      aria-pressed={done}
      aria-label={done ? '체크 해제' : '체크'}
      style={{ width: size, height: size }}
      className="relative rounded-full flex items-center justify-center flex-shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
    >
      {/* 바깥 링 — 항상 존재, done 상태에 따라 색 전환 */}
      <motion.span
        aria-hidden="true"
        className="absolute inset-0 rounded-full border-[1.5px]"
        animate={{
          borderColor: done
            ? 'var(--color-accent)'
            : 'var(--color-ink-faint)',
          backgroundColor: done
            ? 'var(--color-accent)'
            : 'var(--color-surface)',
        }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      />

      {/* 체크 아이콘 */}
      <motion.svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        className="relative z-10 text-surface"
        style={{ width: size * 0.5, height: size * 0.5 }}
        initial={false}
        animate={
          shouldReduceMotion
            ? { opacity: done ? 1 : 0 }
            : { opacity: done ? 1 : 0, scale: done ? 1 : 0.4 }
        }
        transition={spring}
      >
        <motion.path
          d="M5 12.5 L10 17.5 L19 7.5"
          strokeWidth={2.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={false}
          animate={{ pathLength: done ? 1 : 0 }}
          transition={{ duration: 0.35, ease: 'easeOut', delay: done ? 0.05 : 0 }}
        />
      </motion.svg>
    </motion.button>
  )
}
