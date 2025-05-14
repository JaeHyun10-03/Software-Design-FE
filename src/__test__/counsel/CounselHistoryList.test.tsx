import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CounselHistoryList } from '@/components/counsel/CounselHistoryList';
import { ConsultingData } from '@/types/counsel';

// CounselHistoryItem을 mock 처리 (렌더링 여부만 확인)
jest.mock('../../components/counsel/CounselHistoryItem', () => ({
  CounselHistoryItem: ({ item, isSelected }: any) => (
    <div data-testid="history-item">
      {item.content} {isSelected ? '(선택됨)' : ''}
    </div>
  ),
}));

const sampleHistory: ConsultingData[] = [
  {
    id: 1,
    dateTime: '2025-05-07',
    category: 'UNIVERSITY',
    teacher: '홍길동',
    content: '상담 내용 1',
    isPublic: true,
    nextPlan: '다음 상담 계획',
  },
  {
    id: 2,
    dateTime: '2025-05-07',
    category: 'CAREER',
    teacher: '김철수',
    content: '상담 내용 2',
    isPublic: false,
    nextPlan: '다음 상담 계획2',
  },
];

describe('<CounselHistoryList />', () => {
  it('dailyHistory가 비어있으면 안내 문구를 보여준다', () => {
    render(
      <CounselHistoryList
        dailyHistory={[]}
        selectedCounselId={null}
        setSelectedCounselId={jest.fn()}
        setForm={jest.fn()}
      />
    );
    expect(screen.getByText('선택한 날짜의 상담 이력이 없습니다.')).toBeInTheDocument();
  });

  it('dailyHistory의 각 item을 CounselHistoryItem으로 렌더링한다', () => {
    render(
      <CounselHistoryList
        dailyHistory={sampleHistory}
        selectedCounselId={1}
        setSelectedCounselId={jest.fn()}
        setForm={jest.fn()}
      />
    );
    // 두 개의 history-item이 렌더링됨
    const items = screen.getAllByTestId('history-item');
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent('상담 내용 1 (선택됨)');
    expect(items[1]).toHaveTextContent('상담 내용 2');
  });

  it('selectedCounselId가 일치하는 아이템만 (선택됨) 표시', () => {
    render(
      <CounselHistoryList
        dailyHistory={sampleHistory}
        selectedCounselId={2}
        setSelectedCounselId={jest.fn()}
        setForm={jest.fn()}
      />
    );
    const items = screen.getAllByTestId('history-item');
    expect(items[0]).not.toHaveTextContent('(선택됨)');
    expect(items[1]).toHaveTextContent('(선택됨)');
  });
});
