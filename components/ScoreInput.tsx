'use client'

import { useState, useEffect } from 'react'
import './ScoreInput.css'

interface ScoreRecommendation {
  performanceScore: number
  capacityScore: number
  rationale: string
}

export interface PerformanceQuality {
  safety: number // 안전성 (0-4)
  physicalEffort: number // 신체 노력정도 (0-4)
  efficiency: number // 효율성 (0-4)
  independence: number // 자립정도 (0-4)
  socialAppropriateness: number // 사회적 적절성 (0-4)
}

export interface ScoreData {
  code: string
  title: string
  performanceScore: number // 수행력 점수 (0-4)
  capacityScore: number // 능력 점수 (0-4)
  quality?: PerformanceQuality // 작업수행의 질
  notes?: string
}

interface ScoreInputProps {
  codes: Array<{ code: string; title: string }>
  onScoresChange: (scores: ScoreData[]) => void
  clinicalText?: string // 점수 추천을 위한 임상 언어
}

export default function ScoreInput({ codes, onScoresChange, clinicalText }: ScoreInputProps) {
  const [scores, setScores] = useState<Record<string, ScoreData>>({})
  const [recommendations, setRecommendations] = useState<Record<string, ScoreRecommendation>>({})
  const [loadingRecommendation, setLoadingRecommendation] = useState<string | null>(null)

  const handleScoreChange = (code: string, type: 'performance' | 'capacity', value: number) => {
    setScores(prev => {
      const updated = {
        ...prev,
        [code]: {
          ...prev[code],
          code,
          title: codes.find(c => c.code === code)?.title || '',
          performanceScore: type === 'performance' ? value : (prev[code]?.performanceScore ?? 0),
          capacityScore: type === 'capacity' ? value : (prev[code]?.capacityScore ?? 0),
          quality: prev[code]?.quality || {
            safety: 0,
            physicalEffort: 0,
            efficiency: 0,
            independence: 0,
            socialAppropriateness: 0
          },
          notes: prev[code]?.notes || ''
        }
      }
      return updated
    })
  }

  const handleQualityChange = (code: string, qualityType: keyof PerformanceQuality, value: number) => {
    setScores(prev => {
      const currentQuality = prev[code]?.quality || {
        safety: 0,
        physicalEffort: 0,
        efficiency: 0,
        independence: 0,
        socialAppropriateness: 0
      }
      
      const updated = {
        ...prev,
        [code]: {
          ...prev[code],
          code,
          title: codes.find(c => c.code === code)?.title || '',
          performanceScore: prev[code]?.performanceScore ?? 0,
          capacityScore: prev[code]?.capacityScore ?? 0,
          quality: {
            ...currentQuality,
            [qualityType]: value
          },
          notes: prev[code]?.notes || ''
        }
      }
      return updated
    })
  }

  const handleNotesChange = (code: string, notes: string) => {
    setScores(prev => {
      const updated = {
        ...prev,
        [code]: {
          ...prev[code],
          code,
          title: codes.find(c => c.code === code)?.title || '',
          performanceScore: prev[code]?.performanceScore ?? 0,
          capacityScore: prev[code]?.capacityScore ?? 0,
          quality: prev[code]?.quality || {
            safety: 0,
            physicalEffort: 0,
            efficiency: 0,
            independence: 0,
            socialAppropriateness: 0
          },
          notes
        }
      }
      return updated
    })
  }

  // 점수 추천 요청
  const getScoreRecommendation = async (code: string, title: string) => {
    if (!clinicalText || loadingRecommendation) return

    setLoadingRecommendation(code)
    try {
      const gasUrl = process.env.NEXT_PUBLIC_GAS_API_URL
      const apiUrl = gasUrl || '/api/icf/score-recommendation'
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          gasUrl
            ? { endpoint: 'score-recommendation', clinicalText, icfCode: code, icfTitle: title }
            : { clinicalText, icfCode: code, icfTitle: title }
        ),
      })

      if (response.ok) {
        const data = await response.json()
        setRecommendations(prev => ({
          ...prev,
          [code]: data
        }))
      }
    } catch (error) {
      console.error('점수 추천 오류:', error)
    } finally {
      setLoadingRecommendation(null)
    }
  }

  // 추천 점수 적용
  const applyRecommendation = (code: string) => {
    const rec = recommendations[code]
    if (rec) {
      handleScoreChange(code, 'performance', rec.performanceScore)
      handleScoreChange(code, 'capacity', rec.capacityScore)
    }
  }

  // scores가 변경될 때마다 부모에게 전달
  useEffect(() => {
    const scoreArray = Object.values(scores).filter(s => s.code)
    onScoresChange(scoreArray)
  }, [scores, onScoresChange])

  if (codes.length === 0) {
    return null
  }

  return (
    <div className="score-input">
      <div className="score-header">
        <h3 className="score-title">점수 입력</h3>
        <p className="score-description">
          선택한 ICF 코드에 대해 수행력과 능력을 점수화하세요.
        </p>
      </div>

      <div className="score-legend">
        <div className="legend-item">
          <strong>수행력 (Performance):</strong> 실제 환경에서의 수행 수준
        </div>
        <div className="legend-item">
          <strong>능력 (Capacity):</strong> 표준 환경에서의 최대 수행 능력
        </div>
        <div className="legend-scores">
          <span>0점: 문제 없음</span>
          <span>1점: 경미한 문제</span>
          <span>2점: 중간 정도 문제</span>
          <span>3점: 심각한 문제</span>
          <span>4점: 완전한 문제</span>
        </div>
        <div className="quality-legend">
          <strong>작업수행의 질:</strong>
          <ul>
            <li><strong>안전성:</strong> 작업 수행 시 안전한 방법으로 수행하는 정도</li>
            <li><strong>신체 노력정도:</strong> 작업 수행에 필요한 신체적 노력의 정도</li>
            <li><strong>효율성:</strong> 작업을 효율적으로 수행하는 정도</li>
            <li><strong>자립정도:</strong> 독립적으로 작업을 수행하는 정도</li>
            <li><strong>사회적 적절성:</strong> 사회적으로 적절한 방법으로 수행하는 정도</li>
          </ul>
        </div>
      </div>

      <div className="scores-list">
        {codes.map(({ code, title }) => {
          const score = scores[code] || { performanceScore: 0, capacityScore: 0, notes: '' }
          
          return (
            <div key={code} className="score-item">
              <div className="score-item-header">
                <div className="score-code-info">
                  <span className="score-code">{code}</span>
                  <span className="score-item-title">{title}</span>
                </div>
                {clinicalText && (
                  <div className="recommendation-actions">
                    {!recommendations[code] && (
                      <button
                        type="button"
                        className="recommend-button"
                        onClick={() => getScoreRecommendation(code, title)}
                        disabled={loadingRecommendation === code}
                      >
                        {loadingRecommendation === code ? '분석 중...' : '점수 추천'}
                      </button>
                    )}
                    {recommendations[code] && (
                      <button
                        type="button"
                        className="apply-button"
                        onClick={() => applyRecommendation(code)}
                      >
                        추천 점수 적용
                      </button>
                    )}
                  </div>
                )}
              </div>

              {recommendations[code] && (
                <div className="recommendation-box">
                  <div className="recommendation-scores">
                    <div className="recommendation-score-item">
                      <strong>수행력 (실제 환경):</strong> {recommendations[code].performanceScore}점
                    </div>
                    <div className="recommendation-score-item">
                      <strong>능력 (표준 환경):</strong> {recommendations[code].capacityScore}점
                    </div>
                    {recommendations[code].performanceScore !== recommendations[code].capacityScore && (
                      <div className="score-difference-note">
                        {recommendations[code].performanceScore > recommendations[code].capacityScore 
                          ? '수행력이 능력보다 높음: 실제 환경이 촉진적이거나 환경적 지원이 있음'
                          : '수행력이 능력보다 낮음: 실제 환경에 제약이 있음'}
                      </div>
                    )}
                  </div>
                  <p className="recommendation-rationale">
                    <strong>분석 근거:</strong> {recommendations[code].rationale}
                  </p>
                </div>
              )}

              <div className="score-inputs">
                <div className="score-input-group">
                  <label className="score-label">수행력</label>
                  <div className="score-options">
                    {[0, 1, 2, 3, 4].map(value => (
                      <label key={value} className="score-option">
                        <input
                          type="radio"
                          name={`perf-${code}`}
                          value={value}
                          checked={score.performanceScore === value}
                          onChange={() => handleScoreChange(code, 'performance', value)}
                        />
                        <span>{value}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="score-input-group">
                  <label className="score-label">능력</label>
                  <div className="score-options">
                    {[0, 1, 2, 3, 4].map(value => (
                      <label key={value} className="score-option">
                        <input
                          type="radio"
                          name={`cap-${code}`}
                          value={value}
                          checked={score.capacityScore === value}
                          onChange={() => handleScoreChange(code, 'capacity', value)}
                        />
                        <span>{value}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* 작업수행의 질 */}
              <div className="quality-section">
                <h4 className="quality-title">작업수행의 질</h4>
                <div className="quality-grid">
                  <div className="quality-item">
                    <label className="quality-label">안전성</label>
                    <div className="quality-options">
                      {[0, 1, 2, 3, 4].map(value => (
                        <label key={value} className="quality-option">
                          <input
                            type="radio"
                            name={`safety-${code}`}
                            value={value}
                            checked={(score.quality?.safety ?? 0) === value}
                            onChange={() => handleQualityChange(code, 'safety', value)}
                          />
                          <span>{value}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="quality-item">
                    <label className="quality-label">신체 노력정도</label>
                    <div className="quality-options">
                      {[0, 1, 2, 3, 4].map(value => (
                        <label key={value} className="quality-option">
                          <input
                            type="radio"
                            name={`effort-${code}`}
                            value={value}
                            checked={(score.quality?.physicalEffort ?? 0) === value}
                            onChange={() => handleQualityChange(code, 'physicalEffort', value)}
                          />
                          <span>{value}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="quality-item">
                    <label className="quality-label">효율성</label>
                    <div className="quality-options">
                      {[0, 1, 2, 3, 4].map(value => (
                        <label key={value} className="quality-option">
                          <input
                            type="radio"
                            name={`efficiency-${code}`}
                            value={value}
                            checked={(score.quality?.efficiency ?? 0) === value}
                            onChange={() => handleQualityChange(code, 'efficiency', value)}
                          />
                          <span>{value}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="quality-item">
                    <label className="quality-label">자립정도</label>
                    <div className="quality-options">
                      {[0, 1, 2, 3, 4].map(value => (
                        <label key={value} className="quality-option">
                          <input
                            type="radio"
                            name={`independence-${code}`}
                            value={value}
                            checked={(score.quality?.independence ?? 0) === value}
                            onChange={() => handleQualityChange(code, 'independence', value)}
                          />
                          <span>{value}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="quality-item">
                    <label className="quality-label">사회적 적절성</label>
                    <div className="quality-options">
                      {[0, 1, 2, 3, 4].map(value => (
                        <label key={value} className="quality-option">
                          <input
                            type="radio"
                            name={`social-${code}`}
                            value={value}
                            checked={(score.quality?.socialAppropriateness ?? 0) === value}
                            onChange={() => handleQualityChange(code, 'socialAppropriateness', value)}
                          />
                          <span>{value}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="score-notes">
                <label className="notes-label">메모</label>
                <textarea
                  className="notes-textarea"
                  value={score.notes || ''}
                  onChange={(e) => handleNotesChange(code, e.target.value)}
                  placeholder="추가 관찰 사항이나 평가 근거를 기록하세요..."
                  rows={2}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

