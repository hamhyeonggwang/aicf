'use client'

import { useState, useEffect } from 'react'
import type { ICFCoreSet } from '@/types/core-set'
import { COMMON_CORE_SETS } from '@/types/core-set'
import './CoreSetSelector.css'

interface CoreSetSelectorProps {
  selectedCoreSet: ICFCoreSet | null
  onCoreSetChange: (coreSet: ICFCoreSet) => void
}

export default function CoreSetSelector({ selectedCoreSet, onCoreSetChange }: CoreSetSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [customCoreSets, setCustomCoreSets] = useState<ICFCoreSet[]>([])
  const [allCoreSets, setAllCoreSets] = useState<ICFCoreSet[]>(COMMON_CORE_SETS)

  // localStorage에서 사용자 정의 Core Set 불러오기
  useEffect(() => {
    const saved = localStorage.getItem('customCoreSets')
    if (saved) {
      try {
        const custom = JSON.parse(saved) as ICFCoreSet[]
        setCustomCoreSets(custom)
        setAllCoreSets([...COMMON_CORE_SETS, ...custom])
      } catch (e) {
        console.error('Failed to load custom core sets:', e)
      }
    }
  }, [])

  const handleSelect = (coreSet: ICFCoreSet) => {
    onCoreSetChange(coreSet)
    setIsOpen(false)
  }

  return (
    <div className="core-set-selector">
      <div className="selector-header">
        <h2 className="selector-title">ICF Core Set 선택</h2>
        <p className="selector-description">
          평가하고자 하는 건강 상태나 상황에 맞는 ICF Core Set을 선택하세요.
        </p>
      </div>

      <div className="core-set-dropdown">
        <button
          className="dropdown-trigger"
          onClick={() => setIsOpen(!isOpen)}
          type="button"
        >
          <span className="trigger-text">
            {selectedCoreSet ? selectedCoreSet.name : 'Core Set 선택하기'}
          </span>
          <span className="trigger-icon">{isOpen ? '▲' : '▼'}</span>
        </button>

        {isOpen && (
          <div className="dropdown-menu">
            {COMMON_CORE_SETS.length > 0 && (
              <div className="dropdown-section">
                <div className="section-label">표준 Core Set</div>
                {COMMON_CORE_SETS.map((coreSet) => (
                  <button
                    key={coreSet.id}
                    className={`dropdown-item ${selectedCoreSet?.id === coreSet.id ? 'selected' : ''}`}
                    onClick={() => handleSelect(coreSet)}
                    type="button"
                  >
                    <div className="item-header">
                      <span className="item-name">{coreSet.name}</span>
                      <span className="item-version">v{coreSet.version}</span>
                    </div>
                    <p className="item-description">{coreSet.description}</p>
                    <div className="item-stats">
                      <span className="stat">
                        d: {coreSet.domains.d?.length || 0}개
                      </span>
                      {coreSet.domains.b && (
                        <span className="stat">
                          b: {coreSet.domains.b.length}개
                        </span>
                      )}
                      {coreSet.domains.s && (
                        <span className="stat">
                          s: {coreSet.domains.s.length}개
                        </span>
                      )}
                      {coreSet.domains.e && (
                        <span className="stat">
                          e: {coreSet.domains.e.length}개
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
            
            {customCoreSets.length > 0 && (
              <div className="dropdown-section">
                <div className="section-label">사용자 정의 Core Set</div>
                {customCoreSets.map((coreSet) => (
                  <button
                    key={coreSet.id}
                    className={`dropdown-item ${selectedCoreSet?.id === coreSet.id ? 'selected' : ''}`}
                    onClick={() => handleSelect(coreSet)}
                    type="button"
                  >
                    <div className="item-header">
                      <span className="item-name">{coreSet.name}</span>
                      <span className="item-version">v{coreSet.version}</span>
                    </div>
                    <p className="item-description">{coreSet.description}</p>
                    <div className="item-stats">
                      <span className="stat">
                        d: {coreSet.domains.d?.length || 0}개
                      </span>
                      {coreSet.domains.b && (
                        <span className="stat">
                          b: {coreSet.domains.b.length}개
                        </span>
                      )}
                      {coreSet.domains.s && (
                        <span className="stat">
                          s: {coreSet.domains.s.length}개
                        </span>
                      )}
                      {coreSet.domains.e && (
                        <span className="stat">
                          e: {coreSet.domains.e.length}개
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {selectedCoreSet && (
        <div className="selected-core-set-info">
          <h3 className="info-title">선택된 Core Set 정보</h3>
          <div className="info-content">
            <p><strong>이름:</strong> {selectedCoreSet.name}</p>
            <p><strong>건강 상태:</strong> {selectedCoreSet.healthCondition}</p>
            <p><strong>설명:</strong> {selectedCoreSet.description}</p>
            <div className="info-domains">
              <h4>포함된 도메인:</h4>
              <div className="domain-list">
                {selectedCoreSet.domains.d && (
                  <div className="domain-item">
                    <strong>d (활동 및 참여):</strong> {selectedCoreSet.domains.d.length}개 코드
                  </div>
                )}
                {selectedCoreSet.domains.b && (
                  <div className="domain-item">
                    <strong>b (신체 기능):</strong> {selectedCoreSet.domains.b.length}개 코드
                  </div>
                )}
                {selectedCoreSet.domains.s && (
                  <div className="domain-item">
                    <strong>s (신체 구조):</strong> {selectedCoreSet.domains.s.length}개 코드
                  </div>
                )}
                {selectedCoreSet.domains.e && (
                  <div className="domain-item">
                    <strong>e (환경 요인):</strong> {selectedCoreSet.domains.e.length}개 코드
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

