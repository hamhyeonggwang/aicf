# ICF 기반 평가도구

ICF(International Classification of Functioning, Disability and Health) 분류체계에 기반한 활동 및 참여 평가도구입니다.

## 주요 기능

- **ICF Core Set 기반 평가**: [ICF Core Set](https://icfcoreset.net/select) 구조에 맞춘 표준화된 평가
- **Core Set 선택 기능**: 특정 건강 상태(뇌졸중, 만성 허리 통증, 퇴행성 관절염 등)에 맞는 Core Set 선택
- **동적 항목 필터링**: 선택한 Core Set에 따라 평가 항목 자동 필터링
- **ICF-aligned Schema 기반 자동 렌더링**: JSON 기반 평가도구를 자동으로 렌더링
- **b/s/d/e 구조 분리**: 신체 기능(b), 신체 구조(s), 활동 및 참여(d), 환경 요인(e) 영역 분리
- **Participation(d) 우선 시각화**: 활동 및 참여 영역을 우선적으로 표시
- **이중 모드 지원**:
  - 보호자 입력 모드: 간단한 평가 입력
  - 치료사 검토 모드: 상세 평가 및 메모 작성, 매핑 근거 확인
- **점수 관리**: useState로 개별 점수 관리, 총점은 derived state로 자동 계산
- **ICF 코드 매핑 근거**: 각 평가 문항과 ICF 코드의 매핑 근거를 명시적으로 표시
- **PDF 보고서 생성**: 평가 결과를 PDF로 저장 가능 (사용된 Core Set 정보 포함)
- **시각화 기능**: 평가 결과를 도메인별 차트와 그래프로 시각화하여 직관적으로 확인

## 기술 스택

- **Next.js 14** (App Router)
- **TypeScript**
- **React 18**
- **순수 CSS** (CSS Modules)
- **jsPDF** + **html2canvas** (PDF 생성)

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 환경 변수 설정 (선택사항)
# .env.local 파일 생성 후 Google Apps Script URL 추가
# NEXT_PUBLIC_GAS_API_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build
npm start
```

## 🤖 AI 기능 설정 (Google Apps Script)

AI 기능(ICF 코드 매칭, 점수 추천, 중재 추천)을 사용하려면 Google Apps Script를 설정해야 합니다.

### 빠른 설정 (5분)

1. **Google Apps Script 프로젝트 생성**
   - https://script.google.com 접속
   - "새 프로젝트" 클릭

2. **파일 업로드**
   - `google-apps-script/` 폴더의 4개 파일을 Google Apps Script에 복사:
     - `Code.gs`
     - `ICFCodes.gs`
     - `OpenAIService.gs`
     - `Handlers.gs`

3. **OpenAI API 키 설정**
   - 프로젝트 설정 → 스크립트 속성
   - 속성: `OPENAI_API_KEY`, 값: OpenAI API 키

4. **배포**
   - 배포 → 새 배포 → 웹 앱
   - 실행할 사용자: **"나"**
   - 액세스 권한: **"모든 사용자"**
   - 배포 URL 복사

5. **프론트엔드 연결**
   - `.env.local` 파일에 배포 URL 추가:
     ```bash
     NEXT_PUBLIC_GAS_API_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
     ```

**자세한 가이드**: [google-apps-script/QUICK_START.md](./google-apps-script/QUICK_START.md) 또는 [google-apps-script/DEPLOYMENT_GUIDE.md](./google-apps-script/DEPLOYMENT_GUIDE.md)

**참고**: Google Apps Script를 설정하지 않아도 기본 기능은 사용할 수 있지만, AI 기능은 작동하지 않습니다.

### 📊 Google 스프레드시트 연동 (선택사항)

평가 결과를 Google 스프레드시트에 자동으로 저장할 수 있습니다.

**설정 방법:**
1. Google 스프레드시트 생성
2. Google Apps Script에 스프레드시트 ID 설정
3. 평가 완료 후 "스프레드시트에 저장" 버튼 클릭

**자세한 가이드**: [google-apps-script/SPREADSHEET_SETUP.md](./google-apps-script/SPREADSHEET_SETUP.md)

## 프로젝트 구조

```
icf/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 루트 레이아웃
│   ├── page.tsx           # 메인 페이지
│   └── globals.css        # 전역 스타일
├── components/            # React 컴포넌트
│   ├── AssessmentTool.tsx # 평가도구 메인 컴포넌트
│   ├── CoreSetSelector.tsx # ICF Core Set 선택 컴포넌트
│   ├── CoreSetEditor.tsx # Core Set 작성/편집 컴포넌트
│   ├── Visualization.tsx # 평가 결과 시각화 컴포넌트
│   ├── DomainSection.tsx  # 도메인별 섹션
│   ├── AssessmentItem.tsx # 개별 평가 항목
│   ├── ScoreSummary.tsx  # 점수 요약
│   ├── ModeSelector.tsx  # 모드 선택기
│   └── PDFExportButton.tsx # PDF 내보내기
├── types/                 # TypeScript 타입 정의
│   ├── icf.ts            # ICF 관련 타입
│   └── core-set.ts       # ICF Core Set 타입
├── data/                  # 데이터 파일
│   └── sample-assessment.ts # 샘플 평가도구 데이터
└── docs/                  # 문서
   ├── assessment-item-selection-criteria.md
   └── current-items-analysis.md
└── package.json
```

## 평가도구 JSON 구조

평가도구는 JSON 형식으로 정의되며, 다음 구조를 따릅니다:

```typescript
{
  id: string
  title: string
  version: string
  description: string
  domains: {
    b?: ICFDomainSection  // 신체 기능
    s?: ICFDomainSection  // 신체 구조
    d: ICFDomainSection   // 활동 및 참여 (필수)
    e?: ICFDomainSection  // 환경 요인
  }
  items: AssessmentItem[]
}
```

각 평가 항목은 ICF 코드와 매핑되며, 임상 언어 설명과 매핑 근거를 포함합니다.

## ICF Core Set 사용 방법

### 평가하기
1. **Core Set 선택**: 페이지 상단에서 평가하고자 하는 건강 상태에 맞는 Core Set 선택
2. **항목 필터링**: 선택한 Core Set에 포함된 ICF 코드만 자동으로 표시
3. **평가 수행**: 필터링된 항목에 대해 평가 진행
4. **결과 확인**: 
   - 도메인별 시각화 차트로 결과 확인
   - PDF 보고서에 사용된 Core Set 정보가 포함됨

### Core Set 작성하기
1. **Write 페이지 접속**: 메인 페이지 상단의 "Core Set 작성하기" 링크 클릭 또는 `/write` 경로로 이동
2. **새 Core Set 생성**: "새 Core Set 만들기" 버튼 클릭
3. **정보 입력**: Core Set 이름, 설명, 건강 상태, 버전 입력
4. **ICF 코드 선택**: 평가에 포함할 ICF 코드를 도메인별로 선택 (d 영역은 필수)
5. **저장**: 작성한 Core Set을 저장하면 메인 페이지에서 사용 가능

## 지원하는 Core Set

현재 다음 Core Set을 지원합니다:
- **뇌졸중 (Stroke)**: 뇌졸중 환자 평가용
- **만성 허리 통증 (Chronic Low Back Pain)**: 만성 허리 통증 환자 평가용
- **퇴행성 관절염 (Osteoarthritis)**: 퇴행성 관절염 환자 평가용
- **일반 (Generic)**: 기본 평가 항목

## 주요 페이지

- **메인 페이지 (`/`)**: Core Set 선택 및 평가 수행
- **Write 페이지 (`/write`)**: 사용자 정의 Core Set 작성 및 관리

## 🌐 온라인 배포

다른 사람들이 온라인에서 사용할 수 있도록 배포하는 방법:

### 빠른 배포 (Vercel 권장)

1. **GitHub에 코드 업로드**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/icf-assessment-tool.git
   git push -u origin main
   ```

2. **Vercel에 배포**
   - https://vercel.com 접속
   - GitHub로 로그인
   - "Add New..." → "Project" → 저장소 선택
   - 환경 변수 설정: `NEXT_PUBLIC_GAS_API_URL` (Google Apps Script URL)
   - "Deploy" 클릭

3. **배포 완료**
   - 배포된 URL 확인 (예: `https://icf-assessment-tool.vercel.app`)
   - URL을 다른 사람들과 공유

**자세한 배포 가이드**: [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)

## 향후 확장 계획

- **더 많은 Core Set 추가**: 다양한 건강 상태에 대한 Core Set 확장
- **sLLM 통합**: 소규모 언어 모델을 활용한 자동 평가 지원 ✅ (완료)
- **Delphi 연구**: 전문가 합의를 통한 평가도구 검증 프로세스 통합
- **데이터베이스 연동**: 평가 결과 저장 및 분석
- **다국어 지원**: ICF 공식 번역 지원
- **Core Set 공유**: 작성한 Core Set을 다른 사용자와 공유하는 기능

## 라이선스

MIT License

