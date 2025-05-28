// DOM 테스트에 확장 매처 추가
import "@testing-library/jest-dom";
import "jest-canvas-mock";

// 🔧 브라우저 내장 객체 Mock --------------------------------------------------

// alert / confirm / prompt 등 기본 브라우저 팝업 함수 mock
global.alert = jest.fn();
global.confirm = jest.fn(() => true); // 기본은 "확인" 선택
global.prompt = jest.fn(() => ""); // 빈 문자열 입력 반환

// scrollTo mock - jsdom에 기본 구현 없음
Object.defineProperty(window, "scrollTo", {
  value: jest.fn(),
  writable: true,
});

// ResizeObserver mock
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = window.ResizeObserver || ResizeObserver;

// matchMedia mock - 일부 차트 라이브러리 등에서 사용
window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      media: "",
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    };
  };

// 🔧 콘솔 관련 처리 ----------------------------------------------------------

// 에러 로그, 경고 로그 무시 (테스트 노이즈 제거)
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
};
