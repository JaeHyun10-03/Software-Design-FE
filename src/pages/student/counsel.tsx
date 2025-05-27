import { StudentHeader } from "@/components/shared/StudentHeader";
import { ReactNode } from "react";

const counsel = () => {
  return <div className="sm:m-0 m-4"></div>;
};

export default counsel;

counsel.getLayout = (page: ReactNode) => {
  return <StudentHeader>{page}</StudentHeader>;
};
