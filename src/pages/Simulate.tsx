import { generateHapticFeedback } from "@apps-in-toss/web-framework";
import { Button, Paragraph } from "@toss/tds-mobile";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import SimulationProgress from "@/components/SimulationProgress";
import { examplePrompts } from "@/data/templates";
import { radius, spacing } from "@/design/tokens";
import { useWhatIf } from "@/hooks/useWhatIf";

const styles = {
	panel: {
		border: "1px solid #F2F4F6",
		borderRadius: radius.xxl,
		padding: spacing.xl,
		backgroundColor: "#F9FAFB",
	} as CSSProperties,
	input: {
		width: "100%",
		minHeight: 132,
		border: "1px solid #E5E8EB",
		borderRadius: radius.xl,
		padding: spacing.md,
		boxSizing: "border-box",
		backgroundColor: "#FFFFFF",
		color: "#191F28",
		fontSize: 18,
		lineHeight: "26px",
		resize: "none",
		outline: "none",
		marginTop: spacing.lg,
	} as CSSProperties,
	examples: {
		display: "grid",
		gridTemplateColumns: "repeat(2, 1fr)",
		gap: spacing.xs,
		marginTop: spacing.lg,
	} as CSSProperties,
	action: { marginTop: spacing.xl } as CSSProperties,
	helper: { color: "#6B7684", marginTop: spacing.sm } as CSSProperties,
};

export default function SimulatePage() {
	const navigate = useNavigate();
	const { snapshot, simulate } = useWhatIf();
	const [question, setQuestion] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const normalized = question.trim();

	useEffect(() => {
		if (!snapshot.canSimulateToday) {
			navigate("/result", { replace: true });
		}
	}, [navigate, snapshot.canSimulateToday]);

	const submit = async () => {
		if (normalized.length < 2 || isSubmitting) {
			return;
		}

		setIsSubmitting(true);
		setErrorMessage("");

		try {
			await simulate(normalized.endsWith("?") ? normalized : `${normalized}?`);
			await generateHapticFeedback({ type: "success" }).catch(() => undefined);
			navigate("/result", { replace: true });
		} catch (error) {
			setErrorMessage(
				error instanceof Error
					? error.message
					: "AI 시뮬레이션 생성에 실패했어요.",
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<AppLayout>
			<PageHeader
				title="질문 입력"
				subtitle="오늘 딱 한 번, 미래 시뮬레이션을 돌립니다."
				backTo="/"
			/>

			<section style={styles.panel}>
				<Paragraph typography="t6" fontWeight="bold" color="#191F28">
					<Paragraph.Text>무엇을 하면 어떻게 될까요?</Paragraph.Text>
				</Paragraph>
				<textarea
					value={question}
					placeholder="예: 퇴사하면?"
					onChange={(event) => setQuestion(event.target.value)}
					style={styles.input}
					maxLength={40}
					disabled={isSubmitting}
				/>
				<Paragraph typography="t7" style={styles.helper}>
					<Paragraph.Text>
						{normalized.length}/40 · 결과는 이 기기에 저장됩니다.
					</Paragraph.Text>
				</Paragraph>
				{errorMessage ? (
					<Paragraph
						typography="t7"
						color="#E11D48"
						style={{ marginTop: spacing.sm }}
					>
						<Paragraph.Text>{errorMessage}</Paragraph.Text>
					</Paragraph>
				) : null}
				<div style={styles.examples}>
					{examplePrompts.slice(0, 4).map((prompt) => (
						<Button
							key={prompt}
							size="medium"
							color="dark"
							variant="weak"
							disabled={isSubmitting}
							onClick={() => setQuestion(prompt)}
						>
							{prompt}
						</Button>
					))}
				</div>
				<div style={styles.action}>
					<Button
						size="large"
						color="primary"
						variant="fill"
						display="block"
						disabled={normalized.length < 2 || isSubmitting}
						onClick={submit}
					>
						{isSubmitting ? "AI가 미래 보는 중" : "미래 뽑기"}
					</Button>
				</div>
				{isSubmitting ? <SimulationProgress /> : null}
			</section>
		</AppLayout>
	);
}
