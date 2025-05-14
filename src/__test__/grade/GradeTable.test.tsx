import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { GradeTable } from '@/components/grade/GradeTable';
import { Evaluation } from '@/utils/gradeUtils';
import { within } from '@testing-library/react';

const evaluations: Evaluation[] = [
  { evaluationId: 1, title: '중간고사' },
  { evaluationId: 2, title: '기말고사' },
];

const students = [
  {
    number: 1,
    studentName: '홍길동',
    중간고사: 80,
    기말고사: 90,
    rawTotal: 170,
    weightedTotal: 170,
    average: 85,
    stdDev: 5.5,
    rank: 1,
    grade: 'A',
    achievementLevel: '상',
    feedback: '잘함',
  },
  {
    number: 2,
    studentName: '김철수',
    중간고사: 70,
    기말고사: 75,
    rawTotal: 145,
    weightedTotal: 145,
    average: 72.5,
    stdDev: 5.5,
    rank: 2,
    grade: 'B',
    achievementLevel: '중',
    feedback: '',
  },
];

describe('<GradeTable />', () => {
  const setSelectedRow = jest.fn();
  const handleCellClick = jest.fn();
  const handleInputChange = jest.fn();
  const handleInputBlur = jest.fn();
  const handleInputKeyDown = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

 it('테이블 헤더와 학생 데이터가 정상적으로 렌더링된다', () => {
    render(
      <GradeTable
        evaluations={evaluations}
        students={students}
        editing={null}
        inputValue=""
        selectedRow={null}
        setSelectedRow={setSelectedRow}
        handleCellClick={handleCellClick}
        handleInputChange={handleInputChange}
        handleInputBlur={handleInputBlur}
        handleInputKeyDown={handleInputKeyDown}
      />
    );

    // 헤더
    expect(screen.getByText('번호')).toBeInTheDocument();
    expect(screen.getByText('중간고사')).toBeInTheDocument();
    expect(screen.getByText('기말고사')).toBeInTheDocument();
    expect(screen.getByText('총점')).toBeInTheDocument();

    // 학생 이름
    expect(screen.getByText('홍길동')).toBeInTheDocument();
    expect(screen.getByText('김철수')).toBeInTheDocument();

    // 점수 (여러 셀이 있을 수 있으므로 getAllByText 사용)
    expect(screen.getAllByText('170.0').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('잘함')).toBeInTheDocument();
  });

  it('행 클릭 시 setSelectedRow가 호출된다', () => {
    render(
      <GradeTable
        evaluations={evaluations}
        students={students}
        editing={null}
        inputValue=""
        selectedRow={null}
        setSelectedRow={setSelectedRow}
        handleCellClick={handleCellClick}
        handleInputChange={handleInputChange}
        handleInputBlur={handleInputBlur}
        handleInputKeyDown={handleInputKeyDown}
      />
    );

    // 첫 번째 학생의 행 클릭
    const row = screen.getByText('홍길동').closest('tr')!;
    fireEvent.click(row);
    expect(setSelectedRow).toHaveBeenCalledWith(1);
  });

  it('셀 클릭 시 handleCellClick이 호출된다', () => {
    render(
      <GradeTable
        evaluations={evaluations}
        students={students}
        editing={null}
        inputValue=""
        selectedRow={null}
        setSelectedRow={setSelectedRow}
        handleCellClick={handleCellClick}
        handleInputChange={handleInputChange}
        handleInputBlur={handleInputBlur}
        handleInputKeyDown={handleInputKeyDown}
      />
    );

    // "중간고사" 셀 클릭
    const cell = screen.getAllByText('80')[0].closest('td')!;
    fireEvent.click(cell);
    expect(handleCellClick).toHaveBeenCalledWith(1, '중간고사', 80);
  });

  it('editing 상태일 때 input이 나타나고 입력 이벤트가 동작한다', () => {
    render(
      <GradeTable
        evaluations={evaluations}
        students={students}
        editing={{ row: 1, key: '중간고사' }}
        inputValue="95"
        selectedRow={1}
        setSelectedRow={setSelectedRow}
        handleCellClick={handleCellClick}
        handleInputChange={handleInputChange}
        handleInputBlur={handleInputBlur}
        handleInputKeyDown={handleInputKeyDown}
      />
    );

    // input이 나타남
    const input = screen.getByDisplayValue('95');
    expect(input).toBeInTheDocument();

    // 입력 이벤트
    fireEvent.change(input, { target: { value: '100' } });
    expect(handleInputChange).toHaveBeenCalled();

    fireEvent.blur(input);
    expect(handleInputBlur).toHaveBeenCalled();

    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    expect(handleInputKeyDown).toHaveBeenCalled();
  });

 it('학생 데이터가 없으면 tbody가 비어 있다', () => {
  render(
    <GradeTable
      evaluations={evaluations}
      students={[]}
      editing={null}
      inputValue=""
      selectedRow={null}
      setSelectedRow={setSelectedRow}
      handleCellClick={handleCellClick}
      handleInputChange={handleInputChange}
      handleInputBlur={handleInputBlur}
      handleInputKeyDown={handleInputKeyDown}
    />
  );
  const table = screen.getByRole('table');
  const rowgroups = within(table).getAllByRole('rowgroup');
  const tbody = rowgroups[1];
  expect(within(tbody).queryAllByRole('row').length).toBe(0);
})
})
