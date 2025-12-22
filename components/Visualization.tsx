'use client'

import { useMemo } from 'react'
import type { AssessmentScore, AssessmentItem } from '@/types/icf'
import type { ICFCoreSet } from '@/types/core-set'
import './Visualization.css'

interface VisualizationProps {
  scores: Record<string, AssessmentScore>
  items: AssessmentItem[]
  coreSet?: ICFCoreSet | null
}

export default function Visualization({ scores, items, coreSet }: VisualizationProps) {
  // 도메인별 점수 집계
  const domainScores = useMemo(() => {
    const domainData: Record<string, { total: number; count: number; items: Array<{ code: string; score: number }> }> = {
      d: { total: 0, count: 0, items: [] },
      b: { total: 0, count: 0, items: [] },
      s: { total: 0, count: 0, items: [] },
      e: { total: 0, count: 0, items: [] }
    }

    // items를 사용하여 도메인 정보 가져오기
    const itemMap = new Map(items.map(item => [item.id, item]))

    Object.entries(scores).forEach(([itemId, score]) => {
      const item = itemMap.get(itemId)
      if (item) {
        const domain = item.domain
        if (domain && domainData[domain]) {
          domainData[domain].total += score.score
          domainData[domain].count += 1
          domainData[domain].items.push({
            code: item.icfCode,
            score: score.score
          })
        }
      }
    })

    return domainData
  }, [scores, items])

  // 도메인별 평균 점수 계산
  const domainAverages = useMemo(() => {
    return {
      d: domainScores.d.count > 0 ? domainScores.d.total / domainScores.d.count : 0,
      b: domainScores.b.count > 0 ? domainScores.b.total / domainScores.b.count : 0,
      s: domainScores.s.count > 0 ? domainScores.s.total / domainScores.s.count : 0,
      e: domainScores.e.count > 0 ? domainScores.e.total / domainScores.e.count : 0
    }
  }, [domainScores])

  // 전체 평균 점수
  const overallAverage = useMemo(() => {
    const total = Object.values(domainScores).reduce((sum, d) => sum + d.total, 0)
    const count = Object.values(domainScores).reduce((sum, d) => sum + d.count, 0)
    return count > 0 ? total / count : 0
  }, [domainScores])

  // 점수를 퍼센트로 변환 (0-4점 스케일을 0-100%로)
  const scoreToPercent = (score: number) => {
    return (score / 4) * 100
  }

  // 점수에 따른 색상 결정
  const getScoreColor = (score: number) => {
    if (score <= 1) return '#50c878' // 좋음 (녹색)
    if (score <= 2) return '#ffc107' // 보통 (노란색)
    if (score <= 3) return '#ff9800' // 나쁨 (주황색)
    return '#dc3545' // 매우 나쁨 (빨간색)
  }

  const getScoreLabel = (score: number) => {
    if (score <= 1) return '양호'
    if (score <= 2) return '보통'
    if (score <= 3) return '주의'
    return '심각'
  }

  return (
    <div className="visualization">
      <div className="visualization-header">
        <h2 className="visual-title">평가 결과 시각화</h2>
        <p className="visual-description">
          도메인별 평가 결과를 시각적으로 확인하세요.
        </p>
      </div>

      {/* 전체 요약 */}
      <div className="overall-summary">
        <div className="summary-card">
          <div className="summary-label">전체 평균 점수</div>
          <div className="summary-value" style={{ color: getScoreColor(overallAverage) }}>
            {overallAverage.toFixed(2)}점
          </div>
          <div className="summary-bar">
            <div
              className="summary-bar-fill"
              style={{
                width: `${scoreToPercent(overallAverage)}%`,
                backgroundColor: getScoreColor(overallAverage)
              }}
            />
          </div>
          <div className="summary-status">{getScoreLabel(overallAverage)}</div>
        </div>
      </div>

      {/* 도메인별 차트 */}
      <div className="domain-charts">
        {/* d (Activities & Participation) */}
        {domainScores.d.count > 0 && (
          <div className="domain-chart">
            <div className="chart-header">
              <h3 className="chart-title">d: 활동 및 참여</h3>
              <span className="chart-count">{domainScores.d.count}개 항목</span>
            </div>
            <div className="chart-content">
              <div className="chart-bar-container">
                <div className="chart-bar-label">평균 점수</div>
                <div className="chart-bar">
                  <div
                    className="chart-bar-fill domain-d"
                    style={{
                      width: `${scoreToPercent(domainAverages.d)}%`,
                      backgroundColor: getScoreColor(domainAverages.d)
                    }}
                  >
                    <span className="bar-value">{domainAverages.d.toFixed(2)}점</span>
                  </div>
                </div>
              </div>
              <div className="chart-items">
                {domainScores.d.items.map((item) => (
                  <div key={item.code} className="chart-item">
                    <span className="item-code">{item.code}</span>
                    <div className="item-bar">
                      <div
                        className="item-bar-fill"
                        style={{
                          width: `${scoreToPercent(item.score)}%`,
                          backgroundColor: getScoreColor(item.score)
                        }}
                      />
                    </div>
                    <span className="item-score">{item.score}점</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* b (Body Functions) */}
        {domainScores.b.count > 0 && (
          <div className="domain-chart">
            <div className="chart-header">
              <h3 className="chart-title">b: 신체 기능</h3>
              <span className="chart-count">{domainScores.b.count}개 항목</span>
            </div>
            <div className="chart-content">
              <div className="chart-bar-container">
                <div className="chart-bar-label">평균 점수</div>
                <div className="chart-bar">
                  <div
                    className="chart-bar-fill domain-b"
                    style={{
                      width: `${scoreToPercent(domainAverages.b)}%`,
                      backgroundColor: getScoreColor(domainAverages.b)
                    }}
                  >
                    <span className="bar-value">{domainAverages.b.toFixed(2)}점</span>
                  </div>
                </div>
              </div>
              <div className="chart-items">
                {domainScores.b.items.map((item) => (
                  <div key={item.code} className="chart-item">
                    <span className="item-code">{item.code}</span>
                    <div className="item-bar">
                      <div
                        className="item-bar-fill"
                        style={{
                          width: `${scoreToPercent(item.score)}%`,
                          backgroundColor: getScoreColor(item.score)
                        }}
                      />
                    </div>
                    <span className="item-score">{item.score}점</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* s (Body Structures) */}
        {domainScores.s.count > 0 && (
          <div className="domain-chart">
            <div className="chart-header">
              <h3 className="chart-title">s: 신체 구조</h3>
              <span className="chart-count">{domainScores.s.count}개 항목</span>
            </div>
            <div className="chart-content">
              <div className="chart-bar-container">
                <div className="chart-bar-label">평균 점수</div>
                <div className="chart-bar">
                  <div
                    className="chart-bar-fill domain-s"
                    style={{
                      width: `${scoreToPercent(domainAverages.s)}%`,
                      backgroundColor: getScoreColor(domainAverages.s)
                    }}
                  >
                    <span className="bar-value">{domainAverages.s.toFixed(2)}점</span>
                  </div>
                </div>
              </div>
              <div className="chart-items">
                {domainScores.s.items.map((item) => (
                  <div key={item.code} className="chart-item">
                    <span className="item-code">{item.code}</span>
                    <div className="item-bar">
                      <div
                        className="item-bar-fill"
                        style={{
                          width: `${scoreToPercent(item.score)}%`,
                          backgroundColor: getScoreColor(item.score)
                        }}
                      />
                    </div>
                    <span className="item-score">{item.score}점</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* e (Environmental Factors) */}
        {domainScores.e.count > 0 && (
          <div className="domain-chart">
            <div className="chart-header">
              <h3 className="chart-title">e: 환경 요인</h3>
              <span className="chart-count">{domainScores.e.count}개 항목</span>
            </div>
            <div className="chart-content">
              <div className="chart-bar-container">
                <div className="chart-bar-label">평균 점수</div>
                <div className="chart-bar">
                  <div
                    className="chart-bar-fill domain-e"
                    style={{
                      width: `${scoreToPercent(domainAverages.e)}%`,
                      backgroundColor: getScoreColor(domainAverages.e)
                    }}
                  >
                    <span className="bar-value">{domainAverages.e.toFixed(2)}점</span>
                  </div>
                </div>
              </div>
              <div className="chart-items">
                {domainScores.e.items.map((item) => (
                  <div key={item.code} className="chart-item">
                    <span className="item-code">{item.code}</span>
                    <div className="item-bar">
                      <div
                        className="item-bar-fill"
                        style={{
                          width: `${scoreToPercent(item.score)}%`,
                          backgroundColor: getScoreColor(item.score)
                        }}
                      />
                    </div>
                    <span className="item-score">{item.score}점</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 범례 */}
      <div className="visualization-legend">
        <h4>점수 범례</h4>
        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#50c878' }} />
            <span>0-1점: 양호</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#ffc107' }} />
            <span>1-2점: 보통</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#ff9800' }} />
            <span>2-3점: 주의</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#dc3545' }} />
            <span>3-4점: 심각</span>
          </div>
        </div>
      </div>
    </div>
  )
}

