# CLAUDE.md — dayfolio

## 프로젝트 개요
**dayfolio** — Bullet Journal 스타일 PWA 습관 트래커.
Today(메인) ↔ Monthly Spread 연동 구조.
데이터는 하나, 뷰만 두 개.

## 기술 스택
- **패키지 매니저**: pnpm
- **Framework**: React 19 + TypeScript + Vite
- **라우팅**: React Router v7
- **스타일**: Tailwind CSS v4 + CSS Variables
- **상태관리**: Zustand + localStorage 퍼시스턴스
- **차트**: Recharts
- **PWA**: vite-plugin-pwa
- **애니메이션**: Motion (`motion/react`)
- **날짜**: date-fns
- **배포**: Vercel

## 패키지 매니저 규칙
- **pnpm만 사용** — npm, yarn, bun 혼용 금지
- `package-lock.json`, `yarn.lock` 생성 금지 (`pnpm-lock.yaml`만 커밋)
- 패키지 추가: `pnpm add <pkg>`
- 개발 의존성: `pnpm add -D <pkg>`
- 스크립트 실행: `pnpm dev` / `pnpm build` / `pnpm preview`

## 초기 세팅 커맨드
```bash
pnpm create vite dayfolio --template react-ts
cd dayfolio
pnpm add react-router zustand motion date-fns recharts uuid
pnpm add -D tailwindcss @tailwindcss/vite vite-plugin-pwa
```

Tailwind v4 Vite 설정:
```typescript
// vite.config.ts
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss(), /* vite-plugin-pwa */],
})
```

---

## 디자인 시스템 (frontend-design skill 기반)

### 핵심 방향
**Organic / Soft Editorial** — 종이 노트와 아날로그 로그 감성을 디지털로 재해석.
Bullet Journal에서 영감 받은 따뜻한 오프화이트 배경, 절제된 세리프 타이포그래피.
Generic AI 앱과 완전히 다른 결. 기억에 남는 한 가지: "디지털인데 아날로그 같다".

### 타이포그래피
```css
/* 절대 사용 금지: Inter, Roboto, Arial, Space Grotesk */
--font-display: 'DM Serif Display', Georgia, serif;  /* 헤더, 날짜, 타이틀 */
--font-body:    'Lora', Georgia, serif;               /* 본문, 메모 입력 */
--font-mono:    'JetBrains Mono', monospace;          /* 숫자, 스코어, 날짜 숫자 */
```
Google Fonts CDN으로 import:
```
DM Serif Display:ital@0;1
Lora:ital,wght@0,400;0,500;1,400
JetBrains Mono:wght@400;500
```

### 컬러 팔레트 — Tailwind v4 테마 등록
```css
/* styles/global.css */
@import "tailwindcss";

@theme {
  /* 배경 — 종이 질감 */
  --color-bg:           #F7F4EF;
  --color-surface:      #FDFBF8;
  --color-surface-alt:  #F0EDE6;

  /* 잉크 */
  --color-ink:          #2C2825;
  --color-ink-muted:    #8C8279;
  --color-ink-faint:    #C4BDB5;

  /* 포인트 — 딥 포레스트 그린 하나만 */
  --color-accent:       #3D6B4F;
  --color-accent-soft:  #EAF2EB;
  --color-accent-hover: #2F5540;

  /* 상태 */
  --color-done:         #3D6B4F;
  --color-miss:         #E8E4DE;

  /* 폰트 */
  --font-display: 'DM Serif Display', Georgia, serif;
  --font-body:    'Lora', Georgia, serif;
  --font-mono:    'JetBrains Mono', monospace;

  /* 반경 */
  --radius-sm:  6px;
  --radius-md:  12px;
  --radius-lg:  20px;
}
```

`@theme` 등록 후 Tailwind 유틸리티로 바로 사용:
```html
<div class="bg-bg text-ink font-body rounded-md">
<button class="bg-accent text-surface hover:bg-accent-hover">
<span class="text-ink-muted font-mono">
```

Tailwind로 표현하기 어려운 세밀한 스타일은 `@layer components` 또는 인라인 `style` 속성으로 보완:
```css
@layer components {
  .card {
    box-shadow: 0 1px 3px rgba(44,40,37,0.08), 0 0 0 0.5px var(--color-border);
  }
  .divider-dashed {
    border-style: dashed;
    border-color: var(--color-border);
  }
}
```

### 모션 원칙
- 페이지 로드: staggered reveal (Motion으로, 아이템마다 0.05s delay)
- 체크인 터치: spring animation (scale 1→1.2→1, 피드백 느낌)
- 화면 전환: fade + translateY(8px) (200ms ease-out)
- 과도한 애니메이션 금지 — 화면당 핵심 1개만
- `prefers-reduced-motion` 미디어쿼리 반드시 대응

### 텍스처 & 분위기
- 배경에 미세한 SVG 노이즈 패턴 (opacity 0.03)
- 카드: `box-shadow: 0 1px 3px rgba(44,40,37,0.08), 0 0 0 0.5px var(--color-border)`
- 구분선은 `border-style: dashed` 선호 (노트 느낌)
- 체크 UI: 원형 버튼, done 상태에 작은 체크 아이콘 + 그린 fill

---

## 디렉토리 구조
```
src/
├── main.tsx
├── App.tsx
├── router.tsx
├── pages/
│   ├── Today/
│   │   └── index.tsx
│   ├── Monthly/
│   │   └── index.tsx
│   ├── Stats/
│   │   └── index.tsx
│   └── Settings/
│       └── index.tsx
├── components/
│   ├── today/
│   │   ├── HabitItem/
│   │   ├── DailyNote/
│   │   └── MoodSleep/
│   ├── monthly/
│   │   ├── DailyLog/        # 왼쪽: 날짜 + 텍스트 메모
│   │   └── HabitGrid/       # 오른쪽: 습관 그리드
│   ├── stats/
│   │   └── StatsChart/
│   └── ui/
│       ├── Button/
│       ├── CheckCircle/     # 커스텀 원형 체크 UI
│       ├── PageTransition/  # Motion 래퍼
│       └── BottomNav/       # 하단 탭 네비게이션
├── store/
│   └── habitStore.ts        # Zustand (단일 소스)
├── types/
│   └── index.ts
├── lib/
│   ├── storage.ts
│   ├── streak.ts
│   └── date.ts
├── hooks/
│   └── useToday.ts
└── styles/
    └── global.css           # @import "tailwindcss", @theme, @layer components, 폰트 import
```

---

## 핵심 규칙

### 데이터
- **단일 store**: `habitStore.ts` 하나가 모든 상태 관리
- Today와 Monthly는 같은 store를 바라보는 뷰
- 날짜 키: `"2026-04-01"` (ISO 8601, 항상 이 형식)

### 컴포넌트
- 컴포넌트명 PascalCase
- props 타입은 반드시 `interface`로 명시
- CSS Modules 사용, 인라인 style 최소화
- 스타일은 반드시 CSS Variables 참조

### 스타일
- 모바일 퍼스트 (375px 기준 → 768px 확장)
- Tailwind 유틸리티 클래스 우선 사용
- 커스텀 컬러/폰트/반경은 `@theme`에 등록된 변수만 사용
- Tailwind로 표현 어려운 스타일은 `@layer components` 또는 인라인 `style`로 보완
- 하드코딩 색상값(`#3D6B4F` 등) 직접 클래스/스타일에 사용 금지 — 반드시 변수 경유
- Monthly 모바일: HTML `<table>` 금지 → CSS Grid (`grid` 유틸리티) 사용

### 날짜
- 모든 날짜는 `date-fns` 사용
- `new Date()` 직접 사용 금지 → `lib/date.ts` 유틸 경유

### 애니메이션
- `import { motion, AnimatePresence } from 'motion/react'`
- 페이지 전환: `PageTransition` 컴포넌트로 통일

---

## 개발 순서 (Phase 1 MVP)
1. `styles/global.css` — CSS Variables, 폰트, reset
2. `types/index.ts` — 전체 타입 정의
3. `store/habitStore.ts` — Zustand store
4. `lib/storage.ts` — localStorage 연동
5. Today 페이지 구현
6. Monthly Spread 구현
7. Today ↔ Monthly 연동 확인
8. `lib/streak.ts` — 스트릭 계산
9. PWA 설정 (`vite-plugin-pwa`)

## 커밋 컨벤션

Conventional Commits 기반. 형식: `<type>(<scope>): <subject>`

### 타입
| 타입 | 설명 | 예시 |
|------|------|------|
| `feat` | 새기능 | `feat(today): 체크인 터치 구현` |
| `fix` | 버그 수정 | `fix(monthly): 오늘 날짜 하이라이트 누락` |
| `style` | UI/CSS 변경 (기능 무관) | `style(habit-item): 체크 애니메이션 조정` |
| `refactor` | 리팩토링 | `refactor(store): 셀렉터 분리` |
| `chore` | 설정, 의존성, 빌드 | `chore: vite-plugin-pwa 설정 추가` |
| `docs` | 문서 수정 | `docs: SPEC.md 데이터 모델 업데이트` |
| `test` | 테스트 추가/수정 | `test(streak): 스트릭 계산 엣지케이스` |
| `perf` | 성능 개선 | `perf(monthly): 그리드 렌더 최적화` |

### 스코프 (주요 영역)
`today` `monthly` `stats` `settings` `store` `ui` `pwa` `style`

### 규칙
- subject는 한국어 또는 영어, 명령문으로 작성 (동사 시작 또는 ~구현, ~수정)
- 제목 뒤에 마침표 금지
- 제목 72자 이내
- 본문이 필요하면 빈 줄 한 칸 후 작성

## 브랜치 & PR 규칙

### 브랜치 네이밍
이슈 타입과 번호를 조합: `<type>/<issue-number>`

| 예시 | 설명 |
|------|------|
| `feat/5` | 기능 구현 이슈 #5 |
| `fix/12` | 버그 수정 이슈 #12 |
| `chore/1` | 설정/빌드 이슈 #1 |
| `style/3` | 스타일 이슈 #3 |

### PR 규칙
- **base 브랜치**: 항상 `dev` (main 직접 PR 금지)
- **PR 템플릿** 반드시 사용 (`.github/PULL_REQUEST_TEMPLATE.md`)
- 이슈 번호 연결: `closes #<issue-number>`

## 스펙 참조
- PRD: `docs/PRD.md`
- 기술 스펙: `docs/SPEC.md`

## 하지 말 것
- `any` 타입 금지
- `console.log` 커밋 금지
- 컴포넌트 내부 직접 localStorage 접근 금지
- Inter, Roboto, Arial 등 generic 폰트 금지
- 하드코딩 색상값 직접 사용 금지 (`@theme` 변수 경유)
- npm, yarn, bun 사용 금지 (pnpm만)
- `package-lock.json`, `yarn.lock` 생성 금지
