from hashlib import sha256

from schemas import SimulationResponse

RARITY_WEIGHTS = {
    "N": 52,
    "R": 30,
    "SR": 14,
    "SSR": 4,
}

ENDING_BY_RARITY = {
    "N": ("조용한 승리", "큰 사건은 없지만 생각보다 무난하게 하루가 풀립니다."),
    "R": ("갑자기 분위기 반전", "처음엔 애매하지만 중간에 예상 못 한 기회가 들어옵니다."),
    "SR": ("주인공 보정 발동", "위험은 있지만 타이밍이 잘 맞으면 꽤 멋진 결과가 나옵니다."),
    "SSR": ("레전드 타임라인", "말도 안 되게 좋은 변수가 붙습니다. 캡처하고 자랑할 만합니다."),
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
    seed = _seed(question)
    rarity = _pick_rarity(seed)
    ending_title, ending_description = ENDING_BY_RARITY[rarity]
    success_base = {"N": 38, "R": 54, "SR": 68, "SSR": 82}[rarity]
    risk_base = {"N": 28, "R": 42, "SR": 58, "SSR": 44}[rarity]
    first = FUTURE_FRAGMENTS[seed % len(FUTURE_FRAGMENTS)]
    second = FUTURE_FRAGMENTS[(seed >> 2) % len(FUTURE_FRAGMENTS)]

    return SimulationResponse(
        question=question,
        successRate=min(97, success_base + seed % 17),
        riskRate=min(96, risk_base + (seed >> 3) % 24),
        rarity=rarity,
        endingTitle=ending_title,
        endingDescription=ending_description,
        summary=f"{rarity} 루트가 열렸습니다. 오늘의 선택은 생각보다 이야깃거리가 됩니다.",
        futureSimulation=f"{first} {second}",
        rareEnding=RARE_ENDINGS[(seed >> 4) % len(RARE_ENDINGS)],
    )
