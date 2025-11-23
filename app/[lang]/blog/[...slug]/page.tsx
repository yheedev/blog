import 'css/prism.css'
import 'katex/dist/katex.css'

import { allBlogs } from 'contentlayer/generated'
import { notFound } from 'next/navigation'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { coreContent } from 'pliny/utils/contentlayer'
import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'
import PostLayout from '@/layouts/PostLayout'
import PostSimple from '@/layouts/PostSimple'
import PostBanner from '@/layouts/PostBanner'
import { components } from '@/components/MDXComponents'

// 동적 경로 생성
export async function generateStaticParams() {
  return allBlogs
    .filter((post) => !post.draft)
    .map((post) => ({
      lang: post.lang,
      slug: post.slug.split('/'),
    }))
}

// 메타데이터 생성
export async function generateMetadata(props: {
  params: Promise<{ lang: string; slug: string[] }>
}): Promise<Metadata> {
  const params = await props.params
  const slug = decodeURI(params.slug.join('/'))
  const post = allBlogs.find((p) => p.slug === slug && p.lang === params.lang)

  if (!post) {
    return {}
  }

  const publishedAt = new Date(post.date).toISOString()
  const modifiedAt = new Date(post.lastmod || post.date).toISOString()

  const imageList = [siteMetadata.socialBanner]
  if (post.images) {
    imageList.push(...post.images)
  }
  const ogImages = imageList.map((img) => {
    return {
      url: img.includes('http') ? img : siteMetadata.siteUrl + img,
    }
  })

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      siteName: siteMetadata.title,
      locale: post.lang,
      type: 'article',
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      url: './',
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
      images: imageList,
    },
  }
}

// 개별 블로그 포스트 페이지
export default async function BlogPostPage(props: {
  params: Promise<{ lang: string; slug: string[] }>
}) {
  const params = await props.params
  const slug = decodeURI(params.slug.join('/'))

  // slug와 lang이 일치하는 포스트 찾기
  const post = allBlogs.find((p) => p.slug === slug && p.lang === params.lang)

  if (!post || post.draft) {
    notFound()
  }

  const mainContent = coreContent(post)
  const jsonLd = post.structuredData

  // 레이아웃 선택
  const layouts = {
    PostLayout,
    PostSimple,
    PostBanner,
  } as const

  type LayoutKey = keyof typeof layouts
  const layoutKey = (post.layout as LayoutKey) || 'PostLayout'
  const Layout = layouts[layoutKey]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Layout content={mainContent}>
        <MDXLayoutRenderer code={post.body.code} components={components} toc={post.toc} />
      </Layout>
    </>
  )
}
