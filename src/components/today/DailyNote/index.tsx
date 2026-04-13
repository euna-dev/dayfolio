import { useState, useEffect } from 'react'
import { useHabitStore } from '../../../store/habitStore'
import { today } from '../../../lib/date'

export default function DailyNote() {
  const todayKey = today()
  const note = useHabitStore((s) => s.records[todayKey]?.note ?? '')
  const updateNote = useHabitStore((s) => s.updateNote)

  const [draft, setDraft] = useState(note)

  useEffect(() => {
    setDraft(note)
  }, [note])

  function commit() {
    if (draft !== note) {
      updateNote(todayKey, draft)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.currentTarget.blur()
    } else if (e.key === 'Escape') {
      setDraft(note)
      e.currentTarget.blur()
    }
  }

  return (
    <input
      type="text"
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={handleKeyDown}
      placeholder="오늘 하루를 한 줄로..."
      className="w-full py-3 px-4 rounded-md bg-surface font-body text-ink text-sm leading-relaxed outline-none placeholder:text-ink-faint"
    />
  )
}
