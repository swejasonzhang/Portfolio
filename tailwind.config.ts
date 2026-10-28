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
        // Reading text: Barlow. The System's voice (display, labels): Barlow Condensed.
        sans: ["var(--font-body)", ...defaultTheme.fontFamily.sans],
        display: ["var(--font-display)", "Arial Narrow", ...defaultTheme.fontFamily.sans],
        mono: ["var(--font-display)", "Arial Narrow", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        gray: colors.slate,
        // Near-black, charcoal, midnight
        void: { DEFAULT: "#05060a", 2: "#0a0d14", 3: "#111522" },
        midnight: "#0b1328",
        panel: "rgba(9,12,20,0.78)",
        // Electric ice blue, the System's light
        sys: { DEFAULT: "#6cbcff", bright: "#c2e4ff", dim: "#2b6cc4" },
        // Shadow violet, used sparingly for depth
        shadow: { DEFAULT: "#8b6cff", bright: "#bba8ff", dim: "#4c3bb3" },
        // Cool silver and text
        silver: { DEFAULT: "#c9d3e6", 2: "#8e9ab3" },
        ice: { DEFAULT: "#eef3ff", 2: "#b7c2da" },
        mute: "#7c869e",
        danger: "#ff3b5c",
        line: {
          hair: "rgba(160,184,224,0.10)",
          DEFAULT: "rgba(160,184,224,0.18)",
          strong: "rgba(160,184,224,0.42)",
        },
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem" }],
        "display-name": ["clamp(4.5rem, min(1rem + 14vw, 25svh), 17rem)", { lineHeight: "0.84", letterSpacing: "-0.01em" }],
        "display-hero": ["clamp(3.6rem, 1rem + 11vw, 13rem)", { lineHeight: "0.84", letterSpacing: "-0.012em" }],
        "display-xl": ["clamp(3rem, 1.4rem + 5.4vw, 8rem)", { lineHeight: "0.88", letterSpacing: "-0.005em" }],
        "display-lg": ["clamp(2.1rem, 1.3rem + 2.6vw, 4.25rem)", { lineHeight: "0.94", letterSpacing: "0" }],
        "display-md": ["clamp(1.55rem, 1.2rem + 1.1vw, 2.4rem)", { lineHeight: "1", letterSpacing: "0.01em" }],
        "display-sm": ["1.375rem", { lineHeight: "1.1", letterSpacing: "0.02em" }],
      },
      letterSpacing: {
        label: "0.2em",
        kicker: "0.32em",
      },
      boxShadow: {
        glow: "0 0 24px rgba(108,188,255,0.16), inset 0 0 0 1px rgba(108,188,255,0.06)",
        "glow-strong": "0 0 44px rgba(108,188,255,0.32), inset 0 0 0 1px rgba(108,188,255,0.18)",
        "glow-violet": "0 0 30px rgba(139,108,255,0.22), inset 0 0 0 1px rgba(139,108,255,0.1)",
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
        "level-flash": {
          "0%": { opacity: "0.2", transform: "scale(1.35)" },
          "60%": { opacity: "1", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "travel-x": {
          "0%": { transform: "translateX(-10%)", opacity: "0" },
          "15%, 85%": { opacity: "1" },
          "100%": { transform: "translateX(1000%)", opacity: "0" },
        },
        "travel-y": {
          "0%": { transform: "translateY(-10%)", opacity: "0" },
          "15%, 85%": { opacity: "1" },
          "100%": { transform: "translateY(1000%)", opacity: "0" },
        },
      },
      animation: {
        flicker: "flicker 7s linear infinite",
        "pulse-soft": "pulse-soft 4.2s ease-in-out infinite",
        drift: "drift 3.8s ease-in-out infinite",
        blink: "blink 1.3s steps(1) infinite",
        "ring-spin": "ring-spin 140s linear infinite",
        "level-flash": "level-flash 1.1s cubic-bezier(0.22, 1, 0.36, 1) both",
        "travel-x": "travel-x 4.8s cubic-bezier(0.45, 0, 0.55, 1) infinite",
        "travel-y": "travel-y 4.8s cubic-bezier(0.45, 0, 0.55, 1) infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
