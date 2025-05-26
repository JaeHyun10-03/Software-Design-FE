import React, { ReactNode, useEffect, useState } from "react";
import { Header } from "@/components/shared/Header";

type Alert = {
  time: string;
  message: string;
  image: string;
};

export default function AlertPage() {

  const [alerts, setAlerts] = useState<Alert[]>([]);


 useEffect(() => {
    // 예시: 서버에서 받아오는 경우
    const fetchAlerts = async () => {
      const data = [
        {
          time: "2025.03.10 10:00",
          message: "OOO님이 성적을 입력하였습니다.",
          image: "images/defaultImage.png",
        },
        {
          time: "2025.03.10 10:00",
          message: "OOO님이 OOO 피드백을 작성하였습니다.",
          image: "images/defaultImage.png",
        },
      ];
      setAlerts(data); // ✅ 상태 업데이트
    };

    fetchAlerts();
  }, []);
  return (
    <div className="flex flex-col p-4">
      <p className="text-left text-xl font-bold text-black mb-4">알림</p>
      <div className="flex flex-col gap-4 border border-[#d9d9d9] p-4 rounded-lg ">
        {alerts.map((alert, index) => (
          <div key={index} className="flex items-start gap-4 border-b border-[#d9d9d9] pb-4 last:border-b-0">
            <div className="w-24 h-24 rounded-full overflow-hidden border border-[#d9d9d9] flex-shrink-0">
              <img src={alert.image} alt="profile" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <p className="text-sm text-[#999]">{alert.time}</p>
              <p className="text-base text-black mt-2">{alert.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

AlertPage.getLayout = (page: ReactNode) => {
  return <Header>{page}</Header>;
};
