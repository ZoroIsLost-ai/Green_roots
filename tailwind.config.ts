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
          DEFAULT: "#059669", // Premium Emerald Green
          50: "#ECFDF5",
          100: "#D1FAE5",
          200: "#A7F3D0",
          300: "#6EE7B7",
          400: "#34D399",
          500: "#10B981",
          600: "#059669",
          700: "#047857",
          800: "#065F46",
          900: "#064E3B",
        },
        surface: {
          DEFAULT: "#FAFDFB", // Soft environmental green-white background
          soft: "#F2F8F5",    // Light sage background tint
          card: "#FFFFFF",    // Clean white card background
          border: "#E2ECE9",  // Subtle sage-tinted borders
        },
        ink: {
          DEFAULT: "#111C17", // Very dark slate-forest for text
          muted: "#4A5D55",   // Muted forest-grey
          faint: "#8A9E95",   // Faint forest-grey
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
