import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GradeFilter from '@/components/grade/GradeFilter';
import useGradeFilterStore from '@/store/grade-filter-store';

// Zustand store mock
jest.mock('@/store/grade-filter-store');

const mockSetYear = jest.fn();
const mockSetSemester = jest.fn();
const mockSetSubject = jest.fn();
const mockUseGradeFilterStore = useGradeFilterStore as unknown as jest.Mock;
(mockUseGradeFilterStore).mockReturnValue({

  year: '2025',
  semester: '1',
  subject: '독서와 문법',
  setYear: mockSetYear,
  setSemester: mockSetSemester,
  setSubject: mockSetSubject,
});

describe('GradeFilter 컴포넌트', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('초기 렌더링 시 select 요소들이 올바른 값을 가진다', () => {
    render(<GradeFilter />);
    expect(screen.getByDisplayValue('2025')).toBeInTheDocument();
    expect(screen.getByDisplayValue('1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('독서와 문법')).toBeInTheDocument();
  });

  it('연도 select 변경 시 setYear가 호출된다', () => {
    render(<GradeFilter />);
    fireEvent.change(screen.getByDisplayValue('2025'), { target: { value: '2024' } });
    expect(mockSetYear).toHaveBeenCalledWith('2024');
  });

  it('학기 select 변경 시 setSemester가 호출된다', () => {
    render(<GradeFilter />);
    fireEvent.change(screen.getByDisplayValue('1'), { target: { value: '2' } });
    expect(mockSetSemester).toHaveBeenCalledWith('2');
  });

  it('과목 select 변경 시 setSubject가 호출된다', () => {
    render(<GradeFilter />);
    fireEvent.change(screen.getByDisplayValue('독서와 문법'), { target: { value: '영어1' } });
    expect(mockSetSubject).toHaveBeenCalledWith('영어1');
  });
});
