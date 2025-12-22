'use client'

import { useRef } from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import type { 
  AssessmentTool as AssessmentToolType, 
  AssessmentScore, 
  PatientInfo, 
  PersonalFactors,
  TreatmentGoals,
  ICF_QUALIFIER_LABELS,
  ICF_ENVIRONMENT_FACILITATOR_LABELS
} from '@/types/icf'
import type { ICFCoreSet } from '@/types/core-set'
import './CaseConferenceReport.css'

interface CaseConferenceReportProps {
  tool: AssessmentToolType
  scores: Record<string, AssessmentScore>
  patientInfo?: PatientInfo
  personalFactors?: PersonalFactors
  treatmentGoals?: TreatmentGoals
  comments?: string
  coreSet?: ICFCoreSet | null
}

export default function CaseConferenceReport({
  tool,
  scores,
  patientInfo,
  personalFactors,
  treatmentGoals,
  comments,
  coreSet,
}: CaseConferenceReportProps) {
  const reportRef = useRef<HTMLDivElement>(null)

  // ICF 코드에서 2단계 코드 추출 (예: d450 -> d4, d450)
  const getTwoLevelCode = (code: string): string => {
    if (code.length >= 2) {
      return code.substring(0, 2)
    }
    return code
  }

  // 도메인별 qualifier 형식 변환
  const formatQualifier = (score: number, domain: 'b' | 's' | 'd' | 'e', isFacilitator = false): string => {
    if (score === 8) return '.8'
    if (score === 9) return '.9'
    
    if (domain === 'e' && isFacilitator) {
      return `+${score}`
    }
    
    return `.${score}`
  }

  // Qualifier 레이블 가져오기
  const getQualifierLabel = (score: number, domain: 'b' | 's' | 'd' | 'e', isFacilitator = false): string => {
    if (domain === 'e' && isFacilitator) {
      return ICF_ENVIRONMENT_FACILITATOR_LABELS[score as keyof typeof ICF_ENVIRONMENT_FACILITATOR_LABELS] || ''
    }
    
    const type = domain === 'b' || domain === 's' ? 'body' : domain === 'd' ? 'activity' : 'environment'
    return ICF_QUALIFIER_LABELS[type][score as keyof typeof ICF_QUALIFIER_LABELS[typeof type]] || ''
  }

  // 도메인별 코드 그룹화
  const bodyFunctionItems = Object.entries(scores)
    .map(([itemId, score]) => {
      const item = tool.items.find(i => i.id === itemId)
      if (!item || (item.domain !== 'b' && item.domain !== 's')) return null
      
      const code = tool.domains[item.domain]?.codes.find(c => c.code === item.icfCode)
      return {
        code: item.icfCode,
        twoLevelCode: getTwoLevelCode(item.icfCode),
        content: code?.title || item.question,
        qualifier: formatQualifier(score.score, item.domain),
        qualifierLabel: getQualifierLabel(score.score, item.domain),
        score: score.score,
      }
    })
    .filter(Boolean)

  const activityItems = Object.entries(scores)
    .map(([itemId, score]) => {
      const item = tool.items.find(i => i.id === itemId)
      if (!item || item.domain !== 'd') return null
      
      const code = tool.domains.d?.codes.find(c => c.code === item.icfCode)
      return {
        code: item.icfCode,
        twoLevelCode: getTwoLevelCode(item.icfCode),
        content: code?.title || item.question,
        performance: formatQualifier(score.score, 'd'),
        performanceLabel: getQualifierLabel(score.score, 'd'),
        capacity: formatQualifier(score.score, 'd'), // 기본적으로 동일하게 설정
        capacityLabel: getQualifierLabel(score.score, 'd'),
        score: score.score,
      }
    })
    .filter(Boolean)

  const environmentItems = Object.entries(scores)
    .map(([itemId, score]) => {
      const item = tool.items.find(i => i.id === itemId)
      if (!item || item.domain !== 'e') return null
      
      const code = tool.domains.e?.codes.find(c => c.code === item.icfCode)
      // 환경요인은 기본적으로 저해요인으로 설정 (실제로는 UI에서 선택 가능하도록 해야 함)
      return {
        code: item.icfCode,
        category: code?.title || item.question,
        content: code?.description || item.clinicalDescription,
        type: 'barrier' as const,
        qualifier: formatQualifier(score.score, 'e'),
        qualifierLabel: getQualifierLabel(score.score, 'e'),
        score: score.score,
      }
    })
    .filter(Boolean)

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

      const fileName = `Case_Conference_${patientInfo?.name || '보고서'}_${new Date().toISOString().split('T')[0]}.pdf`
      pdf.save(fileName)
    } catch (error) {
      console.error('PDF 생성 중 오류:', error)
      alert('PDF 생성 중 오류가 발생했습니다.')
    }
  }

  return (
    <>
      <button
        className="case-conference-export-button"
        onClick={generatePDF}
        type="button"
      >
        Case Conference 보고서 저장
      </button>

      <div ref={reportRef} className="case-conference-report">
        {/* 환자 정보 */}
        <table className="case-report-table patient-info-table">
          <tbody>
            <tr>
              <td>이름</td>
              <td>{patientInfo?.name || ''}</td>
              <td>성별</td>
              <td>{patientInfo?.gender === 'M' ? '남' : patientInfo?.gender === 'F' ? '여' : ''}</td>
              <td>생년월일</td>
              <td>{patientInfo?.birthDate || ''}</td>
            </tr>
            <tr>
              <td>C.C</td>
              <td colSpan={3}>{patientInfo?.chiefComplaint || ''}</td>
              <td>복용 약물</td>
              <td>{patientInfo?.medications || ''}</td>
            </tr>
            <tr>
              <td>상병코드</td>
              <td>{patientInfo?.diagnosisCode || ''}</td>
              <td>진단명</td>
              <td>{patientInfo?.diagnosisName || ''}</td>
              <td>내원일</td>
              <td>{patientInfo?.visitDate || ''}</td>
            </tr>
            <tr>
              <td>퇴원 예정일</td>
              <td>{patientInfo?.dischargeDate || ''}</td>
              <td>학령기 재활처방</td>
              <td colSpan={3}>{patientInfo?.prescription || ''}</td>
            </tr>
          </tbody>
        </table>

        {/* 개인요인 */}
        <div className="case-section">
          <h3>개인요인</h3>
          <table className="case-report-table personal-factors-table">
            <thead>
              <tr>
                <th>개인 영역</th>
                <th>내용</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>경험/history</td>
                <td>{personalFactors?.experience || ''}</td>
              </tr>
              <tr>
                <td>가치/신념</td>
                <td>{personalFactors?.values || ''}</td>
              </tr>
              <tr>
                <td>동기</td>
                <td>{personalFactors?.motivation || ''}</td>
              </tr>
              <tr>
                <td>습관</td>
                <td>{personalFactors?.habits || ''}</td>
              </tr>
              <tr>
                <td>인지</td>
                <td>{personalFactors?.cognition || ''}</td>
              </tr>
              <tr>
                <td>감각/운동</td>
                <td>{personalFactors?.sensoryMotor || ''}</td>
              </tr>
              <tr>
                <td>정서</td>
                <td>{personalFactors?.emotion || ''}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 건강상태 - 신체기능/구조 */}
        <div className="case-section">
          <h3>건강상태 - 신체기능/구조</h3>
          <table className="case-report-table body-function-table">
            <thead>
              <tr>
                <th>강점/제한점</th>
                <th>ICF 코드</th>
                <th>2단계 코드</th>
                <th>내용</th>
                <th>기능(0)/손상(1-4)</th>
              </tr>
            </thead>
            <tbody>
              {bodyFunctionItems.length > 0 ? (
                bodyFunctionItems.map((item, idx) => {
                  // 신체기능/구조 영역 분류 매핑
                  const bodyDomainMap: Record<string, string> = {
                    'b1': 'b1.정신기능',
                    'b2': 'b2.감각기능과 통증',
                    'b3': 'b3.음성과 말기능',
                    'b4': 'b4.심혈관, 혈액, 면역 및 호흡기계 기능',
                    'b5': 'b5.소화, 대사 및 내분비계 기능',
                    'b6': 'b6.배뇨 및 생식기능',
                    'b7': 'b7.신경근골격 및 움직임 관련 기능',
                    'b8': 'b8.피부 및 관련 구조 기능',
                  }
                  
                  const domainTitle = bodyDomainMap[item.twoLevelCode] || item.twoLevelCode
                  
                  return (
                    <tr key={idx}>
                      <td>{item.score === 0 ? '강점' : '제한점'}</td>
                      <td>{item.code}</td>
                      <td>{domainTitle}</td>
                      <td>{item.content}</td>
                      <td>{item.qualifier} {item.qualifierLabel}</td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={5}>평가된 항목이 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 활동과 참여 */}
        <div className="case-section">
          <h3>활동과 참여</h3>
          <table className="case-report-table activity-table">
            <thead>
              <tr>
                <th>ICF 영역 분류</th>
                <th>2단계 코드</th>
                <th>내용</th>
                <th>P</th>
                <th>C</th>
              </tr>
            </thead>
            <tbody>
              {activityItems.length > 0 ? (
                activityItems.map((item, idx) => {
                  // ICF 영역 분류 매핑 (예: d1 -> d1.학습과 지식적용)
                  const domainMap: Record<string, string> = {
                    'd1': 'd1.학습과 지식적용',
                    'd2': 'd2.일반적인 작업과 요구사항',
                    'd3': 'd3.의사소통',
                    'd4': 'd4.이동',
                    'd5': 'd5.자기관리',
                    'd6': 'd6.가정생활',
                    'd7': 'd7.대인관계',
                    'd8': 'd8.주요 생활 영역',
                    'd9': 'd9.지역사회, 사회 및 시민생활',
                  }
                  
                  const domainTitle = domainMap[item.twoLevelCode] || item.twoLevelCode
                  
                  return (
                    <tr key={idx}>
                      <td>{domainTitle}</td>
                      <td>{item.twoLevelCode}</td>
                      <td>{item.content}</td>
                      <td>{item.performance} {item.performanceLabel}</td>
                      <td>{item.capacity} {item.capacityLabel}</td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={5}>평가된 항목이 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 환경 */}
        <div className="case-section">
          <h3>환경</h3>
          <table className="case-report-table environment-table">
            <thead>
              <tr>
                <th>ICF 코드</th>
                <th>분류</th>
                <th>내용</th>
                <th>촉진/방해</th>
              </tr>
            </thead>
            <tbody>
              {environmentItems.length > 0 ? (
                environmentItems.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.code}</td>
                    <td>{item.category}</td>
                    <td>{item.content}</td>
                    <td>{item.type === 'facilitator' ? '촉진' : '방해'} {item.qualifier} {item.qualifierLabel}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4}>평가된 항목이 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 영역별 치료목표 */}
        <div className="case-section">
          <h3>영역별 치료목표</h3>
          <table className="case-report-table treatment-goals-table">
            <thead>
              <tr>
                <th>PT</th>
                <th>OT</th>
                <th>ST</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{treatmentGoals?.pt || ''}</td>
                <td>{treatmentGoals?.ot || ''}</td>
                <td>{treatmentGoals?.st || ''}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 사례 회의 comment */}
        {comments && (
          <div className="case-section">
            <h3>사례 회의 comment</h3>
            <div className="case-comments">
              {comments}
            </div>
          </div>
        )}
      </div>
    </>
  )
}


