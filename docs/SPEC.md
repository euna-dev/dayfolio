# SPEC.md — dayfolio 기술 스펙

## 1. 데이터 모델

```typescript
// types/index.ts

/** 카테고리 */
interface Category {
  id: string           // uuid
  name: string         // "건강", "학습"
  color: string        // "#3D6B4F" (hex, --color-accent 계열)
  icon?: string        // 이모지 "🌿"
}

/** 습관 */
interface Habit {
  id: string           // uuid
  name: string         // "이동"
  categoryId: string   // Category.id 참조
  tags: string[]       // ["morning", "health"]
  reminderTime?: string // "08:00" | undefined
  order: number        // 정렬 순서
  createdAt: string    // "2026-04-01T00:00:00.000Z"
  archivedAt?: string  // 보관된 습관
}

/** 하루 기록 */
interface DayRecord {
  date: string                      // "2026-04-01" (키)
  note: string                      // 텍스트 메모
  mood: 1 | 2 | 3 | 4 | 5 | null  // 1=최저 5=최고
  sleepHours: number | null         // 0.5 단위, 0~12
  checkIns: {
    [habitId: string]: boolean
  }
}

/** localStorage 전체 구조 */
interface AppStorage {
  version: number
  categories: Category[]
  habits: Habit[]
  records: {
    [date: string]: DayRecord       // "2026-04-01": DayRecord
  }
}
```

---

## 2. Zustand Store

```typescript
// store/habitStore.ts
import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

interface HabitStore {
  // 상태
  categories: Category[]
  habits: Habit[]
  records: Record<string, DayRecord>

  // 습관 CRUD
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'order'>) => void
  updateHabit: (id: string, updates: Partial<Habit>) => void
  archiveHabit: (id: string) => void
  reorderHabits: (ids: string[]) => void

  // 카테고리 CRUD
  addCategory: (category: Omit<Category, 'id'>) => void
  updateCategory: (id: string, updates: Partial<Category>) => void
  deleteCategory: (id: string) => void

  // 하루 기록
  toggleCheckIn: (date: string, habitId: string) => void
  updateNote: (date: string, note: string) => void
  updateMood: (date: string, mood: DayRecord['mood']) => void
  updateSleep: (date: string, hours: number | null) => void

  // 셀렉터
  getDayRecord: (date: string) => DayRecord
  getMonthRecords: (year: number, month: number) => Record<string, DayRecord>
  getStreak: (habitId: string) => { current: number; best: number }
  getMonthScore: (habitId: string, year: number, month: number) => number // 0~100
}

// localStorage 자동 저장: subscribeWithSelector로 store 변경 감지
```

---

## 3. localStorage 스키마

```typescript
// lib/storage.ts
const STORAGE_KEY = 'dayfolio-v1'

export function loadStorage(): AppStorage
export function saveStorage(data: AppStorage): void
export function migrate(old: unknown, toVersion: number): AppStorage
```

---

## 4. 날짜 유틸

```typescript
// lib/date.ts
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns'

export const today = (): string =>
  format(new Date(), 'yyyy-MM-dd')

export const toDateKey = (date: Date): string =>
  format(date, 'yyyy-MM-dd')

export const fromDateKey = (key: string): Date =>
  parseISO(key)

export const getDaysInMonth = (year: number, month: number): string[] =>
  eachDayOfInterval({
    start: startOfMonth(new Date(year, month - 1)),
    end: endOfMonth(new Date(year, month - 1)),
  }).map(toDateKey)
```

---

## 5. 스트릭 계산

```typescript
// lib/streak.ts

/**
 * 특정 습관의 현재/최고 스트릭 계산
 * - 오늘 체크 안 했으면 이전까지 카운트
 * - 연속 체크 기준: 하루도 빠짐없이
 */
export function calculateStreak(
  records: Record<string, DayRecord>,
  habitId: string,
  todayKey: string
): { current: number; best: number }
```

---

## 6. 화면 전환 & 애니메이션

```tsx
// components/ui/PageTransition/index.tsx
import { motion, AnimatePresence } from 'motion/react'

const variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -8 },
}

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
```

```tsx
// 체크인 탭 후 spring animation 예시
<motion.button
  whileTap={{ scale: 0.88 }}
  animate={done ? { scale: [1, 1.2, 1] } : {}}
  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
>
```

---

## 7. Monthly Spread 레이아웃

```css
/* Monthly.module.css */

.spread {
  display: grid;
  grid-template-columns: 1fr 1fr;  /* 데스크탑: 양면 */
  gap: 0;
}

/* 모바일: 탭 전환 */
@media (max-width: 767px) {
  .spread {
    grid-template-columns: 1fr;
  }
  .page {
    display: none;
  }
  .page.active {
    display: block;
  }
}
```

Habit Grid는 CSS Grid로 구현 (HTML `<table>` 금지):
```css
.habitGrid {
  display: grid;
  grid-template-columns: 80px repeat(var(--days-count), 1fr) 44px;
  /* 습관명 | 날짜별 칸 | score */
}
```

---

## 8. PWA 설정

```typescript
// vite.config.ts
import { VitePWA } from 'vite-plugin-pwa'

VitePWA({
  registerType: 'autoUpdate',
  manifest: {
    name: 'dayfolio',
    short_name: 'dayfolio',
    display: 'standalone',
    orientation: 'portrait',
    theme_color: '#3D6B4F',
    background_color: '#F7F4EF',
    start_url: '/',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
    runtimeCaching: [{
      urlPattern: /^https:\/\/fonts\.googleapis\.com/,
      handler: 'CacheFirst',
    }],
  },
})
```

---

## 9. 주요 라이브러리

| 라이브러리 | 버전 | 용도 |
|-----------|------|------|
| react | 19.x | UI |
| react-dom | 19.x | DOM |
| react-router | 7.x | 라우팅 |
| typescript | 5.x | 타입 |
| vite | 6.x | 번들러 |
| zustand | 5.x | 상태관리 |
| motion | 12.x | 애니메이션 |
| date-fns | 4.x | 날짜 |
| recharts | 2.x | 통계 차트 |
| vite-plugin-pwa | 0.21.x | PWA |
| uuid | 11.x | ID 생성 |

---

## 10. 미결 사항 (개발 전 결정 필요)

| 항목 | 옵션 | 결정 |
|------|------|------|
| 앱 이름 | 미정 | ☐ |
| 스트릭 끊김 | 즉시 리셋 | ☐ |
| 기분 표현 | 이모지 5종 | ☐ |
| 수면 입력 UI | 슬라이더 (0.5h 단위) | ☐ |
