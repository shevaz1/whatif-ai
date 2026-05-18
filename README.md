# 오늘의 인생 선택지

Apps in Toss WebView 기반 AI 미니앱 MVP입니다.

사용자가 오늘 하고 싶은 선택을 입력하면 성공확률, 위험도, 미래 시뮬레이션, 희귀 엔딩, 등급을 카드 형태로 보여줍니다. 현재 프론트 MVP는 localStorage 기반 랜덤 생성이며, FastAPI 백엔드로 교체할 수 있게 구조를 분리했습니다.

## 실행

```bash
npm install
npm run dev
```

## 빌드

```bash
npm run build
```

`ait build`가 실행되며, Vite 결과물은 `granite.config.ts`의 `outdir: "dist"`와 일치해야 합니다.

## 주요 기능

- 질문 입력
- 하루 1회 사용 제한
- 랜덤 미래 결과 생성
- 성공확률 / 위험도 계산
- 등급 `N`, `R`, `SR`, `SSR`
- 희귀 엔딩
- 엔딩 도감
- 출석 streak
- 결과 저장
- 공유용 카드 UI

## 화면

- `/`: HomePage
- `/simulate`: SimulatePage
- `/result`: ResultPage
- `/archive`: ArchivePage
- `/my`: MyPage

## 프론트 구조

- `src/pages`: 라우트 화면
- `src/components`: 카드, 배지, 네비게이션 등 공통 UI
- `src/data`: 엔딩/문구/등급 데이터
- `src/hooks`: 앱 상태 hook
- `src/utils`: 랜덤 생성, 날짜, localStorage 저장소
- `src/types`: 도메인 타입

## 백엔드 구조

- `backend/main.py`: FastAPI 앱
- `backend/schemas.py`: 요청/응답 스키마
- `backend/simulator.py`: MVP 시뮬레이션 생성 로직

백엔드 연동 시 프론트의 `src/utils/random.ts`와 `src/utils/storage.ts`에서 결과 생성 부분을 API 호출로 교체하면 됩니다.
