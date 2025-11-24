import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import ListLayout from '@/layouts/ListLayout'
import { genPageMetadata } from 'app/seo'

const POSTS_PER_PAGE = 5

export const metadata = genPageMetadata({ title: 'Blog' })

export async function generateStaticParams() {
  const langGroups = allBlogs
    .filter((post) => !post.draft)
    .reduce(
      (acc, post) => {
        if (!acc[post.lang]) acc[post.lang] = []
        acc[post.lang].push(post)
        return acc
      },
      {} as Record<string, typeof allBlogs>
    )

  const params: Array<{ lang: string; page: string }> = []
  Object.entries(langGroups).forEach(([lang, posts]) => {
    const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
    for (let i = 2; i <= totalPages; i++) {
      params.push({ lang, page: i.toString() })
    }
  })

  return params
}

export default async function Page(props: { params: Promise<{ lang: string; page: string }> }) {
  const params = await props.params
  const pageNumber = parseInt(params.page)

  const posts = allCoreContent(
    sortPosts(allBlogs.filter((post) => post.lang === params.lang && !post.draft))
  )

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
  const startIndex = (pageNumber - 1) * POSTS_PER_PAGE
  const endIndex = startIndex + POSTS_PER_PAGE
  const initialDisplayPosts = posts.slice(startIndex, endIndex)

  const pagination = {
    currentPage: pageNumber,
    totalPages: totalPages,
  }

  return (
    <ListLayout
      posts={posts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title="All Posts"
      lang={params.lang}
    />
  )
}
