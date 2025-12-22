'use client'

import './ScoreSummary.css'

interface ScoreSummaryProps {
  totalScore: number
  maxScore: number
  averageScore: number
  answeredCount: number
  totalCount: number
}

export default function ScoreSummary({
  totalScore,
  maxScore,
  averageScore,
  answeredCount,
  totalCount,
}: ScoreSummaryProps) {
  const completionPercentage = totalCount > 0 ? (answeredCount / totalCount) * 100 : 0
  const scorePercentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0

  return (
    <div className="score-summary">
      <h2 className="summary-title">평가 요약</h2>
      <div className="summary-grid">
        <div className="summary-card">
          <div className="summary-label">총점</div>
          <div className="summary-value">
            {totalScore.toFixed(1)} <span className="summary-unit">/ {maxScore}</span>
          </div>
          <div className="summary-progress">
            <div 
              className="summary-progress-bar" 
              style={{ width: `${scorePercentage}%` }}
            />
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-label">평균 점수</div>
          <div className="summary-value">
            {answeredCount > 0 ? averageScore.toFixed(2) : '0.00'} <span className="summary-unit">점</span>
          </div>
          <div className="summary-subtext">
            {answeredCount}개 항목 응답
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-label">진행률</div>
          <div className="summary-value">
            {completionPercentage.toFixed(0)}<span className="summary-unit">%</span>
          </div>
          <div className="summary-subtext">
            {answeredCount} / {totalCount} 항목 완료
          </div>
        </div>
      </div>
    </div>
  )
}




