import projectsData from '@/data/projectsData'
import Card from '@/components/Card'
import { genPageMetadata } from 'app/seo'
import { Lang } from '@/lib/types'

export const metadata = genPageMetadata({ title: 'Projects' })

export default async function Projects({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params

  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
            Projects
          </h1>
        </div>
        <div className="container my-9">
          <div className="-m-4 flex flex-wrap">
            {projectsData.map((d) => (
              <Card
                key={d.title}
                title={d.title}
                description={d.description}
                imgSrc={d.imgSrc}
                href={d.href}
                githubUrl={d.githubUrl}
                project={d.project}
                lang={lang}
                period={d.period}
                stacks={d.stacks}
                featuredPosts={d.featuredPosts}
                teamType={d.teamType}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
