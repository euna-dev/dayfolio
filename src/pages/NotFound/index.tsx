import { Link } from 'react-router'

export default function NotFoundPage() {
  return (
    <div className="px-4 sm:px-6 py-16 text-center">
      <p className="font-display text-4xl mb-2">404</p>
      <p className="text-ink-muted mb-6">페이지를 찾을 수 없습니다</p>
      <Link to="/" className="text-accent underline underline-offset-4">
        Today로 돌아가기
      </Link>
    </div>
  )
}
