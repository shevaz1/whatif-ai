import {
	loadFullScreenAd,
	showFullScreenAd,
} from "@apps-in-toss/web-framework";

export const AD_GROUP_IDS = {
	resultBottomBanner: "ait.v2.live.218b8be77b9a495b",
	talismanReward: "ait.v2.live.a775dc44d431465e",
} as const;

const AD_LOAD_TIMEOUT_MS = 15000;
const AD_SHOW_TIMEOUT_MS = 90000;

function isDevelopmentFallbackEnabled(): boolean {
	return import.meta.env.DEV;
}

function withTimeout<T>(
	promise: Promise<T>,
	timeoutMessage: string,
	timeoutMs: number,
): Promise<T> {
	return new Promise((resolve, reject) => {
		const timer = window.setTimeout(() => {
			reject(new Error(timeoutMessage));
		}, timeoutMs);

		promise
			.then(resolve)
			.catch(reject)
			.finally(() => window.clearTimeout(timer));
	});
}

function loadRewardAd(adGroupId: string): Promise<void> {
	return withTimeout(
		new Promise((resolve, reject) => {
			const cleanup = loadFullScreenAd({
				options: { adGroupId },
				onEvent: (event) => {
					if (event.type === "loaded") {
						cleanup();
						resolve();
					}
				},
				onError: (error) => {
					cleanup();
					reject(error);
				},
			});
		}),
		"광고를 불러오지 못했어요.",
		AD_LOAD_TIMEOUT_MS,
	);
}

function showRewardAd(adGroupId: string): Promise<boolean> {
	return withTimeout(
		new Promise((resolve, reject) => {
			let adWasShown = false;
			const cleanup = showFullScreenAd({
				options: { adGroupId },
				onEvent: (event) => {
					if (
						event.type === "requested" ||
						event.type === "show" ||
						event.type === "impression"
					) {
						adWasShown = true;
					}

					if (event.type === "userEarnedReward") {
						cleanup();
						resolve(true);
					}

					if (event.type === "failedToShow") {
						cleanup();
						resolve(false);
					}

					if (event.type === "dismissed") {
						cleanup();
						resolve(adWasShown);
					}
				},
				onError: (error) => {
					cleanup();
					reject(error);
				},
			});
		}),
		"광고 응답이 지연되고 있어요.",
		AD_SHOW_TIMEOUT_MS,
	);
}

export async function showTalismanRewardAd(): Promise<boolean> {
	if (
		loadFullScreenAd.isSupported() !== true ||
		showFullScreenAd.isSupported() !== true
	) {
		return isDevelopmentFallbackEnabled();
	}

	await loadRewardAd(AD_GROUP_IDS.talismanReward);
	return showRewardAd(AD_GROUP_IDS.talismanReward);
}
