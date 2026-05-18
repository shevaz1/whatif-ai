import { Paragraph } from "@toss/tds-mobile";
import type { CSSProperties } from "react";
import { radius, spacing } from "@/design/tokens";

const styles = {
	card: {
		border: "1px solid #F2F4F6",
		borderRadius: radius.xl,
		padding: spacing.lg,
		backgroundColor: "#F9FAFB",
	} as CSSProperties,
	label: { color: "#6B7684", marginBottom: spacing.xs } as CSSProperties,
};

interface MetricCardProps {
	label: string;
	value: string;
}

export default function MetricCard({ label, value }: MetricCardProps) {
	return (
		<div style={styles.card}>
			<Paragraph typography="t7" style={styles.label}>
				<Paragraph.Text>{label}</Paragraph.Text>
			</Paragraph>
			<Paragraph typography="t4" fontWeight="bold" color="#191F28">
				<Paragraph.Text>{value}</Paragraph.Text>
			</Paragraph>
		</div>
	);
}
