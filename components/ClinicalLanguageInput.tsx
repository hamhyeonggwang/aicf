'use client'

import { useState } from 'react'
import './ClinicalLanguageInput.css'

interface ICFCodeMatch {
  code: string
  title: string
  confidence: number
  rationale: string
}

interface ClinicalLanguageInputProps {
  onCodeMatch: (matches: ICFCodeMatch[], text: string) => void
}

export default function ClinicalLanguageInput({ onCodeMatch }: ClinicalLanguageInputProps) {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // 간단한 키워드 기반 매핑 (실제로는 sLLM을 사용해야 함)
  const findICFCodes = (text: string): ICFCodeMatch[] => {
    const keywords: Record<string, { code: string; title: string; keywords: string[]; priority?: boolean }> = {
      // 손 기능 관련 (높은 우선순위)
      d440: { 
        code: 'd440', 
        title: '손 사용하기', 
        keywords: ['손기능', '손 기능', '손 사용', '손 움직임', '손 조작', '손동작', '손의 기능', 'fine motor', 'hand function', 'hand use', 'manual dexterity'],
        priority: true
      },
      b760: { 
        code: 'b760', 
        title: '손과 팔의 운동 조절', 
        keywords: ['손 조절', '손 운동', '손 협응', '손 조정', '어눌한 손', '손 움직임 조절', 'hand control', 'hand coordination', 'motor control'],
        priority: true
      },
      // 활동 관련
      d430: { code: 'd430', title: '물건 들어올리기 및 운반하기', keywords: ['들어올리기', '운반', '물건 들기', 'lifting', 'carrying'] },
      d445: { code: 'd445', title: '손과 팔 사용하기', keywords: ['손과 팔', '상지 사용', 'upper limb use'] },
      // 이동 관련
      d450: { code: 'd450', title: '걷기', keywords: ['걷기', '보행', '걸음', '도보', 'walking', 'gait'] },
      d455: { code: 'd455', title: '이동하기', keywords: ['이동', '움직임', 'mobility', 'movement'] },
      d460: { code: 'd460', title: '다양한 장소로 이동하기', keywords: ['외출', '나가기', '장소 이동', 'going out'] },
      // 일상생활 활동
      d510: { code: 'd510', title: '씻기', keywords: ['씻기', '목욕', '샤워', '세면', 'washing', 'bathing'] },
      d520: { code: 'd520', title: '옷 입기', keywords: ['옷 입기', '착의', '의복', 'dressing', 'clothing'] },
      d550: { code: 'd550', title: '먹기', keywords: ['먹기', '식사', '섭취', 'eating', 'feeding'] },
      // 대인관계
      d710: { code: 'd710', title: '기본적 대인관계', keywords: ['대인관계', '관계', '인간관계', 'interpersonal'] },
      d720: { code: 'd720', title: '복잡한 대인관계', keywords: ['사회적 관계', '복잡한 관계', 'social relationship'] },
      // 신체 기능
      b130: { code: 'b130', title: '에너지 및 동기', keywords: ['에너지', '동기', '피로', 'energy', 'motivation'] },
      // 신체 구조 (낮은 우선순위 - 구조적 문제가 명시되지 않으면 제외)
      s730: { 
        code: 's730', 
        title: '상지 구조', 
        keywords: ['팔 구조', '손 구조', '상지 구조', 'upper limb structure', 'arm structure', 'hand structure'],
        priority: false
      },
      // 환경 요인
      e110: { code: 'e110', title: '제품 및 기술', keywords: ['보조기구', '도구', '제품', 'assistive device'] },
    }

    const matches: ICFCodeMatch[] = []
    const lowerText = text.toLowerCase()

    // 우선순위가 높은 코드부터 매칭
    const priorityCodes = Object.values(keywords).filter(k => k.priority !== false)
    const normalCodes = Object.values(keywords).filter(k => k.priority === false)

    const processCode = ({ code, title, keywords: kw }: typeof keywords[string]) => {
      // 더 정확한 매칭을 위해 긴 키워드부터 확인
      const sortedKeywords = [...kw].sort((a, b) => b.length - a.length)
      
      for (const keyword of sortedKeywords) {
        const keywordLower = keyword.toLowerCase().replace(/\s+/g, '')
        const textNormalized = lowerText.replace(/\s+/g, '')
        
        // 정확한 키워드 매칭 (공백 제거 후)
        if (textNormalized.includes(keywordLower)) {
          // 이미 추가된 코드면 confidence만 높임
          const existingMatch = matches.find(m => m.code === code)
          if (existingMatch) {
            existingMatch.confidence = Math.min(0.95, existingMatch.confidence + 0.2)
            return
          }
          
          matches.push({
            code,
            title,
            confidence: 0.7 + (kw.length > 5 ? 0.1 : 0), // 키워드가 많을수록 기본 confidence 높임
            rationale: `입력하신 내용에서 "${keyword}" 관련 표현이 발견되어 ${code} 코드와 매칭됩니다.`
          })
          return // 첫 번째 매칭만 사용
        }
      }
    }

    // 우선순위 코드 먼저 처리
    priorityCodes.forEach(processCode)
    
    // 일반 코드 처리 (모든 관련 코드를 찾기 위해 항상 처리)
    normalCodes.forEach(processCode)

    // "종이접기", "접기", "만들기" 같은 활동 키워드 체크
    const activityKeywords = ['종이접기', '접기', '만들기', '조작', '작업']
    const hasActivity = activityKeywords.some(kw => lowerText.includes(kw))
    
    if (hasActivity) {
      // d440 (손 사용하기)가 없으면 추가
      if (!matches.find(m => m.code === 'd440')) {
        matches.push({
          code: 'd440',
          title: '손 사용하기',
          confidence: 0.8,
          rationale: '종이접기, 만들기 등의 활동은 손 사용 능력과 관련이 있어 d440 코드와 매칭됩니다.'
        })
      } else {
        // 이미 있으면 confidence 높임
        const d440Match = matches.find(m => m.code === 'd440')
        if (d440Match) {
          d440Match.confidence = Math.min(0.95, d440Match.confidence + 0.15)
        }
      }
    }

    // "어눌한", "어려움", "장애", "문제" 같은 표현이 있으면 confidence 조정
    const difficultyKeywords = ['어눌', '어려움', '장애', '문제', '제한', '불가능', '어색']
    const hasDifficulty = difficultyKeywords.some(kw => lowerText.includes(kw))
    
    if (hasDifficulty) {
      matches.forEach(match => {
        match.confidence = Math.min(0.95, match.confidence + 0.1)
      })
    }

    // 관련성이 낮은 매칭 제거 (confidence가 너무 낮거나, 구조적 문제가 명시되지 않은 경우)
    const filteredMatches = matches.filter(match => {
      // s730 (상지 구조)는 "구조", "손상", "절단" 같은 명시적 표현이 없으면 제외
      if (match.code === 's730') {
        const structureKeywords = ['구조', '손상', '절단', '절제', '구조적', '해부학적']
        return structureKeywords.some(kw => lowerText.includes(kw))
      }
      return match.confidence >= 0.5 // confidence 0.5 이상만 유지
    })

    return filteredMatches.sort((a, b) => b.confidence - a.confidence)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    setIsLoading(true)
    
    try {
      // Google Apps Script API 또는 로컬 API 호출
      const gasUrl = process.env.NEXT_PUBLIC_GAS_API_URL
      const apiUrl = gasUrl || '/api/icf/match'
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          gasUrl 
            ? { endpoint: 'match', clinicalText: input } // Google Apps Script 형식
            : { clinicalText: input } // 로컬 API 형식
        ),
      })

      if (!response.ok) {
        throw new Error(`API 오류: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      // API 응답이 있으면 사용
      if (data.matches && data.matches.length > 0) {
        onCodeMatch(data.matches, input)
      } else {
        // 매칭 결과가 없으면 키워드 매칭으로 폴백
        const fallbackMatches = findICFCodes(input)
        onCodeMatch(fallbackMatches, input)
      }
    } catch (error: any) {
      console.error('ICF 매칭 오류:', error)
      
      // 에러 발생 시 키워드 매칭으로 폴백
      const fallbackMatches = findICFCodes(input)
      onCodeMatch(fallbackMatches, input)
      
      // 사용자에게 알림 (선택사항)
      // alert('AI 매칭에 실패하여 기본 매칭을 사용합니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="clinical-language-input">
      <div className="input-header">
        <h2 className="input-title">임상 언어 입력</h2>
        <p className="input-description">
          환자의 상태나 평가 내용을 임상 언어로 입력하세요. 
          입력하신 내용을 분석하여 관련된 ICF 코드를 제시해드립니다.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="input-form">
        <div className="form-group">
          <label htmlFor="clinical-text" className="form-label">
            임상 언어 입력
          </label>
          <textarea
            id="clinical-text"
            className="clinical-textarea"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="예: 환자는 평지에서 독립적으로 걷기가 가능하나, 계단 오르기 시 어려움을 보입니다. 일상생활 활동 중 옷 입기와 식사는 독립적으로 수행 가능합니다."
            rows={6}
            required
          />
        </div>

        <button 
          type="submit" 
          className="submit-button"
          disabled={isLoading || !input.trim()}
        >
          {isLoading ? '분석 중...' : 'ICF 코드 찾기'}
        </button>
      </form>
    </div>
  )
}

export type { ICFCodeMatch }

