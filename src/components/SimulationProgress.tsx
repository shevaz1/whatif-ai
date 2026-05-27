import { Paragraph } from "@toss/tds-mobile";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import { radius, spacing } from "@/design/tokens";

const steps = [
	"선택지를 미래 지도에 올리는 중",
	"성공 확률과 위험 신호를 맞춰보는 중",
	"희귀 엔딩 후보를 뒤집어보는 중",
	"오늘의 카드 등급을 조율하는 중",
	"공유하고 싶은 문장으로 다듬는 중",
];

const styles = {
	wrap: {
		marginTop: spacing.lg,
		borderRadius: radius.xl,
		padding: spacing.lg,
		border: "1px solid #E5E8EB",
		backgroundColor: "#FFFFFF",
		boxShadow: "0 10px 24px rgba(15, 23, 42, 0.06)",
	} as CSSProperties,
	top: {
		display: "flex",
		alignItems: "center",
		gap: spacing.sm,
	} as CSSProperties,
	orb: {
		width: 34,
		height: 34,
		borderRadius: radius.full,
		background:
			"conic-gradient(from 160deg, #3182F6, #F97316, #E11D48, #3182F6)",
		display: "grid",
		placeItems: "center",
		flex: "0 0 auto",
	} as CSSProperties,
	orbInner: {
		width: 20,
		height: 20,
		borderRadius: radius.full,
		backgroundColor: "#FFFFFF",
		boxShadow: "inset 0 0 0 5px #F2F4F6",
	} as CSSProperties,
	track: {
		height: 8,
		borderRadius: radius.full,
		backgroundColor: "#F2F4F6",
		overflow: "hidden",
		marginTop: spacing.md,
	} as CSSProperties,
	bar: {
		height: "100%",
		borderRadius: radius.full,
		background: "linear-gradient(90deg, #3182F6, #F97316, #E11D48)",
		transition: "width 520ms ease",
	} as CSSProperties,
	miniCards: {
		display: "grid",
		gridTemplateColumns: "repeat(4, 1fr)",
		gap: spacing.xs,
		marginTop: spacing.md,
	} as CSSProperties,
	miniCard: {
		borderRadius: radius.md,
		padding: `${spacing.xs}px 0`,
		textAlign: "center",
		fontSize: 12,
		fontWeight: 900,
		backgroundColor: "#F9FAFB",
		color: "#8B95A1",
		border: "1px solid #F2F4F6",
	} as CSSProperties,
	miniCardActive: {
		backgroundColor: "#191F28",
		color: "#FFFFFF",
		borderColor: "#191F28",
	} as CSSProperties,
};

type SimulationProgressProps = {
	label?: string;
};

export default function SimulationProgress({
	label = "AI가 미래를 시뮬레이션하고 있어요",
}: SimulationProgressProps) {
	const [step, setStep] = useState(0);

	useEffect(() => {
		const timer = window.setInterval(() => {
			setStep((current) => Math.min(current + 1, steps.length - 1));
		}, 1300);

		return () => window.clearInterval(timer);
	}, []);

	const progress = Math.min(24 + step * 18, 96);
	const activeRarityIndex = Math.min(step, 3);

	return (
		<section style={styles.wrap} aria-live="polite">
			<div style={styles.top}>
				<div style={styles.orb} aria-hidden="true">
					<div style={styles.orbInner} />
				</div>
				<div>
					<Paragraph typography="t6" fontWeight="bold" color="#191F28">
						<Paragraph.Text>{label}</Paragraph.Text>
					</Paragraph>
					<Paragraph
						typography="t7"
						color="#6B7684"
						style={{ marginTop: spacing.xxs }}
					>
						<Paragraph.Text>{steps[step]}</Paragraph.Text>
					</Paragraph>
				</div>
			</div>
			<div style={styles.track}>
				<div style={{ ...styles.bar, width: `${progress}%` }} />
			</div>
			<div style={styles.miniCards}>
				{["N", "R", "SR", "SSR"].map((rarity, index) => (
					<div
						key={rarity}
						style={{
							...styles.miniCard,
							...(index === activeRarityIndex ? styles.miniCardActive : null),
						}}
					>
						{rarity}
					</div>
				))}
			</div>
		</section>
	);
}
