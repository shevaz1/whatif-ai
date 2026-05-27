# 인생선택

Apps in Toss WebView 기반 AI 인생 선택 시뮬레이션 미니앱 MVP입니다.

사용자가 오늘 하고 싶은 선택을 입력하면 OpenAI 기반 FastAPI 백엔드가 성공확률, 위험도, 인생 시뮬레이션, 히든 메시지, 등급을 행운 부적 카드 형태로 생성합니다. 결과와 출석 정보는 MVP 기준 localStorage에 저장합니다.

## 실행

```bash
npm install
npm run dev
```

프론트에서 AI 백엔드를 호출하려면 환경변수가 필요합니다.

```bash
VITE_API_BASE_URL=http://localhost:8000 npm run dev
```

## 백엔드 실행

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
OPENAI_API_KEY=sk-... uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

선택 환경변수:

- `OPENAI_MODEL`: 기본값 `gpt-5-mini`
- `ALLOW_LOCAL_SIMULATION_FALLBACK=true`: OpenAI 키 없이 개발용 로컬 시뮬레이션 허용

## Render 백엔드 배포

루트의 `render.yaml`로 FastAPI 백엔드를 Render Web Service로 배포할 수 있습니다.

Render Dashboard에서 Blueprint 또는 Web Service를 만들고 이 GitHub repo를 연결합니다.

필수 환경변수:

- `OPENAI_API_KEY`: Render 환경변수로 직접 입력
- `OPENAI_MODEL`: `gpt-5-mini`

배포 후 발급된 URL의 `/health`가 `{"status":"ok"}`를 반환하면 프론트 출시 빌드를 다시 만듭니다.

```bash
VITE_API_BASE_URL=https://your-render-service.onrender.com npm run build
```

## 빌드

```bash
npm run build
```

`ait build`가 실행되며, Vite 결과물은 `granite.config.ts`의 `outdir: "dist"`와 일치해야 합니다.

## 주요 기능

- 질문 입력
- 하루 1회 사용 제한
- AI 미래 결과 생성
- 성공확률 / 위험도 계산
- 등급 `N`, `R`, `SR`, `SSR`
- 희귀 엔딩
- 시뮬레이션 보관함
- 연속 출석
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
- `src/utils`: API 호출, 날짜, localStorage 저장소
- `src/types`: 도메인 타입

## 백엔드 구조

- `backend/main.py`: FastAPI 앱
- `backend/schemas.py`: 요청/응답 스키마
- `backend/simulator.py`: OpenAI 기반 시뮬레이션 생성 로직

프론트는 `src/utils/api.ts`에서 백엔드 `/simulate`를 호출합니다.
