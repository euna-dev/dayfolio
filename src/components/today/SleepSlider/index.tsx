import { useHabitStore } from '../../../store/habitStore'
import { today } from '../../../lib/date'
import './sleep-slider.css'

export default function SleepSlider() {
  const todayKey = today()
  const sleepHours = useHabitStore((s) => s.getDayRecord(todayKey).sleepHours)
  const updateSleep = useHabitStore((s) => s.updateSleep)

  const displayValue = sleepHours !== null ? `${sleepHours}h` : '—'
  const sliderValue = sleepHours !== null ? sleepHours : 0

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    updateSleep(todayKey, Number(e.target.value))
  }

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-ink-muted text-sm font-body">수면</span>
        <span className="font-mono text-ink">{displayValue}</span>
      </div>
      <input
        type="range"
        min={0}
        max={12}
        step={0.5}
        value={sliderValue}
        onChange={handleChange}
        className="sleep-slider w-full"
      />
    </div>
  )
}
