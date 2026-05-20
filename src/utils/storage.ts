import type {
	AttendanceState,
	SimulationDraft,
	SimulationResult,
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
};

function canUseStorage(): boolean {
	return (
		typeof window !== "undefined" && typeof window.localStorage !== "undefined"
	);
}

function normalizeState(raw: Partial<WhatIfState> | null): WhatIfState {
	return {
		results: Array.isArray(raw?.results) ? raw.results : [],
		attendance: {
			streak: Number(raw?.attendance?.streak ?? 0),
			bestStreak: Number(raw?.attendance?.bestStreak ?? 0),
			lastUsedDate: raw?.attendance?.lastUsedDate ?? null,
		},
	};
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
	};
	const previousDate = state.attendance.lastUsedDate;
	const nextStreak =
		previousDate === getYesterdayKey() ? state.attendance.streak + 1 : 1;
	const nextState: WhatIfState = {
		results: [result, ...state.results],
		attendance: {
			streak: nextStreak,
			bestStreak: Math.max(state.attendance.bestStreak, nextStreak),
			lastUsedDate: today,
		},
	};

	saveWhatIfState(nextState);
	return nextState;
}

export function clearWhatIfState(): WhatIfState {
	saveWhatIfState(defaultState);
	return defaultState;
}
