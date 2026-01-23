import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import siteMetadata from '@/data/siteMetadata'
import ListLayout from '@/layouts/ListLayout'
import { allBlogs } from 'contentlayer/generated'
import projectData from 'app/project-data.json'
import { genPageMetadata } from 'app/seo'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Lang, LANGS } from '@/lib/types'

export async function generateMetadata(props: {
  params: Promise<{ project: string; lang: Lang }>
}): Promise<Metadata> {
  const params = await props.params
  const project = decodeURIComponent(params.project)
  return genPageMetadata({
    title: project,
    description: `${siteMetadata.title} - ${project} 프로젝트 관련 포스트 모음`,
  })
}

export const generateStaticParams = async () => {
  const projectCounts = projectData as Record<string, number>
  const projectKeys = Object.keys(projectCounts)
  const paths = projectKeys.flatMap((project) =>
    (LANGS as readonly string[]).map((lang) => ({
      project: encodeURIComponent(project),
      lang,
    }))
  )
  return paths
}

export default async function ProjectPage(props: {
  params: Promise<{ project: string; lang: Lang }>
}) {
  const params = await props.params
  const project = decodeURIComponent(params.project)
  const lang = params.lang

  // 해당 언어의 해당 project가 있는 포스트만 필터링
  const filteredPosts = allCoreContent(
    sortPosts(
      allBlogs.filter(
        (post) =>
          post.lang === lang &&
          !post.draft &&
          post.projects &&
          (post.projects as string[]).includes(project)
      )
    )
  )

  if (filteredPosts.length === 0) {
    return notFound()
  }

  return <ListLayout posts={filteredPosts} title={project} lang={lang} />
}
