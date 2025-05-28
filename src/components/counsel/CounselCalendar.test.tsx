import React from "react";
import { render, screen } from "@testing-library/react";
import { CounselCalendar } from "./CounselCalendar";

// FullCalendar 및 관련 플러그인들을 목킹합니다.
// Jest의 mockClear()를 위해 FullCalendar Mock을 Jest.fn()으로 만듭니다.
jest.mock("@fullcalendar/react", () => {
  // 목킹된 FullCalendar 컴포넌트는 실제 렌더링 대신 props를 저장합니다.
  const MockFullCalendar = jest.fn((props) => {
    // Jest mock의 props에 접근하기 위해 컴포넌트 함수 자체에 속성으로 저장합니다.
    MockFullCalendar.mock.props = props;
    return <div data-testid="full-calendar-mock">Mock FullCalendar</div>;
  });
  return {
    __esModule: true, // ES 모듈 호환성을 위해 필요
    default: MockFullCalendar,
  };
});

// FullCalendar 플러그인들은 간단히 목킹합니다.
jest.mock("@fullcalendar/daygrid", () => jest.fn());
jest.mock("@fullcalendar/interaction", () => jest.fn());
// 한국어 로케일 객체는 빈 객체로 목킹합니다.
jest.mock("@fullcalendar/core/locales/ko", () => ({}));

// 목킹된 FullCalendar 컴포넌트를 import 방식으로 가져옵니다.
// 이렇게 하면 `@typescript-eslint/no-require-imports` 룰을 위반하지 않습니다.
import FullCalendar from "@fullcalendar/react";

// 목킹된 FullCalendar 함수에 Jest Mock의 속성을 사용하기 위해 타입 캐스팅합니다.
const MockFullCalendar = FullCalendar as jest.Mock;

describe("CounselCalendar", () => {
  // 각 테스트 실행 전에 Mock의 호출 기록과 저장된 props를 초기화합니다.
  beforeEach(() => {
    MockFullCalendar.mockClear();
    MockFullCalendar.mock.props = {}; // props 객체도 초기화하여 테스트 간 독립성 보장
  });

  // 테스트에 사용될 목킹된 데이터
  const mockEvents = [
    {
      id: "1",
      title: "상담 1",
      date: "2025-06-01",
      backgroundColor: "blue",
      borderColor: "darkblue",
    },
    {
      id: "2",
      title: "상담 2",
      date: "2025-06-15",
      backgroundColor: "green",
      borderColor: "darkgreen",
    },
  ];

  // 테스트에 사용될 목킹된 핸들러 함수
  const mockHandleDateClick = jest.fn();
  const mockHandleEventClick = jest.fn();
  const mockSelectedDate = "2025-06-10";

  // --- 기본 렌더링 및 props 전달 확인 ---
  it("FullCalendar 컴포넌트가 올바른 props와 함께 렌더링 된다", () => {
    render(<CounselCalendar events={mockEvents} selectedDate={mockSelectedDate} handleDateClick={mockHandleDateClick} handleEventClick={mockHandleEventClick} />);

    // 목킹된 FullCalendar 컴포넌트가 DOM에 렌더링되었는지 확인
    expect(screen.getByTestId("full-calendar-mock")).toBeInTheDocument();

    // FullCalendar에 전달된 props가 올바른지 확인
    const props = MockFullCalendar.mock.props;
    expect(props.plugins).toHaveLength(2);
    expect(props.initialView).toBe("dayGridMonth");
    expect(props.locale).toBeDefined(); // koLocale이 전달되었는지 확인
    expect(props.headerToolbar).toEqual({ left: "prev", center: "title", right: "next" });
    expect(props.height).toBe("auto");
    expect(props.firstDay).toBe(0);
    expect(props.contentHeight).toBe(320);
    expect(props.events).toEqual(mockEvents);
    expect(props.dateClick).toBe(mockHandleDateClick);
    expect(props.eventClick).toBe(mockHandleEventClick);
  });

  // --- `dayCellContent` 브랜치 커버 ---
  it("dayCellContent 콜백이 숫자를 정확히 추출하여 렌더링 한다", () => {
    render(<CounselCalendar events={mockEvents} selectedDate={mockSelectedDate} handleDateClick={mockHandleDateClick} handleEventClick={mockHandleEventClick} />);

    // 목킹된 FullCalendar에 전달된 dayCellContent 함수를 가져옴
    const dayCellContentFn = MockFullCalendar.mock.props.dayCellContent;
    expect(dayCellContentFn).toBeDefined(); // 함수가 정의되었는지 확인

    // 1. "1일"과 같이 한글이 포함된 경우: "1"만 추출되어 <span>1</span> 렌더링
    const result1 = dayCellContentFn({ dayNumberText: "1일" });
    expect(result1).toEqual(<span>1</span>);

    // 2. "15"와 같이 숫자만 있는 경우: "15"가 그대로 <span>15</span> 렌더링
    const result2 = dayCellContentFn({ dayNumberText: "15" });
    expect(result2).toEqual(<span>15</span>);

    // 3. 다른 문자열이 포함된 경우 (숫자 없음): 빈 문자열이 추출되어 <span></span> 렌더링
    const result3 = dayCellContentFn({ dayNumberText: "첫날" });
    // 빈 span 요소의 children은 빈 문자열임을 검증
    expect(result3.props.children).toBe("");
  });

  // --- `dayCellClassNames` 브랜치 커버 ---
  it("dayCellClassNames 콜백이 선택된 날짜에 'selected-date' 클래스를 적용한다", () => {
    // 현재 날짜를 기반으로 selectedDate 문자열 생성
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = String(today.getMonth() + 1).padStart(2, "0");
    const todayDate = String(today.getDate()).padStart(2, "0");
    const todayDateStr = `${currentYear}-${currentMonth}-${todayDate}`;

    // 선택된 날짜를 오늘 날짜로 설정하여 컴포넌트 렌더링
    render(
      <CounselCalendar
        events={mockEvents}
        selectedDate={todayDateStr} // 오늘 날짜를 selectedDate로 설정
        handleDateClick={mockHandleDateClick}
        handleEventClick={mockHandleEventClick}
      />
    );

    const dayCellClassNamesFn = MockFullCalendar.mock.props.dayCellClassNames;
    expect(dayCellClassNamesFn).toBeDefined();

    // 1. **선택된 날짜와 일치하는 경우**: 'selected-date' 클래스가 반환됨
    const selectedDateArg = { date: today }; // today는 현재 날짜
    expect(dayCellClassNamesFn(selectedDateArg)).toEqual(["selected-date"]);

    // 2. **선택된 날짜와 일치하지 않는 경우**: 빈 배열이 반환됨
    const otherDate = new Date(currentYear, today.getMonth(), today.getDate() + 1); // 다음 날짜
    const otherDateArg = { date: otherDate };
    expect(dayCellClassNamesFn(otherDateArg)).toEqual([]);

    // 3. **월/일이 한 자릿수인 경우에도 올바르게 포맷팅되는지 확인 (padStart 로직)**
    //   새로운 컴포넌트 렌더링으로 selectedDate를 변경하여 테스트
    const singleDigitDate = new Date(currentYear, 0, 5); // 예: 2025-01-05
    const singleDigitDateStr = `${currentYear}-01-05`;

    // 새로운 selectedDate로 컴포넌트 다시 렌더링 (mock props가 업데이트됨)
    render(<CounselCalendar events={mockEvents} selectedDate={singleDigitDateStr} handleDateClick={mockHandleDateClick} handleEventClick={mockHandleEventClick} />);
    // 업데이트된 mock props에서 dayCellClassNames 함수를 가져와 테스트
    expect(MockFullCalendar.mock.props.dayCellClassNames({ date: singleDigitDate })).toEqual(["selected-date"]);
  });

  // --- 이벤트 핸들러 전달 확인 ---
  it("날짜 클릭 핸들러가 FullCalendar에 올바르게 전달된다", () => {
    render(<CounselCalendar events={mockEvents} selectedDate={mockSelectedDate} handleDateClick={mockHandleDateClick} handleEventClick={mockHandleEventClick} />);

    const props = MockFullCalendar.mock.props;
    expect(props.dateClick).toBe(mockHandleDateClick);
  });

  it("이벤트 클릭 핸들러가 FullCalendar에 올바르게 전달된다", () => {
    render(<CounselCalendar events={mockEvents} selectedDate={mockSelectedDate} handleDateClick={mockHandleDateClick} handleEventClick={mockHandleEventClick} />);

    const props = MockFullCalendar.mock.props;
    expect(props.eventClick).toBe(mockHandleEventClick);
  });
});
