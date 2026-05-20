import { Paragraph } from "@toss/tds-mobile";
import type { CSSProperties } from "react";
import RarityBadge from "@/components/RarityBadge";
import { radius, spacing } from "@/design/tokens";
import type { Rarity, SimulationResult } from "@/types";
import { formatKoreanDate } from "@/utils/date";

const rarityMeta: Record<
	Rarity,
	{
		label: string;
		catchphrase: string;
		odds: string;
		color: string;
		deepColor: string;
		softColor: string;
	}
> = {
	N: {
		label: "작은 징조 카드",
		catchphrase: "오늘의 방향을 조용히 잡아주는 기본 부적",
		odds: "등장 확률 52%",
		color: "#6B7684",
		deepColor: "#333D4B",
		softColor: "#F2F4F6",
	},
	R: {
		label: "반전 행운 카드",
		catchphrase: "막힌 흐름을 살짝 틀어주는 행운 부적",
		odds: "등장 확률 30%",
		color: "#3182F6",
		deepColor: "#1B64DA",
		softColor: "#EAF3FF",
	},
	SR: {
		label: "행운 상승 카드",
		catchphrase: "선택의 기세를 올려주는 강한 부적",
		odds: "등장 확률 14%",
		color: "#F97316",
		deepColor: "#C2410C",
		softColor: "#FFF3E0",
	},
	SSR: {
		label: "레전드 행운 부적",
		catchphrase: "오늘 하루가 달라질 것 같은 가장 희귀한 부적",
		odds: "등장 확률 4%",
		color: "#E11D48",
		deepColor: "#BE123C",
		softColor: "#FEECEF",
	},
};

const styles = {
	card: {
		borderRadius: radius.xxl,
		padding: spacing.xl,
		border: "1px solid #F2F4F6",
		boxSizing: "border-box",
		overflow: "hidden",
		position: "relative",
	} as CSSProperties,
	shine: {
		position: "absolute",
		top: -72,
		right: -54,
		width: 160,
		height: 160,
		borderRadius: radius.full,
		opacity: 0.18,
		pointerEvents: "none",
	} as CSSProperties,
	top: {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		gap: spacing.sm,
		marginBottom: spacing.lg,
		position: "relative",
	} as CSSProperties,
	topBadges: {
		display: "flex",
		alignItems: "center",
		gap: spacing.xs,
		flexShrink: 0,
	} as CSSProperties,
	attemptBadge: {
		borderRadius: radius.full,
		padding: `${spacing.xxs}px ${spacing.sm}px`,
		backgroundColor: "rgba(255, 255, 255, 0.72)",
		color: "#4E5968",
		fontSize: 13,
		fontWeight: 800,
		whiteSpace: "nowrap",
	} as CSSProperties,
	symbol: {
		width: 92,
		height: 92,
		borderRadius: radius.xxl,
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		color: "#FFFFFF",
		fontSize: 34,
		fontWeight: 900,
		marginBottom: spacing.lg,
		boxShadow: "0 16px 32px rgba(0, 0, 0, 0.16)",
		letterSpacing: 0,
	} as CSSProperties,
	meta: { color: "#6B7684" } as CSSProperties,
	rarityLine: {
		display: "flex",
		alignItems: "center",
		gap: spacing.sm,
		marginBottom: spacing.sm,
	} as CSSProperties,
	catchphrase: { marginBottom: spacing.lg } as CSSProperties,
	title: { marginBottom: spacing.sm } as CSSProperties,
	description: { color: "#4E5968", marginTop: spacing.md } as CSSProperties,
	meterGrid: {
		display: "grid",
		gridTemplateColumns: "repeat(2, 1fr)",
		gap: spacing.sm,
		marginTop: spacing.lg,
	} as CSSProperties,
	meter: {
		borderRadius: radius.lg,
		backgroundColor: "rgba(255, 255, 255, 0.72)",
		padding: spacing.md,
	} as CSSProperties,
	label: { color: "#6B7684", marginBottom: spacing.xxs } as CSSProperties,
	barTrack: {
		height: 6,
		borderRadius: radius.full,
		backgroundColor: "rgba(25, 31, 40, 0.08)",
		marginTop: spacing.sm,
		overflow: "hidden",
	} as CSSProperties,
	barFill: {
		height: "100%",
		borderRadius: radius.full,
	} as CSSProperties,
	odds: {
		borderRadius: radius.lg,
		padding: spacing.md,
		marginTop: spacing.lg,
		backgroundColor: "rgba(255, 255, 255, 0.66)",
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		gap: spacing.sm,
	} as CSSProperties,
	rule: {
		color: "#6B7684",
		marginTop: spacing.sm,
	} as CSSProperties,
	brand: {
		color: "#6B7684",
		marginTop: spacing.xl,
		textAlign: "center",
	} as CSSProperties,
};

interface SimulationCardProps {
	result: SimulationResult;
	shareMode?: boolean;
}

export default function SimulationCard({
	result,
	shareMode = false,
}: SimulationCardProps) {
	const meta = rarityMeta[result.rarity];

	return (
		<section
			style={{
				...styles.card,
				background: `linear-gradient(180deg, ${meta.softColor} 0%, #FFFFFF 68%)`,
				minHeight: shareMode ? 460 : undefined,
			}}
			aria-label={`${result.question} 행운 부적 카드`}
		>
			<div
				style={{
					...styles.shine,
					backgroundColor: meta.color,
				}}
			/>
			<div style={styles.top}>
				<Paragraph typography="t7" fontWeight="bold" style={styles.meta}>
					<Paragraph.Text>
						{formatKoreanDate(result.date)} 시뮬레이션
					</Paragraph.Text>
				</Paragraph>
				<div style={styles.topBadges}>
					{result.attempt && result.attempt > 1 ? (
						<span style={styles.attemptBadge}>{result.attempt}회차</span>
					) : null}
					<RarityBadge rarity={result.rarity} />
				</div>
			</div>

			<div style={{ ...styles.symbol, backgroundColor: meta.color }}>
				{result.rarity}
			</div>

			<div style={styles.rarityLine}>
				<Paragraph typography="t5" fontWeight="bold" color={meta.deepColor}>
					<Paragraph.Text>{meta.label}</Paragraph.Text>
				</Paragraph>
				<Paragraph typography="t7" fontWeight="bold" color={meta.color}>
					<Paragraph.Text>{meta.odds}</Paragraph.Text>
				</Paragraph>
			</div>
			<Paragraph typography="t7" color="#4E5968" style={styles.catchphrase}>
				<Paragraph.Text>{meta.catchphrase}</Paragraph.Text>
			</Paragraph>

			<Paragraph
				typography="t4"
				fontWeight="bold"
				color="#191F28"
				style={styles.title}
			>
				<Paragraph.Text>{result.question}</Paragraph.Text>
			</Paragraph>
			<Paragraph typography="t6" fontWeight="bold" color="#191F28">
				<Paragraph.Text>{result.endingTitle}</Paragraph.Text>
			</Paragraph>
			<Paragraph typography="t7" style={styles.description}>
				<Paragraph.Text>{result.summary}</Paragraph.Text>
			</Paragraph>

			<div style={styles.meterGrid}>
				<div style={styles.meter}>
					<Paragraph typography="t7" style={styles.label}>
						<Paragraph.Text>성공확률</Paragraph.Text>
					</Paragraph>
					<Paragraph typography="t4" fontWeight="bold" color="#191F28">
						<Paragraph.Text>{result.successRate}%</Paragraph.Text>
					</Paragraph>
					<div style={styles.barTrack}>
						<div
							style={{
								...styles.barFill,
								width: `${result.successRate}%`,
								backgroundColor: meta.color,
							}}
						/>
					</div>
				</div>
				<div style={styles.meter}>
					<Paragraph typography="t7" style={styles.label}>
						<Paragraph.Text>위험도</Paragraph.Text>
					</Paragraph>
					<Paragraph typography="t4" fontWeight="bold" color="#191F28">
						<Paragraph.Text>{result.riskRate}%</Paragraph.Text>
					</Paragraph>
					<div style={styles.barTrack}>
						<div
							style={{
								...styles.barFill,
								width: `${result.riskRate}%`,
								backgroundColor: "#EF4444",
							}}
						/>
					</div>
				</div>
			</div>

			<div style={styles.odds}>
				<Paragraph typography="t7" fontWeight="bold" color="#191F28">
					<Paragraph.Text>다음 목표</Paragraph.Text>
				</Paragraph>
				<Paragraph typography="t7" fontWeight="bold" color={meta.color}>
					<Paragraph.Text>
						{result.rarity === "SSR"
							? "오늘의 최고 부적 달성"
							: "SR · SSR 부적 도전"}
					</Paragraph.Text>
				</Paragraph>
			</div>
			<Paragraph typography="t7" style={styles.rule}>
				<Paragraph.Text>
					등급이 높을수록 더 좋은 미래가 시뮬레이션돼요.
				</Paragraph.Text>
			</Paragraph>

			{shareMode ? (
				<Paragraph typography="t7" fontWeight="bold" style={styles.brand}>
					<Paragraph.Text>인생선택에서 뽑은 오늘의 행운 부적</Paragraph.Text>
				</Paragraph>
			) : null}
		</section>
	);
}
