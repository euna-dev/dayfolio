import type { AppStorage } from '../types'

const STORAGE_KEY = 'dayfolio-v1'
const CURRENT_VERSION = 1

function defaultStorage(): AppStorage {
  return {
    version: CURRENT_VERSION,
    categories: [],
    habits: [],
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
    return old as AppStorage
  }

  // v0 → v1: 최초 마이그레이션 (기존 데이터 없는 경우)
  if (version < 1 && toVersion >= 1) {
    return defaultStorage()
  }

  return old as AppStorage
}

function isObject(val: unknown): val is Record<string, unknown> {
  return typeof val === 'object' && val !== null && !Array.isArray(val)
}
