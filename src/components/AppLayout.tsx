import type { CSSProperties, ReactNode } from "react";
import { spacing } from "@/design/tokens";

const styles = {
	page: {
		minHeight: "100vh",
		backgroundColor: "#FFFFFF",
		color: "#191F28",
		boxSizing: "border-box",
	} as CSSProperties,
	inner: {
		width: "100%",
		maxWidth: 480,
		minHeight: "100vh",
		margin: "0 auto",
		padding: `${spacing.xl}px ${spacing.lg}px ${spacing.xxxl}px`,
		boxSizing: "border-box",
	} as CSSProperties,
};

interface AppLayoutProps {
	children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
	return (
		<main style={styles.page}>
			<div style={styles.inner}>{children}</div>
		</main>
	);
}
