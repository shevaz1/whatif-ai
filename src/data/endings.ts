import type { Ending, Rarity } from "@/types";

export const rarityOrder: Rarity[] = ["N", "R", "SR", "SSR"];

export const endings: Ending[] = [
	{
		id: "quiet-win",
		rarity: "N",
		title: "작은 징조",
		description: "크게 흔들리진 않지만 오늘의 방향을 조용히 잡아줍니다.",
		color: "#F2F4F6",
		accentColor: "#6B7684",
	},
	{
		id: "plot-twist",
		rarity: "R",
		title: "반전 행운",
		description: "처음엔 애매해도 흐름을 바꾸는 작은 기회가 들어옵니다.",
		color: "#EEF6FF",
		accentColor: "#3182F6",
	},
	{
		id: "main-character",
		rarity: "SR",
		title: "행운 상승",
		description: "위험은 있지만 선택의 기세가 올라 꽤 멋진 결과가 나옵니다.",
		color: "#FFF3E0",
		accentColor: "#F97316",
	},
	{
		id: "legendary-timeline",
		rarity: "SSR",
		title: "레전드 미래 카드",
		description:
			"말도 안 되게 좋은 변수가 붙습니다. 오늘의 카드로 간직하고 싶어집니다.",
		color: "#FEECEF",
		accentColor: "#E11D48",
	},
];

export const rarityWeights: Record<Rarity, number> = {
	N: 52,
	R: 30,
	SR: 14,
	SSR: 4,
};
