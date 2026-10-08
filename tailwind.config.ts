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
        // One face for the whole System.
        sans: ["var(--font-display)", "Arial Narrow", ...defaultTheme.fontFamily.sans],
        mono: ["var(--font-display)", "Arial Narrow", ...defaultTheme.fontFamily.sans],
        display: ["var(--font-display)", "Impact", "Arial Narrow", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        gray: colors.slate,
        // The void the System renders onto
        void: { DEFAULT: "#06070b", 2: "#0b0e16", 3: "#111626" },
        panel: "rgba(14,18,30,0.72)",
        // System blue
        sys: { DEFAULT: "#58a6ff", bright: "#9cd0ff", dim: "#2f6fcf" },
        // Shadow violet
        shadow: { DEFAULT: "#7c5cff", bright: "#b39dff", dim: "#4c3bb3" },
        // Text
        ice: { DEFAULT: "#e6ecff", 2: "#b9c3e0" },
        mute: "#7d86a3",
        danger: "#ff3b5c",
        // Luminous hairlines
        line: {
          hair: "rgba(88,166,255,0.12)",
          DEFAULT: "rgba(88,166,255,0.28)",
          strong: "rgba(88,166,255,0.6)",
        },
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem" }],
        // Width-driven, but capped by viewport height so the hero fits a laptop screen.
        "display-name": [
          "clamp(5rem, min(1rem + 16vw, 24svh), 19rem)",
          { lineHeight: "0.85", letterSpacing: "-0.01em" },
        ],
        "display-xl": [
          "clamp(3rem, 1.5rem + 5vw, 7.5rem)",
          { lineHeight: "0.9", letterSpacing: "-0.005em" },
        ],
        "display-lg": [
          "clamp(2rem, 1.4rem + 2.4vw, 4rem)",
          { lineHeight: "0.95", letterSpacing: "0" },
        ],
        "display-md": [
          "clamp(1.5rem, 1.2rem + 1vw, 2.25rem)",
          { lineHeight: "1", letterSpacing: "0.01em" },
        ],
        "display-sm": ["1.375rem", { lineHeight: "1.1", letterSpacing: "0.02em" }],
      },
      letterSpacing: {
        label: "0.18em",
        kicker: "0.3em",
      },
      boxShadow: {
        glow: "0 0 24px rgba(88,166,255,0.18), inset 0 0 0 1px rgba(88,166,255,0.08)",
        "glow-strong": "0 0 40px rgba(88,166,255,0.35), inset 0 0 0 1px rgba(88,166,255,0.2)",
        "glow-violet": "0 0 28px rgba(124,92,255,0.24), inset 0 0 0 1px rgba(124,92,255,0.12)",
      },
      keyframes: {
        flicker: {
          "0%, 96%, 100%": { opacity: "1" },
          "97%": { opacity: "0.55" },
          "98%": { opacity: "1" },
          "99%": { opacity: "0.7" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.35" },
        },
        drift: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(8px)" },
        },
        blink: {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
        "ring-spin": {
          to: { transform: "rotate(360deg)" },
        },
        breathe: {
          "0%, 100%": { opacity: "0.55", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.08)" },
        },
        "level-flash": {
          "0%": { opacity: "0.2", transform: "scale(1.35)" },
          "60%": { opacity: "1", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        flicker: "flicker 7s linear infinite",
        "pulse-soft": "pulse-soft 4.2s ease-in-out infinite",
        drift: "drift 3.8s ease-in-out infinite",
        blink: "blink 1.3s steps(1) infinite",
        "ring-spin": "ring-spin 140s linear infinite",
        breathe: "breathe 14s ease-in-out infinite",
        "level-flash": "level-flash 1.1s cubic-bezier(0.22, 1, 0.36, 1) both",
      },
    },
  },
  plugins: [],
} satisfies Config;
