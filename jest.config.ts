import type { Config } from "jest";

const config: Config = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/lib/analytics$": "<rootDir>/src/lib/__mocks__/analytics.ts",
    "^@/lib/useResolvedFindings$": "<rootDir>/src/lib/__mocks__/useResolvedFindings.ts",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testMatch: ["**/src/**/*.test.tsx", "**/src/**/*.test.ts"],
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.json" }],
  },
};

export default config;
