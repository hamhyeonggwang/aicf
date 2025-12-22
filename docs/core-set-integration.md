# ICF Core Set 통합 가이드

## 개요

이 앱은 [ICF Core Set](https://icfcoreset.net/select) 구조를 기반으로 재구성되었습니다. ICF Core Set은 특정 건강 상태나 상황에 대한 기능적 상태를 평가하기 위해 국제적으로 표준화된 항목 모음입니다.

## ICF Core Set이란?

ICF Core Set은 WHO ICF 분류체계에서 특정 건강 상태나 상황에 가장 관련성이 높은 ICF 코드들을 선별한 표준화된 항목 모음입니다. 이를 통해:

1. **표준화된 평가**: 국제적으로 검증된 평가 항목 사용
2. **효율적인 평가**: 핵심 항목만 선별하여 평가 시간 단축
3. **비교 가능성**: 동일한 Core Set을 사용하면 결과 비교 가능
4. **신뢰성 향상**: 전문가 합의를 통해 검증된 항목 사용

## 구현된 기능

### 1. Core Set 선택 기능

사용자는 평가 시작 전에 적합한 Core Set을 선택할 수 있습니다:

```typescript
// 지원하는 Core Set
- 뇌졸중 (Stroke)
- 만성 허리 통증 (Chronic Low Back Pain)
- 퇴행성 관절염 (Osteoarthritis)
- 일반 (Generic)
```

### 2. 동적 항목 필터링

선택한 Core Set에 포함된 ICF 코드만 평가 항목으로 표시됩니다:

```typescript
// Core Set 구조
{
  domains: {
    d: ['d450', 'd455', ...], // Activities & Participation
    b: ['b130', 'b140', ...], // Body Functions (optional)
    s: ['s730', ...],         // Body Structures (optional)
    e: ['e110', ...]          // Environmental Factors (optional)
  }
}
```

### 3. Core Set 정보 표시

- 선택된 Core Set 이름 및 버전
- 포함된 도메인별 코드 개수
- 건강 상태 정보

## Core Set 추가 방법

새로운 Core Set을 추가하려면 `types/core-set.ts` 파일을 수정하세요:

```typescript
{
  id: 'new-condition',
  name: '새로운 건강 상태',
  description: '설명',
  healthCondition: 'Condition Name',
  version: '1.0',
  domains: {
    d: ['d450', 'd455', ...], // 필수
    b: ['b130', ...],         // 선택
    s: ['s730', ...],         // 선택
    e: ['e110', ...]          // 선택
  },
  items: []
}
```

## Core Set과 평가 항목 매핑

각 평가 항목은 ICF 코드와 매핑되어 있으며, Core Set에 포함된 코드만 표시됩니다:

```typescript
// 평가 항목 예시
{
  id: "item-d450",
  icfCode: "d450",  // Core Set의 domains.d에 포함되어야 함
  domain: "d",
  question: "...",
  // ...
}
```

## 참고 자료

- [ICF Core Set 웹사이트](https://icfcoreset.net/select)
- [WHO ICF 공식 문서](https://www.who.int/standards/classifications/international-classification-of-functioning-disability-and-health)
- [ICF Browser](https://apps.who.int/classifications/icfbrowser/)

## 향후 개선 사항

1. **더 많은 Core Set 추가**: 다양한 건강 상태에 대한 Core Set 확장
2. **Core Set 검증**: Delphi 연구를 통한 Core Set 검증 프로세스 통합
3. **사용자 정의 Core Set**: 사용자가 직접 Core Set을 생성하고 저장하는 기능
4. **Core Set 비교**: 여러 Core Set 간 항목 비교 기능




