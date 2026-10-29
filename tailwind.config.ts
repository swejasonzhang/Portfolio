import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const v = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...defaultTheme.fontFamily.sans],
        serif: ["var(--font-serif)", "Georgia", ...defaultTheme.fontFamily.serif],
      },
      colors: {
        bg: v("bg"),
        surface: v("surface"),
        fg: v("fg"),
        bright: v("bright"),
        muted: v("muted"),
        subtle: v("subtle"),
        border: v("border"),
        accent: v("accent"),
      },
    },
  },
  plugins: [],
} satisfies Config;
