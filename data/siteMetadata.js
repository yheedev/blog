/** @type {import("pliny/config").PlinyConfig } */
const siteMetadata = {
  title: 'yhee.dev',
  author: '윤희은',
  headerTitle: 'yhee.dev',
  language: 'en-us',
  theme: 'system',
  siteUrl: 'https://yheedev.vercel.app',
  siteRepo: 'https://github.com/yheedev/blog',
  siteLogo: `${process.env.BASE_PATH || ''}/static/images/logo.png`,
  socialBanner: `${process.env.BASE_PATH || ''}/static/images/twitter-card.png`,
  email: 'yheedev@gmail.com',
  github: 'https://github.com/yheedev',
  youtube: 'https://www.youtube.com/@yheedev',
  linkedin: 'https://www.linkedin.com/in/%ED%9D%AC%EC%9D%80-%EC%9C%A4-6956753a5/',
  locale: 'en-US',
  stickyNav: false,
  analytics: {
    umamiAnalytics: {
      umamiWebsiteId: process.env.NEXT_UMAMI_ID,
    },
  },
  newsletter: {
    provider: 'buttondown',
  },
  comments: {
    provider: 'giscus',
    giscusConfig: {
      repo: process.env.NEXT_PUBLIC_GISCUS_REPO,
      repositoryId: process.env.NEXT_PUBLIC_GISCUS_REPOSITORY_ID,
      category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY,
      categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID,
      mapping: 'pathname',
      reactions: '1',
      metadata: '0',
      theme: 'light',
      darkTheme: 'dark',
      themeURL: '',
      lang: 'en',
    },
  },
  search: {
    provider: 'kbar',
    kbarConfig: {
      searchDocumentsPath: `${process.env.BASE_PATH || ''}/search.json`, // path to load documents to search
    },
  },
}

module.exports = siteMetadata
