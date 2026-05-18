import { useCallback, useMemo, useState } from "react";
import type { WhatIfSnapshot } from "@/types";
import {
	clearWhatIfState,
	createTodaySimulation,
	getWhatIfSnapshot,
} from "@/utils/storage";

export function useWhatIf() {
	const [snapshot, setSnapshot] = useState<WhatIfSnapshot>(() =>
		getWhatIfSnapshot(),
	);

	const refresh = useCallback(() => {
		setSnapshot(getWhatIfSnapshot());
	}, []);

	const simulate = useCallback((question: string) => {
		createTodaySimulation(question);
		setSnapshot(getWhatIfSnapshot());
	}, []);

	const resetAll = useCallback(() => {
		clearWhatIfState();
		setSnapshot(getWhatIfSnapshot());
	}, []);

	return useMemo(
		() => ({
			snapshot,
			refresh,
			simulate,
			resetAll,
		}),
		[refresh, resetAll, simulate, snapshot],
	);
}
