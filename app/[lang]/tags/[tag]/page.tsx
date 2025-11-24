import { slug } from 'github-slugger'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import siteMetadata from '@/data/siteMetadata'
import ListLayout from '@/layouts/ListLayout'
import { allBlogs } from 'contentlayer/generated'
import tagData from 'app/tag-data.json'
import { genPageMetadata } from 'app/seo'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Lang, LANGS } from '@/lib/types'

export async function generateMetadata(props: {
  params: Promise<{ tag: string; lang: Lang }>
}): Promise<Metadata> {
  const params = await props.params
  const tag = decodeURI(params.tag)
  return genPageMetadata({
    title: tag,
    description: `${siteMetadata.title} ${tag} tagged content`,
    alternates: {
      canonical: './',
      types: {
        'application/rss+xml': `${siteMetadata.siteUrl}/tags/${tag}/feed.xml`,
      },
    },
  })
}

export const generateStaticParams = async () => {
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const paths = tagKeys.flatMap((tag) =>
    (LANGS as readonly string[]).map((lang) => ({
      tag: encodeURI(tag),
      lang,
    }))
  )
  return paths
}

export default async function TagPage(props: { params: Promise<{ tag: string; lang: Lang }> }) {
  const params = await props.params
  const tag = decodeURI(params.tag)
  const lang = params.lang

  // Capitalize first letter and convert space to dash
  const title = tag[0].toUpperCase() + tag.split(' ').join('-').slice(1)

  // 해당 언어의 해당 태그가 있는 포스트만 필터링
  const filteredPosts = allCoreContent(
    sortPosts(
      allBlogs.filter(
        (post) =>
          post.lang === lang &&
          !post.draft &&
          post.tags &&
          post.tags.map((t) => slug(t)).includes(tag)
      )
    )
  )

  if (filteredPosts.length === 0) {
    return notFound()
  }

  return <ListLayout posts={filteredPosts} title={title} lang={lang} />
}
