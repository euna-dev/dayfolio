import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns'

/** 오늘 날짜를 "yyyy-MM-dd" 형식으로 반환 */
export const today = (): string => format(new Date(), 'yyyy-MM-dd')

/** Date → "yyyy-MM-dd" 키 */
export const toDateKey = (date: Date): string => format(date, 'yyyy-MM-dd')

/** "yyyy-MM-dd" 키 → Date */
export const fromDateKey = (key: string): Date => parseISO(key)

/** 특정 월의 모든 날짜 키 배열 반환 */
export const getDaysInMonth = (year: number, month: number): string[] =>
  eachDayOfInterval({
    start: startOfMonth(new Date(year, month - 1)),
    end: endOfMonth(new Date(year, month - 1)),
  }).map(toDateKey)
