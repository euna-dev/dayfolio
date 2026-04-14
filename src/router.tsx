import { createBrowserRouter } from 'react-router'
import RootLayout from './App'
import TodayPage from './pages/Today'
import MonthlyPage from './pages/Monthly'
import StatsPage from './pages/Stats'
import SettingsPage from './pages/Settings'
import NotFoundPage from './pages/NotFound'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, Component: TodayPage },
      { path: 'monthly', Component: MonthlyPage },
      { path: 'stats', Component: StatsPage },
      { path: 'settings', Component: SettingsPage },
      { path: '*', Component: NotFoundPage },
    ],
  },
])
