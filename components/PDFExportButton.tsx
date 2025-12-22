'use client'

import { useRef } from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import type { AssessmentTool as AssessmentToolType, AssessmentScore, ViewMode } from '@/types/icf'
import type { ICFCoreSet } from '@/types/core-set'
import './PDFExportButton.css'

interface PDFExportButtonProps {
  tool: AssessmentToolType
  scores: Record<string, AssessmentScore>
  viewMode: ViewMode
  totalScore: number
  averageScore: number
  coreSet?: ICFCoreSet | null
}

export default function PDFExportButton({
  tool,
  scores,
  viewMode,
  totalScore,
  averageScore,
  coreSet,
}: PDFExportButtonProps) {
  const reportRef = useRef<HTMLDivElement>(null)

  const generatePDF = async () => {
    if (!reportRef.current) return

    try {
      // 리포트 내용 생성
      const reportContent = reportRef.current

      // HTML을 Canvas로 변환
      const canvas = await html2canvas(reportContent, {
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

      // PDF 저장
      const fileName = `ICF_평가보고서_${new Date().toISOString().split('T')[0]}.pdf`
      pdf.save(fileName)
    } catch (error) {
      console.error('PDF 생성 중 오류:', error)
      alert('PDF 생성 중 오류가 발생했습니다.')
    }
  }

  // 리포트 데이터 준비
  const answeredItems = Object.entries(scores).map(([itemId, score]) => {
    const item = tool.items.find(i => i.id === itemId)
    return { item, score }
  }).filter(entry => entry.item)

  return (
    <>
      <button
        className="pdf-export-button"
        onClick={generatePDF}
        type="button"
      >
        PDF 보고서 저장
      </button>

      {/* 숨겨진 리포트 내용 */}
      <div ref={reportRef} className="pdf-report" style={{ position: 'absolute', left: '-9999px' }}>
        <div className="report-header">
          <h1>{tool.title}</h1>
          <p className="report-meta">
            버전 {tool.version} | {viewMode === 'therapist' ? '치료사 검토 모드' : '보호자 입력 모드'} | 
            생성일: {new Date().toLocaleDateString('ko-KR')}
          </p>
          {coreSet && (
            <p className="report-core-set">
              사용된 ICF Core Set: {coreSet.name} ({coreSet.healthCondition})
            </p>
          )}
        </div>

        <div className="report-summary">
          <h2>평가 요약</h2>
          <table className="report-table">
            <tbody>
              <tr>
                <td>총점</td>
                <td>{totalScore.toFixed(1)} / {tool.items.length * 4}</td>
              </tr>
              <tr>
                <td>평균 점수</td>
                <td>{averageScore.toFixed(2)}점</td>
              </tr>
              <tr>
                <td>응답 항목 수</td>
                <td>{answeredItems.length} / {tool.items.length}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="report-items">
          <h2>항목별 평가 결과</h2>
          {answeredItems.map(({ item, score }) => (
            <div key={item!.id} className="report-item">
              <div className="report-item-header">
                <span className="report-icf-code">{item!.icfCode}</span>
                <span className="report-score">점수: {score.score}점</span>
              </div>
              <h3>{item!.question}</h3>
              <p className="report-clinical">{item!.clinicalDescription}</p>
              <div className="report-mapping">
                <strong>매핑 근거:</strong> {item!.mappingRationale}
              </div>
              {score.notes && (
                <div className="report-notes">
                  <strong>치료사 메모:</strong> {score.notes}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="report-footer">
          <p>본 보고서는 ICF 분류체계에 기반하여 작성되었습니다.</p>
        </div>
      </div>
    </>
  )
}

