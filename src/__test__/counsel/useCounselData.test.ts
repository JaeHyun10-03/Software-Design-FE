// __tests__/hooks/useCounselData.test.ts
import { renderHook, act } from "@testing-library/react";
import { useCounselData } from "@/hooks/useCounselData";
import { GetCounsel } from "@/api/getCounsel";

jest.mock("@/api/getCounsel");
const mockedGetCounsel = GetCounsel as jest.Mock;

describe("useCounselData", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("allFilled가 false면 GetCounsel을 호출하지 않는다", () => {
    renderHook(() => useCounselData("student1", false));
    expect(mockedGetCounsel).not.toHaveBeenCalled();
  });

  it("allFilled가 true면 GetCounsel을 호출하고 데이터를 반환한다", async () => {
    const mockData = [{ id: 1, content: "상담1" }];
    mockedGetCounsel.mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useCounselData("student1", true));
    // 비동기 useEffect 처리
    await act(async () => {});

    expect(mockedGetCounsel).toHaveBeenCalledWith("student1");
    expect(result.current[0]).toEqual(mockData);
    // setConsultingData도 반환됨
    expect(typeof result.current[1]).toBe("function");
  });

  it("GetCounsel이 에러를 throw하면 consultingData는 빈 배열이 된다", async () => {
    mockedGetCounsel.mockRejectedValueOnce(new Error("API 실패"));

    const { result } = renderHook(() => useCounselData("student1", true));
    await act(async () => {});

    expect(result.current[0]).toEqual([]);
  });

  it("studentId나 allFilled가 바뀔 때마다 GetCounsel이 다시 호출된다", async () => {
    const mockData1 = [{ id: 1, content: "상담1" }];
    const mockData2 = [{ id: 2, content: "상담2" }];
    mockedGetCounsel
      .mockResolvedValueOnce(mockData1)
      .mockResolvedValueOnce(mockData2);

    const { result, rerender } = renderHook(
      ({ studentId, allFilled }) => useCounselData(studentId, allFilled),
      { initialProps: { studentId: "student1", allFilled: true } }
    );
    await act(async () => {});

    expect(result.current[0]).toEqual(mockData1);

    // studentId가 바뀌면 다시 호출
    rerender({ studentId: "student2", allFilled: true });
    await act(async () => {});
    expect(mockedGetCounsel).toHaveBeenCalledWith("student2");
    expect(result.current[0]).toEqual(mockData2);
  });
});
