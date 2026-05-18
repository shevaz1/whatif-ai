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
		headline: "현실적인 평행세계",
		mood: "잔잔하지만 손해는 적은 루트",
	},
	R: {
		headline: "살짝 재밌어지는 루트",
		mood: "변수가 생기고 이야기가 굴러가는 루트",
	},
	SR: {
		headline: "도파민 상승 루트",
		mood: "리스크와 보상이 같이 커지는 루트",
	},
	SSR: {
		headline: "이건 좀 캡처각",
		mood: "희귀 변수가 터지는 레전드 루트",
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
