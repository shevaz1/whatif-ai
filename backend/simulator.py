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

QUALITY_RANGES = {
    "N": {"success": (32, 58), "risk": (42, 78)},
    "R": {"success": (52, 72), "risk": (28, 62)},
    "SR": {"success": (68, 88), "risk": (18, 52)},
    "SSR": {"success": (84, 97), "risk": (8, 38)},
}

ENDING_BY_RARITY = {
    "N": ("quiet-win", "작은 징조", "크게 흔들리진 않지만 오늘의 방향을 조용히 잡아줍니다."),
    "R": ("plot-twist", "반전 행운", "처음엔 애매해도 중간에 흐름을 바꾸는 작은 기회가 들어옵니다."),
    "SR": ("main-character", "행운 상승", "위험은 있지만 선택의 기세가 올라 꽤 멋진 결과가 나옵니다."),
    "SSR": (
        "legendary-timeline",
        "레전드 행운 부적",
        "말도 안 되게 좋은 변수가 붙습니다. 오늘의 부적으로 간직하고 싶어집니다.",
    ),
}

FUTURE_FRAGMENTS = [
    "첫날에는 괜히 좋은 징조를 찾게 됩니다.",
    "주변 반응은 반반이지만 마음은 조금 가벼워집니다.",
    "3일 뒤 작은 우연이 선택의 분위기를 바꿉니다.",
    "일주일 뒤에는 후회보다 기대 쪽으로 마음이 기웁니다.",
    "한 달 뒤엔 이 선택을 행운의 시작처럼 말하게 됩니다.",
]

RARE_ENDINGS = [
    "오늘의 부적이 친구 단톡방에서 은근한 자랑거리가 됩니다.",
    "예상 못 한 사람이 결정적인 힌트를 줍니다.",
    "갑자기 알고리즘이 당신 편을 드는 듯한 일이 생깁니다.",
    "작은 용기가 이상한 행운을 끌고 옵니다.",
]


def _seed(question: str, retry_count: int = 0) -> int:
    digest = sha256(f"{question}:{retry_count}".encode("utf-8")).hexdigest()
    return int(digest[:12], 16)


def _pick_rarity(seed: int) -> str:
    total = sum(RARITY_WEIGHTS.values())
    cursor = seed % total
    for rarity, weight in RARITY_WEIGHTS.items():
        if cursor < weight:
            return rarity
        cursor -= weight
    return "N"


def _boost_rarity_for_retry(rarity: str, retry_count: int) -> str:
    order = ["N", "R", "SR", "SSR"]
    minimum_index = min(retry_count, len(order) - 1)
    current_index = order.index(rarity)
    return order[max(current_index, minimum_index)]


def _clamp(value: int, minimum: int, maximum: int) -> int:
    return max(minimum, min(maximum, int(value)))


def simulate(question: str, retry_count: int = 0) -> SimulationResponse:
    if os.getenv("OPENAI_API_KEY"):
        return simulate_with_openai(question, retry_count)

    if os.getenv("ALLOW_LOCAL_SIMULATION_FALLBACK") == "true":
        return simulate_locally(question, retry_count)

    raise RuntimeError("OPENAI_API_KEY is required for AI simulation")


def simulate_with_openai(question: str, retry_count: int = 0) -> SimulationResponse:
    client = OpenAI()
    model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

    response = client.responses.parse(
        model=model,
        input=[
            {
                "role": "system",
                "content": (
                    "너는 앱 '인생선택'의 엔터테인먼트용 AI 인생 선택 시뮬레이터이자 행운 부적 카드 생성기다. "
                    "사용자의 선택 질문을 미래 시뮬레이션, 운세, 밈, 가챠, 행운 부적 느낌으로 재미있게 시뮬레이션한다. "
                    "결과는 오락/참고용이어야 하며 투자, 법률, 의료, 취업 등 전문 조언처럼 단정하지 않는다. "
                    "위험한 행동을 부추기지 말고, 민감한 개인정보 입력을 요구하지 않는다. "
                    "실제로 인생이 바뀐다고 보장하지 않는다. "
                    "카드 등급은 미래 시뮬레이션의 품질이다. N은 작은 징조, R은 반전 가능성, SR은 좋은 미래 가능성, SSR은 가장 좋은 미래 가능성이다. "
                    "높은 등급일수록 성공확률은 높고 위험도는 낮아야 하며, 미래 시뮬레이션도 더 좋은 방향으로 써야 한다. "
                    "한국어로 짧고 공유하고 싶은 톤으로 작성한다. 좋은 등급일수록 오늘의 운이 살짝 바뀔 것 같은 상징성을 준다."
                ),
            },
            {
                "role": "user",
                "content": (
                    f"질문: {question}\n\n"
                    f"재도전 횟수: {retry_count}회\n"
                    "성공확률과 위험도는 0~100 정수로 작성해. 등급별 기준은 다음과 같아. "
                    "N=평범한 미래, R=조금 나아지는 미래, SR=좋은 미래, SSR=가장 좋은 미래. "
                    "rarity는 N, R, SR, SSR 중 하나로 고르고, 높은 등급일수록 결과 문장도 더 유리하게 써. "
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

    return normalize_response(parsed, question, retry_count)


def normalize_response(
    result: SimulationResponse,
    question: str,
    retry_count: int = 0,
) -> SimulationResponse:
    rarity = _boost_rarity_for_retry(result.rarity, retry_count)
    ending_id, ending_title, ending_description = ENDING_BY_RARITY[rarity]
    ranges = QUALITY_RANGES[rarity]
    return SimulationResponse(
        question=question,
        successRate=_clamp(result.successRate, *ranges["success"]),
        riskRate=_clamp(result.riskRate, *ranges["risk"]),
        rarity=rarity,
        endingId=ending_id,
        endingTitle=result.endingTitle or ending_title,
        endingDescription=result.endingDescription or ending_description,
        summary=result.summary,
        futureSimulation=result.futureSimulation,
        rareEnding=result.rareEnding,
    )


def simulate_locally(question: str, retry_count: int = 0) -> SimulationResponse:
    seed = _seed(question, retry_count)
    rarity = _boost_rarity_for_retry(_pick_rarity(seed), retry_count)
    ending_id, ending_title, ending_description = ENDING_BY_RARITY[rarity]
    success_min, success_max = QUALITY_RANGES[rarity]["success"]
    risk_min, risk_max = QUALITY_RANGES[rarity]["risk"]
    first = FUTURE_FRAGMENTS[seed % len(FUTURE_FRAGMENTS)]
    second = FUTURE_FRAGMENTS[(seed >> 2) % len(FUTURE_FRAGMENTS)]

    return SimulationResponse(
        question=question,
        successRate=_clamp(success_min + seed % 17, success_min, success_max),
        riskRate=_clamp(risk_min + (seed >> 3) % 24, risk_min, risk_max),
        rarity=rarity,
        endingId=ending_id,
        endingTitle=ending_title,
        endingDescription=ending_description,
        summary=f"{rarity} 부적이 열렸습니다. 오늘의 선택에 작은 기운이 붙습니다.",
        futureSimulation=f"{first} {second}",
        rareEnding=RARE_ENDINGS[(seed >> 4) % len(RARE_ENDINGS)],
    )
