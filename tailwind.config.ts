import type { Config } from "tailwindcss";

export default {
	content: [
		"./app/**/*.{js,jsx,ts,tsx}",
		"./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
	],
	theme: {
		extend: {
			fontFamily: {
				Comfortaa: ["Comfortaa", "sans-serif"],
			},
		},
	},
	plugins: [require("tailwindcss-animation-delay")],
} satisfies Config;
