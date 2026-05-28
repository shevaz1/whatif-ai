from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from schemas import SimulationRequest, SimulationResponse
from simulator import get_openai_model, get_openai_reasoning_effort, simulate

app = FastAPI(title="인생선택 API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {
        "status": "ok",
        "model": get_openai_model(),
        "reasoningEffort": get_openai_reasoning_effort(),
    }


@app.post("/simulate", response_model=SimulationResponse)
def create_simulation(payload: SimulationRequest) -> SimulationResponse:
    try:
        return simulate(
            payload.question.strip(),
            payload.retryCount,
            payload.talismanRarity,
            payload.minimumRarity,
        )
    except RuntimeError as error:
        raise HTTPException(status_code=503, detail=str(error)) from error
