# sLLM 통합 가이드

## 개요
현재 키워드 기반 매칭을 sLLM(Small Language Model)으로 확장하여 더 정확하고 지능적인 ICF 코드 매핑을 구현합니다.

---

## 1단계: sLLM 모델 선택 및 환경 설정

### 1.1 모델 선택
**해야 할 일:**
- [ ] 사용할 sLLM 모델 결정
  - 옵션 1: 로컬 실행 모델 (Ollama, LM Studio 등)
    - 예: Llama 3.2 3B, Phi-3, Gemma 2B
    - 장점: 무료, 데이터 프라이버시
    - 단점: 로컬 리소스 필요
  - 옵션 2: 클라우드 API (OpenAI GPT-3.5-turbo, Anthropic Claude Haiku 등)
    - 장점: 설정 간단, 높은 성능
    - 단점: 비용 발생
  - 옵션 3: 한국어 특화 모델 (Polyglot-Ko, KULLM 등)
    - 장점: 한국어 성능 우수
    - 단점: 설정 복잡도 높음

**권장:** 초기에는 OpenAI GPT-3.5-turbo 또는 Anthropic Claude Haiku (비용 효율적)

### 1.2 개발 환경 설정
**해야 할 일:**
- [ ] Node.js 프로젝트에 LLM 라이브러리 설치
  ```bash
  npm install openai  # OpenAI 사용 시
  # 또는
  npm install @anthropic-ai/sdk  # Anthropic 사용 시
  # 또는
  npm install ollama  # Ollama 로컬 모델 사용 시
  ```
- [ ] 환경 변수 파일 생성 (`.env.local`)
  ```
  OPENAI_API_KEY=your_api_key_here
  # 또는
  ANTHROPIC_API_KEY=your_api_key_here
  ```

---

## 2단계: API 라우트 생성 (Next.js App Router)

### 2.1 API 엔드포인트 생성
**해야 할 일:**
- [ ] `app/api/icf/match/route.ts` 파일 생성
- [ ] 임상 언어를 받아 ICF 코드를 매칭하는 API 구현
- [ ] 에러 처리 및 응답 형식 정의

**예시 구조:**
```typescript
// app/api/icf/match/route.ts
export async function POST(request: Request) {
  const { clinicalText } = await request.json()
  
  // sLLM 호출
  // ICF 코드 매칭
  // 결과 반환
}
```

### 2.2 프롬프트 엔지니어링
**해야 할 일:**
- [ ] ICF 코드 매핑을 위한 시스템 프롬프트 작성
- [ ] 사용자 입력을 구조화된 형식으로 변환하는 프롬프트 설계
- [ ] JSON 응답 형식 정의

**프롬프트 예시:**
```
당신은 ICF(International Classification of Functioning) 전문가입니다.
임상 언어를 분석하여 관련된 ICF 코드를 찾아주세요.

응답 형식:
{
  "matches": [
    {
      "code": "d450",
      "title": "걷기",
      "confidence": 0.9,
      "rationale": "매칭 근거 설명"
    }
  ]
}
```

---

## 3단계: 프론트엔드 통합

### 3.1 ClinicalLanguageInput 컴포넌트 수정
**해야 할 일:**
- [ ] `components/ClinicalLanguageInput.tsx` 수정
- [ ] 키워드 매칭 대신 API 호출로 변경
- [ ] 로딩 상태 및 에러 처리 추가

**수정할 부분:**
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  // 기존: findICFCodes(input)
  // 변경: API 호출
  const response = await fetch('/api/icf/match', {
    method: 'POST',
    body: JSON.stringify({ clinicalText: input })
  })
  const data = await response.json()
  onCodeMatch(data.matches, input)
}
```

### 3.2 폴백 메커니즘 구현
**해야 할 일:**
- [ ] sLLM API 실패 시 키워드 매칭으로 폴백
- [ ] 네트워크 오류 처리
- [ ] 사용자에게 명확한 에러 메시지 표시

---

## 4단계: 점수 추론 기능 추가 (선택사항)

### 4.1 점수 추론 API 생성
**해야 할 일:**
- [ ] `app/api/icf/score/route.ts` 파일 생성
- [ ] 임상 언어와 ICF 코드를 기반으로 점수 추론
- [ ] 수행력(Performance)과 능력(Capacity) 점수 제안

**예시:**
```typescript
// 임상 언어: "환자는 독립적으로 걷기 가능"
// ICF 코드: d450
// 추론된 점수: performanceScore: 0, capacityScore: 0
```

### 4.2 자동 점수 제안 UI 추가
**해야 할 일:**
- [ ] ScoreInput 컴포넌트에 "자동 점수 제안" 버튼 추가
- [ ] sLLM이 제안한 점수를 사용자가 확인/수정할 수 있도록 구현

---

## 5단계: 프롬프트 최적화 및 파인튜닝

### 5.1 프롬프트 개선
**해야 할 일:**
- [ ] 실제 사용 사례 수집
- [ ] 매칭 정확도 평가
- [ ] 프롬프트 반복 개선
- [ ] Few-shot 예시 추가

### 5.2 ICF 코드 데이터베이스 구축
**해야 할 일:**
- [ ] 전체 ICF 코드 목록을 구조화된 데이터로 정리
- [ ] 각 코드의 설명, 예시, 관련 키워드 데이터베이스화
- [ ] 프롬프트에 컨텍스트로 제공

**데이터 구조 예시:**
```typescript
// data/icf-codes.ts
export const ICF_CODES = {
  d450: {
    code: "d450",
    title: "걷기",
    description: "...",
    keywords: ["걷기", "보행", ...],
    examples: ["독립적으로 걷기 가능", ...]
  }
}
```

---

## 6단계: 성능 최적화

### 6.1 캐싱 구현
**해야 할 일:**
- [ ] 동일한 임상 언어에 대한 반복 요청 캐싱
- [ ] Redis 또는 메모리 캐시 사용
- [ ] 캐시 무효화 전략 수립

### 6.2 배치 처리
**해야 할 일:**
- [ ] 여러 코드를 한 번에 매칭하는 배치 API 구현
- [ ] API 호출 횟수 최소화

### 6.3 스트리밍 응답 (선택사항)
**해야 할 일:**
- [ ] 긴 텍스트 처리 시 스트리밍 응답 구현
- [ ] 사용자 경험 개선

---

## 7단계: 모니터링 및 평가

### 7.1 로깅 시스템 구축
**해야 할 일:**
- [ ] API 호출 로그 기록
- [ ] 매칭 정확도 추적
- [ ] 사용자 피드백 수집

### 7.2 평가 메트릭 정의
**해야 할 일:**
- [ ] 정확도(Accuracy) 측정
- [ ] 응답 시간 모니터링
- [ ] 비용 추적 (클라우드 API 사용 시)

---

## 8단계: 보안 및 프라이버시

### 8.1 API 키 보안
**해야 할 일:**
- [ ] API 키를 환경 변수로 관리
- [ ] 클라이언트 사이드에 노출되지 않도록 확인
- [ ] Next.js 서버 사이드에서만 API 호출

### 8.2 데이터 프라이버시
**해야 할 일:**
- [ ] 환자 정보가 포함된 텍스트 처리 시 암호화
- [ ] 로그에 민감 정보 포함 방지
- [ ] GDPR/개인정보보호법 준수

---

## 9단계: 로컬 모델 실행 (고급, 선택사항)

### 9.1 Ollama 설정
**해야 할 일:**
- [ ] Ollama 설치 및 실행
- [ ] 한국어 모델 다운로드
- [ ] 로컬 API 서버 구축

### 9.2 통합
**해야 할 일:**
- [ ] Ollama API와 통합
- [ ] 로컬/클라우드 모델 전환 기능 구현

---

## 10단계: 문서화 및 배포

### 10.1 문서 작성
**해야 할 일:**
- [ ] API 문서 작성
- [ ] 사용 가이드 작성
- [ ] 프롬프트 버전 관리

### 10.2 배포 준비
**해야 할 일:**
- [ ] 환경 변수 설정
- [ ] API 비용 예산 설정
- [ ] 모니터링 대시보드 구축

---

## 우선순위별 구현 순서

### Phase 1: 기본 통합 (1-2주)
1. ✅ 1단계: 모델 선택 및 환경 설정
2. ✅ 2단계: API 라우트 생성
3. ✅ 3단계: 프론트엔드 통합

### Phase 2: 기능 강화 (2-3주)
4. ✅ 4단계: 점수 추론 기능
5. ✅ 5단계: 프롬프트 최적화

### Phase 3: 최적화 및 안정화 (1-2주)
6. ✅ 6단계: 성능 최적화
7. ✅ 7단계: 모니터링
8. ✅ 8단계: 보안 강화

### Phase 4: 고급 기능 (선택사항)
9. ✅ 9단계: 로컬 모델
10. ✅ 10단계: 문서화 및 배포

---

## 예상 비용 (클라우드 API 사용 시)

- **OpenAI GPT-3.5-turbo**: $0.0015/1K tokens (입력), $0.002/1K tokens (출력)
- **Anthropic Claude Haiku**: $0.25/1M tokens (입력), $1.25/1M tokens (출력)
- **예상 월 사용량**: 1,000건 평가 × 평균 500 tokens = 500K tokens/월
- **예상 비용**: $1-5/월 (모델에 따라 다름)

---

## 참고 자료

- [OpenAI API 문서](https://platform.openai.com/docs)
- [Anthropic API 문서](https://docs.anthropic.com)
- [Ollama 문서](https://ollama.ai/docs)
- [ICF 공식 문서](https://www.who.int/standards/classifications/international-classification-of-functioning-disability-and-health)




