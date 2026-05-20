import { useCallback, useMemo, useState } from "react";
import type { WhatIfSnapshot } from "@/types";
import { requestAiSimulation } from "@/utils/api";
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

	const simulate = useCallback(async (question: string) => {
		const resultDraft = await requestAiSimulation(question);
		createTodaySimulation(resultDraft);
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
