import { useCallback, useMemo, useState } from "react";
import type { TalismanItem, WhatIfSnapshot } from "@/types";
import { requestAiSimulation } from "@/utils/api";
import {
	clearWhatIfState,
	consumeTalisman,
	createRetrySimulation,
	createTalismanReward,
	createTodaySimulation,
	getTodayAttemptCount,
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

	const retry = useCallback(async (question: string) => {
		const currentAttemptCount = getTodayAttemptCount(question);
		const resultDraft = await requestAiSimulation(
			question,
			currentAttemptCount,
		);
		createRetrySimulation(resultDraft, currentAttemptCount + 1);
		setSnapshot(getWhatIfSnapshot());
	}, []);

	const grantTalisman = useCallback(() => {
		createTalismanReward();
		setSnapshot(getWhatIfSnapshot());
	}, []);

	const retryWithTalisman = useCallback(
		async (question: string, talisman: TalismanItem) => {
			const currentAttemptCount = getTodayAttemptCount(question);
			const boostedRetryCount = currentAttemptCount + talisman.retryBonus;
			const resultDraft = await requestAiSimulation(
				question,
				boostedRetryCount,
				talisman.rarity,
			);
			createRetrySimulation(
				resultDraft,
				currentAttemptCount + 1,
				talisman.rarity,
			);
			consumeTalisman(talisman.id);
			setSnapshot(getWhatIfSnapshot());
		},
		[],
	);

	const resetAll = useCallback(() => {
		clearWhatIfState();
		setSnapshot(getWhatIfSnapshot());
	}, []);

	return useMemo(
		() => ({
			snapshot,
			refresh,
			grantTalisman,
			simulate,
			retry,
			retryWithTalisman,
			resetAll,
		}),
		[
			grantTalisman,
			refresh,
			resetAll,
			retry,
			retryWithTalisman,
			simulate,
			snapshot,
		],
	);
}
