import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		react(),
		{
			name: "inject-lcp-preload",
			transformIndexHtml(html, ctx) {
				if (!ctx.bundle) return html;
				const grassFile = Object.keys(ctx.bundle).find(
					(f) => f.includes("grass") && f.endsWith(".jpg"),
				);
				if (!grassFile) return html;
				const preload = `<link rel="preload" as="image" href="/${grassFile}" fetchpriority="high" />`;
				return html.replace("</head>", `  ${preload}\n  </head>`);
			},
		},
	],
});
