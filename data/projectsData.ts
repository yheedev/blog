interface FeaturedPost {
  title: string
  href: string
}

interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
  githubUrl?: string
  project?: string
  period?: string
  stacks?: string[]
  featuredPosts?: FeaturedPost[]
  teamType?: 'team' | 'personal'
}

const projectsData: Project[] = [
  {
    title: 'My Pokemon Type',
    teamType: 'personal',
    description: `전세계 미디어 IP 1위 <포켓몬스터> 게임 팬들이 더 효과적인 배틀 컨텐츠를 즐기기 위해 돕는 웹 앱입니다.

    배틀의 공격 및 방어를 위해 더 높은 데미지를 주거나 낮은 데미지를 받을 수 있는 포켓몬 타입을 직관적으로 제안합니다.`,
    imgSrc: '/static/images/my-pokemon-type/landing.png',
    href: 'https://mypokemontype.vercel.app',
    githubUrl: 'https://github.com/yheedev/MyPokemonType',
    project: 'My Pokemon Type',
    period: `· 1차 개발: 2024.01. 2024. 06
      · 2차 개발: 2025. 07. - 2025. 08.
      · 3차 개발: 2026. 01. - 진행중`,
    stacks: ['Next.js 15', 'React', 'TypeScript', 'Tailwind CSS', 'Zustand'],
    featuredPosts: [
      {
        title: '배포 1주년! 스택 마이그레이션 진행 과정',
        href: '/ko/blog/my-pokemon-type/2025-migration',
      },
      {
        title: '프로젝트 소개 및 스택 선정, 도전 과제',
        href: '/ko/blog/my-pokemon-type/2024-intoduce',
      },
    ],
  },
  {
    title: '구똑',
    teamType: 'team',
    description: `점차 다양해지는 구독 서비스와 고정 지출을 한 눈에 관리할 수 있도록 돕는 웹 앱입니다. 구독 서비스 목록에서 선택하거나 직접 입력하여, 연/월/주 단위로 결제 주기를 설정하고 결제 금액 및 수단, 결제 여부 등을 저장할 수 있습니다.

    등록한 고정지출은 등록한 결제 일 하루 전, 오전 9시에 웹 앱 내 알림과 이메일으로 리마인드 알림이 발송되어 결제일을 놓치지 않도록 도와줍니다.`,
    imgSrc: '/static/images/guttok/landing.png',
    githubUrl: 'https://github.com/yheedev/guttok-front',
    project: 'Guttok',
    period: '2025. 01. - 2025.06',
    stacks: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Zustand', 'TanStack Query'],
    featuredPosts: [
      { title: '프론트엔드 아키텍쳐 설계 및 후기', href: '/ko/blog/guttok/fe-architecture' },
      {
        title: 'CSR에서 CSR+SSR로 마이그레이션 과정',
        href: '/ko/blog/guttok/csr-to-ssr-migration',
      },
    ],
  },
]

export default projectsData
