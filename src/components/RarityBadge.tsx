import { Paragraph } from "@toss/tds-mobile";
import type { CSSProperties } from "react";
import { radius, spacing } from "@/design/tokens";
import type { Rarity } from "@/types";

const rarityColor: Record<Rarity, string> = {
	N: "#6B7684",
	R: "#3182F6",
	SR: "#F97316",
	SSR: "#E11D48",
};

const styles = {
	badge: {
		display: "inline-flex",
		alignItems: "center",
		justifyContent: "center",
		borderRadius: radius.full,
		padding: `${spacing.xxs}px ${spacing.sm}px`,
		backgroundColor: "#FFFFFF",
		border: "1px solid rgba(25, 31, 40, 0.08)",
	} as CSSProperties,
};

interface RarityBadgeProps {
	rarity: Rarity;
}

export default function RarityBadge({ rarity }: RarityBadgeProps) {
	return (
		<span style={styles.badge}>
			<Paragraph typography="t7" fontWeight="bold" color={rarityColor[rarity]}>
				<Paragraph.Text>{rarity}</Paragraph.Text>
			</Paragraph>
		</span>
	);
}
