import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Images LCP critiques à nom stable (sans hash)
const STABLE_ASSETS = new Set([
	"grass.jpg",
	"fond-arbre.jpeg",
	"fond-book.jpeg",
	"fond-books.jpeg",
	"fond-cafe.jpeg",
	"fond-cat.jpg",
	"fond-don.jpeg",
	"fond-profile.jpeg",
]);

export default defineConfig({
	plugins: [react()],
	build: {
		rollupOptions: {
			output: {
				assetFileNames: (assetInfo) => {
					if (STABLE_ASSETS.has(assetInfo.name)) {
						return "assets/[name][extname]";
					}
					return "assets/[name]-[hash][extname]";
				},
			},
		},
	},
});
