import { endings, rarityWeights } from "@/data/endings";
import {
	futureFragments,
	rareEndingPhrases,
	toneByRarity,
} from "@/data/templates";
import type { Rarity, SimulationResult } from "@/types";
import { getTodayKey } from "@/utils/date";

function hashText(text: string): number {
	let hash = 2166136261;
	for (let index = 0; index < text.length; index += 1) {
		hash ^= text.charCodeAt(index);
		hash = Math.imul(hash, 16777619);
	}
	return Math.abs(hash);
}

function pickBySeed<T>(items: T[], seed: number): T {
	return items[seed % items.length];
}

function pickRarity(seed: number): Rarity {
	const total = Object.values(rarityWeights).reduce(
		(sum, weight) => sum + weight,
		0,
	);
	let cursor = seed % total;

	for (const [rarity, weight] of Object.entries(rarityWeights) as Array<
		[Rarity, number]
	>) {
		if (cursor < weight) {
			return rarity;
		}
		cursor -= weight;
	}

	return "N";
}

export function createSimulationResult(question: string): SimulationResult {
	const normalizedQuestion = question.trim();
	const today = getTodayKey();
	const seed = hashText(`${today}:${normalizedQuestion}`);
	const rarity = pickRarity(seed);
	const endingCandidates = endings.filter((ending) => ending.rarity === rarity);
	const ending = pickBySeed(endingCandidates, seed + 7);
	const tone = toneByRarity[rarity];
	const successBase =
		rarity === "SSR" ? 82 : rarity === "SR" ? 68 : rarity === "R" ? 54 : 38;
	const riskBase =
		rarity === "SSR" ? 44 : rarity === "SR" ? 58 : rarity === "R" ? 42 : 28;
	const successRate = Math.min(97, successBase + (seed % 17));
	const riskRate = Math.min(96, riskBase + ((seed >> 3) % 24));
	const firstFragment = pickBySeed(futureFragments, seed);
	const secondFragment = pickBySeed(futureFragments, seed >> 2);
	const rareEnding = pickBySeed(rareEndingPhrases, seed >> 4);

	return {
		id: `${today}-${seed}`,
		question: normalizedQuestion,
		date: today,
		successRate,
		riskRate,
		rarity,
		endingId: ending.id,
		endingTitle: ending.title,
		endingDescription: ending.description,
		summary: `${tone.headline}: ${tone.mood}`,
		futureSimulation: `${firstFragment} ${secondFragment}`,
		rareEnding,
		createdAt: new Date().toISOString(),
	};
}
