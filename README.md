# dayfolio

Bullet Journal 스타일 PWA 습관 트래커.
매일 체크인하고, Monthly Spread로 한 달을 한눈에.

---

## 화면 구성

| 경로 | 화면 | 설명 |
|------|------|------|
| `/` | Today | 오늘 습관 체크인, 메모, 기분/수면 기록 |
| `/monthly` | Monthly Spread | 이번 달 Daily Log + Habit Grid |
| `/stats` | 통계 | 달성률 차트, 스트릭 현황 |
| `/settings` | 설정 | 습관/카테고리 관리, 리마인더 |

## 기술 스택

- **React 19** + TypeScript + Vite 6
- **Zustand** — 단일 store, localStorage 퍼시스턴스
- **Tailwind CSS v4** — `@theme` 기반 디자인 토큰
- **Motion** (`motion/react`) — 페이지 전환 & 인터랙션
- **date-fns** — 날짜 처리
- **Recharts** — 통계 차트
- **PWA** (`vite-plugin-pwa`) — 홈화면 설치, 오프라인

## 시작하기

```bash
pnpm install
pnpm dev
```

## 빌드

```bash
pnpm build
pnpm preview
```

## 문서

- [PRD](docs/PRD.md) — 제품 요구사항
- [SPEC](docs/SPEC.md) — 기술 스펙 (데이터 모델, Store, API)
- [CLAUDE.md](CLAUDE.md) — 개발 규칙 및 디자인 시스템
