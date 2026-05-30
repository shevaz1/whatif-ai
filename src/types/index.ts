export type RoutePath = "/" | "/simulate" | "/result" | "/archive" | "/my";

export type Rarity = "N" | "R" | "SR" | "SSR";

export interface Ending {
	id: string;
	rarity: Rarity;
	title: string;
	description: string;
	color: string;
	accentColor: string;
}

export interface SimulationTone {
	headline: string;
	mood: string;
}

export interface SimulationResult {
	id: string;
	question: string;
	date: string;
	successRate: number;
	riskRate: number;
	rarity: Rarity;
	endingId: string;
	endingTitle: string;
	endingDescription: string;
	summary: string;
	futureSimulation: string;
	rareEnding: string;
	createdAt: string;
	attempt?: number;
	usedTalisman?: Rarity;
}

export type SimulationDraft = Omit<
	SimulationResult,
	"id" | "date" | "createdAt"
>;

export interface AttendanceState {
	streak: number;
	bestStreak: number;
	lastUsedDate: string | null;
}

export interface WhatIfState {
	results: SimulationResult[];
	attendance: AttendanceState;
	talismans: TalismanItem[];
}

export interface WhatIfSnapshot extends WhatIfState {
	todayResult: SimulationResult | null;
	canSimulateToday: boolean;
}

export interface TalismanItem {
	id: string;
	rarity: Rarity;
	name: string;
	description: string;
	retryBonus: number;
	remainingUses: number;
	createdAt: string;
}
