import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import type { Category, Habit, DayRecord, AppStorage } from '../types'
import { loadStorage, saveStorage } from '../lib/storage'
import { today, getDaysInMonth } from '../lib/date'

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
  getMonthScore: (habitId: string, year: number, month: number) => number
}

function emptyDayRecord(date: string): DayRecord {
  return { date, note: '', mood: null, sleepHours: null, checkIns: {} }
}

const initial = loadStorage()

export const useHabitStore = create<HabitStore>()(
  subscribeWithSelector((set, get) => ({
    categories: initial.categories,
    habits: initial.habits,
    records: initial.records,

    // 습관 CRUD
    addHabit: (habit) =>
      set((s) => ({
        habits: [
          ...s.habits,
          {
            ...habit,
            id: uuidv4(),
            createdAt: new Date().toISOString(),
            order: s.habits.length,
          },
        ],
      })),

    updateHabit: (id, updates) =>
      set((s) => ({
        habits: s.habits.map((h) => (h.id === id ? { ...h, ...updates } : h)),
      })),

    archiveHabit: (id) =>
      set((s) => ({
        habits: s.habits.map((h) =>
          h.id === id ? { ...h, archivedAt: new Date().toISOString() } : h
        ),
      })),

    reorderHabits: (ids) =>
      set((s) => ({
        habits: ids
          .map((id, order) => {
            const habit = s.habits.find((h) => h.id === id)
            return habit ? { ...habit, order } : null
          })
          .filter((h): h is Habit => h !== null),
      })),

    // 카테고리 CRUD
    addCategory: (category) =>
      set((s) => ({
        categories: [...s.categories, { ...category, id: uuidv4() }],
      })),

    updateCategory: (id, updates) =>
      set((s) => ({
        categories: s.categories.map((c) => (c.id === id ? { ...c, ...updates } : c)),
      })),

    deleteCategory: (id) =>
      set((s) => ({
        categories: s.categories.filter((c) => c.id !== id),
        habits: s.habits.map((h) =>
          h.categoryId === id ? { ...h, categoryId: '' } : h
        ),
      })),

    // 하루 기록
    toggleCheckIn: (date, habitId) =>
      set((s) => {
        const prev = s.records[date] ?? emptyDayRecord(date)
        return {
          records: {
            ...s.records,
            [date]: {
              ...prev,
              checkIns: { ...prev.checkIns, [habitId]: !prev.checkIns[habitId] },
            },
          },
        }
      }),

    updateNote: (date, note) =>
      set((s) => {
        const prev = s.records[date] ?? emptyDayRecord(date)
        return { records: { ...s.records, [date]: { ...prev, note } } }
      }),

    updateMood: (date, mood) =>
      set((s) => {
        const prev = s.records[date] ?? emptyDayRecord(date)
        return { records: { ...s.records, [date]: { ...prev, mood } } }
      }),

    updateSleep: (date, hours) =>
      set((s) => {
        const prev = s.records[date] ?? emptyDayRecord(date)
        return { records: { ...s.records, [date]: { ...prev, sleepHours: hours } } }
      }),

    // 셀렉터
    getDayRecord: (date) => get().records[date] ?? emptyDayRecord(date),

    getMonthRecords: (year, month) => {
      const keys = getDaysInMonth(year, month)
      const { records } = get()
      return Object.fromEntries(
        keys.map((key) => [key, records[key] ?? emptyDayRecord(key)])
      )
    },

    getStreak: (habitId) => {
      const { records } = get()
      const todayKey = today()
      const sortedKeys = Object.keys(records).sort()

      let current = 0
      let best = 0
      let streak = 0

      for (const key of sortedKeys) {
        if (records[key].checkIns[habitId]) {
          streak += 1
          if (streak > best) best = streak
          if (key === todayKey) current = streak
        } else {
          if (key < todayKey) streak = 0
        }
      }

      // 오늘 체크 안 했으면 어제까지 기준
      if (!records[todayKey]?.checkIns[habitId]) {
        current = streak
      }

      return { current, best }
    },

    getMonthScore: (habitId, year, month) => {
      const monthRecords = get().getMonthRecords(year, month)
      const days = Object.keys(monthRecords)
      if (days.length === 0) return 0

      const done = days.filter((d) => monthRecords[d].checkIns[habitId]).length
      return Math.round((done / days.length) * 100)
    },
  }))
)

// localStorage 자동 저장
useHabitStore.subscribe((state) => {
  const data: AppStorage = {
    version: 1,
    categories: state.categories,
    habits: state.habits,
    records: state.records,
  }
  saveStorage(data)
})
