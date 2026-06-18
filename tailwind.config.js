/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1A1A2E",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#E94560",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#16213E",
          foreground: "#FFFFFF",
        },
        surface: "#0F3460",
        background: "#F8F9FA",
        muted: {
          DEFAULT: "#6B7280",
          foreground: "#F8F9FA",
        },
        border: "#E5E7EB",
        input: "#E5E7EB",
        ring: "#E94560",
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#FFFFFF",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#1A1A2E",
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#1A1A2E",
        },
      },
      fontFamily: {
        heading: ["'Bebas Neue'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
      },
      borderRadius: {
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%)",
        "accent-gradient": "linear-gradient(135deg, #E94560 0%, #c62a47 100%)",
        "card-gradient": "linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
      },
      animation: {
        "float": "float 3s ease-in-out infinite",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "spin-slow": "spin 8s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      boxShadow: {
        "glow": "0 0 30px rgba(233, 69, 96, 0.3)",
        "glow-sm": "0 0 15px rgba(233, 69, 96, 0.2)",
        "card": "0 4px 24px rgba(26, 26, 46, 0.08)",
        "card-hover": "0 8px 40px rgba(26, 26, 46, 0.16)",
      },
    },
  },
  plugins: [],
}
