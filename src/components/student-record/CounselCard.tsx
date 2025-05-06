// CounselCard.tsx
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CounselingCardProps {
  id: number;
  dateTime: string;
  category: string;
  teacher: string;
  content: string;
  nextPlan: string;
  isPublic: boolean;
}

export default function CounselCard({ dateTime, category, teacher, content, nextPlan }: CounselingCardProps) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // 날짜 형식을 YYYY-MM-DD HH:MM:SS에서 YYYY년 MM월 DD일 HH:MM으로 변환
  const formatDate = (dateTimeStr: string) => {
    try {
      const date = new Date(dateTimeStr);
      return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
    } catch (err) {
      console.error(err);
      return dateTimeStr; // 변환 실패 시 원본 반환
    }
  };

  return (
    <div className="flex flex-col items-start w-full border border-gray-300 rounded-md overflow-hidden">
      <div className="bg-gray-50 p-4 w-full cursor-pointer text-base text-black font-medium flex justify-between items-center" onClick={() => setOpen(!open)}>
        <div className="flex flex-col sm:flex-row sm:gap-2">
          <span className="text-gray-700">{formatDate(dateTime)}</span>
          <div className="flex gap-2">
            <span className="text-gray-900">주제: {category}</span>
            <span className="text-gray-900">담당 교사: {teacher}</span>
          </div>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }} className="ml-2 flex-shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </motion.div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: "auto",
              opacity: 1,
              transition: {
                height: { duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] },
                opacity: { duration: 0.25, delay: 0.15 },
              },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                height: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] },
                opacity: { duration: 0.2 },
              },
            }}
            className="overflow-hidden w-full bg-white"
          >
            <div ref={contentRef} className="p-5 text-base text-black border-t border-gray-200">
              <div className="mb-4">
                <h3 className="font-semibold text-lg mb-2">상담 내용</h3>
                <p className="whitespace-pre-line">{content}</p>
              </div>

              {nextPlan && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">향후 계획</h3>
                  <p className="whitespace-pre-line">{nextPlan}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
