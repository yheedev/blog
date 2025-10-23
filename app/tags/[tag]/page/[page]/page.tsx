import { slug } from 'github-slugger'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import siteMetadata from '@/data/siteMetadata'
import ListLayout from '@/layouts/ListLayoutWithTags'
import { allBlogs } from 'contentlayer/generated'
import tagData from 'app/tag-data.json'
import { genPageMetadata } from 'app/seo'
import { Metadata } from 'next'

const POSTS_PER_PAGE = 5

export async function generateMetadata(props: {
  params: Promise<{ tag: string; page: string; lang: string }>
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
  const paths: { tag: string; page: string }[] = []

  tagKeys.forEach((tag) => {
    const count = tagCounts[tag]
    const numPages = Math.ceil(count / POSTS_PER_PAGE)
    for (let i = 1; i <= numPages; i++) {
      paths.push({
        tag: encodeURI(tag),
        page: i.toString(),
      })
    }
  })

  return paths
}

export default async function TagPageWithPagination(props: {
  params: Promise<{ tag: string; page: string; lang: string }>
}) {
  const params = await props.params
  const tag = decodeURI(params.tag)
  const lang = params.lang
  const page = parseInt(params.page)

  const title = tag[0].toUpperCase() + tag.split(' ').join('-').slice(1)

  const filteredPosts = allCoreContent(
    sortPosts(
      allBlogs.filter(
        (post) => post.lang === lang && post.tags && post.tags.map((t) => slug(t)).includes(tag)
      )
    )
  )

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)
  const pageNumber = page
  const initialDisplayPosts = filteredPosts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  )

  const pagination = {
    currentPage: pageNumber,
    totalPages: totalPages,
  }

  return (
    <ListLayout
      posts={filteredPosts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title={title}
      lang={lang}
    />
  )
}
