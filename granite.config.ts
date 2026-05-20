import { defineConfig } from "@apps-in-toss/web-framework/config";

export default defineConfig({
	appName: "whatif-ai",
	brand: {
		displayName: "인생선택",
		primaryColor: "#3182F6",
		icon: "",
	},
	web: {
		host: "localhost",
		port: 5173,
		commands: {
			dev: "vite --port 5173",
			build: "vite build",
		},
	},
	outdir: "dist",
	permissions: [],
	webViewProps: {
		type: "partner",
	},
});
