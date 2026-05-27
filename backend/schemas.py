from typing import Literal

from pydantic import BaseModel, Field

Rarity = Literal["N", "R", "SR", "SSR"]
EndingId = Literal["quiet-win", "plot-twist", "main-character", "legendary-timeline"]


class SimulationRequest(BaseModel):
    question: str = Field(min_length=2, max_length=40)
    retryCount: int = Field(default=0, ge=0, le=100)
    talismanRarity: Rarity | None = None
    minimumRarity: Rarity | None = None


class SimulationResponse(BaseModel):
	question: str
	successRate: int
	riskRate: int
	rarity: Rarity
	endingId: EndingId
	endingTitle: str
	endingDescription: str
	summary: str
	futureSimulation: str
	rareEnding: str
