import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useSettingsStore } from './store/settingsStore'
import ScannerPage from './pages/ScannerPage'
import ReviewPage from './pages/ReviewPage'
import ArchivePage from './pages/ArchivePage'
import DocumentDetailPage from './pages/DocumentDetailPage'
import ExportPage from './pages/ExportPage'
import SettingsPage from './pages/SettingsPage'
import Navbar from './components/shared/Navbar'
import { useEffect } from 'react'

function App() {
  const { theme } = useSettingsStore()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <Router>
      <div className='min-h-screen flex flex-col md:flex-row bg-surface text-text-primary transition-colors duration-200'>
        <Navbar />
        <main className='flex-1 w-full max-w-7xl mx-auto p-4 md:p-8'>
          <Routes>
            <Route path='/scan' element={<ScannerPage />} />
            <Route path='/review/:id' element={<ReviewPage />} />
            <Route path='/archive' element={<ArchivePage />} />
            <Route path='/document/:id' element={<DocumentDetailPage />} />
            <Route path='/export' element={<ExportPage />} />
            <Route path='/settings' element={<SettingsPage />} />
            <Route path='/' element={<Navigate to='/scan' replace />} />
          </Routes>
        </main>
        <Toaster position='bottom-right' />
      </div>
    </Router>
  )
}

export default App
