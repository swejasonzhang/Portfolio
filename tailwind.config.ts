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
        display: ["var(--font-display)", "Times New Roman", "serif"],
      },
      colors: {
        // Strictly achromatic: alias Tailwind's cool-tinted gray to neutral.
        gray: colors.neutral,
        ink: { DEFAULT: "#050505", 2: "#0a0a0a", 3: "#141414" },
        paper: "#f5f5f5",
        line: {
          hair: "rgba(255,255,255,0.08)",
          DEFAULT: "rgba(255,255,255,0.18)",
          rule: "rgba(255,255,255,0.35)",
          strong: "rgba(255,255,255,0.6)",
        },
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem" }],
        // Fluid display scale for the blackletter face.
        "display-hero": [
          "clamp(4.25rem, 2.5rem + 7.5vw, 9rem)",
          { lineHeight: "0.85", letterSpacing: "-0.015em" },
        ],
        "display-xl": [
          "clamp(2.75rem, 1.9rem + 3.4vw, 5rem)",
          { lineHeight: "0.95", letterSpacing: "0" },
        ],
        "display-lg": [
          "clamp(2rem, 1.6rem + 1.6vw, 2.75rem)",
          { lineHeight: "1", letterSpacing: "0.01em" },
        ],
        "display-md": ["1.625rem", { lineHeight: "1.1", letterSpacing: "0.015em" }],
        "display-sm": ["1.375rem", { lineHeight: "1.15", letterSpacing: "0.02em" }],
      },
      letterSpacing: {
        label: "0.18em",
        kicker: "0.28em",
        btn: "0.14em",
      },
      keyframes: {
        marquee: { to: { transform: "translateX(-50%)" } },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.3" },
        },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        "spin-slow": "spin 44s linear infinite",
        "spin-slower": "spin 90s linear infinite",
        "pulse-soft": "pulse-soft 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
