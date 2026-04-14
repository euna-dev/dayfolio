import { format } from 'date-fns'
import { Link } from 'react-router'
import { today, fromDateKey } from '../../../lib/date'

export default function DateHeader() {
  const dateLabel = format(fromDateKey(today()), 'MMMM d')

  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-3xl sm:text-4xl font-display text-accent-hover leading-none">
        {dateLabel}
      </span>
      <Link
        to="/monthly"
        className="text-ink-muted text-sm font-body hover:text-accent transition-colors py-2 px-2 -mr-2 inline-flex items-center whitespace-nowrap"
      >
        Monthly →
      </Link>
    </div>
  )
}
