import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#05070d", surface: "#0b1222", well: "#0c1d3e" },
        cy: { DEFAULT: "#38bdf8", 2: "#22d3ee", 3: "#60a5fa" },
        vi: { DEFAULT: "#a78bfa", 2: "#c084fc" },
        caramel: { DEFAULT: "#bc7b3a", deep: "#9a5c2a" },
        text: { DEFAULT: "#eaf2ff", dim: "#8da2c0" },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      maxWidth: { page: "1200px" },
    },
  },
  plugins: [],
};
export default config;
