import { useState } from 'react'
import DateHeader from '../../components/today/DateHeader'
import DailyNote from '../../components/today/DailyNote'
import CategoryFilter from '../../components/today/CategoryFilter'
import HabitList from '../../components/today/HabitList'
import MoodPicker from '../../components/today/MoodPicker'
import SleepSlider from '../../components/today/SleepSlider'

export default function TodayPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)

  return (
    <div className="px-4 sm:px-6 pt-10 sm:pt-14 pb-10 space-y-7 sm:space-y-9">
      <DateHeader />
      <DailyNote />
      <div className="space-y-4">
        <CategoryFilter
          selectedCategoryId={selectedCategoryId}
          onChange={setSelectedCategoryId}
        />
        <HabitList selectedCategoryId={selectedCategoryId} />
      </div>
      <div className="pt-6 border-t border-dashed border-ink-faint space-y-7">
        <MoodPicker />
        <SleepSlider />
      </div>
    </div>
  )
}
