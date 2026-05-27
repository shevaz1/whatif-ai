import type { Rarity, SimulationTone } from "@/types";

export const examplePrompts = [
	"퇴사하면?",
	"고백하면?",
	"코인 사면?",
	"집 사면?",
	"여행 가면?",
];

export const toneByRarity: Record<Rarity, SimulationTone> = {
	N: {
		headline: "작은 징조 카드",
		mood: "오늘의 방향을 잡아주는 기본 미래 카드",
	},
	R: {
		headline: "반전 행운 카드",
		mood: "막힌 흐름을 틀어주는 반전 미래 카드",
	},
	SR: {
		headline: "행운 상승 카드",
		mood: "선택의 기세를 올려주는 강한 미래 카드",
	},
	SSR: {
		headline: "레전드 미래 카드",
		mood: "오늘 하루가 달라질 것 같은 희귀한 미래 카드",
	},
};

export const futureFragments = [
	"첫날에는 괜히 휴대폰을 자주 보게 됩니다. 그래도 오후가 되면 생각보다 마음이 가벼워집니다.",
	"주변 반응은 반반입니다. 누군가는 말리고, 누군가는 지금 아니면 언제 하냐고 부추깁니다.",
	"3일 뒤 작은 사건이 생깁니다. 그 사건 때문에 선택의 의미가 조금 달라집니다.",
	"일주일 뒤에는 후회보다 궁금함이 커집니다. 결과보다 과정이 더 강하게 남습니다.",
	"한 달 뒤엔 이 선택을 농담처럼 말하게 됩니다. 다만 통장과 멘탈 중 하나는 흔들립니다.",
];

export const rareEndingPhrases = [
	"친구 단톡방에서 밈으로 박제됩니다.",
	"예상 못 한 사람이 결정적인 힌트를 줍니다.",
	"갑자기 알고리즘이 당신 편을 듭니다.",
	"작은 용기가 이상한 행운을 끌고 옵니다.",
	"미래의 내가 오늘을 꽤 그럴듯하게 포장합니다.",
];
