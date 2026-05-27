import type {
	AttendanceState,
	Rarity,
	SimulationDraft,
	SimulationResult,
	TalismanItem,
	WhatIfSnapshot,
	WhatIfState,
} from "@/types";
import { getTodayKey, getYesterdayKey } from "@/utils/date";

const STORAGE_KEY = "whatif-ai-v1";

const defaultAttendance: AttendanceState = {
	streak: 0,
	bestStreak: 0,
	lastUsedDate: null,
};

const defaultState: WhatIfState = {
	results: [],
	attendance: defaultAttendance,
	talismans: [],
};

const talismanMeta: Record<
	Rarity,
	{ name: string; description: string; retryBonus: number; weight: number }
> = {
	N: {
		name: "작은 징조 부적",
		description: "재시도 1회. 좋은 미래 확률이 아주 조금 올라가요.",
		retryBonus: 1,
		weight: 52,
	},
	R: {
		name: "반전 행운 부적",
		description: "재시도 1회. R 이상 미래를 기대해볼 수 있어요.",
		retryBonus: 1,
		weight: 30,
	},
	SR: {
		name: "행운 상승 부적",
		description: "재시도 2회급 보정. 좋은 미래 쪽으로 강하게 밀어줘요.",
		retryBonus: 2,
		weight: 14,
	},
	SSR: {
		name: "레전드 행운 부적",
		description: "재시도 3회급 보정. 가장 좋은 미래에 가까워져요.",
		retryBonus: 3,
		weight: 4,
	},
};

function canUseStorage(): boolean {
	return (
		typeof window !== "undefined" && typeof window.localStorage !== "undefined"
	);
}

function normalizeState(raw: Partial<WhatIfState> | null): WhatIfState {
	return {
		results: Array.isArray(raw?.results) ? raw.results : [],
		talismans: Array.isArray(raw?.talismans) ? raw.talismans : [],
		attendance: {
			streak: Number(raw?.attendance?.streak ?? 0),
			bestStreak: Number(raw?.attendance?.bestStreak ?? 0),
			lastUsedDate: raw?.attendance?.lastUsedDate ?? null,
		},
	};
}

function pickTalismanRarity(): Rarity {
	const entries = Object.entries(talismanMeta) as Array<
		[Rarity, (typeof talismanMeta)[Rarity]]
	>;
	const total = entries.reduce((sum, [, item]) => sum + item.weight, 0);
	let cursor = Math.floor(Math.random() * total);

	for (const [rarity, item] of entries) {
		if (cursor < item.weight) {
			return rarity;
		}
		cursor -= item.weight;
	}

	return "N";
}

export function loadWhatIfState(): WhatIfState {
	if (!canUseStorage()) {
		return defaultState;
	}

	const raw = window.localStorage.getItem(STORAGE_KEY);
	if (!raw) {
		return defaultState;
	}

	try {
		return normalizeState(JSON.parse(raw) as Partial<WhatIfState>);
	} catch {
		return defaultState;
	}
}

export function saveWhatIfState(next: WhatIfState): void {
	if (!canUseStorage()) {
		return;
	}

	window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function getWhatIfSnapshot(): WhatIfSnapshot {
	const state = loadWhatIfState();
	const today = getTodayKey();
	const todayResult =
		state.results.find((result) => result.date === today) ?? null;

	return {
		...state,
		todayResult,
		canSimulateToday: todayResult === null,
	};
}

export function createTodaySimulation(
	resultDraft: SimulationDraft,
): WhatIfState {
	const state = loadWhatIfState();
	const today = getTodayKey();
	const existing = state.results.find((result) => result.date === today);

	if (existing) {
		return state;
	}

	const result: SimulationResult = {
		...resultDraft,
		id: `${today}-${Date.now()}`,
		date: today,
		createdAt: new Date().toISOString(),
		attempt: 1,
	};
	const previousDate = state.attendance.lastUsedDate;
	const nextStreak =
		previousDate === getYesterdayKey() ? state.attendance.streak + 1 : 1;
	const nextState: WhatIfState = {
		results: [result, ...state.results],
		talismans: state.talismans,
		attendance: {
			streak: nextStreak,
			bestStreak: Math.max(state.attendance.bestStreak, nextStreak),
			lastUsedDate: today,
		},
	};

	saveWhatIfState(nextState);
	return nextState;
}

export function getTodayAttemptCount(question: string): number {
	const state = loadWhatIfState();
	const today = getTodayKey();
	return state.results.filter(
		(result) => result.date === today && result.question === question,
	).length;
}

export function createRetrySimulation(
	resultDraft: SimulationDraft,
	attempt: number,
	usedTalisman?: Rarity,
): WhatIfState {
	const state = loadWhatIfState();
	const today = getTodayKey();
	const result: SimulationResult = {
		...resultDraft,
		id: `${today}-${Date.now()}`,
		date: today,
		createdAt: new Date().toISOString(),
		attempt,
		usedTalisman,
	};
	const nextState: WhatIfState = {
		...state,
		results: [result, ...state.results],
	};

	saveWhatIfState(nextState);
	return nextState;
}

export function createTalismanReward(): WhatIfState {
	const state = loadWhatIfState();
	const rarity = pickTalismanRarity();
	const meta = talismanMeta[rarity];
	const item: TalismanItem = {
		id: `talisman-${Date.now()}`,
		rarity,
		name: meta.name,
		description: meta.description,
		retryBonus: meta.retryBonus,
		createdAt: new Date().toISOString(),
	};
	const nextState = {
		...state,
		talismans: [item],
	};

	saveWhatIfState(nextState);
	return nextState;
}

export function consumeTalisman(id: string): void {
	const state = loadWhatIfState();
	saveWhatIfState({
		...state,
		talismans: state.talismans[0]?.id === id ? [] : state.talismans,
	});
}

export function clearWhatIfState(): WhatIfState {
	saveWhatIfState(defaultState);
	return defaultState;
}
