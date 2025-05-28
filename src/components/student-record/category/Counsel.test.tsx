import { render, screen } from "@testing-library/react";
import Counsel from "@/components/student-record/category/Counsel";
beforeAll(() => {
  jest.spyOn(window, "alert").mockImplementation(() => {});
});

jest.mock("../CounselList", () => {
  const MockedCounselList = () => <div data-testid="mocked-counsel-list">Mocked CounselList</div>;
  MockedCounselList.displayName = "MockedCounselList";
  return MockedCounselList;
});

describe("Counsel Component", () => {
  it("CounselList 컴포넌트를 렌더링한다", () => {
    render(<Counsel />);
    expect(screen.getByTestId("mocked-counsel-list")).toBeInTheDocument();
  });
});
