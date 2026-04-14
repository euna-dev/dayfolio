import { motion, useReducedMotion } from 'motion/react'
import { CheckCircle } from '../../ui/CheckCircle'
import type { Habit } from '../../../types'

interface HabitItemProps {
  habit: Habit
  done: boolean
  onToggle: () => void
  index: number
}

export default function HabitItem({ habit, done, onToggle, index }: HabitItemProps) {
  const shouldReduceMotion = useReducedMotion()

  const initial = shouldReduceMotion
    ? { opacity: 0 }
    : { opacity: 0, y: 8 }

  const animate = shouldReduceMotion
    ? { opacity: 1 }
    : { opacity: 1, y: 0 }

  const transition = shouldReduceMotion
    ? { duration: 0.25, ease: 'easeOut' as const }
    : { delay: index * 0.05, duration: 0.25, ease: 'easeOut' as const }

  return (
    <motion.li
      initial={initial}
      animate={animate}
      transition={transition}
      className="flex items-center gap-3 py-3"
    >
      <CheckCircle done={done} onToggle={onToggle} size={24} />
      <span
        className={[
          'font-body text-ink flex-1',
          done ? 'line-through text-ink-muted' : '',
        ].join(' ').trim()}
      >
        {habit.name}
      </span>
    </motion.li>
  )
}
