# 빠른 배포 가이드 (5분 완성)

온라인 배포를 빠르게 완료하는 방법입니다.

## ⚡ 빠른 배포 (5단계)

### 1️⃣ GitHub에 코드 업로드

**GitHub Desktop 사용:**
1. GitHub Desktop 다운로드: https://desktop.github.com
2. 프로젝트 폴더 추가
3. **Publish repository** 클릭

**또는 Git 명령어:**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/icf-assessment-tool.git
git push -u origin main
```

### 2️⃣ Vercel 계정 생성

1. https://vercel.com 접속
2. GitHub로 로그인

### 3️⃣ 프로젝트 배포

1. Vercel 대시보드 → **"Add New..."** → **"Project"**
2. GitHub 저장소 선택 → **"Import"**
3. 프로젝트 설정 확인 (기본값 사용)

### 4️⃣ 환경 변수 설정 ⚠️

**Settings** → **Environment Variables**:
```
NEXT_PUBLIC_GAS_API_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

### 5️⃣ 배포 완료

1. **"Deploy"** 클릭
2. 배포 완료 후 **"Visit"** 클릭
3. 배포된 URL 확인

---

## ✅ 완료!

이제 배포된 URL을 다른 사람들과 공유할 수 있습니다!

**예시 URL**: `https://icf-assessment-tool.vercel.app`

---

## 🔄 업데이트 방법

코드를 수정한 후:
1. GitHub에 푸시
2. Vercel이 자동으로 재배포

---

**더 자세한 설명이 필요하신가요?** → [상세 배포 가이드](./DEPLOYMENT.md)
