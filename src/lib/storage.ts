import type { AppStorage } from '../types'

const STORAGE_KEY = 'dayfolio-v1'
const CURRENT_VERSION = 1

function defaultStorage(): AppStorage {
  const now = new Date().toISOString()
  return {
    version: CURRENT_VERSION,
    categories: [
      { id: 'cat-health', name: '건강', color: '#839958', icon: '🌿' },
      { id: 'cat-learn', name: '학습', color: '#839958', icon: '📚' },
      { id: 'cat-mind', name: '마음', color: '#839958', icon: '🧘' },
    ],
    habits: [
      {
        id: 'habit-water',
        name: '물 2L 마시기',
        categoryId: 'cat-health',
        tags: [],
        order: 0,
        createdAt: now,
      },
      {
        id: 'habit-walk',
        name: '30분 산책',
        categoryId: 'cat-health',
        tags: [],
        order: 1,
        createdAt: now,
      },
      {
        id: 'habit-read',
        name: '독서 20페이지',
        categoryId: 'cat-learn',
        tags: [],
        order: 2,
        createdAt: now,
      },
      {
        id: 'habit-english',
        name: '영어 단어 10개',
        categoryId: 'cat-learn',
        tags: [],
        order: 3,
        createdAt: now,
      },
      {
        id: 'habit-meditate',
        name: '명상 10분',
        categoryId: 'cat-mind',
        tags: [],
        order: 4,
        createdAt: now,
      },
    ],
    records: {},
  }
}

export function loadStorage(): AppStorage {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultStorage()

    const parsed: unknown = JSON.parse(raw)
    return migrate(parsed, CURRENT_VERSION)
  } catch {
    return defaultStorage()
  }
}

export function saveStorage(data: AppStorage): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // localStorage 쓰기 실패 (용량 초과 등) — 무시
  }
}

export function migrate(old: unknown, toVersion: number): AppStorage {
  if (!isObject(old)) return defaultStorage()

  const version = typeof old.version === 'number' ? old.version : 0

  if (version === toVersion) {
    return old as unknown as AppStorage
  }

  // v0 → v1: 최초 마이그레이션 (기존 데이터 없는 경우)
  if (version < 1 && toVersion >= 1) {
    return defaultStorage()
  }

  return old as unknown as AppStorage
}

function isObject(val: unknown): val is Record<string, unknown> {
  return typeof val === 'object' && val !== null && !Array.isArray(val)
}
