import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

/**
 * Colors come from CSS variables (app/globals.css), so light and dark mode
 * follow the visitor's system setting with no extra classes.
 */
const v = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        bg: v("bg"),
        surface: v("surface"),
        fg: v("fg"),
        muted: v("muted"),
        subtle: v("subtle"),
        border: v("border"),
        accent: v("accent"),
        "accent-fg": v("accent-fg"),
      },
      maxWidth: {
        page: "68rem",
      },
    },
  },
  plugins: [],
} satisfies Config;
