'use client'

import React from 'react'
import Slugger from 'github-slugger'
import clsx from 'clsx'

type TOCItem = { id: string; text: string; depth: number }

interface Props {
  container?: string // 본문 컨테이너
  headings?: string // 수집할 헤딩(기본 h2,h3)
  offsetTop?: number // sticky 오프셋
  defaultEnabled?: boolean // 기본 ON
  storageKey?: string // 로컬 저장 키
  className?: string

  /** 선택: 부모가 제어하고 싶을 때(Controlled) */
  enabled?: boolean
  onToggle?: (next: boolean) => void
}

export default function TOCSidebar({
  container = 'article',
  headings = 'h1, h2, h3, h4, h5, h6',
  offsetTop = 96,
  defaultEnabled = true,
  storageKey = 'toc:enabled',
  className,
  enabled, // 있으면 Controlled
  onToggle, // 있으면 Controlled
}: Props) {
  // --- 상태: Uncontrolled(내부 관리) 또는 Controlled(부모 관리) 모두 지원
  const [internalEnabled, setInternalEnabled] = React.useState(defaultEnabled)
  const isControlled = typeof enabled === 'boolean'
  const show = isControlled ? (enabled as boolean) : internalEnabled

  React.useEffect(() => {
    if (isControlled) return
    const saved = localStorage.getItem(storageKey)
    if (saved !== null) setInternalEnabled(saved === 'true')
  }, [isControlled, storageKey])

  React.useEffect(() => {
    if (isControlled) return
    localStorage.setItem(storageKey, String(internalEnabled))
  }, [isControlled, internalEnabled, storageKey])

  const toggle = () => {
    if (isControlled) {
      onToggle?.(!enabled)
    } else {
      setInternalEnabled((v) => !v)
    }
  }

  // --- TOC 생성
  const [items, setItems] = React.useState<TOCItem[]>([])
  const [activeId, setActiveId] = React.useState<string | null>(null)

  React.useEffect(() => {
    const root = document.querySelector(container)
    if (!root) return

    const slugger = new Slugger()
    const hs = Array.from(root.querySelectorAll<HTMLHeadingElement>(headings))
    const toc: TOCItem[] = hs.map((h) => {
      let id = h.id
      if (!id) {
        id = slugger.slug(h.textContent || '')
        h.id = id
      }
      return { id, text: h.textContent || '', depth: Number(h.tagName.replace('H', '')) }
    })
    setItems(toc)
  }, [container, headings])

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible?.target instanceof HTMLElement) setActiveId(visible.target.id)
      },
      { rootMargin: `-${offsetTop + 8}px 0px -60% 0px`, threshold: [0, 0.25, 0.5, 1] }
    )
    items.forEach((i) => {
      const el = document.getElementById(i.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [items, offsetTop])

  // --- 렌더
  return (
    <aside className={clsx('hidden xl:block xl:self-start')}>
      <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pl-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
            TOC
          </h2>
          <button
            onClick={toggle}
            className="rounded-md border px-2 py-1 text-xs hover:bg-gray-50 dark:hover:bg-gray-800"
            aria-pressed={show}
          >
            {show ? 'Hide' : 'Show'}
          </button>
        </div>

        {show && items.length > 0 && (
          <nav aria-label="Table of contents">
            <ul className="space-y-1 text-sm">
              {items.map((it) => (
                <li
                  key={it.id}
                  className={clsx(
                    it.depth === 2 && 'pl-2',
                    it.depth === 3 && 'pl-4',
                    it.depth >= 4 && 'pl-6'
                  )}
                >
                  <a
                    href={`#${it.id}`}
                    onClick={(e) => {
                      e.preventDefault()
                      document
                        .getElementById(it.id)
                        ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                      history.replaceState(null, '', `#${it.id}`)
                    }}
                    className={clsx(
                      'block border-l py-1 pl-3',
                      activeId === it.id
                        ? 'text-primary-500 border-primary-500 dark:text-primary-400'
                        : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                    )}
                  >
                    {it.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </aside>
  )
}
