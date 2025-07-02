import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Strict 5-Color Brutalist Design System
        "off-black": "#1a1a1a",
        "off-white": "#fafafa", 
        "warm-gray": "#6b7280",
        "light-gray": "#f3f4f6",
        primary: {
          DEFAULT: "#64748b",
          light: "#94a3b8",   // Only allowed primary variation
          dark: "#475569",    // Only allowed primary variation
          foreground: "#fafafa",
        },
        // Legacy shadcn compatibility (maps to 5-color system)
        background: "#fafafa",           // Maps to off-white
        foreground: "#1a1a1a",           // Maps to off-black
        muted: "#f3f4f6",                // Maps to light-gray
        "muted-foreground": "#6b7280",   // Maps to warm-gray
        border: "#f3f4f6",               // Maps to light-gray
        input: "#fafafa",                // Maps to off-white
        ring: "#64748b",                 // Maps to primary
      },
      fontFamily: {
        sans: ["Inter var", "Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
        display: ["Lexend", "sans-serif"],
        figtree: ["Figtree", "sans-serif"],
        crimson: ['"Crimson Text"', "serif"],
      },
      fontSize: {
        // Brutalist Typography Scale - Dramatic Ratios
        "mega": ["clamp(4rem, 8vw, 7.5rem)", { lineHeight: "0.9", fontWeight: "800", letterSpacing: "-0.02em" }],
        "hero": ["clamp(3rem, 6vw, 5rem)", { lineHeight: "1.1", fontWeight: "700", letterSpacing: "-0.01em" }],
        "display": ["clamp(1.5rem, 3vw, 2.5rem)", { lineHeight: "1.2", fontWeight: "600" }],
        "lg": ["1.25rem", { lineHeight: "1.4", fontWeight: "500" }],
        "base": ["1rem", { lineHeight: "1.6", fontWeight: "400" }],
        "sm": ["0.875rem", { lineHeight: "1.5", fontWeight: "400" }],
        "xs": ["0.75rem", { lineHeight: "1.4", fontWeight: "400" }],
        // Legacy design system compatibility
        h1: ["2.25rem", { lineHeight: "1.2", fontWeight: "700" }],
        h2: ["1.875rem", { lineHeight: "1.3", fontWeight: "600" }],
        h3: ["1.5rem", { lineHeight: "1.4", fontWeight: "600" }],
        h4: ["1.25rem", { lineHeight: "1.4", fontWeight: "500" }],
        body: ["1rem", { lineHeight: "1.6", fontWeight: "400" }],
        small: ["0.875rem", { lineHeight: "1.5", fontWeight: "400" }],
        code: ["0.875rem", { lineHeight: "1.4", fontWeight: "400" }],
      },
      spacing: {
        // Brutalist Spacing Scale from Design System
        xs: "0.5rem",    // 8px - Inner component spacing
        sm: "1rem",      // 16px - Related element spacing  
        md: "2rem",      // 32px - Component separation
        lg: "3rem",      // 48px - Section boundaries
        xl: "4rem",      // 64px - Major section spacing
        "2xl": "6rem",   // 96px - Page section divisions
        // Legacy spacing
        section: "3rem",
        component: "2rem", 
        paragraph: "1rem",
        list: "0.5rem",
      },
      screens: {
        // Responsive breakpoints from design system
        mobile: "320px",
        tablet: "768px",
        desktop: "1024px",
        wide: "1440px",
      },
      maxWidth: {
        // Reading width constraint
        reading: "65ch",
      },
      animation: {
        "bounce-fast": "bounce 0.5s infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        meteor: "meteor 5s linear infinite",
        "border-beam": "border-beam calc(var(--duration)*1s) infinite linear",
        shimmer: "shimmer 4s infinite",
        backgroundPositionSpin:
          "background-position-spin 3000ms infinite alternate",
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
        meteor: {
          "0%": { transform: "rotate(215deg) translateX(0)", opacity: "1" },
          "70%": { opacity: "1" },
          "100%": {
            transform: "rotate(215deg) translateX(-500px)",
            opacity: "0",
          },
        },
        "border-beam": {
          "100%": {
            "offset-distance": "100%",
          },
        },
        "background-position-spin": {
          "0%": { backgroundPosition: "top center" },
          "100%": { backgroundPosition: "bottom center" },
        },
        shimmer: {
          "0%, 90%, 100%": {
            "background-position": "calc(-100% - var(--shimmer-width)) 0",
          },
          "30%, 60%": {
            "background-position": "calc(100% + var(--shimmer-width)) 0",
          },
        },
        },
        additionalColors: {
          beige: "#f8e8e0",
          "dark-beige": "#fcf3ed",
          "dark-blue": "#1D265D",
          "light-blue": "#00ACFF",
          "navy-blue": "#0044FF",
          "github-blue": "#4078c0",
          "github-green": "#1F883D",
          "github-light-green": "#2dba4e",
          "github-red": "#bd2c00",
          "github-orange": "#c9510c",
          "github-purple": "#6e5494",
          pink: "#ff7bff",
          orange: "#FFBA00",
          "base-black": "#191818",
        blueGray: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
        },
        coolGray: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
        },
        trueGray: {
          50: "#FAFAFA",
          100: "#F5F5F5",
          200: "#E5E5E5",
          300: "#D4D4D4",
          400: "#A3A3A3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
        },
        warmGray: {
          50: "#FAFAF9",
          100: "#F5F5F4",
          200: "#E7E5E4",
          300: "#D6D3D1",
          400: "#A8A29E",
          500: "#78716C",
          600: "#57534E",
          700: "#44403C",
          800: "#292524",
          900: "#1C1917",
        },
        green: {
          50: "#F0FDF4",
          100: "#DCFCE7",
          200: "#BBF7D0",
          300: "#86EFAC",
          400: "#4ADE80",
          500: "#22C55E",
          600: "#16A34A",
          700: "#15803D",
          800: "#166534",
          900: "#14532D",
        },
        secondary: {
          50: "#F5F3FF",
          100: "#EDE9FE",
          200: "#DDD6FE",
          300: "#C4B5FD",
          400: "#A78BFA",
          500: "#8B5CF6",
          600: "#7C3AED",
          700: "#6D28D9",
          800: "#5B21B6",
          900: "#4C1D95",
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        brandBlue: {
          DEFAULT: "#2962FF",
          50: "#E7F0FF",
          100: "#C2D8FF",
          200: "#9CC1FF",
          300: "#77A9FF",
          400: "#5192FF",
          500: "#2962FF",
          600: "#1E49C4",
          700: "#153388",
          800: "#0B1C4D",
          900: "#010711",
        },
        neutral: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
        },
        brandGreen: {
          DEFAULT: "#3CCF91",
          50: "#ECFDF5",
          100: "#D1FAE5",
          200: "#A7F3D0",
          300: "#6EE7B7",
          400: "#34D399",
          500: "#3CCF91",
          600: "#059669",
          700: "#047857",
          800: "#065F46",
          900: "#064E3B",
        },
        aurora: {
          50: "#E0F7FF",
          100: "#B8EEFF",
          200: "#8CE5FF",
          300: "#5EDBFF",
          400: "#36D2FF",
          500: "#00C8FF",
          600: "#00A3D9",
          700: "#007FB3",
          800: "#005C8C",
          900: "#003A66",
        },
        blossom: {
          50: "#FFF0F7",
          100: "#FFD6E8",
          200: "#FFADD2",
          300: "#FF85BC",
          400: "#FF5CA6",
          500: "#FF3390",
          600: "#FF0A7A",
          700: "#DB0064",
          800: "#B7004E",
          900: "#930038",
        },
        meadow: {
          50: "#F0FFF4",
          100: "#D6FFE3",
          200: "#ADFFCA",
          300: "#85FFB1",
          400: "#5CFF98",
          500: "#33FF7F",
          600: "#0AFF66",
          700: "#00DB52",
          800: "#00B743",
          900: "#009334",
        },
        sunset: {
          50: "#FFF7E0",
          100: "#FFEAB8",
          200: "#FFDD8C",
          300: "#FFD05E",
          400: "#FFC336",
          500: "#FFB600",
          600: "#D99B00",
          700: "#B38000",
          800: "#8C6500",
          900: "#664A00",
        },
        error: {
          50: "#FEF2F2",
          100: "#FEE2E2",
          200: "#FECACA",
          300: "#FCA5A5",
          400: "#F87171",
          500: "#EF4444",
          600: "#DC2626",
          700: "#B91C1C",
          800: "#991B1B",
          900: "#7F1D1D",
        },
        done: "#28a745",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
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
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
} satisfies Config;
