import { StudentHeader } from "@/components/shared/StudentHeader";
import { ReactNode } from "react";

const attendance = () => {
  return <div className="sm:m-0 m-4"></div>;
};

export default attendance;

attendance.getLayout = (page: ReactNode) => {
  return <StudentHeader>{page}</StudentHeader>;
};
