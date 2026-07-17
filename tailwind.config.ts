import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563EB",
          50: "#EFF4FF",
          100: "#DBE6FE",
          200: "#BFD3FE",
          300: "#93B4FD",
          400: "#608BFA",
          500: "#3B6BF5",
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#1E3A8A",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          soft: "#F7F8FA",
          card: "#F4F5F7",
          border: "#E7E9EE",
        },
        ink: {
          DEFAULT: "#111827",
          muted: "#6B7280",
          faint: "#9CA3AF",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.35s ease-out",
        "spin-slow": "spin-slow 0.8s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
