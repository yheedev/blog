import { Lang } from '@/lib/types'

export interface BloggerProfile {
  name: string
  nickname: string
  avatar: string
  occupation: string
  company?: string
  email: string
  twitter?: string
  bluesky?: string
  linkedin?: string
  github?: string
  bio: string
}

const COMMON_TECH_STACK = `· Frontend
JavaScript, TypeScript, React, Next.js, Zustand, Redux, Tailwind css, Styled-components, Jest

· Tools & Infrastructure
AWS, Git, Figma, Jira

---
`

const COMMON_FIELDS = {
  nickname: 'yhee',
  avatar: '/static/images/profile.webp',
  email: 'yheedev@gmail.com',
  github: 'https://github.com/yheedev',
  linkedin: 'https://www.linkedin.com/in/%ED%9D%AC%EC%9D%80-%EC%9C%A4-6956753a5/',
}

export const bloggerProfiles: Record<Lang, BloggerProfile> = {
  ko: {
    name: '윤희은',
    ...COMMON_FIELDS,
    occupation: '프론트엔드 개발자',
    bio: `${COMMON_TECH_STACK}
안녕하세요. 프론트엔드 개발자 윤희은입니다. yh, yhee, benny 등 다양한 닉네임을 사용하고 있지만, 실명으로 불러주시는 것을 가장 선호합니다.

[My Pokemon Type](https://mypokemontype.vercel.app/) 프로젝트를 개발하고 2년 가량 운영하고 있으며, 다국어 지원과 접근성을 기반으로 한 사용자 경험 개선에 집중해 왔습니다. 브라우저 전반의 동작 흐름에 대한 이해를 바탕으로, 사용자를 자연스럽게 끌어들이는 인터랙션과 UI를 설계합니다.

한국인으로 한국어를 모국어로 사용하며, 일본어와 영어로 의사소통이 가능합니다. 번역 오픈 소스 프로젝트에 기여한 경험이 있고, 언어와 맥락을 연결하는 작업이 즐겁습니다.

프론트엔드 개발을 비롯해서 제가 번역, 문서화 등으로 기여할 수 있는 오픈 소스 프로젝트를 운영 중이시라면 편하게 메일 주세요!`,
  },
  en: {
    name: 'Yoon Heeeun',
    ...COMMON_FIELDS,
    occupation: 'Frontend Developer',
    bio: `${COMMON_TECH_STACK}
Hello, I'm Heeeun Yoon, a frontend developer. I go by several nicknames such as yh, yhee, benny, but I prefer to be addressed by my real name. you can just call me hee or yoon.

I've worked on projects including [My Pokemon Type](https://mypokemontype.vercel.app/) with a focus on improving user experience through multilingual support and accessibility. With a solid understanding of how browsers work end to end, I'm passionate about designing interactions and UIs that naturally draw users in.

I'm a native Korean speaker and can communicate in both Japanese and English. I've contributed to opensource translation projects and genuinely enjoy connecting language with context.

If you're maintaining an open-source project where I could help through frontend development, translation, or documentation, feel free to reach out via email!`,
  },
  ja: {
    name: 'ユン・ヒウン',
    ...COMMON_FIELDS,
    occupation: 'フロントエンド開発者',
    bio: `${COMMON_TECH_STACK}
こんにちは。フロントエンドエンジニアの ユン・ヒウンです。yh、yhee、benny などいくつかのニックネームを使っていますが、本名で呼んでいただくのが一番うれしいです。ユン や ヒと呼んでいただいても構いません。

[My Pokemon Type](https://mypokemontype.vercel.app/) などのプロジェクトに携わり、多言語対応やアクセシビリティを軸にしたユーザー体験の向上に取り組んできました。ブラウザ全体の動作フローへの理解をもとに、ユーザーを自然に引き込むインタラクションや UI を設計することに情熱を持っています。

韓国語を母語とし、日本語と英語でのコミュニケーションが可能です。翻訳系のオープンソースプロジェクトへの貢献経験があり、言語と文脈をつなぐ作業そのものを楽しんでいます。

フロントエンド開発、翻訳、ドキュメント作成などでお手伝いできそうな オープンソースプロジェクトを運営されていましたら、ぜひお気軽にメールでご連絡ください.`,
  },
}

// 특정 언어의 프로필 가져오기
export function getBloggerProfile(lang: Lang): BloggerProfile {
  return bloggerProfiles[lang]
}

// 기본 프로필 (언어 무관)
export const defaultProfile: Omit<BloggerProfile, 'bio' | 'occupation'> = {
  name: 'yhee',
  ...COMMON_FIELDS,
  linkedin: 'https://linkedin.com/in/yourprofile',
  twitter: '',
  bluesky: '',
  company: '',
}
