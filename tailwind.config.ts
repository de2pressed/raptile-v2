import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        "bg-soft": "var(--bg-soft)",
        "bg-elevated": "var(--bg-elevated)",
        text: "var(--text)",
        "text-muted": "var(--text-muted)",
        accent: "var(--accent)",
        "accent-strong": "var(--accent-strong)",
        "accent-glow": "var(--accent-glow)",
      },
      fontFamily: {
        display: "var(--font-display)",
        mono: "var(--font-mono)",
      },
      boxShadow: {
        glow: "0 0 24px var(--glass-shadow)",
        amber: "0 0 24px color-mix(in oklch, var(--accent-glow) 45%, transparent)",
      },
      keyframes: {
        blink: {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
        pulseAmber: {
          "0%, 100%": { boxShadow: "0 0 0 0 color-mix(in oklch, var(--accent-glow) 0%, transparent)" },
          "50%": { boxShadow: "0 0 0 1px color-mix(in oklch, var(--accent-glow) 50%, transparent), 0 0 24px color-mix(in oklch, var(--accent-glow) 30%, transparent)" },
        },
        floatDrift: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        blink: "blink 1.15s steps(2, jump-none) infinite",
        "pulse-amber": "pulseAmber 4s ease-in-out infinite",
        drift: "floatDrift 7s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
