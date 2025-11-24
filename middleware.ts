import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const SUPPORTED_LANGS = ['ko', 'en', 'ja']
const DEFAULT_LANG = 'ko'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // 루트 경로는 건드리지 않음 (app/page.tsx에서 처리)
  if (pathname === '/') {
    return NextResponse.next()
  }

  // 정적 파일, API 경로, Next.js 내부 경로는 건드리지 않음
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // 이미 언어 경로가 포함되어 있는지 확인
  const pathnameHasLang = SUPPORTED_LANGS.some(
    (lang) => pathname.startsWith(`/${lang}/`) || pathname === `/${lang}`
  )

  // 언어가 없으면 기본 언어로 리다이렉트
  if (!pathnameHasLang) {
    const newUrl = new URL(`/${DEFAULT_LANG}${pathname}`, request.url)
    return NextResponse.redirect(newUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
