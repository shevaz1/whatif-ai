import { Button, Paragraph } from "@toss/tds-mobile";
import type { CSSProperties } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import SimulationCard from "@/components/SimulationCard";
import { radius, spacing } from "@/design/tokens";
import { useWhatIf } from "@/hooks/useWhatIf";
import type { Rarity } from "@/types";

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
	talismanCard: {
		borderRadius: radius.xl,
		padding: spacing.lg,
		marginTop: spacing.lg,
		backgroundColor: "#F9FAFB",
		border: "1px solid #E5E8EB",
	} as CSSProperties,
	talismanTop: {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		gap: spacing.sm,
		marginBottom: spacing.xs,
	} as CSSProperties,
	talismanBadge: {
		borderRadius: radius.full,
		padding: `${spacing.xxs}px ${spacing.sm}px`,
		fontSize: 13,
		fontWeight: 900,
		color: "#FFFFFF",
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

const talismanColors: Record<Rarity, string> = {
	N: "#6B7684",
	R: "#3182F6",
	SR: "#F97316",
	SSR: "#E11D48",
};

export default function ResultPage() {
	const navigate = useNavigate();
	const { snapshot, grantTalisman, retryWithTalisman } = useWhatIf();
	const [isRetrying, setIsRetrying] = useState(false);
	const [isGranting, setIsGranting] = useState(false);
	const [retryError, setRetryError] = useState("");
	const result = snapshot.todayResult;
	const talisman = snapshot.talismans[0] ?? null;

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
		if (isRetrying || !talisman) {
			return;
		}

		setIsRetrying(true);
		setRetryError("");
		try {
			await retryWithTalisman(result.question, talisman);
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

	const receiveTalisman = () => {
		if (isGranting) {
			return;
		}

		setIsGranting(true);
		grantTalisman();
		window.setTimeout(() => setIsGranting(false), 280);
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
									: "행운부적을 쓰면 더 좋은 미래에 가까워져요"}
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
									: "광고 보상으로 받은 부적 등급이 높을수록 좋은 카드 확률이 올라가요."}
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
						재도전 {retryCount}회 · 부적을 쓰면 재시도 보정과 등급 보너스가
						붙어요.
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
				{talisman ? (
					<div style={styles.talismanCard}>
						<div style={styles.talismanTop}>
							<Paragraph typography="t6" fontWeight="bold" color="#191F28">
								<Paragraph.Text>{talisman.name}</Paragraph.Text>
							</Paragraph>
							<span
								style={{
									...styles.talismanBadge,
									backgroundColor: talismanColors[talisman.rarity],
								}}
							>
								{talisman.rarity}
							</span>
						</div>
						<Paragraph typography="t7" color="#6B7684">
							<Paragraph.Text>{talisman.description}</Paragraph.Text>
						</Paragraph>
					</div>
				) : null}
				<div style={styles.actions}>
					<Button
						size="large"
						color="dark"
						variant="weak"
						display="block"
						disabled={isGranting}
						onClick={receiveTalisman}
					>
						{isGranting ? "행운부적 받는 중" : "테스트 광고 보고 행운부적 받기"}
					</Button>
					<Button
						size="large"
						color="primary"
						variant="fill"
						display="block"
						disabled={isRetrying || !talisman || result.rarity === "SSR"}
						onClick={submitRetry}
					>
						{result.rarity === "SSR"
							? "최고 부적 달성"
							: isRetrying
								? "부적으로 다시 점치는 중"
								: talisman
									? "부적 사용하고 다시 시뮬레이션"
									: "행운부적을 먼저 받아주세요"}
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
