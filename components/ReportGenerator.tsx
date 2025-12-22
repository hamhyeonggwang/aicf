'use client'

import { useRef } from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import type { ScoreData } from './ScoreInput'
import type { ICFCodeMatch } from './ClinicalLanguageInput'
import ScoreAnalysis from './ScoreAnalysis'
import RadarChart from './RadarChart'
import './ReportGenerator.css'

// 매칭 근거 간결화 함수
const simplifyRationale = (rationale: string): string => {
  let simplified = rationale
  simplified = simplified.replace(/입력하신 내용에서\s*/g, '')
  simplified = simplified.replace(/관련 표현이 발견되어\s*/g, '')
  simplified = simplified.replace(/코드와 매칭됩니다\.?/g, '')
  simplified = simplified.replace(/매칭됩니다\.?/g, '')
  simplified = simplified.replace(/\s+/g, ' ').trim()
  if (!simplified.endsWith('.') && !simplified.endsWith('다')) {
    simplified += '.'
  }
  return simplified
}

interface ReportGeneratorProps {
  clinicalText: string
  matchedCodes: ICFCodeMatch[]
  scores: ScoreData[]
}

export default function ReportGenerator({ clinicalText, matchedCodes, scores }: ReportGeneratorProps) {
  const reportRef = useRef<HTMLDivElement>(null)

  const generatePDF = async () => {
    if (!reportRef.current) return

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      
      // Canvas 크기를 PDF 크기에 맞게 조정
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const widthRatio = pdfWidth / imgWidth
      const heightRatio = pdfHeight / imgHeight
      const ratio = Math.min(widthRatio, heightRatio) * 0.264583 // px to mm 변환
      
      const imgScaledWidth = imgWidth * ratio
      const imgScaledHeight = imgHeight * ratio

      // 첫 페이지에 이미지 추가
      pdf.addImage(imgData, 'PNG', 0, 0, imgScaledWidth, imgScaledHeight)

      // 내용이 한 페이지를 넘어가는 경우에만 추가 페이지 생성
      if (imgScaledHeight > pdfHeight) {
        let heightLeft = imgScaledHeight - pdfHeight
        let position = pdfHeight

        while (heightLeft > 0) {
          pdf.addPage()
          pdf.addImage(imgData, 'PNG', 0, -position, imgScaledWidth, imgScaledHeight)
          position += pdfHeight
          heightLeft -= pdfHeight
        }
      }

      const fileName = `ICF_평가보고서_${new Date().toISOString().split('T')[0]}.pdf`
      pdf.save(fileName)
    } catch (error) {
      console.error('PDF 생성 중 오류:', error)
      alert('PDF 생성 중 오류가 발생했습니다.')
    }
  }

  const getScoreLabel = (score: number) => {
    if (score === 0) return '문제 없음'
    if (score === 1) return '경미한 문제'
    if (score === 2) return '중간 정도 문제'
    if (score === 3) return '심각한 문제'
    return '완전한 문제'
  }

  return (
    <>
      <div className="report-generator">
        <div className="report-header-section">
          <h2 className="report-title">평가 보고서</h2>
          <button className="pdf-button" onClick={generatePDF} type="button">
            PDF로 저장
          </button>
        </div>

        <div ref={reportRef} className="report-content">
          <div className="report-header">
            <h1>ICF 기반 평가 보고서</h1>
            <p className="report-date">생성일: {new Date().toLocaleDateString('ko-KR')}</p>
          </div>

          <div className="report-section">
            <h2>1. 입력된 임상 언어</h2>
            <div className="clinical-text-box">
              {clinicalText}
            </div>
          </div>

          <div className="report-section">
            <h2>2. 매칭된 ICF 코드</h2>
            <table className="codes-table">
              <thead>
                <tr>
                  <th>ICF 코드</th>
                  <th>제목</th>
                  <th>일치도</th>
                  <th>매칭 근거</th>
                </tr>
              </thead>
              <tbody>
                {matchedCodes.map((match) => (
                  <tr key={match.code}>
                    <td className="code-cell">{match.code}</td>
                    <td>{match.title}</td>
                    <td>{Math.round(match.confidence * 100)}%</td>
                    <td>{simplifyRationale(match.rationale)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="report-section">
            <h2>3. 평가 점수</h2>
            <table className="scores-table">
              <thead>
                <tr>
                  <th>ICF 코드</th>
                  <th>제목</th>
                  <th>수행력</th>
                  <th>능력</th>
                  <th>작업수행의 질</th>
                  <th>메모</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((score) => (
                  <tr key={score.code}>
                    <td className="code-cell">{score.code}</td>
                    <td>{score.title}</td>
                    <td>
                      <span className="score-value">{score.performanceScore}점</span>
                      <span className="score-label-small">({getScoreLabel(score.performanceScore)})</span>
                    </td>
                    <td>
                      <span className="score-value">{score.capacityScore}점</span>
                      <span className="score-label-small">({getScoreLabel(score.capacityScore)})</span>
                    </td>
                    <td className="quality-cell">
                      {score.quality ? (
                        <div className="quality-scores">
                          <div>안전성: {score.quality.safety}점</div>
                          <div>신체 노력: {score.quality.physicalEffort}점</div>
                          <div>효율성: {score.quality.efficiency}점</div>
                          <div>자립정도: {score.quality.independence}점</div>
                          <div>사회적 적절성: {score.quality.socialAppropriateness}점</div>
                        </div>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td>{score.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="report-section">
            <h2>4. 요약</h2>
            <div className="summary-box">
              <p><strong>총 평가 항목:</strong> {scores.length}개</p>
              <p><strong>평균 수행력 점수:</strong> {
                scores.length > 0 
                  ? (scores.reduce((sum, s) => sum + s.performanceScore, 0) / scores.length).toFixed(2)
                  : 0
              }점</p>
              <p><strong>평균 능력 점수:</strong> {
                scores.length > 0
                  ? (scores.reduce((sum, s) => sum + s.capacityScore, 0) / scores.length).toFixed(2)
                  : 0
              }점</p>
            </div>
          </div>

          {scores.length >= 2 && scores.length <= 8 && (
            <div className="report-section">
              <h2>5. 능력-수행력 비교 그래프</h2>
              <RadarChart scores={scores} />
            </div>
          )}

          {scores.length > 0 && (
            <div className="report-section">
              <h2>6. 수행력-능력 차이 분석</h2>
              <ScoreAnalysis scores={scores} clinicalText={clinicalText} />
            </div>
          )}

          <div className="report-footer">
            <p>본 보고서는 ICF 분류체계에 기반하여 작성되었습니다.</p>
          </div>
        </div>
      </div>
    </>
  )
}




