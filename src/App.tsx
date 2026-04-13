import { Outlet, useLocation } from 'react-router'
import { AnimatePresence } from 'motion/react'
import BottomNav from './components/ui/BottomNav'
import PageTransition from './components/ui/PageTransition'

export default function App() {
  const location = useLocation()

  return (
    <div
      className="min-h-screen bg-bg text-ink font-body flex flex-col items-center"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <main className="pb-24 w-full max-w-md">
        <AnimatePresence mode="wait">
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </AnimatePresence>
      </main>
      <BottomNav />
    </div>
  )
}
