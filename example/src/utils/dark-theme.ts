import { useEffect } from 'react'
import { useStorage } from './local-storage'

export function useDarkTheme() {
  const [colorSchema, setColorSchema] = useStorage('color-schema', 'auto')
  const isDark = colorSchema === 'dark'
  const toggleDark = () => setColorSchema(isDark ? 'light' : 'dark')

  if (typeof document !== 'undefined') {
    useEffect(() => {
      document.documentElement.classList.toggle('dark', isDark)
    })
  }

  return [isDark, toggleDark] as [boolean, () => void]
}
