'use client'

import { Comments } from 'pliny/comments'
import siteMetadata from '@/data/siteMetadata'

export default function GuestbookComments() {
  if (!siteMetadata.comments?.provider) return null
  return <Comments commentsConfig={siteMetadata.comments} slug="guest" />
}
