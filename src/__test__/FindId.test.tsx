import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FindId from '@/pages/findId'; // 실제 경로에 맞게 조정
import { useRouter } from 'next/navigation';
import * as postFindIdApi from '@/api/postFindId';

// PostFindId 모듈 mock
jest.mock('@/api/postFindId', () => ({
  PostFindId: jest.fn(),
}));

// 라우터 mock
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
const pushMock = jest.fn();
(window as any).alert = jest.fn();


beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('<FindId />', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    jest.clearAllMocks();
  });

  it('렌더링: 이름/휴대폰/학교 입력창과 작성 완료 버튼이 있다', () => {
    render(<FindId />);
    expect(screen.getByPlaceholderText('이름을 작성해주세요')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('휴대폰 번호를 작성해주세요')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('중학교 or 고등학교를 선택해주세요')).toBeInTheDocument();
    expect(screen.getByText('작성 완료')).toBeInTheDocument();
  });

  it('입력: 이름, 휴대폰, 학교 입력이 잘 된다', () => {
    render(<FindId />);
    const nameInput = screen.getByPlaceholderText('이름을 작성해주세요') as HTMLInputElement;
    const phoneInput = screen.getByPlaceholderText('휴대폰 번호를 작성해주세요') as HTMLInputElement;
    const schoolInput = screen.getByPlaceholderText('중학교 or 고등학교를 선택해주세요') as HTMLInputElement;

    fireEvent.change(nameInput, { target: { value: '홍길동' } });
    fireEvent.change(phoneInput, { target: { value: '01012345678' } });
    fireEvent.change(schoolInput, { target: { value: '고등학교' } });

    expect(nameInput.value).toBe('홍길동');
    expect(phoneInput.value).toBe('01012345678');
    expect(schoolInput.value).toBe('고등학교');
  });

  it('예외: 정보 미입력 시 alert 호출', () => {
    render(<FindId />);
    fireEvent.click(screen.getByText('작성 완료'));
    expect(window.alert).toHaveBeenCalledWith('정보를 모두 입력해주세요.');
  });

  it('아이디 찾기 성공 시 PostFindId 호출, 라우팅', async () => {
    (postFindIdApi.PostFindId as jest.Mock).mockResolvedValue({
      loginId: 'testuser123',
    });

    render(<FindId />);
    fireEvent.change(screen.getByPlaceholderText('이름을 작성해주세요'), { target: { value: '홍길동' } });
    fireEvent.change(screen.getByPlaceholderText('휴대폰 번호를 작성해주세요'), { target: { value: '01012345678' } });
    fireEvent.change(screen.getByPlaceholderText('중학교 or 고등학교를 선택해주세요'), { target: { value: '고등학교' } });
    fireEvent.click(screen.getByText('작성 완료'));

    await waitFor(() => {
      expect(postFindIdApi.PostFindId).toHaveBeenCalledWith('홍길동', '01012345678', '고등학교');
      expect(pushMock).toHaveBeenCalledWith('/findId/testuser123');
    });
  });

  it('아이디 찾기 실패 시 alert 호출', async () => {
    (postFindIdApi.PostFindId as jest.Mock).mockRejectedValue('아이디 찾기 실패');

    render(<FindId />);
    fireEvent.change(screen.getByPlaceholderText('이름을 작성해주세요'), { target: { value: '홍길동' } });
    fireEvent.change(screen.getByPlaceholderText('휴대폰 번호를 작성해주세요'), { target: { value: '01012345678' } });
    fireEvent.change(screen.getByPlaceholderText('중학교 or 고등학교를 선택해주세요'), { target: { value: '고등학교' } });
    fireEvent.click(screen.getByText('작성 완료'));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('아이디 찾기 실패');
    });
  });
});
