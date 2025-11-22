export const LANGS = ['ko', 'en', 'ja'] as const
export type Lang = (typeof LANGS)[number]
export const DEFAULT_LANG: Lang = 'ko'

export const STACKS = [
  'JavaScript',
  'TypeScript',
  'React',
  'Next.js',
  'Redux',
  'Zustand',
  'TanStack Query',
  'Tailwind',
  'Styled-Components',
  'AWS',
] as const

export const TOPICS = ['Projects', 'OpenSource', 'Lecture', 'Algorithm'] as const

export const LANG_LABELS: Record<Lang, string> = {
  ko: '한국어',
  en: 'English',
  ja: '日本語',
}
