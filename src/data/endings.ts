import type { Ending, Rarity } from "@/types";

export const rarityOrder: Rarity[] = ["N", "R", "SR", "SSR"];

export const endings: Ending[] = [
	{
		id: "quiet-win",
		rarity: "N",
		title: "조용한 승리",
		description: "큰 사건은 없지만, 생각보다 무난하게 하루가 풀립니다.",
		color: "#F2F4F6",
		accentColor: "#6B7684",
	},
	{
		id: "plot-twist",
		rarity: "R",
		title: "갑자기 분위기 반전",
		description: "처음엔 애매하지만 중간에 예상 못 한 기회가 들어옵니다.",
		color: "#EEF6FF",
		accentColor: "#3182F6",
	},
	{
		id: "main-character",
		rarity: "SR",
		title: "주인공 보정 발동",
		description: "위험은 있지만 타이밍이 잘 맞으면 꽤 멋진 결과가 나옵니다.",
		color: "#FFF3E0",
		accentColor: "#F97316",
	},
	{
		id: "legendary-timeline",
		rarity: "SSR",
		title: "레전드 타임라인",
		description: "말도 안 되게 좋은 변수가 붙습니다. 캡처하고 자랑할 만합니다.",
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
