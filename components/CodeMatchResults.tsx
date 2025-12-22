'use client'

import { useState, useMemo } from 'react'
import type { ICFCodeMatch } from './ClinicalLanguageInput'
import './CodeMatchResults.css'

interface CodeMatchResultsProps {
  matches: ICFCodeMatch[]
  onSelectCodes: (selectedCodes: string[]) => void
}

type DomainFilter = 'all' | 'b' | 's' | 'd' | 'e'

const DOMAIN_LABELS: Record<string, string> = {
  all: '전체',
  b: '신체 기능 (Body Functions)',
  s: '신체 구조 (Body Structures)',
  d: '활동 및 참여 (Activities & Participation)',
  e: '환경 요인 (Environmental Factors)'
}

// ICF 코드에서 도메인 추출 (첫 번째 문자)
const getDomainFromCode = (code: string): 'b' | 's' | 'd' | 'e' | null => {
  const firstChar = code.charAt(0).toLowerCase()
  if (['b', 's', 'd', 'e'].includes(firstChar)) {
    return firstChar as 'b' | 's' | 'd' | 'e'
  }
  return null
}

// 매칭 근거 간결화 함수
const simplifyRationale = (rationale: string): string => {
  // 반복되는 문구 제거
  let simplified = rationale
  
  // "입력하신 내용에서" 같은 반복 문구 제거
  simplified = simplified.replace(/입력하신 내용에서\s*/g, '')
  simplified = simplified.replace(/관련 표현이 발견되어\s*/g, '')
  simplified = simplified.replace(/코드와 매칭됩니다\.?/g, '')
  simplified = simplified.replace(/매칭됩니다\.?/g, '')
  
  // 중복된 설명 제거
  simplified = simplified.replace(/\s+/g, ' ').trim()
  
  // 문장 끝 정리
  if (!simplified.endsWith('.') && !simplified.endsWith('다')) {
    simplified += '.'
  }
  
  return simplified
}

export default function CodeMatchResults({ matches, onSelectCodes }: CodeMatchResultsProps) {
  const [selectedCodes, setSelectedCodes] = useState<Set<string>>(new Set())
  const [domainFilter, setDomainFilter] = useState<DomainFilter>('all')

  // 도메인별 필터링된 매칭 결과
  const filteredMatches = useMemo(() => {
    if (domainFilter === 'all') {
      return matches
    }
    return matches.filter(match => {
      const domain = getDomainFromCode(match.code)
      return domain === domainFilter
    })
  }, [matches, domainFilter])

  // 도메인별 통계
  const domainStats = useMemo(() => {
    const stats: Record<string, number> = {
      all: matches.length,
      b: 0,
      s: 0,
      d: 0,
      e: 0
    }
    
    matches.forEach(match => {
      const domain = getDomainFromCode(match.code)
      if (domain) {
        stats[domain] = (stats[domain] || 0) + 1
      }
    })
    
    return stats
  }, [matches])

  const handleToggleCode = (code: string) => {
    const newSelected = new Set(selectedCodes)
    if (newSelected.has(code)) {
      newSelected.delete(code)
    } else {
      newSelected.add(code)
    }
    setSelectedCodes(newSelected)
    onSelectCodes(Array.from(newSelected))
  }

  const handleSelectAll = () => {
    const allCodes = new Set(filteredMatches.map(m => m.code))
    setSelectedCodes(allCodes)
    onSelectCodes(Array.from(allCodes))
  }

  const handleDeselectAll = () => {
    setSelectedCodes(new Set())
    onSelectCodes([])
  }

  if (matches.length === 0) {
    return (
      <div className="code-match-results empty">
        <p>매칭된 ICF 코드가 없습니다. 다른 임상 언어로 다시 시도해보세요.</p>
      </div>
    )
  }

  return (
    <div className="code-match-results">
      <div className="results-header">
        <h3 className="results-title">
          발견된 ICF 코드 ({matches.length}개)
        </h3>
        <div className="results-actions">
          <button onClick={handleSelectAll} type="button" className="action-button">
            모두 선택
          </button>
          <button onClick={handleDeselectAll} type="button" className="action-button">
            모두 해제
          </button>
        </div>
      </div>

      {/* 도메인 필터 */}
      <div className="domain-filter">
        <div className="filter-label">분류 필터:</div>
        <div className="filter-buttons">
          {(['all', 'b', 's', 'd', 'e'] as DomainFilter[]).map(domain => (
            <button
              key={domain}
              type="button"
              className={`filter-button ${domainFilter === domain ? 'active' : ''}`}
              onClick={() => setDomainFilter(domain)}
            >
              {DOMAIN_LABELS[domain]} ({domainStats[domain] || 0})
            </button>
          ))}
        </div>
      </div>

      <div className="matches-list">
        {filteredMatches.length === 0 ? (
          <div className="no-matches">
            <p>선택한 분류에 해당하는 코드가 없습니다.</p>
          </div>
        ) : (
          filteredMatches.map((match) => (
          <div
            key={match.code}
            className={`match-card ${selectedCodes.has(match.code) ? 'selected' : ''}`}
            onClick={() => handleToggleCode(match.code)}
          >
            <div className="match-header">
              <div className="match-code-info">
                <input
                  type="checkbox"
                  checked={selectedCodes.has(match.code)}
                  onChange={() => handleToggleCode(match.code)}
                  onClick={(e) => e.stopPropagation()}
                />
                <span className="code">{match.code}</span>
                <span className="title">{match.title}</span>
              </div>
              <div className="confidence-badge" style={{
                backgroundColor: match.confidence > 0.7 ? '#50c878' : match.confidence > 0.4 ? '#ffc107' : '#ff9800'
              }}>
                {Math.round(match.confidence * 100)}% 일치
              </div>
            </div>
            <p className="rationale">{simplifyRationale(match.rationale)}</p>
          </div>
          ))
        )}
      </div>

      {selectedCodes.size > 0 && (
        <div className="selection-summary">
          {selectedCodes.size}개 코드가 선택되었습니다.
        </div>
      )}
    </div>
  )
}




