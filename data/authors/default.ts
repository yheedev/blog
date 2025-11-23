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

// TODO
// [ ] 겹치는 정보 정리하기 (예: github, email, github 등)
// [ ] 프로필 사진 추가

export const bloggerProfiles: Record<Lang, BloggerProfile> = {
  ko: {
    name: '윤희은',
    nickname: 'yhee',
    avatar: '/static/images/avatar.png',
    occupation: '프론트엔드 개발자',
    email: 'yheedev@gmail.com',
    github: 'https://github.com/yheedev',
    bio: `안녕하세요! yhee입니다.

웹 개발과 사용자 경험에 관심이 많으며, React와 Next.js를 주로 사용합니다.
백엔드 개발자와의 협업을 통해 완성도 높은 웹 애플리케이션을 만들고 있습니다.`,
  },
  en: {
    name: 'Yoon Heeeun',
    nickname: 'yhee',
    avatar: '/static/images/avatar.png',
    occupation: 'Frontend Developer',
    email: 'yheedev@gmail.com',
    github: 'https://github.com/yheedev',
    bio: `Hello! I'm yhee, a frontend developer passionate about web development and user experience.

I primarily work with React and Next.js, and I enjoy building high-quality web applications through collaboration with backend developers.

I love documenting and sharing what I learn along my development journey.
I mainly write about frontend technologies, algorithms, and career development.`,
  },
  ja: {
    name: 'ゆん・ひうん',
    nickname: 'yhee',
    avatar: '/static/images/avatar.png',
    occupation: 'フロントエンド開発者',
    email: 'yheedev@gmail.com',
    github: 'https://github.com/yheedev',
    bio: `こんにちは！フロントエンド開発者を目指しているyheeです。

Web開発とユーザー体験に興味があり、主にReactとNext.jsを使用しています。
バックエンド開発者との協業を通じて、完成度の高いWebアプリケーションを作っています。

開発で学んだ内容と経験を記録し、共有することが好きです。
特にフロントエンド技術、アルゴリズム、そしてキャリアに関する記事を主に書いています。`,
  },
}

// 특정 언어의 프로필 가져오기
export function getBloggerProfile(lang: Lang): BloggerProfile {
  return bloggerProfiles[lang]
}

// 기본 프로필 (언어 무관)
export const defaultProfile: Omit<BloggerProfile, 'bio' | 'occupation'> = {
  name: 'yhee',
  avatar: '/static/images/avatar.png',
  email: 'your-email@example.com',
  github: 'https://github.com/yourusername',
  linkedin: 'https://linkedin.com/in/yourprofile',
  twitter: '',
  bluesky: '',
  company: '',
  nickname: '',
}
