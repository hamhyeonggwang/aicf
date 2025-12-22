'use client'

import { useRef, useEffect } from 'react'
import type { ScoreData } from './ScoreInput'
import './RadarChart.css'

interface RadarChartProps {
  scores: ScoreData[]
}

export default function RadarChart({ scores }: RadarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || scores.length === 0) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Canvas 크기 설정
    const size = Math.min(500, window.innerWidth - 40)
    canvas.width = size
    canvas.height = size
    const centerX = size / 2
    const centerY = size / 2
    const radius = size * 0.35

    // 배경 지우기
    ctx.clearRect(0, 0, size, size)

    const numPoints = scores.length
    if (numPoints < 2 || numPoints > 8) return

    // 각도 계산 (위에서 시작, 시계방향)
    const angleStep = (2 * Math.PI) / numPoints
    const startAngle = -Math.PI / 2 // 위쪽부터 시작

    // 그리드 그리기
    ctx.strokeStyle = '#e0e0e0'
    ctx.lineWidth = 1

    // 동심원 그리기 (0, 1, 2, 3, 4점)
    for (let level = 0; level <= 4; level++) {
      const levelRadius = (radius * level) / 4
      ctx.beginPath()
      ctx.arc(centerX, centerY, levelRadius, 0, 2 * Math.PI)
      ctx.stroke()
      
      // 점수 레벨 라벨
      if (level > 0) {
        ctx.fillStyle = '#999'
        ctx.font = '10px Arial'
        ctx.textAlign = 'left'
        ctx.textBaseline = 'middle'
        ctx.fillText(`${level}`, centerX + levelRadius + 5, centerY)
      }
    }

    // 축 그리기
    for (let i = 0; i < numPoints; i++) {
      const angle = startAngle + i * angleStep
      const x = centerX + radius * Math.cos(angle)
      const y = centerY + radius * Math.sin(angle)

      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(x, y)
      ctx.stroke()
    }

    // 점수 데이터를 좌표로 변환
    const getPoint = (score: number, index: number) => {
      const angle = startAngle + index * angleStep
      const distance = (radius * score) / 4
      return {
        x: centerX + distance * Math.cos(angle),
        y: centerY + distance * Math.sin(angle)
      }
    }

    // 능력 점수 영역 그리기
    if (scores.some(s => s.capacityScore > 0)) {
      ctx.fillStyle = 'rgba(74, 144, 226, 0.3)'
      ctx.strokeStyle = '#4a90e2'
      ctx.lineWidth = 2
      ctx.beginPath()

      const firstCapacityPoint = getPoint(scores[0].capacityScore, 0)
      ctx.moveTo(firstCapacityPoint.x, firstCapacityPoint.y)

      for (let i = 1; i < numPoints; i++) {
        const point = getPoint(scores[i].capacityScore, i)
        ctx.lineTo(point.x, point.y)
      }
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
    }

    // 수행력 점수 영역 그리기
    if (scores.some(s => s.performanceScore > 0)) {
      ctx.fillStyle = 'rgba(40, 167, 69, 0.3)'
      ctx.strokeStyle = '#28a745'
      ctx.lineWidth = 2
      ctx.beginPath()

      const firstPerformancePoint = getPoint(scores[0].performanceScore, 0)
      ctx.moveTo(firstPerformancePoint.x, firstPerformancePoint.y)

      for (let i = 1; i < numPoints; i++) {
        const point = getPoint(scores[i].performanceScore, i)
        ctx.lineTo(point.x, point.y)
      }
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
    }

    // 점수 라벨 그리기
    ctx.fillStyle = '#333'
    ctx.font = '12px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    for (let i = 0; i < numPoints; i++) {
      const angle = startAngle + i * angleStep
      const labelRadius = radius + 35
      const labelX = centerX + labelRadius * Math.cos(angle)
      const labelY = centerY + labelRadius * Math.sin(angle)

      // 코드 라벨
      ctx.fillStyle = '#333'
      ctx.font = 'bold 12px Arial'
      ctx.fillText(scores[i].code, labelX, labelY - 15)

      // 제목 라벨 (짧게)
      ctx.fillStyle = '#666'
      ctx.font = '10px Arial'
      const shortTitle = scores[i].title.length > 10 
        ? scores[i].title.substring(0, 10) + '...' 
        : scores[i].title
      ctx.fillText(shortTitle, labelX, labelY)

      // 점수 표시
      const capacityPoint = getPoint(scores[i].capacityScore, i)
      const performancePoint = getPoint(scores[i].performanceScore, i)

      // 능력 점수
      if (scores[i].capacityScore > 0) {
        ctx.fillStyle = '#4a90e2'
        ctx.font = 'bold 11px Arial'
        ctx.fillText(`C:${scores[i].capacityScore}`, capacityPoint.x, capacityPoint.y - 8)
      }

      // 수행력 점수
      if (scores[i].performanceScore > 0) {
        ctx.fillStyle = '#28a745'
        ctx.font = 'bold 11px Arial'
        ctx.fillText(`P:${scores[i].performanceScore}`, performancePoint.x, performancePoint.y + 8)
      }
    }

    // 범례 그리기
    const legendY = size - 60
    ctx.fillStyle = '#4a90e2'
    ctx.fillRect(20, legendY, 15, 15)
    ctx.fillStyle = '#333'
    ctx.font = '12px Arial'
    ctx.textAlign = 'left'
    ctx.fillText('능력 (Capacity)', 40, legendY + 12)

    ctx.fillStyle = '#28a745'
    ctx.fillRect(20, legendY + 25, 15, 15)
    ctx.fillStyle = '#333'
    ctx.fillText('수행력 (Performance)', 40, legendY + 37)

    // 중심점 표시
    ctx.fillStyle = '#333'
    ctx.beginPath()
    ctx.arc(centerX, centerY, 3, 0, 2 * Math.PI)
    ctx.fill()
  }, [scores])

  if (scores.length < 2 || scores.length > 8) {
    return (
      <div className="radar-chart-container">
        <p className="radar-chart-error">
          그래프는 2개 이상 8개 이하의 코드에서만 표시됩니다.
          (현재: {scores.length}개)
        </p>
      </div>
    )
  }

  return (
    <div className="radar-chart-container">
      <h3 className="radar-chart-title">능력-수행력 비교 그래프</h3>
      <p className="radar-chart-description">
        {scores.length}개 항목의 능력과 수행력을 비교합니다.
      </p>
      <div className="radar-chart-wrapper">
        <canvas ref={canvasRef} className="radar-chart-canvas" />
      </div>
      <div className="radar-chart-legend">
        <div className="legend-item">
          <span className="legend-color capacity"></span>
          <span>능력 (Capacity): 표준 환경에서의 최대 수행 능력</span>
        </div>
        <div className="legend-item">
          <span className="legend-color performance"></span>
          <span>수행력 (Performance): 실제 환경에서의 수행 수준</span>
        </div>
      </div>
    </div>
  )
}


