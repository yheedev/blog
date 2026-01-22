export const LANGS = ['ko', 'en', 'ja'] as const
export type Lang = (typeof LANGS)[number]
export const DEFAULT_LANG: Lang = 'ko'

export const PROJECTS = [
  'My Pokemon Type',
  'Guttok',
  'Perkwatch',
  'OpenSource',
  'Lecture',
  'Algorithm',
  'Debugging',
  'Infra',
  'TIL',
  'FE Study',
] as const

export const TAGS = [
  // 기술 스택
  'JavaScript',
  'TypeScript',
  'React',
  'Next.js',
  'Redux',
  'Redux Toolkit',
  'Zustand',
  'TanStack Query',
  'Tailwind',
  'Styled-Components',
  'Vercel',
  'AWS',
  'Git/GitHub',

  // 프론트엔드
  'html',
  'css',
  'accessibility',

  // 주제/키워드
  'guide',
  'tutorial',
  'debugging',
  'performance',
  'refactoring',
] as const

export const LANG_LABELS: Record<Lang, string> = {
  ko: '한국어',
  en: 'English',
  ja: '日本語',
}
