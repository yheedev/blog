interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
  githubUrl?: string
  project?: string
}

const projectsData: Project[] = [
  {
    title: '[팀] 구똑',
    description: `구독 중인 서비스를 한 눈에 확인하고 구독 날짜를 리마인드 받으세요!`,
    imgSrc: '/static/images/guttok/landing.png',
    githubUrl: 'https://github.com/yheedev/guttok-front',
    project: 'Guttok',
  },
  {
    title: '[개인] My Pokemon Type',
    description: `Imagine being able to travel back in time or to the future. Simple turn the knob
    to the desired date and press "Go". No more worrying about lost keys or
    forgotten headphones with this simple yet affordable solution.`,
    imgSrc: '/static/images/time-machine.jpg',
    href: 'https://mypokemontype.vercel.app',
    githubUrl: 'https://github.com/y-hee/MyPokemonType',
    project: 'My Pokemon Type',
  },
]

export default projectsData
