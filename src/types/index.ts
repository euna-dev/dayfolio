/** 카테고리 */
export interface Category {
  id: string // uuid
  name: string // "건강", "학습"
  color: string // hex, --color-accent 계열
  icon?: string // 이모지 "🌿"
}

/** 습관 */
export interface Habit {
  id: string // uuid
  name: string
  categoryId: string // Category.id 참조
  tags: string[]
  reminderTime?: string // "08:00" | undefined
  order: number // 정렬 순서
  createdAt: string // ISO 8601
  archivedAt?: string // 보관된 습관
}

/** 하루 기록 */
export interface DayRecord {
  date: string // "2026-04-01" (키)
  note: string
  mood: 1 | 2 | 3 | 4 | 5 | null // 1=최저 5=최고
  sleepHours: number | null // 0.5 단위, 0~12
  checkIns: {
    [habitId: string]: boolean
  }
}

/** localStorage 전체 구조 */
export interface AppStorage {
  version: number
  categories: Category[]
  habits: Habit[]
  records: {
    [date: string]: DayRecord // "2026-04-01": DayRecord
  }
}
