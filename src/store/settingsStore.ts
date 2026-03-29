import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsState {
  geminiApiKey: string | undefined
  language: 'eng' | 'ben' | 'eng+ben'
  theme: 'light' | 'dark'
  setGeminiApiKey: (key: string | undefined) => void
  setLanguage: (lang: 'eng' | 'ben' | 'eng+ben') => void
  toggleTheme: () => void
}

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      geminiApiKey: GEMINI_API_KEY,
      language: 'eng',
      theme: 'light',
      setGeminiApiKey: (key) => set({ geminiApiKey: key }),
      setLanguage: (lang) => set({ language: lang }),
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' }))
    }),
    {
      name: 'docuscan-settings'
    }
  )
)
