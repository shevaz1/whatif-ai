import { TossAds } from "@apps-in-toss/web-framework";
import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";
import { radius, spacing } from "@/design/tokens";
import { AD_GROUP_IDS } from "@/utils/ads";

const styles = {
	wrap: {
		width: "100%",
		minHeight: 92,
		marginTop: spacing.xl,
		borderRadius: radius.xl,
		overflow: "hidden",
		backgroundColor: "#F9FAFB",
	} as CSSProperties,
};

export default function ResultBannerAd() {
	const containerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const container = containerRef.current;
		if (!container || TossAds.initialize.isSupported() !== true) {
			return undefined;
		}

		let banner: { destroy: () => void } | null = null;
		let disposed = false;

		TossAds.initialize({
			callbacks: {
				onInitialized: () => {
					if (
						disposed ||
						!container ||
						TossAds.attachBanner.isSupported() !== true
					) {
						return;
					}

					banner = TossAds.attachBanner(
						AD_GROUP_IDS.resultBottomBanner,
						container,
						{
							theme: "light",
							tone: "grey",
							variant: "card",
						},
					);
				},
			},
		});

		return () => {
			disposed = true;
			banner?.destroy();
		};
	}, []);

	if (TossAds.initialize.isSupported() !== true) {
		return null;
	}

	return <div ref={containerRef} style={styles.wrap} />;
}
