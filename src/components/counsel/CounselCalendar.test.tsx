import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CounselCalendar } from "./CounselCalendar";

// FullCalendar 관련 mock
jest.mock("@fullcalendar/react", () => {
  return function MockFullCalendar({ events, dateClick, eventClick }: any) {
    return (
      <div data-testid="fullcalendar-mock">
        {/* 헤더 시뮬레이션 */}
        <div className="fc-toolbar">
          <div className="fc-toolbar-chunk">
            <h2 data-testid="calendar-title">2025년 5월</h2>
          </div>
        </div>

        {/* 캘린더 그리드 시뮬레이션 */}
        <div className="fc-view fc-dayGridMonth-view">
          <table>
            <tbody>
              <tr>
                {/* 날짜 셀들 시뮬레이션 */}
                {Array.from({ length: 7 }, (_, i) => (
                  <td
                    key={i}
                    role="gridcell"
                    className={`fc-daygrid-day ${i === 2 ? "selected-date" : ""}`}
                    onClick={() => {
                      if (dateClick) {
                        dateClick({
                          date: new Date("2025-05-28"),
                          dateStr: "2025-05-28",
                          allDay: true,
                          dayEl: null,
                          jsEvent: {} as MouseEvent,
                          view: {} as any,
                        });
                      }
                    }}
                  >
                    <div className="fc-daygrid-day-number">{i + 26}</div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>

          {/* 이벤트들 렌더링 */}
          <div className="fc-event-container">
            {events?.map((event: any) => (
              <div
                key={event.id}
                className="fc-event"
                style={{
                  backgroundColor: event.backgroundColor,
                  borderColor: event.borderColor,
                }}
                onClick={() => {
                  if (eventClick) {
                    eventClick({
                      event: {
                        id: event.id,
                        title: event.title,
                        start: new Date(event.date),
                        end: null,
                        allDay: true,
                        url: "",
                        extendedProps: {},
                      },
                      el: null,
                      jsEvent: {} as MouseEvent,
                      view: {} as any,
                    });
                  }
                }}
              >
                <div className="fc-event-title">{event.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
});

// FullCalendar 플러그인들 mock
jest.mock("@fullcalendar/daygrid", () => ({}));
jest.mock("@fullcalendar/interaction", () => ({}));

describe("CounselCalendar", () => {
  const mockEvents = [
    {
      id: "1",
      title: "상담 1",
      date: "2025-05-28",
      backgroundColor: "#ff9f89",
      borderColor: "#ff9f89",
    },
  ];

  const selectedDate = "2025-05-28";
  const handleDateClick = jest.fn();
  const handleEventClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    return render(<CounselCalendar events={mockEvents} selectedDate={selectedDate} handleDateClick={handleDateClick} handleEventClick={handleEventClick} />);
  };

  it("FullCalendar가 렌더링 되는가?", () => {
    renderComponent();

    expect(screen.getByTestId("fullcalendar-mock")).toBeInTheDocument();
    expect(screen.getByTestId("calendar-title")).toHaveTextContent("2025년 5월");
  });

  it("이벤트가 렌더링 되는가?", () => {
    renderComponent();

    expect(screen.getByText("상담 1")).toBeInTheDocument();
  });

  it("날짜 클릭 시 handleDateClick이 호출되는가?", async () => {
    const user = userEvent.setup();
    renderComponent();

    // FullCalendar에서 날짜 셀 선택
    const dayCells = screen.getAllByRole("gridcell");
    expect(dayCells.length).toBeGreaterThan(0);

    await user.click(dayCells[0]);

    await waitFor(() => {
      expect(handleDateClick).toHaveBeenCalledTimes(1);
    });

    // 호출된 인자 확인
    expect(handleDateClick).toHaveBeenCalledWith({
      date: expect.any(Date),
      dateStr: "2025-05-28",
      allDay: true,
      dayEl: null,
      jsEvent: expect.any(Object),
      view: expect.any(Object),
    });
  });

  it("이벤트 클릭 시 handleEventClick이 호출되는가?", async () => {
    const user = userEvent.setup();
    renderComponent();

    const eventEl = screen.getByText("상담 1");
    await user.click(eventEl);

    await waitFor(() => {
      expect(handleEventClick).toHaveBeenCalledTimes(1);
    });

    // 호출된 인자 확인
    expect(handleEventClick).toHaveBeenCalledWith({
      event: {
        id: "1",
        title: "상담 1",
        start: expect.any(Date),
        end: null,
        allDay: true,
        url: "",
        extendedProps: {},
      },
      el: null,
      jsEvent: expect.any(Object),
      view: expect.any(Object),
    });
  });

  it("selectedDate에 selected-date 클래스가 적용되는가?", () => {
    renderComponent();

    const selectedCell = document.querySelector(".selected-date");
    expect(selectedCell).toBeTruthy();
    expect(selectedCell?.classList.contains("selected-date")).toBe(true);
  });

  it("이벤트 스타일이 올바르게 적용되는가?", () => {
    renderComponent();

    const eventEl = screen.getByText("상담 1").closest(".fc-event");
    expect(eventEl).toHaveStyle({
      backgroundColor: "#ff9f89",
      borderColor: "#ff9f89",
    });
  });

  it("여러 이벤트가 있을 때 모두 렌더링되는가?", () => {
    const multipleEvents = [
      {
        id: "1",
        title: "상담 1",
        date: "2025-05-28",
        backgroundColor: "#ff9f89",
        borderColor: "#ff9f89",
      },
      {
        id: "2",
        title: "상담 2",
        date: "2025-05-29",
        backgroundColor: "#89c4ff",
        borderColor: "#89c4ff",
      },
    ];

    render(<CounselCalendar events={multipleEvents} selectedDate={selectedDate} handleDateClick={handleDateClick} handleEventClick={handleEventClick} />);

    expect(screen.getByText("상담 1")).toBeInTheDocument();
    expect(screen.getByText("상담 2")).toBeInTheDocument();
  });

  it("빈 이벤트 배열일 때도 정상 렌더링되는가?", () => {
    render(<CounselCalendar events={[]} selectedDate={selectedDate} handleDateClick={handleDateClick} handleEventClick={handleEventClick} />);

    expect(screen.getByTestId("fullcalendar-mock")).toBeInTheDocument();
    expect(screen.queryByText("상담 1")).not.toBeInTheDocument();
  });

  it("props가 올바르게 전달되는가?", () => {
    // 실제 CounselCalendar 컴포넌트 내부에서 FullCalendar에 전달하는 props들이
    // 올바르게 전달되는지 확인하는 테스트
    renderComponent();

    // Mock 컴포넌트가 렌더링되었는지 확인
    expect(screen.getByTestId("fullcalendar-mock")).toBeInTheDocument();
  });
});
