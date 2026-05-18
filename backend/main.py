from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from schemas import SimulationRequest, SimulationResponse
from simulator import simulate

app = FastAPI(title="오늘의 인생 선택지 API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/simulate", response_model=SimulationResponse)
def create_simulation(payload: SimulationRequest) -> SimulationResponse:
    return simulate(payload.question.strip())
