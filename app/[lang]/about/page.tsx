import AuthorLayout from '@/layouts/AuthorLayout'
import { genPageMetadata } from 'app/seo'
import { getBloggerProfile } from '@/data/authors/default'
import { Lang } from '@/lib/types'
import Link from '@/components/Link'
import { ReactNode } from 'react'

export const metadata = genPageMetadata({ title: 'About' })

function parseMarkdownLinks(text: string) {
  const parts: (string | ReactNode)[] = []
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }
    parts.push(
      <Link key={match.index} href={match[2]} className="text-primary-500 hover:text-primary-600">
        {match[1]}
      </Link>
    )
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts.length > 0 ? parts : [text]
}

export default async function Page({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params
  const profile = getBloggerProfile(lang)

  const bioParts = profile.bio.split('---')

  return (
    <AuthorLayout content={profile}>
      <div className="prose dark:prose-invert max-w-none">
        {bioParts.map((part, index) => {
          const lines = part.trim().split('\n')
          return (
            <div key={index}>
              <p style={{ whiteSpace: 'pre-line' }}>
                {lines.map((line, lineIndex) => (
                  <span key={lineIndex}>
                    {parseMarkdownLinks(line)}
                    {lineIndex < lines.length - 1 && '\n'}
                  </span>
                ))}
              </p>
              {index < bioParts.length - 1 && (
                <hr className="my-8 border-gray-200 dark:border-gray-700" />
              )}
            </div>
          )
        })}
      </div>
    </AuthorLayout>
  )
}
