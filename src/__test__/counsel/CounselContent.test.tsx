import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CounselContent from '@/components/counsel/counselContent';

// store mock
jest.mock('@/store/student-filter-store', () => () => ({
  grade: 1,
  classNumber: 2,
  studentNumber: 3,
  studentId: 'student-123',
}));

// api mock
jest.mock('@/api/getCounsel', () => ({
  GetCounsel: jest.fn(),
}));
jest.mock('@/api/getTeacherInfo', () => ({
  GetTeacherInfo: jest.fn(),
}));
jest.mock('@/api/postCounsel', () => ({
  PostCounsel: jest.fn(),
}));
jest.mock('@/api/putCounsel', () => ({
  PutCounsel: jest.fn(),
}));

// 하위 컴포넌트 mock
jest.mock('@/components/counsel/CounselCalendar', () => ({
  CounselCalendar: ({ handleDateClick, handleEventClick }: any) => (
    <div>
      <button data-testid="calendar-date" onClick={() => handleDateClick({ dateStr: '2025-05-07' })}>날짜선택</button>
      <button data-testid="calendar-event" onClick={() => handleEventClick({ event: { id: 1 } })}>이벤트선택</button>
    </div>
  ),
}));

jest.mock('@/components/counsel/CounselHistoryList', () => ({
  CounselHistoryList: () => <div data-testid="history-list">상담이력목록</div>
}));

import { GetCounsel } from '@/api/getCounsel';
import { GetTeacherInfo } from '@/api/getTeacherInfo';
import { PostCounsel } from '@/api/postCounsel';

describe('CounselContent', () => {
  beforeEach(() => {
    // mock API 응답
    (GetCounsel as jest.Mock).mockResolvedValue([
      {
        id: 1,
        dateTime: '2025-05-07',
        category: 'UNIVERSITY',
        teacher: '홍길동',
        content: '상담 내용',
        isPublic: true,
        nextPlan: '다음 계획',
      },
    ]);
    (GetTeacherInfo as jest.Mock).mockResolvedValue({
      id: 1,
      name: '홍길동',
      subject: '상담',
    });
    (PostCounsel as jest.Mock).mockResolvedValue({});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('기본 렌더링 및 주요 하위 컴포넌트 표시', async () => {
    render(<CounselContent />);
    await waitFor(() => {
      expect(screen.getByTestId('counsel-form')).toBeInTheDocument();
      expect(screen.getByTestId('history-list')).toBeInTheDocument();
      expect(screen.getByTestId('calendar-date')).toBeInTheDocument();
      expect(screen.getByTestId('calendar-event')).toBeInTheDocument();
      expect(screen.getByText('상담이력')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('calendar-date'));
    await waitFor(() => {
      expect(screen.getByText(/상담 이력/)).toBeInTheDocument();
    });
  });

  it('날짜 클릭 시 폼이 초기화되고 날짜 타이틀이 바뀐다', async () => {
    render(<CounselContent />);
    await waitFor(() => {
      expect(screen.getByTestId('calendar-date')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('calendar-date'));
    await waitFor(() => {
      expect(screen.getByText('2025. 05. 07. 상담 이력')).toBeInTheDocument();
    });
  });

 it('상담 내용 입력 후 추가 버튼 클릭 시 PostCounsel이 호출된다', async () => {
  render(<CounselContent />);
  
  fireEvent.click(screen.getByTestId('calendar-date'));
  // 상담 종류 select 찾기 (name 속성 활용)
  const categorySelect = screen.getByRole('combobox', { name: /상담 종류/i });
  // select의 option value는 COUNSEL_TYPES의 값 중 하나여야 합니다.
  // 예: "UNIVERSITY", "CAREER", "FAMILY" 등 실제 value 확인
  fireEvent.change(categorySelect, { target: { value: '대학' } });

  // 상담 내용 textarea 찾기 (name 속성 활용)
  const contentTextarea = screen.getByRole('textbox', { name: /상담 내용/i });
  fireEvent.change(contentTextarea, { target: { value: '새 상담 내용' } });

  // 다음 상담 일정 textarea도 필수(required)임을 고려
  const nextPlanTextarea = screen.getByRole('textbox', { name: /다음 상담 일정/i });
  fireEvent.change(nextPlanTextarea, { target: { value: '다음 상담 계획' } });

  // "상담 등록" 버튼 클릭
  const button = screen.getByRole('button', { name: '상담 등록' });
  fireEvent.click(button);

  await waitFor(() => {
    expect(PostCounsel).toHaveBeenCalled();
  });
});


  it('이벤트 클릭 시 폼이 해당 상담 내용으로 바뀐다', async () => {
    render(<CounselContent />);
    await waitFor(() => {
      expect(screen.getByTestId('calendar-event')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('calendar-event'));
    await waitFor(() => {
      expect(screen.getByDisplayValue('상담 내용')).toBeInTheDocument();
    });
  });
});
