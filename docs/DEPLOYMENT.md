# 온라인 배포 가이드

다른 사람들이 온라인에서 사용할 수 있도록 배포하는 방법입니다.

## 🚀 배포 옵션

### 옵션 1: Vercel (권장) ⭐

**장점:**
- Next.js 제작사가 만든 플랫폼
- 무료 플랜 제공
- 자동 배포 (GitHub 연동)
- 간단한 설정
- 빠른 배포 속도

**단점:**
- 서버리스 함수 실행 시간 제한 (무료 플랜: 10초)

### 옵션 2: Netlify

**장점:**
- 무료 플랜 제공
- GitHub 연동
- 간단한 설정

**단점:**
- Vercel보다 Next.js 최적화가 약간 낮음

### 옵션 3: 기타 호스팅

- Railway
- Render
- AWS Amplify
- Google Cloud Run

---

## 📋 Vercel 배포 가이드 (권장)

### 사전 준비

1. ✅ GitHub 계정
2. ✅ Vercel 계정 (https://vercel.com)
3. ✅ Google Apps Script 배포 URL (이미 완료)

### 1단계: GitHub에 코드 업로드

#### 방법 A: GitHub Desktop 사용 (초보자용)

1. GitHub Desktop 다운로드: https://desktop.github.com
2. GitHub Desktop 실행
3. **File** → **Add Local Repository**
4. 프로젝트 폴더 선택
5. **Publish repository** 클릭
6. Repository name 입력 (예: `icf-assessment-tool`)
7. **Publish Repository** 클릭

#### 방법 B: Git 명령어 사용

```bash
# 프로젝트 폴더에서 실행
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/icf-assessment-tool.git
git push -u origin main
```

**⚠️ 중요**: `.env.local` 파일은 GitHub에 업로드하지 마세요 (이미 .gitignore에 포함됨)

### 2단계: Vercel에 배포

1. **Vercel 웹사이트 접속**
   - https://vercel.com 접속
   - **"Sign Up"** 또는 **"Log In"** 클릭
   - GitHub 계정으로 로그인 (권장)

2. **새 프로젝트 생성**
   - 대시보드에서 **"Add New..."** → **"Project"** 클릭
   - **"Import Git Repository"** 클릭
   - GitHub 저장소 선택
   - **"Import"** 클릭

3. **프로젝트 설정**
   - **Framework Preset**: Next.js (자동 감지됨)
   - **Root Directory**: `./` (기본값)
   - **Build Command**: `npm run build` (기본값)
   - **Output Directory**: `.next` (기본값)
   - **Install Command**: `npm install` (기본값)

4. **환경 변수 설정** ⚠️ 중요
   - **"Environment Variables"** 섹션 클릭
   - 다음 환경 변수 추가:

   ```
   이름: NEXT_PUBLIC_GAS_API_URL
   값: https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
   ```
   
   - `YOUR_SCRIPT_ID`를 실제 Google Apps Script 배포 URL로 교체
   - **"Add"** 클릭

5. **배포 시작**
   - **"Deploy"** 버튼 클릭
   - 배포 진행 상황 확인 (약 2-3분 소요)

6. **배포 완료**
   - 배포가 완료되면 **"Visit"** 버튼 클릭
   - 배포된 사이트 URL 확인 (예: `https://icf-assessment-tool.vercel.app`)

### 3단계: 배포 확인

1. 배포된 URL 접속
2. 임상 언어 입력 테스트
3. ICF 코드 매칭 확인
4. 모든 기능이 정상 작동하는지 확인

---

## 🔧 환경 변수 관리

### Vercel에서 환경 변수 설정

1. Vercel 대시보드 → 프로젝트 선택
2. **Settings** → **Environment Variables**
3. 환경 변수 추가:
   - `NEXT_PUBLIC_GAS_API_URL`: Google Apps Script 배포 URL

### 환경 변수 업데이트

환경 변수를 변경한 후:
1. Vercel 대시보드에서 환경 변수 수정
2. **"Redeploy"** 클릭하여 재배포

---

## 🌐 커스텀 도메인 설정 (선택사항)

### Vercel에서 도메인 추가

1. Vercel 대시보드 → 프로젝트 선택
2. **Settings** → **Domains**
3. 도메인 입력 (예: `icf.yourdomain.com`)
4. DNS 설정 안내에 따라 도메인 설정
5. SSL 인증서 자동 발급 (약 1-2분 소요)

### 무료 도메인 옵션

- **Freenom**: `.tk`, `.ml`, `.ga` 등 무료 도메인
- **GitHub Pages**: `username.github.io` 서브도메인

---

## 🔄 자동 배포 설정

### GitHub 연동 (자동 배포)

1. Vercel은 기본적으로 GitHub와 연동됨
2. 코드를 GitHub에 푸시하면 자동으로 재배포됨
3. Pull Request마다 미리보기 배포 생성

### 배포 브랜치 설정

1. Vercel 대시보드 → **Settings** → **Git**
2. **Production Branch**: `main` (기본값)
3. 다른 브랜치도 배포하려면 **"Add Branch"** 클릭

---

## 📊 배포 상태 확인

### Vercel 대시보드

- **Deployments**: 모든 배포 기록 확인
- **Analytics**: 방문자 통계 (유료 플랜)
- **Logs**: 실시간 로그 확인
- **Functions**: 서버리스 함수 실행 통계

### 배포 로그 확인

1. Vercel 대시보드 → 프로젝트 선택
2. **Deployments** 탭
3. 배포 클릭 → **"View Function Logs"** 클릭

---

## ❌ 문제 해결

### 문제 1: 빌드 실패

**해결 방법:**
1. Vercel 대시보드 → 배포 로그 확인
2. 오류 메시지 확인
3. 로컬에서 빌드 테스트:
   ```bash
   npm run build
   ```
4. 오류 수정 후 다시 배포

### 문제 2: 환경 변수가 적용되지 않음

**해결 방법:**
1. Vercel 대시보드 → **Settings** → **Environment Variables** 확인
2. 환경 변수 이름이 정확한지 확인 (`NEXT_PUBLIC_` 접두사 필요)
3. **"Redeploy"** 클릭하여 재배포

### 문제 3: API 호출 실패

**해결 방법:**
1. 브라우저 개발자 도구 (F12) → Network 탭 확인
2. Google Apps Script URL이 올바른지 확인
3. CORS 오류인 경우: Google Apps Script 배포 설정 확인
4. Vercel 함수 로그 확인

### 문제 4: 페이지가 표시되지 않음

**해결 방법:**
1. 빌드 로그 확인
2. `next.config.js` 설정 확인
3. 파일 경로 확인 (대소문자 구분)

---

## 💰 비용

### Vercel 무료 플랜

- ✅ 무제한 프로젝트
- ✅ 무제한 배포
- ✅ 100GB 대역폭/월
- ✅ 서버리스 함수: 100GB-시간/월
- ✅ 최대 실행 시간: 10초 (Hobby 플랜)

### 유료 플랜 (필요시)

- **Pro**: $20/월
  - 더 긴 실행 시간
  - 더 많은 대역폭
  - 팀 협업 기능

---

## 🔐 보안 고려사항

### 환경 변수 보안

- ✅ `.env.local` 파일은 GitHub에 업로드하지 않음 (이미 .gitignore에 포함)
- ✅ 민감한 정보는 Vercel 환경 변수로 관리
- ✅ `NEXT_PUBLIC_` 접두사는 클라이언트에서 접근 가능하므로 주의

### API 키 보안

- ✅ Google Apps Script API 키는 스크립트 속성에 저장
- ✅ OpenAI API 키는 Google Apps Script에서만 사용
- ✅ 클라이언트에 직접 노출되지 않음

---

## 📝 배포 체크리스트

배포 전 확인사항:

- [ ] 코드가 GitHub에 업로드됨
- [ ] `.env.local` 파일이 GitHub에 업로드되지 않음
- [ ] Google Apps Script 배포 URL 준비됨
- [ ] Vercel 계정 생성됨
- [ ] 환경 변수 설정됨 (`NEXT_PUBLIC_GAS_API_URL`)
- [ ] 로컬에서 빌드 테스트 성공 (`npm run build`)
- [ ] 배포 후 모든 기능 테스트 완료

---

## 🎉 완료!

배포가 완료되면:

1. ✅ 배포된 URL을 다른 사람들과 공유
2. ✅ URL을 북마크에 추가
3. ✅ 필요시 커스텀 도메인 설정
4. ✅ 코드 업데이트 시 자동 재배포 확인

---

## 📞 추가 도움말

- Vercel 문서: https://vercel.com/docs
- Next.js 배포 가이드: https://nextjs.org/docs/deployment
- 문제가 계속되면: Vercel 지원팀에 문의
