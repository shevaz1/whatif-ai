import { Button, Paragraph } from "@toss/tds-mobile";
import type { CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import { spacing } from "@/design/tokens";

const styles = {
	wrap: { marginBottom: spacing.xl } as CSSProperties,
	top: {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		gap: spacing.sm,
		marginBottom: spacing.sm,
	} as CSSProperties,
	subtitle: { color: "#6B7684", marginTop: spacing.xs } as CSSProperties,
};

interface PageHeaderProps {
	title: string;
	subtitle?: string;
	backTo?: string;
}

export default function PageHeader({
	title,
	subtitle,
	backTo,
}: PageHeaderProps) {
	const navigate = useNavigate();

	return (
		<header style={styles.wrap}>
			<div style={styles.top}>
				<Paragraph typography="t4" fontWeight="bold" color="#191F28">
					<Paragraph.Text>{title}</Paragraph.Text>
				</Paragraph>
				{backTo ? (
					<Button
						size="small"
						color="dark"
						variant="weak"
						onClick={() => navigate(backTo)}
					>
						홈
					</Button>
				) : null}
			</div>
			{subtitle ? (
				<Paragraph typography="t7" style={styles.subtitle}>
					<Paragraph.Text>{subtitle}</Paragraph.Text>
				</Paragraph>
			) : null}
		</header>
	);
}
