# 문제 해결 가이드

## ❌ 오류: "No HTML file named index was found"

### 원인
Google Apps Script가 HTML 파일을 찾으려고 할 때 발생하는 오류입니다.

### 해결 방법

#### 방법 1: Code.gs 파일 확인 및 수정

1. Google Apps Script 편집기에서 `Code.gs` 파일 열기
2. `doGet` 함수가 다음과 같이 되어 있는지 확인:

```javascript
function doGet(e) {
  try {
    return ContentService.createTextOutput(JSON.stringify({
      message: 'ICF API 서버가 실행 중입니다.',
      endpoints: ['match', 'score-recommendation', 'intervention-recommendation'],
      version: '1.0.0',
      usage: '이 API는 POST 요청을 사용합니다. endpoint 필드를 포함하여 요청하세요.'
    }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(setCorsHeaders());
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      error: error.toString(),
      message: '서버 오류가 발생했습니다.'
    }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(setCorsHeaders());
  }
}
```

3. 만약 다르다면, 최신 `Code.gs` 파일 내용으로 교체
4. 저장 (Ctrl+S 또는 Cmd+S)

#### 방법 2: 배포 설정 확인

1. **"배포"** → **"배포 관리"** 클릭
2. 기존 배포 확인:
   - 배포 유형이 **"웹 앱"**인지 확인
   - 만약 **"HTML 파일"** 또는 다른 유형이라면:
     - 기존 배포 삭제
     - 새 배포 생성
     - **"웹 앱"** 선택

#### 방법 3: 새 배포 생성

1. 기존 배포 삭제 (선택사항):
   - **"배포"** → **"배포 관리"**
   - 기존 배포 옆의 **"삭제"** 클릭

2. 새 배포 생성:
   - **"배포"** → **"새 배포"**
   - ⚙️ 아이콘 클릭 → **"웹 앱"** 선택 (⚠️ 중요: HTML 파일이 아님)
   - 실행할 사용자: **"나"**
   - 액세스 권한: **"모든 사용자"**
   - **"배포"** 클릭

3. 새 배포 URL 복사

#### 방법 4: 코드 재저장

때로는 코드를 다시 저장하면 해결됩니다:

1. 모든 파일 저장 (Ctrl+S 또는 Cmd+S)
2. 잠시 대기 (1-2초)
3. 배포 URL 다시 테스트

---

## ❌ 오류: "OpenAI API 키가 설정되지 않았습니다"

### 해결 방법

1. **⚙️ 프로젝트 설정** → **"스크립트 속성"**
2. 속성 이름 확인:
   - 정확히 `OPENAI_API_KEY` (대문자, 언더스코어)
   - 공백이나 오타가 없는지 확인
3. 속성 값 확인:
   - `sk-`로 시작하는지 확인
   - 전체 키가 복사되었는지 확인
4. **"저장 스크립트 속성"** 클릭
5. 스크립트 재실행

---

## ❌ 오류: "권한이 거부되었습니다"

### 해결 방법

1. **"배포"** → **"배포 관리"**
2. 배포 설정 확인:
   - 실행할 사용자: **"나"** (본인 계정)
   - 액세스 권한: **"모든 사용자"**
3. 권한 재승인:
   - 배포 URL 접속
   - **"권한 확인"** 클릭
   - Google 계정 선택
   - **"허용"** 클릭

---

## ❌ 오류: "알 수 없는 엔드포인트"

### 해결 방법

POST 요청 본문에 `endpoint` 필드가 포함되어 있는지 확인:

```javascript
// 올바른 요청 형식
{
  "endpoint": "match",  // ⚠️ 필수 필드
  "clinicalText": "환자는..."
}

// 사용 가능한 endpoint 값:
// - "match"
// - "score-recommendation"
// - "intervention-recommendation"
```

---

## ❌ CORS 오류

### 해결 방법

1. 배포 설정 확인:
   - 액세스 권한: **"모든 사용자"**
2. 배포를 새로 생성
3. 브라우저 캐시 삭제 후 재시도

---

## ✅ 테스트 방법

### 1. GET 요청 테스트

배포 URL을 브라우저에 직접 입력:
```
https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

예상 응답:
```json
{
  "message": "ICF API 서버가 실행 중입니다.",
  "endpoints": ["match", "score-recommendation", "intervention-recommendation"],
  "version": "1.0.0",
  "usage": "이 API는 POST 요청을 사용합니다. endpoint 필드를 포함하여 요청하세요."
}
```

### 2. POST 요청 테스트

브라우저 개발자 도구 콘솔에서:

```javascript
fetch('YOUR_DEPLOYMENT_URL', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    endpoint: 'match',
    clinicalText: '환자는 평지에서 독립적으로 걷기가 가능합니다.'
  })
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));
```

---

## 🔍 디버깅 팁

### 실행 로그 확인

1. 왼쪽 메뉴에서 **"실행"** 클릭
2. 함수 실행 기록 확인
3. 오류 메시지 확인

### 코드 테스트

1. 상단 **▶️ 실행** 버튼 클릭
2. 함수 선택:
   - `doGet` - GET 요청 테스트
   - `doPost` - POST 요청 테스트 (직접 테스트 불가, 실제 요청 필요)
3. 실행 결과 확인

### 일반적인 문제

1. **파일이 저장되지 않음**
   - Ctrl+S 또는 Cmd+S로 명시적으로 저장
   - 저장 후 잠시 대기

2. **변경사항이 반영되지 않음**
   - 새 버전으로 배포 필요
   - 배포 관리 → 새 버전 편집

3. **함수를 찾을 수 없음**
   - 모든 파일이 업로드되었는지 확인
   - 파일 이름이 정확한지 확인 (.gs 확장자 자동 추가)

---

## 📞 추가 도움

문제가 계속되면:
1. 실행 로그 확인
2. 오류 메시지 전체 내용 확인
3. 배포를 새로 생성해보기
4. 모든 파일을 다시 업로드해보기

