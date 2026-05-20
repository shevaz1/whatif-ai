import { Button, Paragraph } from "@toss/tds-mobile";
import type { CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import BottomNav from "@/components/BottomNav";
import MetricCard from "@/components/MetricCard";
import SimulationCard from "@/components/SimulationCard";
import { examplePrompts } from "@/data/templates";
import { radius, spacing } from "@/design/tokens";
import { useWhatIf } from "@/hooks/useWhatIf";

const styles = {
	hero: { marginBottom: spacing.xl } as CSSProperties,
	subtitle: { color: "#6B7684", marginTop: spacing.sm } as CSSProperties,
	action: { marginTop: spacing.xl } as CSSProperties,
	examples: {
		display: "flex",
		flexWrap: "wrap",
		gap: spacing.xs,
		marginTop: spacing.lg,
	} as CSSProperties,
	chip: {
		borderRadius: radius.full,
		border: "1px solid #E5E8EB",
		padding: `${spacing.xs}px ${spacing.sm}px`,
		backgroundColor: "#FFFFFF",
		color: "#4E5968",
		fontSize: 14,
		fontWeight: 700,
	} as CSSProperties,
	stats: {
		display: "grid",
		gridTemplateColumns: "repeat(2, 1fr)",
		gap: spacing.sm,
		marginTop: spacing.xl,
	} as CSSProperties,
	empty: {
		border: "1px solid #F2F4F6",
		borderRadius: radius.xxl,
		padding: spacing.xl,
		backgroundColor: "#F9FAFB",
	} as CSSProperties,
	revenueHint: {
		border: "1px solid #E5E8EB",
		borderRadius: radius.xxl,
		padding: spacing.xl,
		backgroundColor: "#FFFFFF",
		marginTop: spacing.xl,
	} as CSSProperties,
};

export default function HomePage() {
	const navigate = useNavigate();
	const { snapshot } = useWhatIf();

	return (
		<AppLayout>
			<section style={styles.hero}>
				<Paragraph typography="t4" fontWeight="bold" color="#191F28">
					<Paragraph.Text>인생선택</Paragraph.Text>
				</Paragraph>
				<Paragraph typography="t7" style={styles.subtitle}>
					<Paragraph.Text>
						하고 싶은 선택을 입력하면 미래 루트를 뽑아드립니다.
					</Paragraph.Text>
				</Paragraph>
				<div style={styles.examples}>
					{examplePrompts.map((prompt) => (
						<span key={prompt} style={styles.chip}>
							{prompt}
						</span>
					))}
				</div>
				<div style={styles.action}>
					<Button
						size="large"
						color="primary"
						variant="fill"
						display="block"
						onClick={() =>
							navigate(snapshot.canSimulateToday ? "/simulate" : "/result")
						}
					>
						{snapshot.canSimulateToday ? "오늘의 루트 뽑기" : "오늘 결과 보기"}
					</Button>
				</div>
			</section>

			{snapshot.todayResult ? (
				<SimulationCard result={snapshot.todayResult} />
			) : (
				<section style={styles.empty}>
					<Paragraph typography="t6" fontWeight="bold" color="#191F28">
						<Paragraph.Text>오늘의 가챠가 아직 열려 있어요.</Paragraph.Text>
					</Paragraph>
					<Paragraph
						typography="t7"
						color="#6B7684"
						style={{ marginTop: spacing.xs }}
					>
						<Paragraph.Text>
							하루에 한 번만 결과가 저장됩니다. 질문은 짧을수록 밈처럼 잘
							나와요.
						</Paragraph.Text>
					</Paragraph>
				</section>
			)}

			<div style={styles.stats}>
				<MetricCard
					label="연속 출석"
					value={`${snapshot.attendance.streak}일`}
				/>
				<MetricCard label="엔딩 수집" value={`${snapshot.results.length}개`} />
			</div>

			<section style={styles.revenueHint}>
				<Paragraph typography="t6" fontWeight="bold" color="#191F28">
					<Paragraph.Text>내일 또 오면 새 타임라인</Paragraph.Text>
				</Paragraph>
				<Paragraph
					typography="t7"
					color="#6B7684"
					style={{ marginTop: spacing.xs }}
				>
					<Paragraph.Text>
						하루 1회 무료. 이후에는 광고 보상형 추가 뽑기와 프리미엄 해석으로
						확장할 수 있어요.
					</Paragraph.Text>
				</Paragraph>
			</section>

			<BottomNav />
		</AppLayout>
	);
}
