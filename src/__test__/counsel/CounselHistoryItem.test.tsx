import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CounselHistoryItem } from '@/components/counsel/CounselHistoryItem';
import { ConsultingData } from '@/types/counsel';

const baseItem: ConsultingData = {
  id: 1,
  dateTime: '2025-05-07',
  category: 'UNIVERSITY',
  teacher: '홍길동',
  content: '상담 내용입니다.',
  isPublic: true,
  nextPlan: '다음 상담 계획',
};

describe('<CounselHistoryItem />', () => {
  it('상담 정보가 정상적으로 렌더링된다', () => {
    render(
      <CounselHistoryItem
        item={baseItem}
        isSelected={false}
        setSelectedCounselId={jest.fn()}
        setForm={jest.fn()}
      />
    );
    expect(screen.getByText('대학')).toBeInTheDocument(); // categoryMap['UNIVERSITY'] === '대학'
    expect(screen.getByText(/담당 교사: 홍길동/)).toBeInTheDocument();
    expect(screen.getByText('상담 내용입니다.')).toBeInTheDocument();
  });

  it('클릭 시 setSelectedCounselId와 setForm이 호출된다', () => {
    const setSelectedCounselId = jest.fn();
    const setForm = jest.fn();
    render(
      <CounselHistoryItem
        item={baseItem}
        isSelected={false}
        setSelectedCounselId={setSelectedCounselId}
        setForm={setForm}
      />
    );
    // blur-sm가 없으므로 div 클릭 가능
    fireEvent.click(screen.getByText('대학'));
    expect(setSelectedCounselId).toHaveBeenCalledWith(1);
    expect(setForm).toHaveBeenCalledWith({
      dateTime: baseItem.dateTime,
      category: baseItem.category,
      teacher: baseItem.teacher,
      content: baseItem.content,
      isPublic: baseItem.isPublic,
      nextPlan: baseItem.nextPlan,
    });
  });

  it('비공개 상담일 때 버튼이 보이고 클릭 시 setSelectedCounselId, setForm 호출', () => {
    const setSelectedCounselId = jest.fn();
    const setForm = jest.fn();
    render(
      <CounselHistoryItem
        item={{ ...baseItem, isPublic: false }}
        isSelected={false}
        setSelectedCounselId={setSelectedCounselId}
        setForm={setForm}
      />
    );
    // 비공개 버튼이 나타난다
    const privateBtn = screen.getByRole('button', { name: /상담이 비공개입니다/ });
    expect(privateBtn).toBeInTheDocument();

    // 버튼 클릭 시 setSelectedCounselId, setForm 호출
    fireEvent.click(privateBtn);
    expect(setSelectedCounselId).toHaveBeenCalledWith(1);
    expect(setForm).toHaveBeenCalledWith({
      ...baseItem,
      isPublic: false,
    });
  });

  it('isSelected가 true면 파란색 배경이 적용된다', () => {
    const { container } = render(
      <CounselHistoryItem
        item={baseItem}
        isSelected={true}
        setSelectedCounselId={jest.fn()}
        setForm={jest.fn()}
      />
    );
    // border-blue-500, bg-blue-50 클래스 적용 여부 확인
    expect(container.firstChild).toHaveClass('border-blue-500');
    expect(container.firstChild).toHaveClass('bg-blue-50');
  });

  it('상담 내용이 30자 이상이면 ...으로 잘린다', () => {
    const longContent = 'a'.repeat(35);
    render(
      <CounselHistoryItem
        item={{ ...baseItem, content: longContent }}
        isSelected={false}
        setSelectedCounselId={jest.fn()}
        setForm={jest.fn()}
      />
    );
    expect(screen.getByText(`${'a'.repeat(30)}...`)).toBeInTheDocument();
  });
});
