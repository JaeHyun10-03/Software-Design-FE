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

export default function CounselCard({ dateTime, category, teacher, content, nextPlan, isPublic }: CounselingCardProps) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col items-start w-full">
      <div className="border border-gray-400 p-4 w-full cursor-pointer text-base text-black font-medium flex justify-between items-center" onClick={() => setOpen(!open)}>
        <div>
          {dateTime} | 주제 : {category} | 담당 교사 : {teacher}
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }} className="ml-2">
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
            className="overflow-hidden border-x border-b border-gray-400 w-full"
          >
            <div ref={contentRef} className="text-base text-black whitespace-pre-line p-4">
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
