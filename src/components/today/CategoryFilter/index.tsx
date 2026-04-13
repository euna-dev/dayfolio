import { useHabitStore } from '../../../store/habitStore'
import type { Category } from '../../../types'

interface CategoryFilterProps {
  selectedCategoryId: string | null
  onChange: (categoryId: string | null) => void
}

export default function CategoryFilter({ selectedCategoryId, onChange }: CategoryFilterProps) {
  const categories = useHabitStore((s) => s.categories)

  const baseClass =
    'px-4 py-2 rounded-full text-sm font-body transition-colors whitespace-nowrap min-h-[36px]'
  const selectedClass = 'bg-accent-soft text-accent'
  const unselectedClass = 'bg-surface text-ink-muted hover:text-ink'

  return (
    <div className="flex gap-2 overflow-x-auto -mx-4 sm:-mx-6 px-4 sm:px-6 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <button
        type="button"
        className={`${baseClass} ${selectedCategoryId === null ? selectedClass : unselectedClass}`}
        onClick={() => onChange(null)}
      >
        전체
      </button>
      {categories.map((category: Category) => (
        <button
          key={category.id}
          type="button"
          className={`${baseClass} ${selectedCategoryId === category.id ? selectedClass : unselectedClass}`}
          onClick={() => onChange(category.id)}
        >
          {category.icon ? `${category.icon} ` : ''}{category.name}
        </button>
      ))}
    </div>
  )
}
