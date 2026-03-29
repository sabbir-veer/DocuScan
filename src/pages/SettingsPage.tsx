import { useSettingsStore } from '../store/settingsStore'
import {
  Settings,
  Key,
  Globe,
  Moon,
  Sun,
  Database,
  Trash2,
  ShieldCheck,
  Sparkles
} from 'lucide-react'
import { db } from '../db/schema'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const {
    geminiApiKey,
    setGeminiApiKey,
    language,
    setLanguage,
    theme,
    toggleTheme
  } = useSettingsStore()

  const handleClearData = async () => {
    if (
      !confirm(
        'This will permanently delete all your documents and data. Are you sure?'
      )
    )
      return
    await db.documents.clear()
    localStorage.clear()
    location.reload()
  }

  return (
    <div className='flex flex-col gap-8 max-w-4xl mx-auto pb-24'>
      <div className='flex flex-col gap-2'>
        <h1 className='text-3xl font-bold text-text-primary dark:text-[#f1f3f9]'>
          Settings
        </h1>
        <p className='text-text-secondary'>
          Manage your preferences and API configuration
        </p>
      </div>

      <div className='grid grid-cols-1 gap-6'>
        {/* API Configuration */}
        <section className='bg-surface dark:bg-surface-alt rounded-3xl border border-border shadow-sm p-8'>
          <div className='flex items-center gap-3 mb-6'>
            <div className='bg-brand/10 p-3 rounded-2xl'>
              <Key className='w-6 h-6 text-brand' />
            </div>
            <div>
              <h2 className='text-lg font-bold text-text-primary'>
                Gemini API Key
              </h2>
              <p className='text-xs text-text-secondary'>
                Required for document classification and data extraction
              </p>
            </div>
          </div>

          <div className='flex flex-col gap-4'>
            <div className='relative'>
              <input
                type='password'
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
                placeholder='AIzaSy...'
                className='w-full pl-4 pr-12 py-4 rounded-xl bg-surface-alt dark:bg-brand/5 border border-border focus:ring-2 focus:ring-brand/20 outline-none transition-all font-mono text-sm'
              />
              <ShieldCheck
                className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 ${geminiApiKey ? 'text-success' : 'text-text-muted'}`}
              />
            </div>
            <p className='text-[10px] text-text-muted px-2'>
              Your API key is stored locally in your browser and is never sent
              to our servers.
            </p>
          </div>
        </section>

        {/* Preferences */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <section className='bg-surface dark:bg-surface-alt rounded-3xl border border-border shadow-sm p-8'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='bg-brand/10 p-3 rounded-2xl'>
                <Globe className='w-6 h-6 text-brand' />
              </div>
              <h2 className='text-lg font-bold text-text-primary'>Language</h2>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className='w-full p-4 rounded-xl bg-surface-alt dark:bg-brand/5 border border-border outline-none focus:ring-2 focus:ring-brand/20 transition-all font-medium appearance-none'>
              <option value='eng'>English (Default)</option>
              <option value='ben'>Bengali (Bangla)</option>
              <option value='eng+ben'>English + Bengali</option>
            </select>
          </section>

          <section className='bg-surface dark:bg-surface-alt rounded-3xl border border-border shadow-sm p-8'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='bg-brand/10 p-3 rounded-2xl'>
                {theme === 'light' ? (
                  <Sun className='w-6 h-6 text-brand' />
                ) : (
                  <Moon className='w-6 h-6 text-brand' />
                )}
              </div>
              <h2 className='text-lg font-bold text-text-primary'>
                Theme Mode
              </h2>
            </div>
            <button
              onClick={toggleTheme}
              className='w-full flex items-center justify-between p-4 rounded-xl bg-surface-alt dark:bg-brand/5 border border-border hover:bg-brand/5 transition-all font-bold'>
              <span className='capitalize'>{theme} Mode</span>
              <div
                className={`w-12 h-6 rounded-full relative transition-colors ${theme === 'dark' ? 'bg-brand' : 'bg-text-muted/30'}`}>
                <div
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${theme === 'dark' ? 'left-7' : 'left-1'}`}
                />
              </div>
            </button>
          </section>
        </div>

        {/* Data Persistence */}
        <section className='bg-surface dark:bg-surface-alt rounded-3xl border border-border shadow-sm p-8 mt-4 border-dashed'>
          <div className='flex items-center justify-between gap-4'>
            <div className='flex items-center gap-3'>
              <div className='bg-danger/10 p-3 rounded-2xl'>
                <Database className='w-6 h-6 text-danger' />
              </div>
              <div>
                <h2 className='text-lg font-bold text-text-primary'>
                  Data Management
                </h2>
                <p className='text-xs text-text-secondary'>
                  Everything is stored locally on this device
                </p>
              </div>
            </div>
            <button
              onClick={handleClearData}
              className='flex items-center gap-2 px-6 py-3 rounded-xl bg-danger/10 text-danger hover:bg-danger text-sm font-bold hover:text-white transition-all border border-danger/20'>
              <Trash2 className='w-4 h-4' />
              Reset All Data
            </button>
          </div>
        </section>

        <div className='flex flex-col items-center justify-center pt-8 gap-4 opacity-30 group hover:opacity-100 transition-opacity'>
          <div className='flex items-center gap-2'>
            <Sparkles className='w-5 h-5 text-ai' />
            <span className='text-sm font-black tracking-widest text-text-primary uppercase'>
              DocuScan v1.0.0
            </span>
          </div>
          <p className='text-[10px] font-medium text-text-muted'>
            Built for Privacy and Speed
          </p>
        </div>
      </div>
    </div>
  )
}
