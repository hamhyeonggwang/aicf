'use client'

import { useMemo, useState } from 'react'
import type { ScoreData } from './ScoreInput'
import { getInterventionExamples } from '@/data/intervention-examples'
import { getCSVInterventions } from '@/data/csv-interventions'
import './ScoreAnalysis.css'

interface ScoreAnalysisProps {
  scores: ScoreData[]
  clinicalText: string
}

interface AIInterventionExamples {
  environmental: string[]
  task: string[]
  personal: string[]
}

export default function ScoreAnalysis({ scores, clinicalText }: ScoreAnalysisProps) {
  const [aiInterventions, setAiInterventions] = useState<Record<string, AIInterventionExamples>>({})
  const [loadingAI, setLoadingAI] = useState<Record<string, boolean>>({})

  // AI 중재 예시 요청
  const fetchAIIntervention = async (code: string, title: string, performanceScore: number, capacityScore: number) => {
    if (loadingAI[code] || aiInterventions[code]) return

    setLoadingAI(prev => ({ ...prev, [code]: true }))
    try {
      const response = await fetch('/api/icf/intervention-recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clinicalText,
          icfCode: code,
          icfTitle: title,
          performanceScore,
          capacityScore
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setAiInterventions(prev => ({
          ...prev,
          [code]: data
        }))
      }
    } catch (error) {
      console.error('AI 중재 예시 오류:', error)
    } finally {
      setLoadingAI(prev => ({ ...prev, [code]: false }))
    }
  }

  const analysis = useMemo(() => {
    if (scores.length === 0) return null

    // 수행력과 능력 차이 분석
    const differences = scores.map(score => ({
      code: score.code,
      title: score.title,
      performance: score.performanceScore,
      capacity: score.capacityScore,
      difference: score.performanceScore - score.capacityScore,
      absDifference: Math.abs(score.performanceScore - score.capacityScore)
    }))

    // 차이가 큰 항목 (환경적 요인 영향)
    const largeDifferenceItems = differences.filter(d => d.absDifference >= 2)
    
    // 수행력이 능력보다 낮은 항목 (환경적 제약)
    const performanceLowerItems = differences.filter(d => d.difference < 0)
    
    // 능력이 수행력보다 낮은 항목 (능력 자체의 문제)
    const capacityLowerItems = differences.filter(d => d.difference > 0)

    // 평균 차이
    const avgDifference = differences.reduce((sum, d) => sum + d.difference, 0) / differences.length

    // 분석 결과 생성
    const recommendations: string[] = []
    const findings: string[] = []

    // 1. 환경적 제약 분석
    if (performanceLowerItems.length > 0) {
      findings.push(`${performanceLowerItems.length}개 항목에서 수행력이 능력보다 낮게 나타났습니다.`)
      recommendations.push(
        `환경적 제약이 있는 항목들(${performanceLowerItems.map(i => i.code).join(', ')})에 대해 환경 수정 및 보조기구 활용을 고려해보세요.`
      )
    }

    // 2. 능력 자체의 문제
    if (capacityLowerItems.length > 0) {
      findings.push(`${capacityLowerItems.length}개 항목에서 능력 자체에 문제가 있습니다.`)
      recommendations.push(
        `능력 향상을 위한 중재가 필요한 항목들(${capacityLowerItems.map(i => i.code).join(', ')})에 대해 기능 훈련 및 치료적 접근을 권장합니다.`
      )
    }

    // 3. 큰 차이 항목
    if (largeDifferenceItems.length > 0) {
      findings.push(`${largeDifferenceItems.length}개 항목에서 수행력과 능력 간 큰 차이(2점 이상)가 있습니다.`)
      recommendations.push(
        `큰 차이를 보이는 항목들(${largeDifferenceItems.map(i => i.code).join(', ')})은 환경 요인 평가를 추가로 실시하여 저해요인과 촉진요인을 파악하는 것이 중요합니다.`
      )
    }

    // 4. 평균 차이 분석
    if (Math.abs(avgDifference) > 0.5) {
      if (avgDifference < 0) {
        findings.push('전반적으로 수행력이 능력보다 낮은 경향을 보입니다.')
        recommendations.push('환경적 지원 및 보조기구 활용을 통해 실제 수행력을 향상시킬 수 있습니다.')
      } else {
        findings.push('전반적으로 능력이 수행력보다 낮은 경향을 보입니다.')
        recommendations.push('기능 향상을 위한 치료적 중재가 우선적으로 필요합니다.')
      }
    } else {
      findings.push('수행력과 능력이 유사한 수준으로 나타났습니다.')
      recommendations.push('환경적 요인보다는 개인의 기능적 능력에 초점을 맞춘 중재가 적절합니다.')
    }

    // 5. 점수 분포 분석
    const highScoreItems = scores.filter(s => s.performanceScore >= 3 || s.capacityScore >= 3)
    if (highScoreItems.length > 0) {
      findings.push(`${highScoreItems.length}개 항목에서 심각한 문제(3점 이상)가 확인되었습니다.`)
      recommendations.push(
        `심각한 문제가 있는 항목들(${highScoreItems.map(s => s.code).join(', ')})에 대해 즉각적인 중재 및 지원이 필요합니다.`
      )
    }

    const lowScoreItems = scores.filter(s => s.performanceScore <= 1 && s.capacityScore <= 1)
    if (lowScoreItems.length > 0) {
      findings.push(`${lowScoreItems.length}개 항목에서 문제가 거의 없거나 경미한 수준입니다.`)
      recommendations.push(
        `양호한 항목들(${lowScoreItems.map(s => s.code).join(', ')})은 유지 및 예방적 접근을 통해 현재 수준을 보존하는 것이 중요합니다.`
      )
    }

    // 6. 중재 예시 생성 (환경/과제/개인 요인)
    const interventionExamples = scores
      .filter(s => s.performanceScore >= 2 || s.capacityScore >= 2) // 문제가 있는 항목만
      .map(score => {
        const baseExamples = getInterventionExamples(score.code)
        const csvExamples = getCSVInterventions(score.code)
        const aiExamples = aiInterventions[score.code]

        // CSV 예시를 환경/과제/개인 요인으로 분류 (간단한 키워드 기반)
        const csvByCategory = {
          environmental: csvExamples.filter(e => 
            e.includes('환경') || e.includes('보조') || e.includes('설치') || 
            e.includes('제공') || e.includes('공간') || e.includes('조명')
          ),
          task: csvExamples.filter(e => 
            e.includes('과제') || e.includes('훈련') || e.includes('연습') || 
            e.includes('활동') || e.includes('수행') || e.includes('목표')
          ),
          personal: csvExamples.filter(e => 
            e.includes('향상') || e.includes('증진') || e.includes('개발') || 
            e.includes('동기') || e.includes('습관') || e.includes('인식')
          )
        }

        // 기본 예시 + CSV 예시 + AI 예시 통합
        return {
          code: score.code,
          title: score.title,
          performanceScore: score.performanceScore,
          capacityScore: score.capacityScore,
          examples: {
            environmental: [
              ...baseExamples.environmental,
              ...csvByCategory.environmental.slice(0, 3), // 최대 3개
              ...(aiExamples?.environmental || [])
            ].filter((v, i, a) => a.indexOf(v) === i).slice(0, 6), // 중복 제거 및 최대 6개
            task: [
              ...baseExamples.task,
              ...csvByCategory.task.slice(0, 3),
              ...(aiExamples?.task || [])
            ].filter((v, i, a) => a.indexOf(v) === i).slice(0, 6),
            personal: [
              ...baseExamples.personal,
              ...csvByCategory.personal.slice(0, 3),
              ...(aiExamples?.personal || [])
            ].filter((v, i, a) => a.indexOf(v) === i).slice(0, 6)
          },
          hasAI: !!aiExamples,
          isLoadingAI: loadingAI[score.code]
        }
      })

    return {
      differences,
      findings,
      recommendations,
      largeDifferenceItems,
      performanceLowerItems,
      capacityLowerItems,
      avgDifference,
      interventionExamples
    }
  }, [scores])

  if (!analysis) {
    return (
      <div className="score-analysis">
        <p className="no-data">평가 점수가 없습니다. 점수를 입력해주세요.</p>
      </div>
    )
  }

  return (
    <div className="score-analysis">
      <h3 className="analysis-title">수행력-능력 차이 분석</h3>
      
      <div className="analysis-section">
        <h4 className="section-title">주요 발견 사항</h4>
        <ul className="findings-list">
          {analysis.findings.map((finding, idx) => (
            <li key={idx}>{finding}</li>
          ))}
        </ul>
      </div>

      <div className="analysis-section">
        <h4 className="section-title">중재 제언</h4>
        <ul className="recommendations-list">
          {analysis.recommendations.map((rec, idx) => (
            <li key={idx}>{rec}</li>
          ))}
        </ul>
      </div>

      {/* 환경/과제/개인 요인 중재 예시 */}
      {analysis.interventionExamples.length > 0 && (
        <div className="analysis-section">
          <h4 className="section-title">환경/과제/개인 요인 기반 중재 예시</h4>
          <p className="section-description">
            기본 예시, CSV 데이터 기반 예시, AI 분석 예시를 통합하여 제공합니다.
          </p>
          <div className="intervention-examples">
            {analysis.interventionExamples.map((item, idx) => (
              <div key={idx} className="intervention-item">
                <div className="intervention-header">
                  <div className="intervention-code-info">
                    <span className="intervention-code">{item.code}</span>
                    <span className="intervention-title">{item.title}</span>
                    <span className="intervention-scores">
                      (수행력: {item.performanceScore}점, 능력: {item.capacityScore}점)
                    </span>
                  </div>
                  <div className="intervention-actions">
                    {!item.hasAI && !item.isLoadingAI && (
                      <button
                        type="button"
                        className="ai-intervention-button"
                        onClick={() => fetchAIIntervention(
                          item.code,
                          item.title,
                          item.performanceScore,
                          item.capacityScore
                        )}
                      >
                        AI 맞춤 분석 추가
                      </button>
                    )}
                    {item.isLoadingAI && (
                      <span className="ai-loading">AI 분석 중...</span>
                    )}
                    {item.hasAI && (
                      <span className="ai-badge">AI 분석 포함</span>
                    )}
                  </div>
                </div>
                
                <div className="intervention-category">
                  <h5 className="category-title">환경 요인 중재</h5>
                  <p className="category-description">물리적, 사회적, 제도적 환경 수정</p>
                  <ul className="intervention-list">
                    {item.examples.environmental.map((example, i) => (
                      <li key={i}>{example}</li>
                    ))}
                  </ul>
                </div>

                <div className="intervention-category">
                  <h5 className="category-title">과제 요인 중재</h5>
                  <p className="category-description">과제 난이도, 복잡성, 목적 조정</p>
                  <ul className="intervention-list">
                    {item.examples.task.map((example, i) => (
                      <li key={i}>{example}</li>
                    ))}
                  </ul>
                </div>

                <div className="intervention-category">
                  <h5 className="category-title">개인 요인 중재</h5>
                  <p className="category-description">능력, 동기, 습관, 인지 향상</p>
                  <ul className="intervention-list">
                    {item.examples.personal.map((example, i) => (
                      <li key={i}>{example}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {analysis.largeDifferenceItems.length > 0 && (
        <div className="analysis-section">
          <h4 className="section-title">수행력-능력 차이가 큰 항목 (환경 요인 영향 가능)</h4>
          <table className="difference-table">
            <thead>
              <tr>
                <th>ICF 코드</th>
                <th>제목</th>
                <th>수행력</th>
                <th>능력</th>
                <th>차이</th>
              </tr>
            </thead>
            <tbody>
              {analysis.largeDifferenceItems.map((item, idx) => (
                <tr key={idx}>
                  <td className="code-cell">{item.code}</td>
                  <td>{item.title}</td>
                  <td>{item.performance}점</td>
                  <td>{item.capacity}점</td>
                  <td className={item.difference < 0 ? 'negative-diff' : 'positive-diff'}>
                    {item.difference > 0 ? '+' : ''}{item.difference}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="analysis-summary">
        <p><strong>평균 차이:</strong> {analysis.avgDifference.toFixed(2)}점</p>
        <p className="summary-note">
          {analysis.avgDifference < -0.5 
            ? '수행력이 능력보다 낮아 환경적 지원이 필요합니다.'
            : analysis.avgDifference > 0.5
            ? '능력이 수행력보다 낮아 기능 향상 중재가 필요합니다.'
            : '수행력과 능력이 유사한 수준입니다.'}
        </p>
      </div>
    </div>
  )
}


