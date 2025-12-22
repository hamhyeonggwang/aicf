'use client'

import { useState, useMemo } from 'react'
import type { ICFCoreSet } from '@/types/core-set'
import assessmentData from '@/data/sample-assessment'
import './CoreSetEditor.css'

interface CoreSetEditorProps {
  coreSet: ICFCoreSet
  onSave: (coreSet: ICFCoreSet) => void
  onCancel: () => void
}

export default function CoreSetEditor({ coreSet, onSave, onCancel }: CoreSetEditorProps) {
  const [name, setName] = useState(coreSet.name)
  const [description, setDescription] = useState(coreSet.description)
  const [healthCondition, setHealthCondition] = useState(coreSet.healthCondition)
  const [version, setVersion] = useState(coreSet.version)
  const [selectedCodes, setSelectedCodes] = useState<{
    b: Set<string>
    s: Set<string>
    d: Set<string>
    e: Set<string>
  }>({
    b: new Set(coreSet.domains.b || []),
    s: new Set(coreSet.domains.s || []),
    d: new Set(coreSet.domains.d || []),
    e: new Set(coreSet.domains.e || [])
  })

  // 사용 가능한 ICF 코드 목록
  const availableCodes = useMemo(() => {
    const codes: {
      b: Array<{ code: string; title: string }>
      s: Array<{ code: string; title: string }>
      d: Array<{ code: string; title: string }>
      e: Array<{ code: string; title: string }>
    } = {
      b: [],
      s: [],
      d: [],
      e: []
    }

    // 평가도구에서 사용 가능한 코드 추출
    if (assessmentData.domains.b) {
      codes.b = assessmentData.domains.b.codes.map(c => ({ code: c.code, title: c.title }))
    }
    if (assessmentData.domains.s) {
      codes.s = assessmentData.domains.s.codes.map(c => ({ code: c.code, title: c.title }))
    }
    if (assessmentData.domains.d) {
      codes.d = assessmentData.domains.d.codes.map(c => ({ code: c.code, title: c.title }))
    }
    if (assessmentData.domains.e) {
      codes.e = assessmentData.domains.e.codes.map(c => ({ code: c.code, title: c.title }))
    }

    return codes
  }, [])

  const handleCodeToggle = (domain: 'b' | 's' | 'd' | 'e', code: string) => {
    setSelectedCodes(prev => {
      const newSet = new Set(prev[domain])
      if (newSet.has(code)) {
        newSet.delete(code)
      } else {
        newSet.add(code)
      }
      return {
        ...prev,
        [domain]: newSet
      }
    })
  }

  const handleSave = () => {
    if (!name.trim()) {
      alert('Core Set 이름을 입력해주세요.')
      return
    }

    if (selectedCodes.d.size === 0) {
      alert('활동 및 참여(d) 영역에 최소 1개 이상의 코드를 선택해주세요.')
      return
    }

    const newCoreSet: ICFCoreSet = {
      id: coreSet.id,
      name: name.trim(),
      description: description.trim(),
      healthCondition: healthCondition.trim(),
      version: version.trim() || '1.0',
      domains: {
        d: Array.from(selectedCodes.d)
      },
      items: []
    }

    if (selectedCodes.b.size > 0) {
      newCoreSet.domains.b = Array.from(selectedCodes.b)
    }
    if (selectedCodes.s.size > 0) {
      newCoreSet.domains.s = Array.from(selectedCodes.s)
    }
    if (selectedCodes.e.size > 0) {
      newCoreSet.domains.e = Array.from(selectedCodes.e)
    }

    onSave(newCoreSet)
  }

  return (
    <div className="core-set-editor">
      <div className="editor-header">
        <h2>{coreSet.id.startsWith('custom-') ? '새 Core Set 만들기' : 'Core Set 편집'}</h2>
      </div>

      <div className="editor-form">
        <div className="form-group">
          <label htmlFor="name">Core Set 이름 *</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="예: 뇌졸중 재활 평가"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">설명</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="이 Core Set의 목적과 사용 방법을 설명하세요."
            rows={3}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="healthCondition">건강 상태</label>
            <input
              id="healthCondition"
              type="text"
              value={healthCondition}
              onChange={(e) => setHealthCondition(e.target.value)}
              placeholder="예: Stroke, Chronic Pain"
            />
          </div>

          <div className="form-group">
            <label htmlFor="version">버전</label>
            <input
              id="version"
              type="text"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="1.0"
            />
          </div>
        </div>

        <div className="code-selection-section">
          <h3>ICF 코드 선택</h3>
          <p className="section-description">
            평가에 포함할 ICF 코드를 선택하세요. 활동 및 참여(d) 영역은 필수입니다.
          </p>

          {/* d (Activities & Participation) - 필수 */}
          <div className="domain-selection">
            <h4 className="domain-title required">
              d: 활동 및 참여 (Activities and Participation) *
            </h4>
            <div className="code-list">
              {availableCodes.d.map(({ code, title }) => (
                <label key={code} className="code-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedCodes.d.has(code)}
                    onChange={() => handleCodeToggle('d', code)}
                  />
                  <span className="code-label">
                    <strong>{code}</strong> - {title}
                  </span>
                </label>
              ))}
            </div>
            <div className="selection-count">
              선택됨: {selectedCodes.d.size}개
            </div>
          </div>

          {/* b (Body Functions) - 선택 */}
          {availableCodes.b.length > 0 && (
            <div className="domain-selection">
              <h4 className="domain-title">b: 신체 기능 (Body Functions)</h4>
              <div className="code-list">
                {availableCodes.b.map(({ code, title }) => (
                  <label key={code} className="code-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedCodes.b.has(code)}
                      onChange={() => handleCodeToggle('b', code)}
                    />
                    <span className="code-label">
                      <strong>{code}</strong> - {title}
                    </span>
                  </label>
                ))}
              </div>
              <div className="selection-count">
                선택됨: {selectedCodes.b.size}개
              </div>
            </div>
          )}

          {/* s (Body Structures) - 선택 */}
          {availableCodes.s.length > 0 && (
            <div className="domain-selection">
              <h4 className="domain-title">s: 신체 구조 (Body Structures)</h4>
              <div className="code-list">
                {availableCodes.s.map(({ code, title }) => (
                  <label key={code} className="code-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedCodes.s.has(code)}
                      onChange={() => handleCodeToggle('s', code)}
                    />
                    <span className="code-label">
                      <strong>{code}</strong> - {title}
                    </span>
                  </label>
                ))}
              </div>
              <div className="selection-count">
                선택됨: {selectedCodes.s.size}개
              </div>
            </div>
          )}

          {/* e (Environmental Factors) - 선택 */}
          {availableCodes.e.length > 0 && (
            <div className="domain-selection">
              <h4 className="domain-title">e: 환경 요인 (Environmental Factors)</h4>
              <div className="code-list">
                {availableCodes.e.map(({ code, title }) => (
                  <label key={code} className="code-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedCodes.e.has(code)}
                      onChange={() => handleCodeToggle('e', code)}
                    />
                    <span className="code-label">
                      <strong>{code}</strong> - {title}
                    </span>
                  </label>
                ))}
              </div>
              <div className="selection-count">
                선택됨: {selectedCodes.e.size}개
              </div>
            </div>
          )}
        </div>

        <div className="editor-actions">
          <button className="save-button" onClick={handleSave} type="button">
            저장
          </button>
          <button className="cancel-button" onClick={onCancel} type="button">
            취소
          </button>
        </div>
      </div>
    </div>
  )
}




