'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useMemo, useState } from 'react'
import { LANGS, LANG_LABELS, type Lang } from '@/lib/types'
import { Globe } from 'lucide-react'

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
        className="hover:text-primary-500 dark:hover:text-primary-400 flex cursor-pointer items-center gap-1.5 rounded px-2 py-1 text-sm font-medium"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Change language (current: ${LANG_LABELS[currentLang as Lang] ?? LANG_LABELS.ko})`}
      >
        <Globe className="h-5 w-5" />
        <span className="hidden sm:inline">
          {LANG_LABELS[currentLang as Lang] ?? LANG_LABELS.ko}
        </span>
      </button>

      {open && (
        <ul
          role="menu"
          className="absolute right-0 mt-2 w-32 rounded-md border bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          {LANGS.map((lang) => (
            <li key={lang}>
              <button
                role="menuitem"
                className={`w-full cursor-pointer rounded px-3 py-2 text-left text-sm ${
                  lang === currentLang
                    ? 'bg-gray-100 font-semibold dark:bg-gray-800'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                onClick={() => onSelect(lang)}
              >
                {LANG_LABELS[lang]}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
