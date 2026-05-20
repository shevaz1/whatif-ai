from typing import Literal

from pydantic import BaseModel, Field

Rarity = Literal["N", "R", "SR", "SSR"]
EndingId = Literal["quiet-win", "plot-twist", "main-character", "legendary-timeline"]


class SimulationRequest(BaseModel):
    question: str = Field(min_length=2, max_length=40)


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
