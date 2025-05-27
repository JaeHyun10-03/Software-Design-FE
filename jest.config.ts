// jest.config.ts
import nextJest from 'next/jest';
import type { Config } from '@jest/types';

const createJestConfig = nextJest({
  dir: './', // Next.js 앱 루트 디렉토리
});

const customJestConfig: Config.InitialOptions = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  collectCoverageFrom: [
    '**/*.{ts,tsx,js,jsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/coverage/**',
    '!**/jest.config.ts',
    '!**/jest.setup.ts',
    '!**/next-env.d.ts',
    '!**/tailwind.config.ts',
    '!**/src/pages/_app.tsx',
    '!**/src/pages/_document.tsx',
    '!**/src/assets/**', // 정적 파일 제외

  ],
};

export default createJestConfig(customJestConfig);
