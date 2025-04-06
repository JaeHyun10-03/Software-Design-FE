import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CounselingCardProps {
  date: string;
  subject: string;
  teacher: string;
  content?: string;
}

export default function CounselCard({ date, subject, teacher, content }: CounselingCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col items-start w-full max-w-[1642px]">
      <div className="border border-[#a9a9a9] p-4 w-full cursor-pointer text-base text-black font-medium" onClick={() => setOpen(!open)}>
        {date} | 주제 : {subject} | 담당 교사 : {teacher}
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ maxHeight: 0, opacity: 0 }}
            animate={{ maxHeight: 1000, opacity: 1 }}
            exit={{ maxHeight: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="overflow-hidden border border-[#a9a9a9] px-4 py-2 w-full"
          >
            <div className="text-base text-black whitespace-pre-line">{content}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
