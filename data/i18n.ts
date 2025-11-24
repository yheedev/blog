import { Lang } from '@/lib/types'

export const i18nLabels = {
  post: {
    created: {
      ko: '최초 작성',
      en: 'Created',
      ja: '初回作成',
    },
    modified: {
      ko: '마지막 수정',
      en: 'Last modified',
      ja: '最終更新',
    },
    publishedOn: {
      ko: '게시일',
      en: 'Published on',
      ja: '公開日',
    },
    tags: {
      ko: '태그',
      en: 'Tags',
      ja: 'タグ',
    },
    previousArticle: {
      ko: '이전 글',
      en: 'Previous Article',
      ja: '前の記事',
    },
    nextArticle: {
      ko: '다음 글',
      en: 'Next Article',
      ja: '次の記事',
    },
    backToBlog: {
      ko: '블로그로 돌아가기',
      en: 'Back to the blog',
      ja: 'ブログに戻る',
    },
  },
  common: {
    readMore: {
      ko: '더 보기',
      en: 'Read more',
      ja: 'もっと見る',
    },
  },
}

export function getLabel(section: keyof typeof i18nLabels, key: string, lang: Lang): string {
  return i18nLabels[section]?.[key]?.[lang] || i18nLabels[section]?.[key]?.ko || ''
}

export const dateLocaleMap: Record<Lang, string> = {
  ko: 'ko-KR',
  en: 'en-US',
  ja: 'ja-JP',
}
