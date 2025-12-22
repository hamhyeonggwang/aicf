# 프론트엔드 통합 가이드

Google Apps Script API를 Next.js 앱에 통합하는 방법입니다.

## 환경 변수 설정

`.env.local` 파일에 Google Apps Script URL 추가:

```bash
NEXT_PUBLIC_GAS_API_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

## API 호출 수정

### 1. ClinicalLanguageInput.tsx 수정

```typescript
// components/ClinicalLanguageInput.tsx

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  if (!input.trim()) return

  setIsLoading(true)
  
  try {
    // Google Apps Script API 호출
    const gasUrl = process.env.NEXT_PUBLIC_GAS_API_URL || '/api/icf/match'
    
    const response = await fetch(gasUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint: 'match',
        clinicalText: input
      }),
    })

    if (!response.ok) {
      throw new Error(`API 오류: ${response.status}`)
    }

    const data = await response.json()
    
    if (data.error) {
      throw new Error(data.error)
    }

    // API 응답이 있으면 사용
    if (data.matches && data.matches.length > 0) {
      onCodeMatch(data.matches, input)
    } else {
      // 매칭 결과가 없으면 키워드 매칭으로 폴백
      const fallbackMatches = findICFCodes(input)
      onCodeMatch(fallbackMatches, input)
    }
  } catch (error: any) {
    console.error('ICF 매칭 오류:', error)
    
    // 에러 발생 시 키워드 매칭으로 폴백
    const fallbackMatches = findICFCodes(input)
    onCodeMatch(fallbackMatches, input)
  } finally {
    setIsLoading(false)
  }
}
```

### 2. ScoreInput.tsx 수정

```typescript
// components/ScoreInput.tsx

const getScoreRecommendation = async (code: string, title: string) => {
  if (!clinicalText || loadingRecommendation) return

  setLoadingRecommendation(code)
  try {
    const gasUrl = process.env.NEXT_PUBLIC_GAS_API_URL || '/api/icf/score-recommendation'
    
    const response = await fetch(gasUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        endpoint: 'score-recommendation',
        clinicalText,
        icfCode: code,
        icfTitle: title
      }),
    })

    if (response.ok) {
      const data = await response.json()
      setRecommendations(prev => ({
        ...prev,
        [code]: data
      }))
    }
  } catch (error) {
    console.error('점수 추천 오류:', error)
  } finally {
    setLoadingRecommendation(null)
  }
}
```

### 3. ScoreAnalysis.tsx 수정 (중재 추천 사용 시)

```typescript
// components/ScoreAnalysis.tsx

const getInterventionRecommendation = async (code: string, title: string, performanceScore: number, capacityScore: number) => {
  if (!clinicalText) return

  try {
    const gasUrl = process.env.NEXT_PUBLIC_GAS_API_URL || '/api/icf/intervention-recommendation'
    
    const response = await fetch(gasUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        endpoint: 'intervention-recommendation',
        clinicalText,
        icfCode: code,
        icfTitle: title,
        performanceScore,
        capacityScore
      }),
    })

    if (response.ok) {
      const data = await response.json()
      // 중재 추천 데이터 처리
    }
  } catch (error) {
    console.error('중재 추천 오류:', error)
  }
}
```

## 하이브리드 모드 (선택사항)

로컬 개발 시에는 Next.js API를 사용하고, 프로덕션에서는 Google Apps Script를 사용하도록 설정:

```typescript
const getApiUrl = (endpoint: string) => {
  // 개발 환경에서는 로컬 API 사용
  if (process.env.NODE_ENV === 'development') {
    return `/api/icf/${endpoint}`
  }
  
  // 프로덕션에서는 Google Apps Script 사용
  return process.env.NEXT_PUBLIC_GAS_API_URL || `/api/icf/${endpoint}`
}

// 사용 예시
const response = await fetch(getApiUrl('match'), {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    endpoint: 'match', // GAS 사용 시 필요
    clinicalText: input
  }),
})
```

## 테스트

1. `.env.local`에 Google Apps Script URL 설정
2. 개발 서버 재시작: `npm run dev`
3. 브라우저에서 테스트:
   - 임상 언어 입력
   - ICF 코드 매칭 확인
   - 점수 추천 확인

## 주의사항

- Google Apps Script는 요청 본문 형식이 다릅니다 (`endpoint` 필드 필요)
- 로컬 API와 Google Apps Script API를 동시에 지원하려면 래퍼 함수를 만드는 것이 좋습니다
- CORS는 Google Apps Script가 자동으로 처리하므로 추가 설정이 필요 없습니다

