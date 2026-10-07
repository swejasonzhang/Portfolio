import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "475px",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...defaultTheme.fontFamily.sans],
        mono: ["var(--font-geist-mono)", ...defaultTheme.fontFamily.mono],
        serif: ["var(--font-serif)", "Georgia", "Times New Roman", "serif"],
      },
      colors: {
        // Warm grays only: the site is ink and paper, never screen-blue.
        gray: colors.stone,
        sumi: { DEFAULT: "#0c0b0a", 2: "#141311", 3: "#1d1b18" },
        washi: { DEFAULT: "#efe8da", 2: "#e4dccb", 3: "#d6cdb9" },
        ash: { DEFAULT: "#8d8679", 2: "#605a51", 3: "#3b3833" },
        // Vermilion: tattoo ink, used like a stamp. Rare.
        shu: { DEFAULT: "#a8321f", deep: "#7f2517", soft: "#c4503b" },
        // Hairlines on ink
        line: {
          hair: "rgba(239,232,218,0.08)",
          DEFAULT: "rgba(239,232,218,0.16)",
          rule: "rgba(239,232,218,0.32)",
          strong: "rgba(239,232,218,0.6)",
        },
        // Hairlines on paper
        inkline: {
          hair: "rgba(12,11,10,0.08)",
          DEFAULT: "rgba(12,11,10,0.18)",
          rule: "rgba(12,11,10,0.38)",
          strong: "rgba(12,11,10,0.7)",
        },
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem" }],
        // Editorial serif scale
        "display-name": [
          "clamp(4.5rem, 1rem + 15vw, 18rem)",
          { lineHeight: "0.82", letterSpacing: "-0.035em" },
        ],
        "display-xl": [
          "clamp(3rem, 1.8rem + 4.6vw, 7rem)",
          { lineHeight: "0.9", letterSpacing: "-0.02em" },
        ],
        "display-lg": [
          "clamp(2rem, 1.4rem + 2.2vw, 3.75rem)",
          { lineHeight: "0.95", letterSpacing: "-0.015em" },
        ],
        "display-md": [
          "clamp(1.5rem, 1.25rem + 1vw, 2.25rem)",
          { lineHeight: "1.05", letterSpacing: "-0.01em" },
        ],
        "display-sm": ["1.375rem", { lineHeight: "1.15" }],
      },
      letterSpacing: {
        label: "0.18em",
        kicker: "0.3em",
      },
      keyframes: {
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.35" },
        },
        drift: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(8px)" },
        },
      },
      animation: {
        "pulse-soft": "pulse-soft 2.6s ease-in-out infinite",
        drift: "drift 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
