import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jsdom",
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}",
    "<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}",
  ],
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/*.stories.{js,jsx,ts,tsx}",
    "!src/**/index.{js,jsx,ts,tsx}",
  ],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60,
    },
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    // Mock problematic ESM modules
    "^react-markdown$": "<rootDir>/src/__mocks__/react-markdown.js",
    "^rehype-sanitize$": "<rootDir>/src/__mocks__/rehype-sanitize.js",
    "^rehype-highlight$": "<rootDir>/src/__mocks__/rehype-sanitize.js",
    "^react-syntax-highlighter$": "<rootDir>/src/__mocks__/react-syntax-highlighter.js",
    "^react-syntax-highlighter/dist/esm/(.*)$":
      "<rootDir>/src/__mocks__/react-syntax-highlighter.js",
  },
  transformIgnorePatterns: ["node_modules/(?!(superjson|@trpc|lucide-react|@tanstack)/)"],
};

export default createJestConfig(customJestConfig);
