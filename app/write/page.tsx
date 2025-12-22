'use client'

import { useState, useEffect } from 'react'
import CoreSetEditor from '@/components/CoreSetEditor'
import type { ICFCoreSet } from '@/types/core-set'
import './page.css'

export default function WritePage() {
  const [savedCoreSets, setSavedCoreSets] = useState<ICFCoreSet[]>([])
  const [editingCoreSet, setEditingCoreSet] = useState<ICFCoreSet | null>(null)

  // localStorage에서 저장된 Core Set 불러오기
  useEffect(() => {
    const saved = localStorage.getItem('customCoreSets')
    if (saved) {
      try {
        setSavedCoreSets(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load saved core sets:', e)
      }
    }
  }, [])

  const handleSave = (coreSet: ICFCoreSet) => {
    const existingIndex = savedCoreSets.findIndex(cs => cs.id === coreSet.id)
    
    let updated: ICFCoreSet[]
    if (existingIndex >= 0) {
      // 기존 Core Set 업데이트
      updated = [...savedCoreSets]
      updated[existingIndex] = coreSet
    } else {
      // 새 Core Set 추가
      updated = [...savedCoreSets, coreSet]
    }
    
    setSavedCoreSets(updated)
    // localStorage에 저장
    localStorage.setItem('customCoreSets', JSON.stringify(updated))
    setEditingCoreSet(null)
  }

  const handleDelete = (coreSetId: string) => {
    const filtered = savedCoreSets.filter(cs => cs.id !== coreSetId)
    setSavedCoreSets(filtered)
    localStorage.setItem('customCoreSets', JSON.stringify(filtered))
  }

  const handleEdit = (coreSet: ICFCoreSet) => {
    setEditingCoreSet(coreSet)
  }

  const handleNew = () => {
    setEditingCoreSet({
      id: `custom-${Date.now()}`,
      name: '',
      description: '',
      healthCondition: '',
      version: '1.0',
      domains: {
        d: []
      },
      items: []
    })
  }

  return (
    <main>
      <div className="container">
        <header className="header">
          <h1 className="title">ICF Core Set 작성</h1>
          <p className="description">
            사용자 정의 ICF Core Set을 생성하고 관리합니다. 
            평가하고자 하는 건강 상태에 맞는 ICF 코드를 선택하여 맞춤형 평가도구를 구성하세요.
          </p>
        </header>

        <div className="write-page-content">
          <div className="core-set-list-section">
            <div className="section-header">
              <h2>저장된 Core Set</h2>
              <button className="new-button" onClick={handleNew} type="button">
                + 새 Core Set 만들기
              </button>
            </div>

            {savedCoreSets.length === 0 ? (
              <div className="empty-state">
                <p>저장된 Core Set이 없습니다.</p>
                <p>새 Core Set을 만들어 시작하세요.</p>
              </div>
            ) : (
              <div className="core-set-list">
                {savedCoreSets.map((coreSet) => (
                  <div key={coreSet.id} className="core-set-card">
                    <div className="card-header">
                      <h3>{coreSet.name}</h3>
                      <span className="card-version">v{coreSet.version}</span>
                    </div>
                    <p className="card-description">{coreSet.description}</p>
                    <div className="card-stats">
                      <span>d: {coreSet.domains.d?.length || 0}개</span>
                      {coreSet.domains.b && <span>b: {coreSet.domains.b.length}개</span>}
                      {coreSet.domains.s && <span>s: {coreSet.domains.s.length}개</span>}
                      {coreSet.domains.e && <span>e: {coreSet.domains.e.length}개</span>}
                    </div>
                    <div className="card-actions">
                      <button onClick={() => handleEdit(coreSet)} type="button">
                        편집
                      </button>
                      <button onClick={() => handleDelete(coreSet.id)} type="button" className="delete-button">
                        삭제
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {editingCoreSet && (
            <div className="editor-section">
              <CoreSetEditor
                coreSet={editingCoreSet}
                onSave={handleSave}
                onCancel={() => setEditingCoreSet(null)}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

