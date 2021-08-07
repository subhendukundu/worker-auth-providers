import { useState } from 'react'

export function useStorage(key: string, defaultValue?: any) {
  if (import.meta.env.SSR) {
    return [defaultValue]
  }

  const [value, setValue] = useState(
    window.localStorage.getItem(key) || defaultValue
  )

  return [
    value,
    (newValue: any) => {
      window.localStorage.setItem(key, newValue)
      return setValue(newValue)
    },
  ]
}
