import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
        mono: ["var(--font-geist-mono)", ...fontFamily.mono],
        headline: ["var(--font-vt323)", "monospace"],
        pixel: ["var(--font-vt323)", "monospace"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        white: "hsl(var(--white))",
        bond: "hsl(var(--bond))",
        fund: "hsl(var(--fund))",
        alpha: "hsl(var(--alpha))",
        beta: "hsl(var(--beta))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        lp: {
          DEFAULT: "hsl(var(--lp))",
          foreground: "hsl(var(--lp-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        highlight: "hsl(var(--highlight))",
        positive: "hsl(var(--positive))",
        negative: "hsl(var(--negative))",
        rare: "hsl(var(--rare))",
        bondPositive: "hsl(var(--bondPositive))",
        bondNegative: "hsl(var(--bondNegative))",
        bigchBlue: "hsl(var(--bigch-blue))",
        bigchBackground: "hsl(var(--bigch-background))",
        bigchText: "hsl(var(--bigch-text))",
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        spotlight: {
          "0%": {
            opacity: "0",
            transform: "translate(-72%, -62%) scale(0.5)",
          },
          "100%": {
            opacity: "1",
            transform: "translate(-50%,-40%) scale(1)",
          },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-5px)" },
          "50%": { transform: "translateX(5px)" },
          "75%": { transform: "translateX(-5px)" },
        },
        flash: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.2" },
        },
        "shimmer-grow": {
          "0%": {
            transform: "scaleX(0)",
            transformOrigin: "left",
            opacity: "1",
          },
          "25%": {
            transform: "scaleX(0.5)",
            transformOrigin: "left",
            opacity: "1",
          },
          "50%": {
            transform: "scaleX(1)",
            transformOrigin: "left",
            opacity: "0.7",
          },
          "75%": {
            transform: "scaleX(1)",
            transformOrigin: "left",
            opacity: "0.3",
          },
          "100%": {
            transform: "scaleX(1)",
            transformOrigin: "left",
            opacity: "0.1",
          },
        },
        "border-animation": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "bounce-slow-animation": {
          "0%, 100%": {
            transform: "translateY(0)",
            animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)",
          },
          "50%": {
            transform: "translateY(-10%)",
            animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)",
          },
        },
        statsSlideUp: {
          from: {
            transform: "translateY(0)",
            opacity: "1",
            visibility: "visible",
            marginTop: "1rem",
          },
          to: {
            transform: "translateY(-20px)",
            opacity: "0",
            visibility: "hidden",
            marginTop: "0",
          },
        },
        statsSlideDown: {
          from: {
            transform: "translateY(-20px)",
            opacity: "0",
            visibility: "hidden",
            marginTop: "0",
          },
          to: {
            transform: "translateY(0)",
            opacity: "1",
            visibility: "visible",
            marginTop: "1rem",
          },
        },
        moveHorizontal: {
          "0%": { transform: "translateX(-50%) translateY(-10%)" },
          "50%": { transform: "translateX(50%) translateY(10%)" },
          "100%": { transform: "translateX(-50%) translateY(-10%)" },
        },
        moveInCircle: {
          "0%": { transform: "rotate(0deg)" },
          "50%": { transform: "rotate(180deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        moveVertical: {
          "0%": { transform: "translateY(-50%)" },
          "50%": { transform: "translateY(50%)" },
          "100%": { transform: "translateY(-50%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shimmer: "shimmer-grow 3s infinite linear",
        spotlight: "spotlight 2s ease .75s 1 forwards",
        shake: "shake 0.82s cubic-bezier(.36,.07,.19,.97) both",
        flash: "flash 1s ease-in-out",
        "spin-slow": "spin 16s linear infinite",
        "animate-border": "border-animation 4s ease infinite",
        "bounce-slow": "bounce-slow-animation 2s ease infinite",
        first: "moveVertical 30s ease infinite",
        second: "moveInCircle 20s reverse infinite",
        third: "moveInCircle 40s linear infinite",
        fourth: "moveHorizontal 40s ease infinite",
        fifth: "moveInCircle 20s ease infinite",
      },
      backgroundImage: {
        "shimmer-gradient":
          "linear-gradient(120deg, rgba(255, 255, 255, 0.2) 25%, transparent 50%, rgba(255, 255, 255, 0.2) 75%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
