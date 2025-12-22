# sLLM 통합 체크리스트

## 빠른 시작 가이드

### 즉시 시작하기 (30분)

#### 1. API 키 발급 및 설정
- [ ] OpenAI 계정 생성 (https://platform.openai.com)
- [ ] API 키 발급
- [ ] `.env.local` 파일 생성
  ```
  OPENAI_API_KEY=sk-...
  ```
- [ ] `package.json`에 의존성 추가
  ```bash
  npm install openai
  ```

#### 2. API 라우트 생성 (10분)
- [ ] `app/api/icf/match/route.ts` 파일 생성
- [ ] 기본 API 구조 작성
- [ ] OpenAI API 호출 코드 추가

#### 3. 프론트엔드 수정 (10분)
- [ ] `ClinicalLanguageInput.tsx`에서 API 호출로 변경
- [ ] 로딩 상태 추가
- [ ] 에러 처리 추가

#### 4. 테스트 (10분)
- [ ] 로컬 서버 실행
- [ ] 임상 언어 입력 테스트
- [ ] 결과 확인

---

## 상세 구현 체크리스트

### 필수 작업 (Must Have)

#### Phase 1: 기본 통합
- [ ] **1.1** OpenAI 또는 Anthropic 계정 생성
- [ ] **1.2** API 키 발급 및 `.env.local` 설정
- [ ] **1.3** `npm install openai` 또는 `npm install @anthropic-ai/sdk`
- [ ] **2.1** `app/api/icf/match/route.ts` 생성
- [ ] **2.2** 기본 프롬프트 작성
- [ ] **2.3** JSON 응답 파싱 구현
- [ ] **3.1** `ClinicalLanguageInput.tsx`에서 `fetch('/api/icf/match')` 호출
- [ ] **3.2** 기존 키워드 매칭을 폴백으로 유지
- [ ] **3.3** 로딩 스피너 추가
- [ ] **3.4** 에러 메시지 표시

#### Phase 2: 품질 개선
- [ ] **5.1** ICF 코드 전체 목록 데이터베이스화
- [ ] **5.2** 프롬프트에 ICF 코드 컨텍스트 추가
- [ ] **5.3** Few-shot 예시 추가 (3-5개)
- [ ] **5.4** 실제 사용 사례로 프롬프트 개선

### 권장 작업 (Should Have)

#### Phase 3: 기능 확장
- [ ] **4.1** 점수 추론 API 생성 (`/api/icf/score`)
- [ ] **4.2** 자동 점수 제안 기능 UI 추가
- [ ] **6.1** 동일 입력에 대한 캐싱 구현
- [ ] **7.1** API 호출 로깅 추가

### 선택 작업 (Nice to Have)

#### Phase 4: 고급 기능
- [ ] **6.2** 배치 처리 API 구현
- [ ] **6.3** 스트리밍 응답 구현
- [ ] **9.1** Ollama 로컬 모델 설정
- [ ] **9.2** 로컬/클라우드 모델 전환 기능

---

## 코드 예시

### 1. API 라우트 기본 구조

```typescript
// app/api/icf/match/route.ts
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { clinicalText } = await request.json()
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "당신은 ICF 전문가입니다..."
        },
        {
          role: "user",
          content: `다음 임상 언어를 분석하여 ICF 코드를 찾아주세요: ${clinicalText}`
        }
      ],
      response_format: { type: "json_object" }
    })
    
    const result = JSON.parse(completion.choices[0].message.content)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: "API 호출 실패" }, { status: 500 })
  }
}
```

### 2. 프론트엔드 수정

```typescript
// components/ClinicalLanguageInput.tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsLoading(true)
  
  try {
    const response = await fetch('/api/icf/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clinicalText: input })
    })
    
    if (!response.ok) throw new Error('API 호출 실패')
    
    const data = await response.json()
    onCodeMatch(data.matches || [], input)
  } catch (error) {
    // 폴백: 키워드 매칭 사용
    const matches = findICFCodes(input)
    onCodeMatch(matches, input)
  } finally {
    setIsLoading(false)
  }
}
```

---

## 예상 소요 시간

- **Phase 1 (기본 통합)**: 2-4시간
- **Phase 2 (품질 개선)**: 4-8시간
- **Phase 3 (기능 확장)**: 4-6시간
- **Phase 4 (고급 기능)**: 8-16시간

**총 예상 시간**: 18-34시간 (약 2-4일)

---

## 다음 단계

1. ✅ 이 체크리스트를 따라 단계별로 구현
2. ✅ 각 단계 완료 시 체크박스 표시
3. ✅ 문제 발생 시 문서의 예시 코드 참고
4. ✅ 테스트를 통해 각 기능 검증




