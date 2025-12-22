'use client'

import { useState } from 'react'
import type { AssessmentItem, ICFCode, ViewMode } from '@/types/icf'
import { ICF_QUALIFIER_LABELS } from '@/types/icf'
import './AssessmentItem.css'

// Qualifier 형식 변환 함수
const formatQualifier = (score: number, domain: 'b' | 's' | 'd' | 'e'): string => {
  if (score === 8) return '.8'
  if (score === 9) return '.9'
  return `.${score}`
}

interface AssessmentItemProps {
  item: AssessmentItem
  icfCode?: ICFCode
  score?: number
  notes?: string
  onScoreChange: (score: number, notes?: string) => void
  viewMode: ViewMode
}

export default function AssessmentItemComponent({
  item,
  icfCode,
  score,
  notes,
  onScoreChange,
  viewMode,
}: AssessmentItemProps) {
  const [showRationale, setShowRationale] = useState(false)
  const [localNotes, setLocalNotes] = useState(notes || '')

  const isTherapistMode = viewMode === 'therapist'
  const isReadOnly = isTherapistMode && score === undefined

  const handleScoreSelect = (value: number) => {
    if (!isReadOnly) {
      onScoreChange(value, localNotes)
    }
  }

  const handleNotesChange = (newNotes: string) => {
    setLocalNotes(newNotes)
    if (score !== undefined) {
      onScoreChange(score, newNotes)
    }
  }

  return (
    <div className={`assessment-item ${isReadOnly ? 'read-only' : ''}`}>
      <div className="item-header">
        <div className="item-meta">
          <span className="icf-code">{item.icfCode}</span>
          {icfCode && (
            <span className="icf-title">{icfCode.title}</span>
          )}
        </div>
        {isTherapistMode && (
          <button
            className="rationale-toggle"
            onClick={() => setShowRationale(!showRationale)}
            type="button"
          >
            {showRationale ? '매핑 근거 숨기기' : '매핑 근거 보기'}
          </button>
        )}
      </div>

      <div className="item-question">
        <h3 className="question-text">{item.question}</h3>
        <p className="clinical-description">{item.clinicalDescription}</p>
      </div>

      {showRationale && (
        <div className="mapping-rationale">
          <strong>문장-ICF 코드 매핑 근거:</strong>
          <p>{item.mappingRationale}</p>
          {icfCode?.mappingRationale && (
            <p className="code-rationale">
              <strong>ICF 코드 설명:</strong> {icfCode.mappingRationale}
            </p>
          )}
        </div>
      )}

      <div className="item-options">
        {item.options.map(option => (
          <label
            key={option.value}
            className={`option-label ${score === option.value ? 'selected' : ''} ${isReadOnly ? 'disabled' : ''}`}
          >
            <input
              type="radio"
              name={item.id}
              value={option.value}
              checked={score === option.value}
              onChange={() => handleScoreSelect(option.value)}
              disabled={isReadOnly}
            />
            <div className="option-content">
              <span className="option-label-text">{option.label}</span>
              {option.description && (
                <span className="option-description">{option.description}</span>
              )}
            </div>
          </label>
        ))}
      </div>

      {isTherapistMode && (
        <div className="item-notes">
          <label htmlFor={`notes-${item.id}`} className="notes-label">
            치료사 메모:
          </label>
          <textarea
            id={`notes-${item.id}`}
            className="notes-textarea"
            value={localNotes}
            onChange={(e) => handleNotesChange(e.target.value)}
            placeholder="추가 관찰 사항이나 평가 근거를 기록하세요..."
            rows={3}
          />
        </div>
      )}

      {score !== undefined && (
        <div className="item-score-display">
          선택된 점수: <strong>{score}점</strong>
          {icfCode && (
            <span className="qualifier-display">
              (Qualifier: {formatQualifier(score, item.domain)})
            </span>
          )}
        </div>
      )}
    </div>
  )
}




