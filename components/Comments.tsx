'use client'

import Giscus from '@giscus/react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import siteMetadata from '@/data/siteMetadata'

export default function Comments({ slug: _slug }: { slug: string }) {
  const [loadComments, setLoadComments] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()

  useEffect(() => setMounted(true), [])

  const commentsConfig = siteMetadata.comments
  if (!commentsConfig || commentsConfig.provider !== 'giscus') {
    return null
  }

  const { giscusConfig } = commentsConfig
  const isDark = mounted && resolvedTheme === 'dark'
  const giscusTheme = isDark ? giscusConfig.darkTheme : giscusConfig.theme

  return (
    <>
      {loadComments ? (
        <Giscus
          repo={giscusConfig.repo as `${string}/${string}`}
          repoId={giscusConfig.repositoryId}
          category={giscusConfig.category}
          categoryId={giscusConfig.categoryId}
          mapping={giscusConfig.mapping}
          reactionsEnabled={giscusConfig.reactions}
          emitMetadata={giscusConfig.metadata}
          inputPosition={giscusConfig.inputPosition ?? 'bottom'}
          theme={giscusTheme}
          lang={giscusConfig.lang}
          loading="lazy"
        />
      ) : (
        <button onClick={() => setLoadComments(true)}>Load Comments</button>
      )}
    </>
  )
}
