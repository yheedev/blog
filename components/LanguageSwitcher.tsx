// components/LanguageSwitcher.tsx
'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useMemo, useState } from 'react'

const LOCALES = [
  { code: 'ko', label: '한국어' },
  { code: 'en', label: 'English' },
  { code: 'ja', label: '日本語' },
] as const

function replaceLang(pathname: string, nextLang: string) {
  // 예) /ko/blog/new → /en/blog/new
  const segments = pathname.split('/')
  segments[1] = nextLang
  return segments.join('/') || '/'
}

export default function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname() || '/'
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(false)

  const currentLang = useMemo(() => pathname.split('/')[1] || 'ko', [pathname])

  const qs = searchParams?.toString()
  const hash = typeof window !== 'undefined' ? window.location.hash : ''

  const onSelect = (code: string) => {
    if (code === currentLang) return setOpen(false)
    const nextPath = replaceLang(pathname, code)
    const withQuery = qs ? `${nextPath}?${qs}${hash}` : `${nextPath}${hash}`
    router.push(withQuery)
    setOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((s) => !s)}
        className="hover:text-primary-500 dark:hover:text-primary-400 rounded px-3 py-1 text-sm font-medium"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {LOCALES.find((l) => l.code === currentLang)?.label ?? '한국어'}
      </button>

      {open && (
        <ul
          role="menu"
          className="absolute right-0 mt-2 w-32 rounded-md border bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          {LOCALES.map((loc) => (
            <li key={loc.code}>
              <button
                role="menuitem"
                className={`w-full rounded px-3 py-2 text-left text-sm ${
                  loc.code === currentLang
                    ? 'bg-gray-100 font-semibold dark:bg-gray-800'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                onClick={() => onSelect(loc.code)}
              >
                {loc.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
