# Google Apps Script 배포 가이드

이 가이드는 ICF 기반 임상언어분석 API를 Google Apps Script로 배포하는 방법을 설명합니다.

## 📖 시작하기

**처음 배포하시나요?** → **[상세 배포 가이드 (DEPLOYMENT_GUIDE.md)](./DEPLOYMENT_GUIDE.md)** 를 먼저 읽어주세요!

상세 가이드에는 스크린샷과 함께 단계별로 설명되어 있습니다.

## 📋 사전 준비

1. Google 계정 필요
2. OpenAI API 키 필요 (https://platform.openai.com)

## 🚀 배포 단계

### 1단계: Google Apps Script 프로젝트 생성

1. https://script.google.com 접속
2. "새 프로젝트" 클릭
3. 프로젝트 이름 변경 (예: "ICF API")

### 2단계: 파일 업로드

**옵션 1: 파일 복사 (권장)**
1. 다음 파일들을 각각 새 파일로 생성:
   - `Code.gs` - 메인 진입점
   - `ICFCodes.gs` - ICF 코드 데이터베이스
   - `OpenAIService.gs` - OpenAI API 호출 로직
   - `Handlers.gs` - 각 엔드포인트 핸들러
2. 각 파일의 내용을 복사하여 Google Apps Script 편집기에 붙여넣기
3. 저장 (Ctrl+S 또는 Cmd+S)

**옵션 2: 단일 파일 사용**
- `Code.gs` 파일만 사용해도 작동하지만, 코드가 길어서 관리가 어려울 수 있습니다.

### 3단계: OpenAI API 키 설정

1. 왼쪽 메뉴에서 "프로젝트 설정" (톱니바퀴 아이콘) 클릭
2. "스크립트 속성" 섹션으로 스크롤
3. "스크립트 속성 추가" 클릭
4. 속성 이름: `OPENAI_API_KEY`
5. 속성 값: OpenAI API 키 (예: `sk-...`)
6. "저장" 클릭

### 4단계: 웹 앱으로 배포

1. 상단 메뉴에서 "배포" > "새 배포" 클릭
2. "유형 선택"에서 "웹 앱" 선택
3. 설정:
   - **설명**: "ICF API v1" (선택사항)
   - **실행할 사용자**: "나"
   - **액세스 권한**: "모든 사용자"
4. "배포" 버튼 클릭
5. 권한 승인:
   - "권한 확인" 클릭
   - Google 계정 선택
   - "고급" > "안전하지 않은 페이지로 이동" (필요시)
   - "허용" 클릭
6. 배포 URL 복사 (예: `https://script.google.com/macros/s/.../exec`)

### 5단계: 프론트엔드에서 사용

Next.js 앱의 API 호출 부분을 수정하여 Google Apps Script URL을 사용하도록 변경:

```typescript
// components/ClinicalLanguageInput.tsx
const response = await fetch('YOUR_GOOGLE_APPS_SCRIPT_URL', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    endpoint: 'match',
    clinicalText: input
  }),
})
```

## 📡 API 엔드포인트

### 1. ICF 코드 매칭

```javascript
POST /exec
{
  "endpoint": "match",
  "clinicalText": "환자는 평지에서 독립적으로 걷기가 가능하나..."
}

응답:
{
  "matches": [
    {
      "code": "d450",
      "title": "걷기",
      "confidence": 0.9,
      "rationale": "..."
    }
  ]
}
```

### 2. 점수 추천

```javascript
POST /exec
{
  "endpoint": "score-recommendation",
  "clinicalText": "...",
  "icfCode": "d450",
  "icfTitle": "걷기"
}

응답:
{
  "performanceScore": 2,
  "capacityScore": 1,
  "rationale": "..."
}
```

### 3. 중재 추천

```javascript
POST /exec
{
  "endpoint": "intervention-recommendation",
  "clinicalText": "...",
  "icfCode": "d450",
  "icfTitle": "걷기",
  "performanceScore": 2,
  "capacityScore": 1
}

응답:
{
  "environmental": ["..."],
  "task": ["..."],
  "personal": ["..."]
}
```

## 🔧 문제 해결

### CORS 오류

Google Apps Script는 자동으로 CORS 헤더를 설정하므로 일반적으로 문제가 없습니다. 만약 문제가 발생하면:

1. 배포 설정에서 "액세스 권한"이 "모든 사용자"로 설정되어 있는지 확인
2. 배포를 다시 생성 (새 버전 배포)

### API 키 오류

```
OpenAI API 키가 설정되지 않았습니다.
```

→ 스크립트 속성에 `OPENAI_API_KEY`가 올바르게 설정되어 있는지 확인

### 권한 오류

```
권한이 거부되었습니다.
```

→ 배포 설정에서 "실행할 사용자"를 "나"로 설정하고, 권한을 다시 승인

## 📝 참고사항

- Google Apps Script는 무료로 사용할 수 있지만, 일일 실행 시간 제한이 있습니다 (6분/일)
- OpenAI API 호출은 별도로 비용이 발생합니다
- 배포 URL은 변경되지 않지만, 코드를 수정한 후에는 새 버전으로 배포해야 합니다

## 🔄 코드 업데이트

코드를 수정한 후:

1. 저장
2. "배포" > "배포 관리"
3. 기존 배포 옆의 "새 버전 편집" 클릭
4. 새 버전 번호 입력
5. "배포" 클릭

배포 URL은 동일하게 유지되며, 새 버전이 자동으로 적용됩니다.

