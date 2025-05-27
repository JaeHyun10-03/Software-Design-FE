import { StudentHeader } from "@/components/shared/StudentHeader";
import { ReactNode } from "react";

const behavior = () => {
  return <div className="sm:m-0 m-4"></div>;
};

export default behavior;

behavior.getLayout = (page: ReactNode) => {
  return <StudentHeader>{page}</StudentHeader>;
};
