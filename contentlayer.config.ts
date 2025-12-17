import { defineDocumentType, ComputedFields, makeSource } from 'contentlayer2/source-files'
import { writeFileSync } from 'fs'
import { execSync } from 'child_process'
import readingTime from 'reading-time'
import { slug } from 'github-slugger'
import path from 'path'
import { fromHtmlIsomorphic } from 'hast-util-from-html-isomorphic'
import { LANGS, TOPICS } from './lib/types'
// Remark packages
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { remarkAlert } from 'remark-github-blockquote-alert'
import {
  remarkExtractFrontmatter,
  remarkCodeTitles,
  remarkImgToJsx,
  extractTocHeadings,
} from 'pliny/mdx-plugins/index.js'
// Rehype packages
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeKatex from 'rehype-katex'
import rehypeKatexNoTranslate from 'rehype-katex-notranslate'
import rehypeCitation from 'rehype-citation'
import rehypePrismPlus from 'rehype-prism-plus'
import rehypePresetMinify from 'rehype-preset-minify'
import siteMetadata from './data/siteMetadata'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer.js'
import prettier from 'prettier'

const root = process.cwd()
const isProduction = process.env.NODE_ENV === 'production'

// Git 타임스탬프 캐시 (중복 호출 방지)
const timestampCache = new Map<string, { created: string; modified: string }>()

/**
 * Git 히스토리에서 파일의 생성일과 수정일을 가져옵니다 (캐시 사용)
 */
function getCachedGitTimestamps(filePath: string): { created: string; modified: string } {
  // 임시로 캐시 비활성화 - 디버깅용
  return getGitTimestamps(filePath)

  // if (!timestampCache.has(filePath)) {
  //   timestampCache.set(filePath, getGitTimestamps(filePath))
  // }
  // return timestampCache.get(filePath)!
}

/**
 * Git 히스토리에서 파일의 생성일과 수정일을 가져옵니다
 */
function getGitTimestamps(filePath: string): { created: string; modified: string } {
  try {
    // Contentlayer는 'blog/test.mdx'를 전달하지만, Git은 'data/blog/test.mdx'를 원함
    const gitPath = `data/${filePath}`

    // 파일의 첫 커밋 날짜 (생성일) - Windows 호환
    const createdOutput = execSync(`git log --follow --format=%aI --reverse "${gitPath}"`, {
      encoding: 'utf-8',
    })
    const created = createdOutput.split('\n')[0].trim()

    // 파일의 마지막 커밋 날짜 (수정일)
    const modified = execSync(`git log -1 --format=%aI "${gitPath}"`, {
      encoding: 'utf-8',
    })
      .toString()
      .trim()

    return {
      created: created || new Date().toISOString(),
      modified: modified || new Date().toISOString(),
    }
  } catch (error) {
    const now = new Date().toISOString()
    return { created: now, modified: now }
  }
}

// heroicon mini link
const icon = fromHtmlIsomorphic(
  `
  <span class="content-header-link">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 linkicon">
  <path d="M12.232 4.232a2.5 2.5 0 0 1 3.536 3.536l-1.225 1.224a.75.75 0 0 0 1.061 1.06l1.224-1.224a4 4 0 0 0-5.656-5.656l-3 3a4 4 0 0 0 .225 5.865.75.75 0 0 0 .977-1.138 2.5 2.5 0 0 1-.142-3.667l3-3Z" />
  <path d="M11.603 7.963a.75.75 0 0 0-.977 1.138 2.5 2.5 0 0 1 .142 3.667l-3 3a2.5 2.5 0 0 1-3.536-3.536l1.225-1.224a.75.75 0 0 0-1.061-1.06l-1.224 1.224a4 4 0 1 0 5.656 5.656l3-3a4 4 0 0 0-.225-5.865Z" />
  </svg>
  </span>
`,
  { fragment: true }
)

const computedFields: ComputedFields = {
  readingTime: { type: 'json', resolve: (doc) => readingTime(doc.body.raw) },
  slug: {
    type: 'string',
    resolve: (doc) => doc._raw.flattenedPath.replace(/^.+?(\/)/, ''),
  },
  path: {
    type: 'string',
    resolve: (doc) => doc._raw.flattenedPath,
  },
  filePath: {
    type: 'string',
    resolve: (doc) => doc._raw.sourceFilePath,
  },
  toc: { type: 'json', resolve: (doc) => extractTocHeadings(doc.body.raw) },
}

/**
 * Count the occurrences of all tags across blog posts and write to json file
 */
async function createTagCount(allBlogs) {
  const tagCount: Record<string, number> = {}
  allBlogs.forEach((file) => {
    if (file.tags && (!isProduction || file.draft !== true)) {
      file.tags.forEach((tag) => {
        const formattedTag = slug(tag)
        if (formattedTag in tagCount) {
          tagCount[formattedTag] += 1
        } else {
          tagCount[formattedTag] = 1
        }
      })
    }
  })
  const formatted = await prettier.format(JSON.stringify(tagCount, null, 2), { parser: 'json' })
  writeFileSync('./app/tag-data.json', formatted)
}

function createSearchIndex(allBlogs) {
  if (
    siteMetadata?.search?.provider === 'kbar' &&
    siteMetadata.search.kbarConfig.searchDocumentsPath
  ) {
    writeFileSync(
      `public/${path.basename(siteMetadata.search.kbarConfig.searchDocumentsPath)}`,
      JSON.stringify(allCoreContent(sortPosts(allBlogs)))
    )
  }
}

export const Blog = defineDocumentType(() => ({
  name: 'Blog',
  filePathPattern: 'blog/**/*.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    date: { type: 'date', required: true },
    toc: { type: 'boolean', default: true },
    tags: { type: 'list', of: { type: 'string' }, default: [] },
    topics: {
      type: 'list',
      of: { type: 'enum', options: [...TOPICS] },
      default: [],
      required: false,
    },
    lastmod: { type: 'date', required: false },
    draft: { type: 'boolean' },
    summary: { type: 'string' },
    images: { type: 'json' },
    authors: { type: 'list', of: { type: 'string' } },
    layout: { type: 'string' },
    bibliography: { type: 'string' },
    canonicalUrl: { type: 'string' },
  },

  computedFields: {
    ...computedFields,

    // 언어는 폴더 경로에서 자동 추출 (blog/ko/xxx.mdx -> 'ko')
    lang: {
      type: 'enum',
      options: [...LANGS],
      resolve: (doc) => {
        const pathParts = doc._raw.flattenedPath.split('/')
        // blog/ko/post-name -> ['blog', 'ko', 'post-name']
        const lang = pathParts[1] as (typeof LANGS)[number]
        return LANGS.includes(lang) ? lang : 'ko' // 기본값: 'ko'
      },
    },

    // slug는 파일명에서 추출 (blog/ko/nextjs-review.mdx -> 'nextjs-review')
    slug: {
      type: 'string',
      resolve: (doc) => {
        const pathParts = doc._raw.flattenedPath.split('/')
        // blog/ko/post-name -> 'post-name'
        return pathParts.slice(2).join('/')
      },
    },

    // path는 언어/blog/slug 형식 (ko/blog/nextjs-review)
    path: {
      type: 'string',
      resolve: (doc) => {
        const pathParts = doc._raw.flattenedPath.split('/')
        const lang = pathParts[1]
        const slug = pathParts.slice(2).join('/')
        return `${lang}/blog/${slug}`
      },
    },

    filePath: { type: 'string', resolve: (doc) => doc._raw.sourceFilePath },
    readingTime: { type: 'json', resolve: (doc) => readingTime(doc.body.raw) },
    toc: { type: 'json', resolve: (doc) => extractTocHeadings(doc.body.raw) },

    // Git 히스토리에서 생성일/수정일 자동 추출. getCachedGitTimestamps를 사용하여 문서당 한 번만 Git 명령 실행
    createdAt: {
      type: 'date',
      resolve: (doc) => {
        const timestamps = getCachedGitTimestamps(doc._raw.sourceFilePath)
        return timestamps.created
      },
    },
    modifiedAt: {
      type: 'date',
      resolve: (doc) => {
        const timestamps = getCachedGitTimestamps(doc._raw.sourceFilePath)
        return timestamps.modified
      },
    },

    structuredData: {
      type: 'json',
      resolve: (doc) => {
        const pathParts = doc._raw.flattenedPath.split('/')
        const lang = pathParts[1]
        const slug = pathParts.slice(2).join('/')

        return {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: doc.title,
          datePublished: doc.date,
          dateModified: doc.lastmod || doc.date,
          description: doc.summary,
          image: doc.images ? doc.images[0] : siteMetadata.socialBanner,
          url: `${siteMetadata.siteUrl}/${lang}/blog/${slug}`,
        }
      },
    },
  },
}))

export default makeSource({
  contentDirPath: 'data',
  documentTypes: [Blog],
  disableImportAliasWarning: true,
  mdx: {
    cwd: process.cwd(),
    remarkPlugins: [
      remarkExtractFrontmatter,
      remarkGfm,
      remarkCodeTitles,
      remarkMath,
      remarkImgToJsx,
      remarkAlert,
    ],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'prepend',
          headingProperties: {
            className: ['content-header'],
          },
          content: icon,
        },
      ],
      rehypeKatex,
      rehypeKatexNoTranslate,
      [rehypeCitation, { path: path.join(root, 'data') }],
      [rehypePrismPlus, { defaultLanguage: 'js', ignoreMissing: true }],
      rehypePresetMinify,
    ],
  },
  onSuccess: async (importData) => {
    const { allBlogs } = await importData()
    // _templates 폴더의 파일 제외
    const filteredBlogs = allBlogs.filter(
      (blog) => !blog._raw.sourceFilePath.includes('_templates')
    )
    createTagCount(filteredBlogs)
    createSearchIndex(filteredBlogs)
  },
})
