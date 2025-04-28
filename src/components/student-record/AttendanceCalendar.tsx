// components/AttendanceCalendar.tsx
import React from "react";
import { useAttendanceCalendar } from "@/hooks/useAttendanceCalendar";
import { renderStatusIcon } from "@/utils/statusUtils";
import { getDateTextColor, getCellStyle } from "@/hooks/attendanceStyles";

export default function AttendanceCalendar() {
  const { biweeks } = useAttendanceCalendar();

  return (
    <div className="w-full">
      {biweeks.map((biweek, biweekIndex) => {
        const firstWeek = biweek.slice(0, 7);
        const secondWeek = biweek.slice(7);

        return (
          <div key={`biweek-${biweekIndex}`} className="">
            <div className="flex w-full">
              {[firstWeek, secondWeek].map((week, weekIdx) =>
                week.length > 0 ? (
                  <div className="flex-1" key={`week-${weekIdx}`}>
                    <div className="flex flex-col">
                      <div className="flex w-full">
                        {week.map((dateInfo, index) => (
                          <div key={`date-${weekIdx}-${index}`} className={`flex-1 h-8 border ${getCellStyle(dateInfo)} flex items-center justify-center`}>
                            <p className={`text-xs md:text-sm text-center select-none ${getDateTextColor(dateInfo)}`}>{dateInfo.date}</p>
                          </div>
                        ))}
                        {weekIdx === 1 &&
                          Array.from({ length: 7 - week.length }).map((_, i) => <div key={`empty-${biweekIndex}-${i}`} className="flex-1 h-8 border border-gray-200 bg-gray-50" />)}
                      </div>

                      <div className="flex w-full">
                        {week.map((dateInfo, index) => {
                          return (
                            <div key={`status-${weekIdx}-${index}`} className={`flex-1 h-8 border ${getCellStyle(dateInfo)} flex items-center justify-center`}>
                              <p className="text-xs md:text-sm text-center text-gray-800 select-none">{renderStatusIcon(dateInfo.status)}</p>
                            </div>
                          );
                        })}
                        {weekIdx === 1 &&
                          Array.from({ length: 7 - week.length }).map((_, i) => (
                            <div key={`empty-status-${biweekIndex}-${i}`} className="flex-1 h-8 border border-gray-200 bg-gray-50" />
                          ))}
                      </div>
                    </div>
                  </div>
                ) : null
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
