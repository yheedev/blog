import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import Main from './Main'
import { Lang } from '@/lib/types'

export default async function Page({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params
  const sortedPosts = sortPosts(allBlogs.filter((post) => post.lang === lang && !post.draft))
  const posts = allCoreContent(sortedPosts)

  return <Main posts={posts} />
}
