import AuthorLayout from '@/layouts/AuthorLayout'
import { genPageMetadata } from 'app/seo'
import { getBloggerProfile } from '@/data/authors/default'
import { Lang } from '@/lib/types'

export const metadata = genPageMetadata({ title: 'About' })

export default async function Page({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params
  const profile = getBloggerProfile(lang)

  return (
    <AuthorLayout content={profile}>
      <div className="prose dark:prose-invert max-w-none">
        <p style={{ whiteSpace: 'pre-line' }}>{profile.bio}</p>
      </div>
    </AuthorLayout>
  )
}
