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
          black: "#030304",
          "black-light": "#0D0D10",
          terracotta: "#C07040",
          "terracotta-light": "#D4885A",
          "terracotta-deep": "#9A5528",
          sand: "#F2E1C9",
          "sand-light": "#FAF0E0",
          charcoal: "#1A1A20",
          gold: "#E8B96A",
          "gold-light": "#F5D08C",
          "gold-deep": "#C4923A",
          cream: "#FDF5EB",
        },
        surface: {
          DEFAULT: "#0D0D10",
          1: "#0D0D10",
          2: "#111115",
          3: "#161619",
        },
        "text-primary": "#F5ECE2",
        "text-secondary": "#A0A0AC",
        "text-muted": "#6A6A78",
        border: {
          DEFAULT: "#1E1E26",
          subtle: "rgba(255,255,255,0.07)",
          medium: "rgba(255,255,255,0.12)",
          strong: "rgba(255,255,255,0.18)",
        },
        ivory: "#F9F2E6",
      },
      fontFamily: {
        display: ["var(--font-inter)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        arabic: ["var(--font-inter)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(145deg, #030304 0%, #0E0E14 40%, #1A1420 80%, #0A0A0C 100%)",
        "terracotta-gradient":
          "linear-gradient(135deg, #C07040 0%, #D4885A 50%, #E89A60 100%)",
        "terracotta-gradient-deep":
          "linear-gradient(135deg, #9A5528 0%, #C07040 100%)",
        "gold-gradient":
          "linear-gradient(135deg, #C4923A 0%, #E8B96A 50%, #F5D08C 100%)",
        "sand-gradient": "linear-gradient(135deg, #F2E1C9 0%, #F8E8D0 100%)",
        "dark-card": "linear-gradient(165deg, #141419 0%, #0A0A0E 100%)",
        "dark-card-hover": "linear-gradient(165deg, #1A1A20 0%, #0E0E12 100%)",
        "mesh-gradient":
          "radial-gradient(ellipse 70% 50% at 0% 0%, rgba(192,112,64,0.18) 0%, transparent 55%), linear-gradient(145deg, #030304 0%, #0D0D10 100%)",
        "card-shine":
          "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%, rgba(255,255,255,0.02) 100%)",
        "section-bg":
          "linear-gradient(180deg, rgba(13,13,16,0) 0%, rgba(10,10,14,0.6) 50%, rgba(13,13,16,0) 100%)",
      },
      boxShadow: {
        terracotta:
          "0 12px 40px rgba(192, 112, 64, 0.3), 0 4px 12px rgba(192, 112, 64, 0.15)",
        "terracotta-lg":
          "0 20px 60px rgba(192, 112, 64, 0.4), 0 8px 20px rgba(192, 112, 64, 0.2)",
        "terracotta-sm": "0 6px 20px rgba(192, 112, 64, 0.22)",
        card: "0 10px 35px rgba(0, 0, 0, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)",
        "card-hover":
          "0 20px 55px rgba(0, 0, 0, 0.35), 0 6px 15px rgba(0, 0, 0, 0.15)",
        premium:
          "0 30px 80px rgba(0, 0, 0, 0.3), 0 10px 30px rgba(0, 0, 0, 0.15)",
        glow: "0 0 25px rgba(192, 112, 64, 0.25), 0 0 50px rgba(192, 112, 64, 0.1)",
        "inner-glow":
          "inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.3)",
        float: "0 25px 60px rgba(0, 0, 0, 0.4), 0 8px 20px rgba(0, 0, 0, 0.2)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.6s ease-out",
        "slide-down": "slideDown 0.4s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        "pulse-terracotta": "pulseTerracotta 2.5s infinite",
        "pulse-glow": "glowPulse 3s ease-in-out infinite",
        "bounce-subtle": "bounceSubtle 2s ease-in-out infinite",
        marquee: "marquee 28s linear infinite",
        float: "float 6s ease-in-out infinite",
        "spin-slow": "spin 8s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.92)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        pulseTerracotta: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(192, 112, 64, 0.45)" },
          "50%": { boxShadow: "0 0 0 14px rgba(192, 112, 64, 0)" },
        },
        glowPulse: {
          "0%, 100%": { opacity: "0.5", transform: "scale(1)" },
          "50%": { opacity: "0.9", transform: "scale(1.08)" },
        },
        bounceSubtle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "33%": { transform: "translateY(-8px) rotate(0.5deg)" },
          "66%": { transform: "translateY(-4px) rotate(-0.5deg)" },
        },
      },
      borderRadius: {
        "2.5xl": "20px",
        "3xl": "24px",
        "4xl": "32px",
        "5xl": "40px",
      },
      transitionTimingFunction: {
        "expo-out": "cubic-bezier(0.16, 1, 0.3, 1)",
        "expo-in-out": "cubic-bezier(0.87, 0, 0.13, 1)",
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
      },
    },
  },
  plugins: [],
};
export default config;
