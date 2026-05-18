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
}

export interface AttendanceState {
	streak: number;
	bestStreak: number;
	lastUsedDate: string | null;
}

export interface WhatIfState {
	results: SimulationResult[];
	attendance: AttendanceState;
}

export interface WhatIfSnapshot extends WhatIfState {
	todayResult: SimulationResult | null;
	canSimulateToday: boolean;
}
