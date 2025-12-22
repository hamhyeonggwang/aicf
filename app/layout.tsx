import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ICF 기반 임상언어분석 | 강원대학교 일반대학원 작업치료학과',
  description: '임상 언어를 입력하면 관련 ICF 코드를 자동으로 찾아드립니다. 수행력과 능력을 점수화하여 보고서로 저장할 수 있습니다.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}

