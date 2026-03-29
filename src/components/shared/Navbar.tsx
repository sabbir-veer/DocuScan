import { NavLink } from 'react-router-dom'
import { Camera, Archive, Download, Settings, Sparkles } from 'lucide-react'

const navItems = [
  { path: '/scan', icon: Camera, label: 'Scan' },
  { path: '/archive', icon: Archive, label: 'Archive' },
  { path: '/export', icon: Download, label: 'Export' },
  { path: '/settings', icon: Settings, label: 'Settings' }
]

export default function Navbar() {
  return (
    <nav className='fixed bottom-0 left-0 w-full md:relative md:w-64 md:h-screen bg-surface dark:bg-surface-alt border-t md:border-t-0 md:border-r border-border z-50'>
      <div className='flex flex-col h-full'>
        <div className='hidden md:flex items-center gap-3 p-6 mb-4'>
          <div className='bg-brand rounded-lg p-2'>
            <Sparkles className='w-6 h-6 text-white' />
          </div>
          <h1 className='text-xl font-bold text-text-primary'>DocuScan</h1>
        </div>

        <div className='flex md:flex-col justify-around md:justify-start flex-1 px-4 py-2 md:py-0 md:gap-2'>
          {navItems.map(({ path, icon: Icon, label }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) => `
                flex flex-col md:flex-row items-center gap-1 md:gap-3 p-2 md:px-4 md:py-3 rounded-xl transition-all
                ${
                  isActive
                    ? 'text-brand bg-brand/10 dark:bg-brand/20 font-medium'
                    : 'text-text-secondary hover:bg-surface-alt dark:hover:bg-brand/5'
                }
              `}>
              <Icon className='w-6 h-6 md:w-5 md:h-5' />
              <span className='text-[10px] md:text-sm font-medium'>
                {label}
              </span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}
