import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          black: "#060606",
          "black-light": "#121317",
          terracotta: "#C07040",
          "terracotta-light": "#D4885A",
          sand: "#F2E1C9",
          charcoal: "#24242A",
          gold: "#F2C97D",
        },
        surface: "#111116",
        "text-secondary": "#A8A8B0",
        "text-muted": "#7B7B87",
        border: "#2A2A32",
        ivory: "#F9F2E6",
      },
      fontFamily: {
        display: ["var(--font-inter)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        arabic: ["var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, #060606 0%, #141419 50%, #242126 100%)",
        "terracotta-gradient": "linear-gradient(135deg, #C07040 0%, #D4885A 100%)",
        "sand-gradient": "linear-gradient(135deg, #F2E1C9 0%, #F8E8D0 100%)",
        "dark-card": "linear-gradient(180deg, #141419 0%, #080808 100%)",
        "mesh-gradient": "radial-gradient(circle at top left, rgba(192,112,64,0.2), transparent 28%), linear-gradient(135deg, #0A0A0A 0%, #121317 100%)",
      },
      boxShadow: {
        terracotta: "0 12px 40px rgba(192, 112, 64, 0.28)",
        card: "0 10px 30px rgba(0, 0, 0, 0.16)",
        "card-hover": "0 18px 45px rgba(0, 0, 0, 0.22)",
        premium: "0 24px 70px rgba(0, 0, 0, 0.28)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.6s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        "pulse-terracotta": "pulseTerracotta 2s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        pulseTerracotta: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(192, 112, 64, 0.4)" },
          "50%": { boxShadow: "0 0 0 12px rgba(192, 112, 64, 0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
