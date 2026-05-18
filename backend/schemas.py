from typing import Literal

from pydantic import BaseModel, Field

Rarity = Literal["N", "R", "SR", "SSR"]


class SimulationRequest(BaseModel):
    question: str = Field(min_length=2, max_length=40)


class SimulationResponse(BaseModel):
    question: str
    successRate: int
    riskRate: int
    rarity: Rarity
    endingTitle: str
    endingDescription: str
    summary: str
    futureSimulation: str
    rareEnding: str
