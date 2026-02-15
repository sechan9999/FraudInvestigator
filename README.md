# Fraud Detection Dashboard

> 7,000건의 실제 통신/금융 신용 데이터를 분석하여 사기(Fraud)를 탐지하는 AI 기반 대시보드

**Live Demo:** https://fraud-investigator.vercel.app/

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8)

---

## Overview

실제 `telecom_data.csv` (7,000행)를 서버에서 파싱하여 신용 신청 사기를 시각적으로 분석합니다.

| 통계 | 값 |
|------|-----|
| 총 신청 건수 | 7,000 |
| 사기 건수 (target=1) | 1,895 (27%) |
| 승인 | 5,000 |
| 거절 | 2,000 |

---

## Data Structure

CSV 컬럼 (`data/telecom_data.csv`):

| 컬럼 | 설명 | 예시 |
|------|------|------|
| `age` | 신청자 나이 | 33 |
| `income` | 소득 | 358 |
| `credit_history_months` | 신용 이력 (개월) | 31 |
| `num_credit_accounts` | 보유 계좌 수 | 3 |
| `debt_ratio` | 부채 비율 (0~1) | 0.54 |
| `num_late_payments` | 연체 횟수 | 2 |
| `target` | 사기 여부 (1=사기, 0=정상) | 1.0 |
| `status` | 승인/거절 | approved / rejected |

---

## Features

### Dashboard (메인)
- **KPI 카드**: 총 신청수, 사기 건수, 거절 건수, 평균 소득
- **위험 분포**: Low / Medium / High / Critical 파이차트
- **사기 원인 분석**: 높은 부채, 연체, 짧은 신용이력, 다수 계좌
- **나이별 / 소득별 사기 비율** 차트
- **7,000건 테이블**: 페이지네이션(20건/페이지), 검색, 위험등급 필터

### Real-time Analysis
- 실시간 신청 처리 시뮬레이션
- 처리량(Throughput) 추이 차트

### Agent Status (MLOps)
- 5개 AI 모델 성능 모니터링 (Accuracy, F1, Drift)
- Agent 기여도 차트
- 드리프트 감지 현황

### Reports
- **OpenAI API 연동**: AI가 데이터 기반 Executive Summary 자동 생성
- 통계 요약 카드
- PDF 내보내기

### AI Chat
- 대시보드 데이터를 컨텍스트로 한 AI 질의응답
- 플로팅 채팅 패널

---

## OpenAI API의 역할

OpenAI는 **선택 기능**입니다. API 키 없이도 차트, 테이블, KPI 등 핵심 대시보드는 전부 작동합니다. OpenAI는 "똑똑한 분석 도우미"를 추가하는 역할입니다.

### 1. AI 채팅 (`ChatPanel.tsx`)

오른쪽 하단 채팅 버튼을 누르면 대시보드 데이터를 기반으로 질문할 수 있습니다.

> "사기 비율이 가장 높은 나이대는?"
> "위험 등급 Critical인 건 몇 개야?"

대시보드 데이터(KPI, 차트, 클레임)를 OpenAI에 보내서 답변을 받는 구조입니다.

### 2. 개별 신청 분석 (`ClaimAnalysis.tsx`)

클레임을 클릭하면 상세 모달이 뜨는데, **"Analyze" 버튼**을 누르면 OpenAI가 해당 신청 건을 분석합니다.

> - 위험 평가: "부채비율 54%, 연체 2회 — 고위험"
> - 의심 패턴: "소득 대비 부채 과다, 짧은 신용이력"
> - 권장 조치: "추가 심사 필요"

### 3. Executive Summary (`AiReportSummary.tsx`)

Reports 탭에서 **"Generate Summary" 버튼**을 누르면 OpenAI가 전체 데이터를 요약한 경영진용 보고서를 자동 생성합니다.

> - 핵심 발견: 사기율 27%, 주요 원인은 높은 부채비율
> - 리스크: 20대 사기율 상승 추세
> - 권장 사항: 부채비율 40% 이상 신청자 추가 검증 필요

### 요약

| 기능 | 위치 | 하는 일 |
|------|------|---------|
| AI 채팅 | 우하단 채팅 버튼 | 데이터 기반 Q&A |
| 신청 분석 | 클레임 클릭 → Analyze | 개별 건 사기 분석 |
| 리포트 생성 | Reports 탭 | 전체 요약 보고서 |

---

## Risk Score Formula

```
Risk Score = debt_ratio × 0.4
           + (late_payments / 5) × 0.3
           + (1 - credit_months / 120) × 0.2
           + (accounts / 8) × 0.1
```

| 점수 | 등급 |
|------|------|
| 0 ~ 30% | Low |
| 30 ~ 50% | Medium |
| 50 ~ 70% | High |
| 70%+ | Critical |

---

## Tech Stack

| 기술 | 버전 | 용도 |
|------|------|------|
| Next.js | 16 | 풀스택 프레임워크 |
| React | 19 | UI 라이브러리 |
| TypeScript | 5 | 타입 안전성 |
| Tailwind CSS | 4 | 스타일링 |
| Recharts | 3 | 차트 시각화 |
| OpenAI API | - | AI 분석/채팅 (선택) |

---

## Project Structure

```
fraud-detection-dashboard/
├── app/
│   ├── page.tsx              # 메인 페이지
│   └── api/
│       ├── dashboard/route.ts   # CSV 데이터 API (KPI, 차트, 페이지네이션)
│       ├── openai/route.ts      # OpenAI 프록시 API
│       └── openai/status/route.ts # API 키 상태 확인
├── components/
│   ├── Dashboard.tsx          # 메인 대시보드 (4개 탭)
│   ├── ChatPanel.tsx          # AI 채팅 패널
│   ├── ClaimAnalysis.tsx      # 개별 신청 AI 분석
│   ├── AiReportSummary.tsx    # AI 리포트 요약
│   └── ApiKeyModal.tsx        # API 키 설정 모달
├── lib/
│   ├── csvParser.ts           # CSV 파싱 + 통계 계산
│   └── openai.ts              # OpenAI 클라이언트
├── data/
│   └── telecom_data.csv       # 실제 데이터 (7,000건)
└── README.md
```

---

## Getting Started

```bash
# 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build
```

http://localhost:3000 에서 확인

### OpenAI API (선택사항)

AI 분석 기능을 사용하려면:

1. **환경 변수**: `.env.local` 파일에 `OPENAI_API_KEY=sk-...` 추가
2. **또는 UI**: 사이드바 OpenAI 설정 버튼에서 API 키 입력

---

## Deployment

Vercel에 자동 배포됩니다.

```bash
# 수동 배포
npx vercel --prod
```

**Live:** https://fraud-investigator.vercel.app/

---

## API Endpoints

| Endpoint | Method | 설명 |
|----------|--------|------|
| `/api/dashboard` | GET | 대시보드 데이터 (KPI, 차트, 클레임) |
| `/api/dashboard?page=2&limit=20&risk=high&search=CLM` | GET | 필터/페이지네이션 |
| `/api/openai` | POST | OpenAI 프록시 |
| `/api/openai/status` | GET | 서버 API 키 설정 여부 |
