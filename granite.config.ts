import { defineConfig } from "@apps-in-toss/web-framework/config";

export default defineConfig({
	appName: "today-life-choice",
	brand: {
		displayName: "오늘의 인생 선택지",
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
