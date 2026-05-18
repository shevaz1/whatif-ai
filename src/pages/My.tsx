import { Button, Paragraph } from "@toss/tds-mobile";
import type { CSSProperties } from "react";
import AppLayout from "@/components/AppLayout";
import BottomNav from "@/components/BottomNav";
import MetricCard from "@/components/MetricCard";
import PageHeader from "@/components/PageHeader";
import { radius, spacing } from "@/design/tokens";
import { useWhatIf } from "@/hooks/useWhatIf";

const styles = {
	stats: {
		display: "grid",
		gridTemplateColumns: "repeat(2, 1fr)",
		gap: spacing.sm,
	} as CSSProperties,
	panel: {
		border: "1px solid #F2F4F6",
		borderRadius: radius.xxl,
		padding: spacing.xl,
		backgroundColor: "#F9FAFB",
		marginTop: spacing.xl,
	} as CSSProperties,
	action: { marginTop: spacing.lg } as CSSProperties,
};

export default function MyPage() {
	const { snapshot, resetAll } = useWhatIf();

	return (
		<AppLayout>
			<PageHeader
				title="마이"
				subtitle="출석과 사용 제한, 저장된 결과를 확인해요."
			/>

			<div style={styles.stats}>
				<MetricCard
					label="연속 출석"
					value={`${snapshot.attendance.streak}일`}
				/>
				<MetricCard
					label="최고 연속 출석"
					value={`${snapshot.attendance.bestStreak}일`}
				/>
			</div>

			<section style={styles.panel}>
				<Paragraph typography="t6" fontWeight="bold" color="#191F28">
					<Paragraph.Text>오늘 사용 상태</Paragraph.Text>
				</Paragraph>
				<Paragraph
					typography="t7"
					color="#6B7684"
					style={{ marginTop: spacing.xs }}
				>
					<Paragraph.Text>
						{snapshot.canSimulateToday
							? "오늘의 시뮬레이션을 아직 사용할 수 있어요."
							: "오늘의 시뮬레이션을 이미 사용했어요."}
					</Paragraph.Text>
				</Paragraph>
			</section>

			<section style={styles.panel}>
				<Paragraph typography="t6" fontWeight="bold" color="#191F28">
					<Paragraph.Text>저장 데이터</Paragraph.Text>
				</Paragraph>
				<Paragraph
					typography="t7"
					color="#6B7684"
					style={{ marginTop: spacing.xs }}
				>
					<Paragraph.Text>
						현재 이 기기에 {snapshot.results.length}개의 결과가 저장되어 있어요.
					</Paragraph.Text>
				</Paragraph>
				<div style={styles.action}>
					<Button
						size="large"
						color="dark"
						variant="weak"
						display="block"
						onClick={resetAll}
					>
						기록 초기화
					</Button>
				</div>
			</section>

			<BottomNav />
		</AppLayout>
	);
}
