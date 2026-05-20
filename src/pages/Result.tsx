import { Button, Paragraph } from "@toss/tds-mobile";
import type { CSSProperties } from "react";
import { useState } from "react";
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
	nextGoal: {
		border: "1px solid #E5E8EB",
		borderRadius: radius.xxl,
		padding: spacing.xl,
		backgroundColor: "#FFFFFF",
		marginTop: spacing.lg,
		boxShadow: "0 10px 28px rgba(15, 23, 42, 0.06)",
	} as CSSProperties,
	goalTop: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "flex-start",
		gap: spacing.md,
	} as CSSProperties,
	rankStack: {
		display: "grid",
		gridTemplateColumns: "repeat(4, 1fr)",
		gap: spacing.xs,
		marginTop: spacing.lg,
	} as CSSProperties,
	rankCell: {
		borderRadius: radius.lg,
		padding: `${spacing.sm}px ${spacing.xs}px`,
		textAlign: "center",
		fontSize: 13,
		fontWeight: 900,
		border: "1px solid #E5E8EB",
	} as CSSProperties,
	softBadge: {
		borderRadius: radius.full,
		backgroundColor: "#F2F4F6",
		color: "#4E5968",
		padding: `${spacing.xxs}px ${spacing.sm}px`,
		fontSize: 13,
		fontWeight: 800,
		whiteSpace: "nowrap",
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
};

const rankColors = {
	N: { color: "#6B7684", bg: "#F2F4F6" },
	R: { color: "#3182F6", bg: "#EAF3FF" },
	SR: { color: "#F97316", bg: "#FFF3E0" },
	SSR: { color: "#E11D48", bg: "#FEECEF" },
} as const;

export default function ResultPage() {
	const navigate = useNavigate();
	const { snapshot, retry } = useWhatIf();
	const [isRetrying, setIsRetrying] = useState(false);
	const [retryError, setRetryError] = useState("");
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

	const retryCount = Math.max((result.attempt ?? 1) - 1, 0);
	const submitRetry = async () => {
		if (isRetrying) {
			return;
		}

		setIsRetrying(true);
		setRetryError("");
		try {
			await retry(result.question);
		} catch (error) {
			setRetryError(
				error instanceof Error
					? error.message
					: "재도전 카드 생성에 실패했어요.",
			);
		} finally {
			setIsRetrying(false);
		}
	};

	return (
		<AppLayout>
			<PageHeader
				title="인생 시뮬레이션"
				subtitle="미래 결과와 행운 부적이 저장됐어요."
				backTo="/"
			/>
			<SimulationCard result={result} />

			<section style={styles.nextGoal}>
				<div style={styles.goalTop}>
					<div>
						<Paragraph typography="t6" fontWeight="bold" color="#191F28">
							<Paragraph.Text>
								{result.rarity === "SSR"
									? "오늘의 가장 강한 부적을 뽑았어요"
									: "더 강한 행운 부적이 아직 남아 있어요"}
							</Paragraph.Text>
						</Paragraph>
						<Paragraph
							typography="t7"
							color="#6B7684"
							style={{ marginTop: spacing.xs }}
						>
							<Paragraph.Text>
								{result.rarity === "SSR"
									? "이 카드는 오늘의 선택을 밀어주는 가장 강한 부적이에요."
									: "높은 등급일수록 더 좋은 미래 결과와 더 강한 부적이 열려요."}
							</Paragraph.Text>
						</Paragraph>
					</div>
					<span style={styles.softBadge}>오늘 1회 완료</span>
				</div>
				<Paragraph
					typography="t7"
					fontWeight="bold"
					color="#4E5968"
					style={{ marginTop: spacing.lg }}
				>
					<Paragraph.Text>
						재도전 {retryCount}회 · 테스트에서는 뽑을수록 더 강한 부적에
						가까워져요.
					</Paragraph.Text>
				</Paragraph>
				<div style={styles.rankStack}>
					{(["N", "R", "SR", "SSR"] as const).map((rarity) => {
						const active = result.rarity === rarity;
						const color = rankColors[rarity];
						return (
							<div
								key={rarity}
								style={{
									...styles.rankCell,
									color: active ? "#FFFFFF" : color.color,
									backgroundColor: active ? color.color : color.bg,
									borderColor: active ? color.color : "transparent",
								}}
							>
								{rarity}
							</div>
						);
					})}
				</div>
				<div style={styles.actions}>
					<Button
						size="large"
						color="primary"
						variant="fill"
						display="block"
						disabled={isRetrying || result.rarity === "SSR"}
						onClick={submitRetry}
					>
						{result.rarity === "SSR"
							? "최고 부적 달성"
							: isRetrying
								? "부적 다시 뽑는 중"
								: "테스트로 더 강한 부적 뽑기"}
					</Button>
					{retryError ? (
						<Paragraph typography="t7" color="#E11D48">
							<Paragraph.Text>{retryError}</Paragraph.Text>
						</Paragraph>
					) : null}
				</div>
			</section>

			<section style={styles.locked}>
				<div style={styles.lockedHeader}>
					<Paragraph typography="t6" fontWeight="bold" color="#191F28">
						<Paragraph.Text>광고 보고 다른 미래 시뮬레이션</Paragraph.Text>
					</Paragraph>
					<span style={styles.paidBadge}>AD</span>
				</div>
				<Paragraph typography="t7" color="#6B7684">
					<Paragraph.Text>
						같은 질문으로 더 강한 부적과 다른 미래 징조를 한 번 더 열 수 있어요.
					</Paragraph.Text>
				</Paragraph>
				<div style={styles.lockedGrid}>
					<div style={styles.lockedItem}>잠김 · 반전 미래 시뮬레이션</div>
					<div style={styles.lockedItem}>잠김 · 나쁜 흐름 피하기</div>
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

			<div style={styles.actions}>
				<Button
					size="large"
					color="primary"
					variant="fill"
					display="block"
					onClick={() => navigate("/archive")}
				>
					시뮬레이션 보관함 보기
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
