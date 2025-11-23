import { Lang } from '@/lib/types'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Resume' })

export default async function ResumePage({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params

  const content = {
    ko: {
      title: '이력서',
      description: 'Coming soon.',
    },
    en: {
      title: 'Resume',
      description: 'Coming soon.',
    },
    ja: {
      title: '履歴書',
      description: 'Coming soon.',
    },
  }

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      <div className="space-y-2 pt-6 pb-8 md:space-y-5">
        <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
          {content[lang].title}
        </h1>
      </div>
      <div className="prose dark:prose-invert max-w-none pt-8 pb-8">
        <p>{content[lang].description}</p>
      </div>
    </div>
  )
}
