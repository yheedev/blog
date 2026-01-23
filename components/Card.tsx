import Image from './Image'
import Link from './Link'
import { Github } from './social-icons/icons'
import { Lang } from '@/lib/types'

interface FeaturedPost {
  title: string
  href: string
}

interface CardProps {
  title: string
  description: string
  imgSrc?: string
  href?: string
  githubUrl?: string
  project?: string
  lang?: Lang
  period?: string
  stacks?: string[]
  featuredPosts?: FeaturedPost[]
  teamType?: 'team' | 'personal'
}

const Card = ({
  title,
  description,
  imgSrc,
  href,
  githubUrl,
  project,
  lang = 'ko',
  period,
  stacks,
  featuredPosts,
  teamType,
}: CardProps) => {
  return (
    <div className="md max-w-[544px] p-4 md:w-1/2">
      <div
        className={`${
          imgSrc && 'h-full'
        } overflow-hidden rounded-md border-2 border-gray-200/60 dark:border-gray-700/60`}
      >
        {imgSrc &&
          (href ? (
            <Link href={href} aria-label={`Link to ${title}`}>
              <Image
                alt={title}
                src={imgSrc}
                className="object-cover object-center md:h-56 lg:h-96"
                width={544}
                height={384}
              />
            </Link>
          ) : (
            <Image
              alt={title}
              src={imgSrc}
              className="object-cover object-center md:h-56 lg:h-96"
              width={544}
              height={384}
            />
          ))}
        <div className="p-6">
          <h2 className="mb-1 text-2xl leading-8 font-bold tracking-tight">{title}</h2>
          {period && (
            <p className="mb-3 text-sm whitespace-pre-line text-gray-500 dark:text-gray-400">
              {period}
            </p>
          )}
          {(githubUrl || teamType) && (
            <div className="mb-3 flex items-center gap-3 text-sm">
              {teamType && (
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    teamType === 'team'
                      ? 'text-primary-800 dark:text-primary-950 bg-pink-300/50 dark:bg-pink-300/50'
                      : 'text-primary-800 dark:text-primary-950 bg-blue-300/50 dark:bg-blue-300/50'
                  }`}
                >
                  {teamType === 'team' ? '팀' : '개인'}
                </span>
              )}
              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  aria-label="GitHub repository"
                >
                  <Github className="h-5 w-5 fill-current" />
                  <span>저장소</span>
                </a>
              )}
            </div>
          )}
          {stacks && stacks.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {stacks.map((stack) => (
                <span
                  key={stack}
                  className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                >
                  {stack}
                </span>
              ))}
            </div>
          )}
          {featuredPosts && featuredPosts.length > 0 && (
            <div className="mb-3">
              <p className="mb-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
                추천 포스트
              </p>
              <ul className="space-y-1">
                {featuredPosts.map((post) => (
                  <li key={post.href}>
                    <Link
                      href={post.href}
                      className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 text-sm"
                    >
                      🏷️ {post.title}
                    </Link>
                  </li>
                ))}
              </ul>
              {project && (
                <Link
                  href={`/${lang}/projects/${encodeURIComponent(project)}`}
                  className="mt-2 inline-block text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  aria-label={`All posts about ${project}`}
                >
                  모든 관련 포스트 보기 →
                </Link>
              )}
            </div>
          )}
          <hr className="border-primary-500 mb-3 border-[0.1px]" />
          <p className="prose mb-3 max-w-none whitespace-pre-line text-gray-500 dark:text-gray-400">
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Card
