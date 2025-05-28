// DOM 테스트에 확장 매처 추가
import "@testing-library/jest-dom";
import "jest-canvas-mock";
import React from "react";

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

// 🔧 FullCalendar Mock -----------------------------------------------------

// FullCalendar React 컴포넌트 모킹
jest.mock("@fullcalendar/react", () => {
  return function MockFullCalendar(props: any) {
    return React.createElement(
      "div",
      {
        "data-testid": "full-calendar",
        className: "mock-fullcalendar",
      },
      [
        // 이벤트들 렌더링
        ...(props.events || []).map((event: any) =>
          React.createElement(
            "div",
            {
              key: event.id,
              "data-testid": `event-${event.id}`,
              className: "fc-event",
              onClick: () => props.eventClick?.({ event }),
              style: {
                backgroundColor: event.backgroundColor,
                borderColor: event.borderColor,
              },
            },
            event.title
          )
        ),
        // 날짜 셀 (클릭 테스트용) - 항상 selected-date 클래스 포함
        React.createElement(
          "div",
          {
            key: "calendar-cell",
            "data-testid": "calendar-cell",
            className: "fc-daygrid-day selected-date", // 여기서 selected-date 클래스 명시적으로 추가
            onClick: () =>
              props.dateClick?.({
                date: new Date(props.selectedDate || "2024-06-01"),
                dateStr: props.selectedDate || "2024-06-01",
              }),
          },
          "1"
        ),
      ]
    );
  };
});

// FullCalendar 플러그인들 모킹
jest.mock("@fullcalendar/daygrid", () => ({}));
jest.mock("@fullcalendar/interaction", () => ({
  DateClickArg: {},
}));
jest.mock("@fullcalendar/core", () => ({
  EventClickArg: {},
}));
jest.mock("@fullcalendar/core/locales/ko", () => ({}));
