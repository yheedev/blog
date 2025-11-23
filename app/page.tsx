import { redirect } from 'next/navigation'
export default function Home() {
  redirect('/ko')
}

// [ ]  이후 미들웨어 사용해서 폴백 페이지로 리다이렉트 처리 예정
