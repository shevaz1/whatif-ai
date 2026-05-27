import { Paragraph } from "@toss/tds-mobile";
import type { CSSProperties } from "react";
import { radius, spacing } from "@/design/tokens";
import type { Rarity, TalismanItem } from "@/types";

const rarityTheme: Record<
	Rarity,
	{
		label: string;
		background: string;
		border: string;
		text: string;
		subText: string;
		glow: string;
		core: string;
		ring: string;
		patternOpacity: number;
	}
> = {
	N: {
		label: "COMMON",
		background: "linear-gradient(145deg, #FFFFFF 0%, #F2F4F6 100%)",
		border: "#E5E8EB",
		text: "#191F28",
		subText: "#6B7684",
		glow: "0 10px 22px rgba(78, 89, 104, 0.10)",
		core: "#8B95A1",
		ring: "#D1D6DB",
		patternOpacity: 0.2,
	},
	R: {
		label: "RARE",
		background: "linear-gradient(145deg, #F7FBFF 0%, #EAF3FF 100%)",
		border: "#BBD9FF",
		text: "#0B4DA2",
		subText: "#4E5968",
		glow: "0 14px 28px rgba(49, 130, 246, 0.18)",
		core: "#3182F6",
		ring: "#85B8FF",
		patternOpacity: 0.34,
	},
	SR: {
		label: "SUPER RARE",
		background: "linear-gradient(145deg, #FFF9ED 0%, #FFE7C2 100%)",
		border: "#FDBA74",
		text: "#9A3412",
		subText: "#6B4E16",
		glow: "0 16px 34px rgba(249, 115, 22, 0.24)",
		core: "#F97316",
		ring: "#FDBA74",
		patternOpacity: 0.48,
	},
	SSR: {
		label: "LEGEND",
		background:
			"linear-gradient(145deg, #FFF5F7 0%, #FFE4EC 42%, #FCE7F3 100%)",
		border: "#FB7185",
		text: "#BE123C",
		subText: "#713F12",
		glow: "0 18px 40px rgba(225, 29, 72, 0.28)",
		core: "#E11D48",
		ring: "#F9A8D4",
		patternOpacity: 0.62,
	},
};

const styles = {
	card: {
		position: "relative",
		overflow: "hidden",
		borderRadius: radius.xl,
		padding: spacing.lg,
		marginTop: spacing.lg,
		border: "1px solid",
	} as CSSProperties,
	pattern: {
		position: "absolute",
		inset: 0,
		backgroundImage:
			"radial-gradient(circle at 16% 22%, currentColor 0 2px, transparent 3px), radial-gradient(circle at 84% 18%, currentColor 0 2px, transparent 3px), radial-gradient(circle at 76% 78%, currentColor 0 2px, transparent 3px), linear-gradient(135deg, transparent 0 42%, currentColor 42% 43%, transparent 43% 100%)",
		backgroundSize: "72px 72px, 92px 92px, 88px 88px, 100% 100%",
		pointerEvents: "none",
	} as CSSProperties,
	content: {
		position: "relative",
		display: "grid",
		gridTemplateColumns: "82px 1fr",
		gap: spacing.md,
		alignItems: "center",
	} as CSSProperties,
	sealWrap: {
		position: "relative",
		width: 82,
		height: 104,
		display: "grid",
		placeItems: "center",
	} as CSSProperties,
	seal: {
		position: "relative",
		width: 66,
		height: 86,
		borderRadius: "18px 18px 26px 26px",
		backgroundColor: "#FFFFFF",
		border: "2px solid",
		boxShadow: "inset 0 -10px 18px rgba(25, 31, 40, 0.06)",
		display: "grid",
		placeItems: "center",
	} as CSSProperties,
	sealTop: {
		position: "absolute",
		top: -8,
		width: 34,
		height: 16,
		borderRadius: radius.full,
		backgroundColor: "#FFFFFF",
		border: "2px solid",
	} as CSSProperties,
	orb: {
		width: 34,
		height: 34,
		borderRadius: radius.full,
		display: "grid",
		placeItems: "center",
		color: "#FFFFFF",
		fontSize: 13,
		fontWeight: 900,
		boxShadow: "0 8px 18px rgba(15, 23, 42, 0.16)",
	} as CSSProperties,
	ray: {
		position: "absolute",
		width: 74,
		height: 74,
		borderRadius: radius.full,
		border: "1px solid",
		opacity: 0.55,
	} as CSSProperties,
	badge: {
		display: "inline-flex",
		width: "fit-content",
		borderRadius: radius.full,
		padding: `${spacing.xxs}px ${spacing.sm}px`,
		backgroundColor: "rgba(255, 255, 255, 0.72)",
		border: "1px solid rgba(255, 255, 255, 0.74)",
		fontSize: 12,
		fontWeight: 900,
		letterSpacing: 0,
	} as CSSProperties,
	nameRow: {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		gap: spacing.sm,
		marginTop: spacing.xs,
	} as CSSProperties,
	bonus: {
		flex: "0 0 auto",
		borderRadius: radius.full,
		padding: `${spacing.xxs}px ${spacing.sm}px`,
		backgroundColor: "rgba(255, 255, 255, 0.72)",
		fontSize: 12,
		fontWeight: 900,
		whiteSpace: "nowrap",
	} as CSSProperties,
};

type TalismanItemCardProps = {
	talisman: TalismanItem;
};

export default function TalismanItemCard({ talisman }: TalismanItemCardProps) {
	const theme = rarityTheme[talisman.rarity];
	const isHighRarity = talisman.rarity === "SR" || talisman.rarity === "SSR";

	return (
		<div
			style={{
				...styles.card,
				background: theme.background,
				borderColor: theme.border,
				boxShadow: theme.glow,
				color: theme.core,
			}}
		>
			<div style={{ ...styles.pattern, opacity: theme.patternOpacity }} />
			<div style={styles.content}>
				<div style={styles.sealWrap} aria-hidden="true">
					{isHighRarity ? (
						<div
							style={{
								...styles.ray,
								borderColor: theme.ring,
								boxShadow: `0 0 28px ${theme.ring}`,
							}}
						/>
					) : null}
					<div style={{ ...styles.seal, borderColor: theme.ring }}>
						<div style={{ ...styles.sealTop, borderColor: theme.ring }} />
						<div style={{ ...styles.orb, backgroundColor: theme.core }}>
							{talisman.rarity}
						</div>
					</div>
				</div>
				<div>
					<span style={{ ...styles.badge, color: theme.text }}>
						{theme.label}
					</span>
					<div style={styles.nameRow}>
						<Paragraph typography="t6" fontWeight="bold" color={theme.text}>
							<Paragraph.Text>{talisman.name}</Paragraph.Text>
						</Paragraph>
						<span style={{ ...styles.bonus, color: theme.text }}>
							+{talisman.retryBonus}
						</span>
					</div>
					<Paragraph
						typography="t7"
						color={theme.subText}
						style={{ marginTop: spacing.xs }}
					>
						<Paragraph.Text>{talisman.description}</Paragraph.Text>
					</Paragraph>
				</div>
			</div>
		</div>
	);
}
