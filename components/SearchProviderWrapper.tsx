'use client'

import { useRouter } from 'next/navigation'
import { SearchProvider, SearchConfig } from 'pliny/search'
import siteMetadata from '@/data/siteMetadata'

interface SearchDoc {
  path: string
  title: string
  summary?: string
  tags?: string[]
  date?: string
  bodyRaw?: string
}

export function SearchProviderWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  const searchConfig = {
    ...siteMetadata.search,
  }

  return <SearchProvider searchConfig={searchConfig as SearchConfig}>{children}</SearchProvider>
}
