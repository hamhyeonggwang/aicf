# sLLM 통합 완료 가이드

## ✅ 완료된 작업

1. ✅ OpenAI 패키지 설치
2. ✅ ICF 코드 데이터베이스 구축 (`data/icf-codes.ts`)
3. ✅ API 라우트 생성 (`app/api/icf/match/route.ts`)
4. ✅ 프론트엔드 통합 (API 호출 + 폴백 메커니즘)

## 🚀 시작하기

### 1. API 키 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```bash
OPENAI_API_KEY=sk-your-api-key-here
```

**API 키 발급 방법:**
1. https://platform.openai.com 접속
2. 계정 생성 또는 로그인
3. API Keys 메뉴에서 새 키 생성
4. 생성된 키를 `.env.local`에 복사

### 2. 서버 재시작

환경 변수를 적용하려면 개발 서버를 재시작하세요:

```bash
npm run dev
```

### 3. 테스트

1. 브라우저에서 `http://localhost:3000` 접속
2. 임상 언어 입력 예시:
   ```
   환자는 평지에서 독립적으로 걷기가 가능하나, 계단 오르기 시 어려움을 보입니다. 
   일상생활 활동 중 옷 입기와 식사는 독립적으로 수행 가능합니다.
   ```
3. "ICF 코드 찾기" 버튼 클릭
4. AI가 매칭한 ICF 코드 확인

## 📋 작동 방식

### API 호출 흐름

1. **사용자 입력** → 임상 언어 텍스트
2. **API 호출** → `/api/icf/match` 엔드포인트로 POST 요청
3. **sLLM 처리** → OpenAI GPT-3.5-turbo가 ICF 코드 매칭
4. **결과 반환** → JSON 형식으로 매칭된 코드 반환
5. **폴백 메커니즘** → API 실패 시 키워드 매칭 사용

### 프롬프트 구조

- **시스템 프롬프트**: ICF 전문가 역할 정의 + 사용 가능한 코드 목록
- **사용자 프롬프트**: 입력된 임상 언어
- **응답 형식**: JSON (code, title, confidence, rationale)

## 🔧 문제 해결

### API 키 오류
```
OpenAI API 키가 설정되지 않았습니다.
```
→ `.env.local` 파일이 프로젝트 루트에 있는지 확인
→ 파일 내용이 `OPENAI_API_KEY=sk-...` 형식인지 확인
→ 서버를 재시작했는지 확인

### API 호출 실패
→ 자동으로 키워드 매칭으로 폴백됩니다
→ 브라우저 콘솔에서 에러 메시지 확인

### 매칭 결과가 없음
→ confidence 임계값(0.3)을 낮춰보세요 (`route.ts`의 `confidence > 0.3` 부분)
→ 프롬프트를 개선하거나 더 많은 ICF 코드를 데이터베이스에 추가

## 💰 비용 예상

- **GPT-3.5-turbo**: 
  - 입력: $0.0015 / 1K tokens
  - 출력: $0.002 / 1K tokens
- **평균 사용량**: 1회 요청당 약 500-1000 tokens
- **예상 비용**: 1,000건 평가 시 약 $1-2/월

## 🎯 다음 단계 (선택사항)

1. **점수 추론 기능 추가**
   - `app/api/icf/score/route.ts` 생성
   - 임상 언어 기반 점수 자동 제안

2. **프롬프트 최적화**
   - Few-shot 예시 추가
   - 실제 사용 사례로 개선

3. **캐싱 구현**
   - 동일 입력에 대한 결과 캐싱
   - API 호출 비용 절감

4. **더 많은 ICF 코드 추가**
   - `data/icf-codes.ts`에 코드 추가
   - 매칭 정확도 향상

## 📚 참고 문서

- [OpenAI API 문서](https://platform.openai.com/docs)
- [sLLM 통합 가이드](./docs/sllm-integration-guide.md)
- [구현 체크리스트](./docs/sllm-implementation-checklist.md)




