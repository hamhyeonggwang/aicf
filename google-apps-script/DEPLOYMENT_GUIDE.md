# Google Apps Script 배포 가이드

ICF API를 Google Apps Script로 배포하는 정확한 단계별 가이드입니다.

## 📋 사전 준비사항

1. ✅ Google 계정 (Gmail 계정)
2. ✅ OpenAI API 키 (https://platform.openai.com 에서 발급)

---

## 🚀 배포 단계

### 1단계: Google Apps Script 프로젝트 생성

1. 웹 브라우저에서 **https://script.google.com** 접속
2. Google 계정으로 로그인 (필요시)
3. 왼쪽 상단의 **"새 프로젝트"** 버튼 클릭
   - 또는 **"+"** 아이콘 클릭
4. 프로젝트 이름 변경 (선택사항)
   - 기본 이름: "제목 없는 프로젝트"
   - 변경: 상단의 "제목 없는 프로젝트" 클릭 → "ICF API" 입력

---

### 2단계: 파일 업로드

Google Apps Script 편집기에서 다음 파일들을 생성합니다:

#### 파일 1: Code.gs 생성

1. 왼쪽 파일 목록에서 **"Code.gs"** 파일이 기본으로 생성되어 있습니다
2. `google-apps-script/Code.gs` 파일의 **전체 내용**을 복사
3. Google Apps Script 편집기의 Code.gs 파일에 **전체 내용 삭제 후 붙여넣기**
4. 저장: **Ctrl+S** (Windows) 또는 **Cmd+S** (Mac)

#### 파일 2: ICFCodes.gs 생성

1. 왼쪽 상단의 **"+"** 버튼 클릭 → **"스크립트"** 선택
2. 파일 이름을 **"ICFCodes"**로 변경 (확장자 .gs는 자동 추가됨)
3. `google-apps-script/ICFCodes.gs` 파일의 **전체 내용**을 복사
4. 붙여넣기 후 저장 (**Ctrl+S** 또는 **Cmd+S**)

#### 파일 3: OpenAIService.gs 생성

1. **"+"** 버튼 클릭 → **"스크립트"** 선택
2. 파일 이름을 **"OpenAIService"**로 변경
3. `google-apps-script/OpenAIService.gs` 파일의 **전체 내용**을 복사
4. 붙여넣기 후 저장

#### 파일 4: Handlers.gs 생성

1. **"+"** 버튼 클릭 → **"스크립트"** 선택
2. 파일 이름을 **"Handlers"**로 변경
3. `google-apps-script/Handlers.gs` 파일의 **전체 내용**을 복사
4. 붙여넣기 후 저장

**확인**: 왼쪽 파일 목록에 다음 4개 파일이 있어야 합니다:
- Code.gs
- ICFCodes.gs
- OpenAIService.gs
- Handlers.gs

---

### 3단계: OpenAI API 키 설정

1. 왼쪽 메뉴에서 **⚙️ (톱니바퀴) 아이콘** 클릭 → **"프로젝트 설정"** 선택
2. 설정 창이 열리면 아래로 스크롤
3. **"스크립트 속성"** 섹션 찾기
4. **"스크립트 속성 추가"** 버튼 클릭
5. 속성 추가:
   - **속성**: `OPENAI_API_KEY` (정확히 이 이름으로 입력)
   - **값**: OpenAI API 키 (예: `sk-proj-...`)
6. **"저장 스크립트 속성"** 버튼 클릭
7. 설정 창 닫기

**⚠️ 중요**: 
- 속성 이름은 정확히 `OPENAI_API_KEY` (대문자)로 입력해야 합니다
- API 키는 `sk-`로 시작하는 긴 문자열입니다

---

### 4단계: 권한 승인 (첫 실행 시)

1. 상단 메뉴에서 **▶️ (실행) 버튼** 클릭
   - 또는 **Ctrl+R** (Windows) / **Cmd+R** (Mac)
2. 함수 선택 창이 나타나면:
   - **"doGet"** 선택
   - **"실행"** 버튼 클릭
3. **권한 검토** 팝업이 나타납니다:
   - **"권한 확인"** 버튼 클릭
4. Google 계정 선택
5. **"고급"** 링크 클릭 (왼쪽 하단)
6. **"안전하지 않은 페이지로 이동"** 클릭
7. **"허용"** 버튼 클릭

**완료**: 이제 권한이 승인되었습니다.

---

### 5단계: 웹 앱으로 배포

1. 상단 메뉴에서 **"배포"** 클릭
2. **"새 배포"** 선택
3. 배포 창이 열리면:
   - **"유형 선택"** 옆의 **⚙️ (톱니바퀴) 아이콘** 클릭
   - **"웹 앱"** 선택
4. 배포 설정:
   - **설명**: `ICF API v1` (선택사항, 자유롭게 입력)
   - **실행할 사용자**: **"나"** 선택 ⚠️ 중요
   - **액세스 권한**: **"모든 사용자"** 선택 ⚠️ 중요
5. **"배포"** 버튼 클릭
6. 권한 승인 (처음 배포 시):
   - **"권한 확인"** 클릭
   - Google 계정 선택
   - **"허용"** 클릭
7. 배포 완료 창이 나타납니다:
   - **"웹 앱 URL"** 또는 **"배포 URL"** 복사 ⚠️ 중요
   - 예: `https://script.google.com/macros/s/AKfycby.../exec`

**⚠️ 중요 사항**:
- 배포 URL을 **반드시 복사**해두세요 (나중에 다시 볼 수 없습니다)
- URL은 `.../exec`로 끝나야 합니다

---

### 6단계: 배포 확인 (테스트)

1. 복사한 배포 URL을 새 브라우저 탭에 붙여넣기
2. Enter 키 누르기
3. 다음 JSON 응답이 나타나면 성공:
   ```json
   {
     "message": "ICF API 서버가 실행 중입니다.",
     "endpoints": ["match", "score-recommendation", "intervention-recommendation"],
     "version": "1.0.0"
   }
   ```

**✅ 성공**: API가 정상적으로 배포되었습니다!

---

## 🔧 프론트엔드 연결

### Next.js 앱에 연결하기

1. 프로젝트 루트에 `.env.local` 파일 생성 (없는 경우)
2. 다음 내용 추가:
   ```bash
   NEXT_PUBLIC_GAS_API_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
   ```
   - `YOUR_SCRIPT_ID` 부분을 실제 배포 URL로 교체

3. `components/ClinicalLanguageInput.tsx` 파일 수정:
   ```typescript
   const gasUrl = process.env.NEXT_PUBLIC_GAS_API_URL || '/api/icf/match'
   
   const response = await fetch(gasUrl, {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
     },
     body: JSON.stringify({
       endpoint: 'match',  // ⚠️ 중요: Google Apps Script는 endpoint 필드 필요
       clinicalText: input
     }),
   })
   ```

4. 개발 서버 재시작:
   ```bash
   npm run dev
   ```

---

## 🔄 코드 업데이트 방법

코드를 수정한 후 새 버전으로 배포:

1. Google Apps Script 편집기에서 코드 수정
2. 저장 (**Ctrl+S** 또는 **Cmd+S**)
3. **"배포"** → **"배포 관리"** 클릭
4. 기존 배포 옆의 **"새 버전 편집"** (연필 아이콘) 클릭
5. 새 버전 번호 입력 (예: `2`)
6. **"배포"** 버튼 클릭

**참고**: 배포 URL은 변경되지 않으며, 새 버전이 자동으로 적용됩니다.

---

## ❌ 문제 해결

### 문제 1: "OpenAI API 키가 설정되지 않았습니다" 오류

**해결 방법**:
1. 프로젝트 설정 → 스크립트 속성 확인
2. 속성 이름이 정확히 `OPENAI_API_KEY`인지 확인 (대문자)
3. API 키 값이 올바른지 확인 (`sk-`로 시작해야 함)
4. 저장 후 스크립트 재실행

### 문제 2: "권한이 거부되었습니다" 오류

**해결 방법**:
1. 배포 설정 확인:
   - 실행할 사용자: **"나"**
   - 액세스 권한: **"모든 사용자"**
2. 배포를 새로 생성
3. 권한을 다시 승인

### 문제 3: CORS 오류

**해결 방법**:
1. 배포 설정에서 액세스 권한이 **"모든 사용자"**로 설정되어 있는지 확인
2. 배포를 새로 생성
3. 브라우저 캐시 삭제 후 재시도

### 문제 4: "알 수 없는 엔드포인트" 오류

**해결 방법**:
1. 요청 본문에 `endpoint` 필드가 포함되어 있는지 확인
2. `endpoint` 값이 다음 중 하나인지 확인:
   - `match`
   - `score-recommendation`
   - `intervention-recommendation`

### 문제 5: 배포 URL을 잃어버렸을 때

**해결 방법**:
1. **"배포"** → **"배포 관리"** 클릭
2. 기존 배포의 **"URL 복사"** 버튼 클릭
3. 또는 배포를 새로 생성 (새 URL 발급)

---

## 📊 배포 상태 확인

### 배포 정보 확인
1. **"배포"** → **"배포 관리"** 클릭
2. 배포 목록에서 확인:
   - 배포 버전
   - 마지막 배포 시간
   - 활성 사용자 수

### 실행 로그 확인
1. 왼쪽 메뉴에서 **"실행"** 클릭
2. 함수 실행 기록 확인
3. 오류가 있으면 로그에서 확인 가능

---

## ✅ 체크리스트

배포 전 확인사항:

- [ ] 4개 파일 모두 업로드됨 (Code.gs, ICFCodes.gs, OpenAIService.gs, Handlers.gs)
- [ ] OpenAI API 키가 스크립트 속성에 설정됨
- [ ] 권한이 승인됨
- [ ] 배포 설정이 올바름 (실행할 사용자: "나", 액세스 권한: "모든 사용자")
- [ ] 배포 URL을 복사해두었음
- [ ] GET 요청 테스트 성공 (JSON 응답 확인)

---

## 🎉 완료!

이제 Google Apps Script를 통해 ICF API가 배포되었습니다. 

배포 URL을 프론트엔드에 연결하면 바로 사용할 수 있습니다!

---

## 📞 추가 도움말

- Google Apps Script 문서: https://developers.google.com/apps-script
- OpenAI API 문서: https://platform.openai.com/docs
- 문제가 계속되면: 프로젝트의 GitHub Issues에 문의

