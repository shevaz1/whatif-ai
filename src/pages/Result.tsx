import { Button, Paragraph } from "@toss/tds-mobile";
import type { CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import SimulationCard from "@/components/SimulationCard";
import { radius, spacing } from "@/design/tokens";
import { useWhatIf } from "@/hooks/useWhatIf";

const styles = {
	panel: {
		border: "1px solid #F2F4F6",
		borderRadius: radius.xxl,
		padding: spacing.xl,
		backgroundColor: "#F9FAFB",
	} as CSSProperties,
	section: {
		borderRadius: radius.xl,
		padding: spacing.lg,
		backgroundColor: "#F9FAFB",
		marginTop: spacing.lg,
	} as CSSProperties,
	locked: {
		border: "1px solid #E5E8EB",
		borderRadius: radius.xxl,
		padding: spacing.xl,
		backgroundColor: "#FFFFFF",
		marginTop: spacing.lg,
		boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
	} as CSSProperties,
	lockedHeader: {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		gap: spacing.sm,
		marginBottom: spacing.sm,
	} as CSSProperties,
	paidBadge: {
		borderRadius: radius.full,
		backgroundColor: "#FEECEF",
		color: "#E11D48",
		padding: `${spacing.xxs}px ${spacing.sm}px`,
		fontSize: 13,
		fontWeight: 800,
		whiteSpace: "nowrap",
	} as CSSProperties,
	lockedGrid: {
		display: "grid",
		gap: spacing.sm,
		marginTop: spacing.lg,
	} as CSSProperties,
	lockedItem: {
		borderRadius: radius.lg,
		backgroundColor: "#F9FAFB",
		padding: spacing.md,
		color: "#4E5968",
		fontSize: 14,
		fontWeight: 700,
	} as CSSProperties,
	actions: {
		display: "grid",
		gap: spacing.sm,
		marginTop: spacing.xl,
	} as CSSProperties,
	sharePreview: {
		border: "1px dashed #D1D6DB",
		borderRadius: radius.xxl,
		padding: spacing.sm,
		marginTop: spacing.xl,
		backgroundColor: "#FFFFFF",
	} as CSSProperties,
	shareLabel: { color: "#6B7684", marginBottom: spacing.sm } as CSSProperties,
};

export default function ResultPage() {
	const navigate = useNavigate();
	const { snapshot } = useWhatIf();
	const result = snapshot.todayResult;

	if (!result) {
		return (
			<AppLayout>
				<PageHeader
					title="오늘 결과"
					subtitle="아직 생성된 시뮬레이션이 없어요."
					backTo="/"
				/>
				<section style={styles.panel}>
					<Paragraph typography="t6" fontWeight="bold" color="#191F28">
						<Paragraph.Text>먼저 오늘의 선택지를 입력해 주세요.</Paragraph.Text>
					</Paragraph>
					<div style={styles.actions}>
						<Button
							size="large"
							color="primary"
							variant="fill"
							display="block"
							onClick={() => navigate("/simulate")}
						>
							미래 뽑기
						</Button>
					</div>
				</section>
			</AppLayout>
		);
	}

	return (
		<AppLayout>
			<PageHeader
				title="미래 시뮬레이션"
				subtitle="오늘의 결과가 저장됐어요."
				backTo="/"
			/>
			<SimulationCard result={result} />

			<section style={styles.section}>
				<Paragraph typography="t6" fontWeight="bold" color="#191F28">
					<Paragraph.Text>미래 시뮬레이션</Paragraph.Text>
				</Paragraph>
				<Paragraph
					typography="t7"
					color="#4E5968"
					style={{ marginTop: spacing.xs }}
				>
					<Paragraph.Text>{result.futureSimulation}</Paragraph.Text>
				</Paragraph>
			</section>

			<section style={styles.section}>
				<Paragraph typography="t6" fontWeight="bold" color="#191F28">
					<Paragraph.Text>희귀 엔딩</Paragraph.Text>
				</Paragraph>
				<Paragraph
					typography="t7"
					color="#4E5968"
					style={{ marginTop: spacing.xs }}
				>
					<Paragraph.Text>{result.rareEnding}</Paragraph.Text>
				</Paragraph>
			</section>

			<section style={styles.locked}>
				<div style={styles.lockedHeader}>
					<Paragraph typography="t6" fontWeight="bold" color="#191F28">
						<Paragraph.Text>광고 보고 다른 타임라인</Paragraph.Text>
					</Paragraph>
					<span style={styles.paidBadge}>AD</span>
				</div>
				<Paragraph typography="t7" color="#6B7684">
					<Paragraph.Text>
						같은 질문으로 반전 루트와 최악의 루트를 한 번 더 열 수 있어요.
					</Paragraph.Text>
				</Paragraph>
				<div style={styles.lockedGrid}>
					<div style={styles.lockedItem}>잠김 · 반전 루트 시뮬레이션</div>
					<div style={styles.lockedItem}>잠김 · 최악의 루트 회피 팁</div>
				</div>
				<div style={styles.actions}>
					<Button
						size="large"
						color="dark"
						variant="weak"
						display="block"
						disabled
					>
						광고 SDK 연결 후 활성화
					</Button>
				</div>
			</section>

			<section style={styles.locked}>
				<div style={styles.lockedHeader}>
					<Paragraph typography="t6" fontWeight="bold" color="#191F28">
						<Paragraph.Text>프리미엄 해석</Paragraph.Text>
					</Paragraph>
					<span style={styles.paidBadge}>PLUS</span>
				</div>
				<Paragraph typography="t7" color="#6B7684">
					<Paragraph.Text>
						3개월 후, 인간관계 변수, 돈/멘탈 리스크를 더 길게 풀어주는
						자리입니다.
					</Paragraph.Text>
				</Paragraph>
			</section>

			<section style={styles.sharePreview}>
				<Paragraph typography="t7" fontWeight="bold" style={styles.shareLabel}>
					<Paragraph.Text>공유용 카드</Paragraph.Text>
				</Paragraph>
				<SimulationCard result={result} shareMode />
			</section>

			<div style={styles.actions}>
				<Button
					size="large"
					color="primary"
					variant="fill"
					display="block"
					onClick={() => navigate("/archive")}
				>
					엔딩 도감 보기
				</Button>
				<Button
					size="large"
					color="dark"
					variant="weak"
					display="block"
					onClick={() => navigate("/")}
				>
					홈으로
				</Button>
			</div>
		</AppLayout>
	);
}
