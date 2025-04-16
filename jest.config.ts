import nextJest from 'next/jest';
import type { Config } from '@jest/types';

const createJestConfig = nextJest({
  dir: './', // Next.js 앱 루트 디렉토리
});

const customJestConfig: Config.InitialOptions = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // setup 파일을 ts로 쓸 경우
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // 절대경로 alias 예시 (src 디렉토리 기준)
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
};

export default createJestConfig(customJestConfig);
