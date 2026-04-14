import { useHabitStore } from '../../../store/habitStore'
import { today } from '../../../lib/date'
import type { DayRecord } from '../../../types'

interface MoodOption {
  value: 1 | 2 | 3 | 4 | 5
  emoji: string
}

const MOOD_OPTIONS: MoodOption[] = [
  { value: 1, emoji: '😞' },
  { value: 2, emoji: '😐' },
  { value: 3, emoji: '😊' },
  { value: 4, emoji: '😄' },
  { value: 5, emoji: '😁' },
]

export default function MoodPicker() {
  const todayKey = today()
  const mood = useHabitStore((s) => s.getDayRecord(todayKey).mood)
  const updateMood = useHabitStore((s) => s.updateMood)

  function handleSelect(value: DayRecord['mood']) {
    if (mood === value) {
      updateMood(todayKey, null)
    } else {
      updateMood(todayKey, value)
    }
  }

  return (
    <div>
      <span className="text-ink-muted text-sm font-body">오늘 기분</span>
      <div className="flex gap-3 mt-3 justify-between">
        {MOOD_OPTIONS.map(({ value, emoji }) => {
          const isSelected = mood === value
          return (
            <button
              key={value}
              type="button"
              onClick={() => handleSelect(value)}
              aria-label={`기분 ${value}단계`}
              aria-pressed={isSelected}
              style={{ fontSize: '40px', lineHeight: 1 }}
              className={[
                'w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200',
                isSelected
                  ? 'bg-accent-soft scale-110 grayscale-0'
                  : 'bg-transparent hover:bg-surface-alt grayscale opacity-60 hover:opacity-100 hover:grayscale-0',
              ].join(' ')}
            >
              {emoji}
            </button>
          )
        })}
      </div>
    </div>
  )
}
