import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import { genPageMetadata } from 'app/seo'
import ListLayout from '@/layouts/ListLayout'

const POSTS_PER_PAGE = 10

export const metadata = genPageMetadata({ title: 'Blog' })

export default async function BlogPage(props: { params: Promise<{ lang: string }> }) {
  const params = await props.params

  // 현재 언어의 포스트만 필터링
  const posts = allCoreContent(
    sortPosts(allBlogs.filter((post) => post.lang === params.lang && !post.draft))
  )

  const pageNumber = 1
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
  const initialDisplayPosts = posts.slice(0, POSTS_PER_PAGE * pageNumber)
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
