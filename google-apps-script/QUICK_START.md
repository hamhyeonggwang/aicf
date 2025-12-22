# 빠른 시작 가이드 (5분 완성)

Google Apps Script 배포를 빠르게 완료하고 싶다면 이 가이드를 따라하세요.

## ⚡ 빠른 배포 (5단계)

### 1️⃣ 프로젝트 생성
- https://script.google.com 접속
- "새 프로젝트" 클릭

### 2️⃣ 파일 업로드
다음 4개 파일을 각각 생성하고 내용 복사:
- `Code.gs` → `google-apps-script/Code.gs` 내용 복사
- `ICFCodes.gs` → `google-apps-script/ICFCodes.gs` 내용 복사  
- `OpenAIService.gs` → `google-apps-script/OpenAIService.gs` 내용 복사
- `Handlers.gs` → `google-apps-script/Handlers.gs` 내용 복사

### 3️⃣ API 키 설정
- ⚙️ 프로젝트 설정 → 스크립트 속성
- 속성: `OPENAI_API_KEY`, 값: `sk-...` (OpenAI API 키)

### 4️⃣ 배포
- 배포 → 새 배포 → 웹 앱
- 실행할 사용자: **"나"**
- 액세스 권한: **"모든 사용자"**
- 배포 URL 복사 ⚠️

### 5️⃣ 테스트
배포 URL을 브라우저에 붙여넣기 → JSON 응답 확인

---

## ✅ 완료!

이제 배포 URL을 프론트엔드에 연결하면 됩니다.

**더 자세한 설명이 필요하신가요?** → [상세 배포 가이드](./DEPLOYMENT_GUIDE.md)

