import os
from hashlib import sha256

from openai import OpenAI
from schemas import SimulationResponse

RARITY_WEIGHTS = {
    "N": 52,
    "R": 30,
    "SR": 14,
    "SSR": 4,
}

ENDING_BY_RARITY = {
    "N": ("quiet-win", "조용한 승리", "큰 사건은 없지만 생각보다 무난하게 하루가 풀립니다."),
    "R": ("plot-twist", "갑자기 분위기 반전", "처음엔 애매하지만 중간에 예상 못 한 기회가 들어옵니다."),
    "SR": ("main-character", "주인공 보정 발동", "위험은 있지만 타이밍이 잘 맞으면 꽤 멋진 결과가 나옵니다."),
    "SSR": (
        "legendary-timeline",
        "레전드 타임라인",
        "말도 안 되게 좋은 변수가 붙습니다. 캡처하고 자랑할 만합니다.",
    ),
}

FUTURE_FRAGMENTS = [
    "첫날에는 괜히 휴대폰을 자주 보게 됩니다.",
    "주변 반응은 반반입니다.",
    "3일 뒤 작은 사건이 생깁니다.",
    "일주일 뒤에는 후회보다 궁금함이 커집니다.",
    "한 달 뒤엔 이 선택을 농담처럼 말하게 됩니다.",
]

RARE_ENDINGS = [
    "친구 단톡방에서 밈으로 박제됩니다.",
    "예상 못 한 사람이 결정적인 힌트를 줍니다.",
    "갑자기 알고리즘이 당신 편을 듭니다.",
    "작은 용기가 이상한 행운을 끌고 옵니다.",
]


def _seed(question: str) -> int:
    digest = sha256(question.encode("utf-8")).hexdigest()
    return int(digest[:12], 16)


def _pick_rarity(seed: int) -> str:
    total = sum(RARITY_WEIGHTS.values())
    cursor = seed % total
    for rarity, weight in RARITY_WEIGHTS.items():
        if cursor < weight:
            return rarity
        cursor -= weight
    return "N"


def simulate(question: str) -> SimulationResponse:
    if os.getenv("OPENAI_API_KEY"):
        return simulate_with_openai(question)

    if os.getenv("ALLOW_LOCAL_SIMULATION_FALLBACK") == "true":
        return simulate_locally(question)

    raise RuntimeError("OPENAI_API_KEY is required for AI simulation")


def simulate_with_openai(question: str) -> SimulationResponse:
    client = OpenAI()
    model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

    response = client.responses.parse(
        model=model,
        input=[
            {
                "role": "system",
                "content": (
                    "너는 앱 '인생선택'의 엔터테인먼트용 AI 미래 시뮬레이터다. "
                    "사용자의 선택 질문을 운세, 밈, 가챠 느낌으로 재미있게 시뮬레이션한다. "
                    "결과는 오락/참고용이어야 하며 투자, 법률, 의료, 취업 등 전문 조언처럼 단정하지 않는다. "
                    "위험한 행동을 부추기지 말고, 민감한 개인정보 입력을 요구하지 않는다. "
                    "한국어로 짧고 공유하고 싶은 톤으로 작성한다."
                ),
            },
            {
                "role": "user",
                "content": (
                    f"질문: {question}\n\n"
                    "성공확률과 위험도는 0~100 정수로 작성해. "
                    "rarity는 N, R, SR, SSR 중 하나로 고르고, "
                    "endingId는 rarity에 맞게 N=quiet-win, R=plot-twist, "
                    "SR=main-character, SSR=legendary-timeline 중 하나로 골라. "
                    "futureSimulation은 2~3문장, rareEnding은 한 문장으로 작성해."
                ),
            },
        ],
        text_format=SimulationResponse,
    )

    parsed = response.output_parsed
    if parsed is None:
        raise RuntimeError("AI simulation response was empty")

    return normalize_response(parsed, question)


def normalize_response(result: SimulationResponse, question: str) -> SimulationResponse:
    ending_id, ending_title, ending_description = ENDING_BY_RARITY[result.rarity]
    return SimulationResponse(
        question=question,
        successRate=max(0, min(100, int(result.successRate))),
        riskRate=max(0, min(100, int(result.riskRate))),
        rarity=result.rarity,
        endingId=ending_id,
        endingTitle=result.endingTitle or ending_title,
        endingDescription=result.endingDescription or ending_description,
        summary=result.summary,
        futureSimulation=result.futureSimulation,
        rareEnding=result.rareEnding,
    )


def simulate_locally(question: str) -> SimulationResponse:
    seed = _seed(question)
    rarity = _pick_rarity(seed)
    ending_id, ending_title, ending_description = ENDING_BY_RARITY[rarity]
    success_base = {"N": 38, "R": 54, "SR": 68, "SSR": 82}[rarity]
    risk_base = {"N": 28, "R": 42, "SR": 58, "SSR": 44}[rarity]
    first = FUTURE_FRAGMENTS[seed % len(FUTURE_FRAGMENTS)]
    second = FUTURE_FRAGMENTS[(seed >> 2) % len(FUTURE_FRAGMENTS)]

    return SimulationResponse(
        question=question,
        successRate=min(97, success_base + seed % 17),
        riskRate=min(96, risk_base + (seed >> 3) % 24),
        rarity=rarity,
        endingId=ending_id,
        endingTitle=ending_title,
        endingDescription=ending_description,
        summary=f"{rarity} 루트가 열렸습니다. 오늘의 선택은 생각보다 이야깃거리가 됩니다.",
        futureSimulation=f"{first} {second}",
        rareEnding=RARE_ENDINGS[(seed >> 4) % len(RARE_ENDINGS)],
    )
