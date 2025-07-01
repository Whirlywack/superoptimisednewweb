#!/usr/bin/env node

import { writeFileSync } from 'fs';
import { join } from 'path';

/**
 * Generate design tokens JSON for Figma sync
 * Extracts design system values from Tailwind config
 */

const designTokens = {
  colors: {
    base: {
      "off-black": "#1a1a1a",
      "off-white": "#fafafa",
      "warm-gray": "#6b7280",
      "light-gray": "#f3f4f6",
    },
    primary: {
      DEFAULT: "#64748b",
      50: "#f8fafc",
      100: "#f1f5f9",
      200: "#e2e8f0",
      300: "#cbd5e1",
      400: "#94a3b8",
      500: "#64748b",
      600: "#475569",
      700: "#334155",
      800: "#1e293b",
      900: "#0f172a",
      foreground: "#fafafa",
    },
  },
  typography: {
    fonts: {
      sans: "Inter",
      mono: "JetBrains Mono",
    },
    scale: {
      h1: {
        fontSize: "2.25rem",
        lineHeight: "1.2",
        fontWeight: "700",
        marginBottom: "2rem",
      },
      h2: {
        fontSize: "1.875rem",
        lineHeight: "1.3",
        fontWeight: "600",
        marginBottom: "1.5rem",
      },
      h3: {
        fontSize: "1.5rem",
        lineHeight: "1.4",
        fontWeight: "600",
        marginBottom: "1.25rem",
      },
      h4: {
        fontSize: "1.25rem",
        lineHeight: "1.4",
        fontWeight: "500",
        marginBottom: "1rem",
      },
      body: {
        fontSize: "1rem",
        lineHeight: "1.6",
        fontWeight: "400",
        marginBottom: "1rem",
      },
      small: {
        fontSize: "0.875rem",
        lineHeight: "1.5",
        fontWeight: "400",
        marginBottom: "0.75rem",
      },
      code: {
        fontSize: "0.875rem",
        lineHeight: "1.4",
        fontWeight: "400",
        fontFamily: "JetBrains Mono",
        marginBottom: "1rem",
      },
    },
  },
  spacing: {
    scale: {
      section: "3rem",
      component: "2rem",
      paragraph: "1rem",
      list: "0.5rem",
    },
  },
  breakpoints: {
    mobile: "320px",
    tablet: "768px",
    desktop: "1024px",
    wide: "1440px",
  },
  constraints: {
    maxWidthReading: "65ch",
  },
};

// Generate Figma-compatible tokens format
const figmaTokens = {
  global: {
    color: Object.entries(designTokens.colors).reduce((acc, [category, values]) => {
      if (typeof values === 'object') {
        Object.entries(values).forEach(([key, value]) => {
          const tokenName = category === 'base' ? key : `${category}-${key}`;
          acc[tokenName] = {
            value,
            type: 'color',
          };
        });
      }
      return acc;
    }, {} as any),
    typography: Object.entries(designTokens.typography.scale).reduce((acc, [key, value]) => {
      acc[key] = {
        value: {
          fontSize: value.fontSize,
          lineHeight: value.lineHeight,
          fontWeight: value.fontWeight,
          fontFamily: key === 'code' ? designTokens.typography.fonts.mono : designTokens.typography.fonts.sans,
        },
        type: 'typography',
      };
      return acc;
    }, {} as any),
    spacing: Object.entries(designTokens.spacing.scale).reduce((acc, [key, value]) => {
      acc[key] = {
        value,
        type: 'spacing',
      };
      return acc;
    }, {} as any),
  },
};

// Write files
const outputDir = process.cwd();

// Standard design tokens
writeFileSync(
  join(outputDir, 'design-tokens.json'),
  JSON.stringify(designTokens, null, 2)
);

// Figma tokens format
writeFileSync(
  join(outputDir, 'design-tokens.figma.json'),
  JSON.stringify(figmaTokens, null, 2)
);

console.log('✅ Design tokens generated successfully!');
console.log('   - design-tokens.json');
console.log('   - design-tokens.figma.json');