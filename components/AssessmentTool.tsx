'use client'

import { useState, useMemo } from 'react'
import type { AssessmentTool as AssessmentToolType, AssessmentScore, ViewMode, PatientInfo, PersonalFactors, TreatmentGoals } from '@/types/icf'
import type { ICFCoreSet } from '@/types/core-set'
import DomainSection from './DomainSection'
import ScoreSummary from './ScoreSummary'
import PDFExportButton from './PDFExportButton'
import CaseConferenceReport from './CaseConferenceReport'
import PatientInfoForm from './PatientInfoForm'
import Visualization from './Visualization'
import './AssessmentTool.css'

interface AssessmentToolProps {
  tool: AssessmentToolType
  viewMode: ViewMode
  coreSet?: ICFCoreSet | null
}

export default function AssessmentTool({ tool, viewMode, coreSet }: AssessmentToolProps) {
  const [scores, setScores] = useState<Record<string, AssessmentScore>>({})
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({})
  const [personalFactors, setPersonalFactors] = useState<PersonalFactors>({})
  const [treatmentGoals, setTreatmentGoals] = useState<TreatmentGoals>({})
  const [comments, setComments] = useState<string>('')
  const [showPatientForm, setShowPatientForm] = useState(false)

  // Core Set에 따라 항목 필터링
  const filteredItems = useMemo(() => {
    if (!coreSet) return tool.items
    
    // Core Set에 포함된 ICF 코드만 필터링
    const allowedCodes = new Set([
      ...(coreSet.domains.d || []),
      ...(coreSet.domains.b || []),
      ...(coreSet.domains.s || []),
      ...(coreSet.domains.e || []),
    ])
    
    return tool.items.filter(item => allowedCodes.has(item.icfCode))
  }, [tool.items, coreSet])

  // 필터링된 도메인 정보 생성
  const filteredDomains = useMemo(() => {
    if (!coreSet) {
      return tool.domains
    }
    
    const domains: AssessmentToolType['domains'] = {
      d: tool.domains.d // d는 필수이므로 항상 포함
    }
    
    // Core Set에 포함된 코드만 필터링
    if (tool.domains.d && coreSet.domains.d) {
      domains.d = {
        ...tool.domains.d,
        codes: tool.domains.d.codes.filter(code => 
          coreSet.domains.d?.includes(code.code)
        )
      }
    }
    
    if (tool.domains.b && coreSet.domains.b && coreSet.domains.b.length > 0) {
      domains.b = {
        ...tool.domains.b,
        codes: tool.domains.b.codes.filter(code => 
          coreSet.domains.b?.includes(code.code)
        )
      }
    }
    
    if (tool.domains.s && coreSet.domains.s && coreSet.domains.s.length > 0) {
      domains.s = {
        ...tool.domains.s,
        codes: tool.domains.s.codes.filter(code => 
          coreSet.domains.s?.includes(code.code)
        )
      }
    }
    
    if (tool.domains.e && coreSet.domains.e && coreSet.domains.e.length > 0) {
      domains.e = {
        ...tool.domains.e,
        codes: tool.domains.e.codes.filter(code => 
          coreSet.domains.e?.includes(code.code)
        )
      }
    }
    
    return domains
  }, [tool.domains, coreSet])

  // Derived state: 총점 계산
  const totalScore = useMemo(() => {
    return Object.values(scores).reduce((sum, score) => sum + score.score, 0)
  }, [scores])

  const maxScore = useMemo(() => {
    return filteredItems.length * 4 // 각 항목 최대 4점
  }, [filteredItems])

  const averageScore = useMemo(() => {
    const answeredItems = Object.keys(scores).length
    if (answeredItems === 0) return 0
    return totalScore / answeredItems
  }, [totalScore, scores])

  const handleScoreChange = (itemId: string, score: number, notes?: string) => {
    setScores(prev => ({
      ...prev,
      [itemId]: {
        itemId,
        score,
        notes,
      }
    }))
  }

  // 도메인별로 항목 분리 (d 우선 표시)
  const itemsByDomain = useMemo(() => {
    const grouped: Record<string, typeof tool.items> = {
      d: [],
      b: [],
      s: [],
      e: [],
    }
    
    tool.items.forEach(item => {
      if (grouped[item.domain]) {
        grouped[item.domain].push(item)
      }
    })

    // d를 맨 앞으로, 나머지는 알파벳 순서
    return [
      ...grouped.d,
      ...grouped.b,
      ...grouped.s,
      ...grouped.e,
    ]
  }, [tool.items])

  return (
    <div className="assessment-tool">
      <div className="tool-header">
        <div className="tool-info">
          <h2 className="tool-title">{tool.title}</h2>
          <p className="tool-version">버전 {tool.version}</p>
        </div>
        <div className="tool-actions">
          <button
            className="patient-info-button"
            onClick={() => setShowPatientForm(!showPatientForm)}
            type="button"
          >
            {showPatientForm ? '환자 정보 숨기기' : '환자 정보 입력'}
          </button>
          <PDFExportButton 
            tool={{
              ...tool,
              items: filteredItems,
              domains: filteredDomains
            }}
            scores={scores} 
            viewMode={viewMode}
            totalScore={totalScore}
            averageScore={averageScore}
            coreSet={coreSet}
          />
        </div>
      </div>

      {/* 환자 정보 입력 폼 */}
      {showPatientForm && (
        <div className="patient-form-section">
          <PatientInfoForm
            patientInfo={patientInfo}
            personalFactors={personalFactors}
            onSave={(info, factors) => {
              setPatientInfo(info)
              if (factors) setPersonalFactors(factors)
              setShowPatientForm(false)
            }}
          />
          
          {/* 치료 목표 및 코멘트 입력 */}
          <div className="treatment-goals-section">
            <h3>영역별 치료목표</h3>
            <div className="goals-grid">
              <div className="goal-group">
                <label>PT</label>
                <textarea
                  value={treatmentGoals.pt || ''}
                  onChange={(e) => setTreatmentGoals(prev => ({ ...prev, pt: e.target.value }))}
                  rows={3}
                  placeholder="물리치료 목표를 입력하세요"
                />
              </div>
              <div className="goal-group">
                <label>OT</label>
                <textarea
                  value={treatmentGoals.ot || ''}
                  onChange={(e) => setTreatmentGoals(prev => ({ ...prev, ot: e.target.value }))}
                  rows={3}
                  placeholder="작업치료 목표를 입력하세요"
                />
              </div>
              <div className="goal-group">
                <label>ST</label>
                <textarea
                  value={treatmentGoals.st || ''}
                  onChange={(e) => setTreatmentGoals(prev => ({ ...prev, st: e.target.value }))}
                  rows={3}
                  placeholder="언어치료 목표를 입력하세요"
                />
              </div>
            </div>
            <div className="comments-group">
              <label>사례 회의 comment</label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={4}
                placeholder="사례 회의 코멘트를 입력하세요"
              />
            </div>
          </div>
        </div>
      )}

      {/* Case Conference 보고서 */}
      {Object.keys(scores).length > 0 && (
        <div className="case-conference-section">
          <CaseConferenceReport
            tool={{
              ...tool,
              items: filteredItems,
              domains: filteredDomains
            }}
            scores={scores}
            patientInfo={patientInfo}
            personalFactors={personalFactors}
            treatmentGoals={treatmentGoals}
            comments={comments}
            coreSet={coreSet}
          />
        </div>
      )}

      {coreSet && (
        <div className="core-set-badge">
          <span className="badge-label">사용 중인 Core Set:</span>
          <span className="badge-name">{coreSet.name}</span>
        </div>
      )}

      <ScoreSummary
        totalScore={totalScore}
        maxScore={maxScore}
        averageScore={averageScore}
        answeredCount={Object.keys(scores).length}
        totalCount={filteredItems.length}
      />

      {/* Participation (d) 우선 표시 */}
      {filteredDomains.d && (
        <DomainSection
          domain={filteredDomains.d}
          items={filteredItems.filter(item => item.domain === 'd')}
          scores={scores}
          onScoreChange={handleScoreChange}
          viewMode={viewMode}
          priority
        />
      )}

      {/* 다른 도메인들 */}
      {filteredDomains.b && (
        <DomainSection
          domain={filteredDomains.b}
          items={filteredItems.filter(item => item.domain === 'b')}
          scores={scores}
          onScoreChange={handleScoreChange}
          viewMode={viewMode}
        />
      )}

      {filteredDomains.s && (
        <DomainSection
          domain={filteredDomains.s}
          items={filteredItems.filter(item => item.domain === 's')}
          scores={scores}
          onScoreChange={handleScoreChange}
          viewMode={viewMode}
        />
      )}

      {filteredDomains.e && (
        <DomainSection
          domain={filteredDomains.e}
          items={filteredItems.filter(item => item.domain === 'e')}
          scores={scores}
          onScoreChange={handleScoreChange}
          viewMode={viewMode}
        />
      )}

      {/* 시각화 섹션 */}
      {Object.keys(scores).length > 0 && (
        <Visualization scores={scores} items={filteredItems} coreSet={coreSet} />
      )}
    </div>
  )
}

