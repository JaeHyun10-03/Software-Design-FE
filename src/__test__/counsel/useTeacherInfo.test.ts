// __tests__/hooks/useTeacherInfo.test.ts
import { renderHook, act } from "@testing-library/react";
import { useTeacherInfo } from "@/hooks/useTeacherInfo";
import { GetTeacherInfo } from "@/api/getTeacherInfo";

jest.mock("@/api/getTeacherInfo");
const mockedGetTeacherInfo = GetTeacherInfo as jest.Mock;

describe("useTeacherInfo", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("초기값은 null이다", () => {
    const { result } = renderHook(() => useTeacherInfo());
    expect(result.current).toBeNull();
  });

  it("GetTeacherInfo가 성공하면 teacher를 반환한다", async () => {
    const mockTeacher = { teacherId: 1, name: "홍길동", phone: "010-1234-5678", email: "hong@school.com" };
    mockedGetTeacherInfo.mockResolvedValueOnce(mockTeacher);

    const { result } = renderHook(() => useTeacherInfo());
    await act(async () => {});

    expect(mockedGetTeacherInfo).toHaveBeenCalled();
    expect(result.current).toEqual(mockTeacher);
  });

  it("GetTeacherInfo가 실패하면 teacher는 null이다", async () => {
    mockedGetTeacherInfo.mockRejectedValueOnce(new Error("API 실패"));

    const { result } = renderHook(() => useTeacherInfo());
    await act(async () => {});

    expect(result.current).toBeNull();
  });
});
