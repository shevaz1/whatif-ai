import { Button, Paragraph } from "@toss/tds-mobile";
import type { CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import BottomNav from "@/components/BottomNav";
import PageHeader from "@/components/PageHeader";
import RarityBadge from "@/components/RarityBadge";
import SimulationCard from "@/components/SimulationCard";
import { endings } from "@/data/endings";
import { radius, spacing } from "@/design/tokens";
import { useWhatIf } from "@/hooks/useWhatIf";

const styles = {
	list: { display: "grid", gap: spacing.lg } as CSSProperties,
	endingGrid: {
		display: "grid",
		gridTemplateColumns: "repeat(2, 1fr)",
		gap: spacing.sm,
		marginBottom: spacing.xl,
	} as CSSProperties,
	ending: {
		border: "1px solid #F2F4F6",
		borderRadius: radius.xl,
		padding: spacing.md,
		backgroundColor: "#F9FAFB",
	} as CSSProperties,
	lockedSsr: {
		border: "1px solid #FEECEF",
		borderRadius: radius.xxl,
		padding: spacing.xl,
		backgroundColor: "#FFF7F8",
		marginBottom: spacing.xl,
	} as CSSProperties,
	empty: {
		border: "1px solid #F2F4F6",
		borderRadius: radius.xxl,
		padding: spacing.xl,
		backgroundColor: "#F9FAFB",
	} as CSSProperties,
	action: { marginTop: spacing.lg } as CSSProperties,
};

export default function ArchivePage() {
	const navigate = useNavigate();
	const { snapshot } = useWhatIf();
	const collectedEndingIds = new Set(
		snapshot.results.map((result) => result.endingId),
	);
	const hasSsr = snapshot.results.some((result) => result.rarity === "SSR");

	return (
		<AppLayout>
			<PageHeader
				title="시뮬레이션 보관함"
				subtitle="뽑은 미래 카드와 행운부적을 확인해요."
			/>

			{hasSsr ? null : (
				<section style={styles.lockedSsr}>
					<Paragraph typography="t6" fontWeight="bold" color="#191F28">
						<Paragraph.Text>SSR 미래 카드가 아직 없어요</Paragraph.Text>
					</Paragraph>
					<Paragraph
						typography="t7"
						color="#6B7684"
						style={{ marginTop: spacing.xs }}
					>
						<Paragraph.Text>
							시뮬레이션 재도전 기능이 열리면 광고 시청으로 한 번 더 도전할 수
							있어요.
						</Paragraph.Text>
					</Paragraph>
				</section>
			)}

			<div style={styles.endingGrid}>
				{endings.map((ending) => (
					<div key={ending.id} style={styles.ending}>
						<RarityBadge rarity={ending.rarity} />
						<Paragraph
							typography="t7"
							fontWeight="bold"
							color="#191F28"
							style={{ marginTop: spacing.sm }}
						>
							<Paragraph.Text>
								{collectedEndingIds.has(ending.id) ? ending.title : "???"}
							</Paragraph.Text>
						</Paragraph>
					</div>
				))}
			</div>

			{snapshot.results.length === 0 ? (
				<section style={styles.empty}>
					<Paragraph typography="t6" fontWeight="bold" color="#191F28">
						<Paragraph.Text>아직 저장된 결과가 없어요.</Paragraph.Text>
					</Paragraph>
					<Paragraph
						typography="t7"
						color="#6B7684"
						style={{ marginTop: spacing.xs }}
					>
						<Paragraph.Text>
							오늘의 선택지를 입력하면 첫 미래 시뮬레이션이 열립니다.
						</Paragraph.Text>
					</Paragraph>
					<div style={styles.action}>
						<Button
							size="large"
							color="primary"
							variant="fill"
							display="block"
							onClick={() => navigate("/simulate")}
						>
							첫 시뮬레이션 만들기
						</Button>
					</div>
				</section>
			) : (
				<div style={styles.list}>
					{snapshot.results.map((result) => (
						<SimulationCard key={result.id} result={result} />
					))}
				</div>
			)}

			<BottomNav />
		</AppLayout>
	);
}
