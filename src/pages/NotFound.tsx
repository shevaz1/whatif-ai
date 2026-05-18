import { Button, Paragraph } from "@toss/tds-mobile";
import type { CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { radius, spacing } from "@/design/tokens";

const styles = {
	panel: {
		border: "1px solid #F2F4F6",
		borderRadius: radius.xxl,
		padding: spacing.xl,
		backgroundColor: "#F9FAFB",
	} as CSSProperties,
	action: { marginTop: spacing.lg } as CSSProperties,
};

export default function NotFoundPage() {
	const navigate = useNavigate();

	return (
		<AppLayout>
			<section style={styles.panel}>
				<Paragraph typography="t4" fontWeight="bold" color="#191F28">
					<Paragraph.Text>없는 타임라인이에요</Paragraph.Text>
				</Paragraph>
				<Paragraph
					typography="t7"
					color="#6B7684"
					style={{ marginTop: spacing.xs }}
				>
					<Paragraph.Text>
						홈으로 돌아가 오늘의 선택지를 다시 확인해 주세요.
					</Paragraph.Text>
				</Paragraph>
				<div style={styles.action}>
					<Button
						size="large"
						color="primary"
						variant="fill"
						display="block"
						onClick={() => navigate("/")}
					>
						홈으로
					</Button>
				</div>
			</section>
		</AppLayout>
	);
}
