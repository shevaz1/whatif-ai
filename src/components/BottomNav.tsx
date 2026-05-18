import { Button } from "@toss/tds-mobile";
import type { CSSProperties } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { radius, spacing } from "@/design/tokens";
import type { RoutePath } from "@/types";

const items: Array<{ path: RoutePath; label: string }> = [
	{ path: "/", label: "홈" },
	{ path: "/archive", label: "도감" },
	{ path: "/my", label: "마이" },
];

const styles = {
	nav: {
		position: "sticky",
		bottom: spacing.md,
		display: "grid",
		gridTemplateColumns: "repeat(3, 1fr)",
		gap: spacing.xs,
		backgroundColor: "#F9FAFB",
		border: "1px solid #E5E8EB",
		borderRadius: radius.xl,
		padding: spacing.xs,
		marginTop: spacing.xxl,
	} as CSSProperties,
};

export default function BottomNav() {
	const navigate = useNavigate();
	const location = useLocation();

	return (
		<nav style={styles.nav}>
			{items.map((item) => (
				<Button
					key={item.path}
					size="medium"
					color={location.pathname === item.path ? "primary" : "dark"}
					variant={location.pathname === item.path ? "fill" : "weak"}
					onClick={() => navigate(item.path)}
				>
					{item.label}
				</Button>
			))}
		</nav>
	);
}
