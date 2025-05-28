import React, { ReactNode, useEffect, useState, useRef, useCallback } from "react";
import { StudentHeader } from "@/components/shared/StudentHeader";
import { GetNotification } from "@/api/student/getNotifications";

type Alert = {
  time: string;
  message: string;
  image: string;
};

export default function AlertPage() {

  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const fetchAlerts = useCallback(async (pageNum: number) => {
    setLoading(true);
    const data = await GetNotification(pageNum, 10);
    const alertArray: Alert[] = (data.notifications || []).map((item: any) => ({
      time: item.time || item.createdAt || "",
      message: item.message || item.content || "",
      image: item.image || "images/defaultImage.png",
    }));
    if (!data.notifications || data.notifications.length < 10) setHasMore(false);
    setAlerts(prev => (pageNum === 0 ? alertArray : [...prev, ...alertArray]));
    setLoading(false);
  }, []);

  useEffect(() => { fetchAlerts(0); }, [fetchAlerts]);

  useEffect(() => {
    if (!hasMore || loading) return;
    const observer = new window.IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) setPage(prev => prev + 1);
      },
      { threshold: 1 }
    );
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading]);

  useEffect(() => {
    if (page === 0 || !hasMore) return;
    fetchAlerts(page);
  }, [page, fetchAlerts, hasMore]);

  return (
    <div className="flex flex-col p-4 h-[calc(100vh-120px)]">
      <p className="text-left text-xl font-bold text-black mb-4">알림</p>
      <div className="flex-1 overflow-auto">
        <div className="flex flex-col gap-4 border border-[#d9d9d9] p-4  ">
          {alerts.map((alert, index) => (
            <div key={index} className="flex items-start gap-4  border-b border-[#d9d9d9]  last:border-b-0 pb-3 -ml-4 -mr-4">
              <div className="w-[13%]  ml-4 max-w-[50px] min-w-[38.5px] rounded-full overflow-hidden flex-shrink-0">
                <img src={alert.image} alt="profile" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <p className="text-sm text-[#999]">{alert.time}</p>
                <p className="text-[80%] text-black mt-2">{alert.message}</p>
              </div>
            </div>
          ))}
           <div ref={observerRef} />
          {loading && <div className="text-center text-gray-400 py-2">불러오는 중...</div>}
          {!hasMore && <div className="text-center text-gray-400 py-2">더 이상 알림이 없습니다.</div>}
        </div>
      </div>
    </div>
  );
}

AlertPage.getLayout = (page: ReactNode) => {
  return <StudentHeader>{page}</StudentHeader>;
};
