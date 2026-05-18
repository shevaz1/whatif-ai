import { Paragraph } from "@toss/tds-mobile";
import type { CSSProperties } from "react";
import RarityBadge from "@/components/RarityBadge";
import { endings } from "@/data/endings";
import { radius, spacing } from "@/design/tokens";
import type { SimulationResult } from "@/types";
import { formatKoreanDate } from "@/utils/date";

const styles = {
	card: {
		borderRadius: radius.xxl,
		padding: spacing.xl,
		border: "1px solid #F2F4F6",
		boxSizing: "border-box",
		overflow: "hidden",
	} as CSSProperties,
	top: {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		gap: spacing.sm,
		marginBottom: spacing.lg,
	} as CSSProperties,
	symbol: {
		width: 76,
		height: 76,
		borderRadius: radius.xxl,
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		color: "#FFFFFF",
		fontSize: 28,
		fontWeight: 900,
		marginBottom: spacing.lg,
		boxShadow: "0 12px 28px rgba(0, 0, 0, 0.12)",
	} as CSSProperties,
	meta: { color: "#6B7684" } as CSSProperties,
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
	const ending =
		endings.find((item) => item.id === result.endingId) ?? endings[0];

	return (
		<section
			style={{
				...styles.card,
				backgroundColor: ending.color,
				minHeight: shareMode ? 460 : undefined,
			}}
			aria-label={`${result.question} 결과 카드`}
		>
			<div style={styles.top}>
				<Paragraph typography="t7" fontWeight="bold" style={styles.meta}>
					<Paragraph.Text>
						{formatKoreanDate(result.date)} 시뮬레이션
					</Paragraph.Text>
				</Paragraph>
				<RarityBadge rarity={result.rarity} />
			</div>

			<div style={{ ...styles.symbol, backgroundColor: ending.accentColor }}>
				{result.rarity}
			</div>

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
				</div>
				<div style={styles.meter}>
					<Paragraph typography="t7" style={styles.label}>
						<Paragraph.Text>위험도</Paragraph.Text>
					</Paragraph>
					<Paragraph typography="t4" fontWeight="bold" color="#191F28">
						<Paragraph.Text>{result.riskRate}%</Paragraph.Text>
					</Paragraph>
				</div>
			</div>

			{shareMode ? (
				<Paragraph typography="t7" fontWeight="bold" style={styles.brand}>
					<Paragraph.Text>오늘의 인생 선택지에서 뽑은 미래 카드</Paragraph.Text>
				</Paragraph>
			) : null}
		</section>
	);
}
