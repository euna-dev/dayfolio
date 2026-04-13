import { useHabitStore } from '../../../store/habitStore'
import { today } from '../../../lib/date'
import HabitItem from '../HabitItem'

interface HabitListProps {
  selectedCategoryId: string | null
}

export default function HabitList({ selectedCategoryId }: HabitListProps) {
  const todayKey = today()
  const habits = useHabitStore((s) => s.habits)
  const toggleCheckIn = useHabitStore((s) => s.toggleCheckIn)
  const checkIns = useHabitStore((s) => s.records[todayKey]?.checkIns)

  const filtered = habits
    .filter((h) => !h.archivedAt)
    .filter((h) => selectedCategoryId === null || h.categoryId === selectedCategoryId)
    .sort((a, b) => a.order - b.order)

  if (filtered.length === 0) {
    return (
      <p className="text-ink-muted text-sm py-6 text-center">습관이 없습니다</p>
    )
  }

  return (
    <ul>
      {filtered.map((habit, index) => (
        <HabitItem
          key={habit.id}
          habit={habit}
          done={checkIns?.[habit.id] ?? false}
          onToggle={() => toggleCheckIn(todayKey, habit.id)}
          index={index}
        />
      ))}
    </ul>
  )
}
