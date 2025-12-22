'use client'

import { useState } from 'react'
import ClinicalLanguageInput, { type ICFCodeMatch } from '@/components/ClinicalLanguageInput'
import CodeMatchResults from '@/components/CodeMatchResults'
import ScoreInput, { type ScoreData } from '@/components/ScoreInput'
import ReportGenerator from '@/components/ReportGenerator'
import Footer from '@/components/Footer'

export default function Home() {
  const [clinicalText, setClinicalText] = useState('')
  const [matchedCodes, setMatchedCodes] = useState<ICFCodeMatch[]>([])
  const [selectedCodes, setSelectedCodes] = useState<string[]>([])
  const [scores, setScores] = useState<ScoreData[]>([])

  const handleCodeMatch = (matches: ICFCodeMatch[], text: string) => {
    setClinicalText(text)
    setMatchedCodes(matches)
    // 매칭된 코드 중 첫 번째를 기본 선택
    if (matches.length > 0 && selectedCodes.length === 0) {
      setSelectedCodes([matches[0].code])
    }
  }

  const handleSelectCodes = (codes: string[]) => {
    setSelectedCodes(codes)
    // 선택 해제된 코드의 점수 제거
    setScores(prev => prev.filter(s => codes.includes(s.code)))
  }

  const handleScoresChange = (newScores: ScoreData[]) => {
    setScores(newScores)
  }

  const selectedCodeInfo = matchedCodes.filter(m => selectedCodes.includes(m.code))

  return (
    <main>
      <div className="container">
        <header className="header">
          <h1 className="title">ICF 기반 임상언어분석</h1>
          <p className="description">
            임상 언어를 입력하면 관련 ICF 코드를 자동으로 찾아드립니다. 
            수행력과 능력을 점수화하여 보고서로 저장할 수 있습니다.
          </p>
        </header>

        <ClinicalLanguageInput onCodeMatch={handleCodeMatch} />

        {matchedCodes.length > 0 && (
          <>
            <CodeMatchResults 
              matches={matchedCodes}
              onSelectCodes={handleSelectCodes}
            />

            {selectedCodes.length > 0 && (
              <ScoreInput
                codes={selectedCodeInfo.map(m => ({ code: m.code, title: m.title }))}
                onScoresChange={handleScoresChange}
                clinicalText={clinicalText}
              />
            )}

            {scores.length > 0 && (
              <ReportGenerator
                clinicalText={clinicalText}
                matchedCodes={matchedCodes.filter(m => selectedCodes.includes(m.code))}
                scores={scores}
              />
            )}
          </>
        )}

        <Footer />
      </div>
    </main>
  )
}

