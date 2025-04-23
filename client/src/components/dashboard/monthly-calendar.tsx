import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn, generateCalendarDays } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MonthlyCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeView, setActiveView] = useState("month");
  
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  
  const { data: meetings = [] } = useQuery({
    queryKey: ["/api/meetings/calendar", currentYear, currentMonth],
  });
  
  const calendarDays = generateCalendarDays(currentYear, currentMonth);

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // Get meetings for a specific day
  const getMeetingsForDay = (day: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return [];

    return meetings.filter(meeting => {
      const meetingDate = new Date(meeting.startTime);
      return (
        meetingDate.getDate() === day &&
        meetingDate.getMonth() === currentMonth &&
        meetingDate.getFullYear() === currentYear
      );
    });
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  return (
    <Card>
      <CardHeader className="p-4 border-b border-gray-100 flex flex-wrap justify-between items-center">
        <h3 className="font-semibold">{format(currentDate, "MMMM yyyy")}</h3>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={handlePreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <div className="ml-4 hidden sm:flex space-x-1">
            <Button
              variant={activeView === "month" ? "default" : "outline"}
              className={cn(
                "px-3 py-1 text-sm rounded-md",
                activeView === "month" ? "bg-primary text-white" : ""
              )}
              onClick={() => setActiveView("month")}
            >
              Month
            </Button>
            <Button
              variant={activeView === "week" ? "default" : "outline"}
              className={cn(
                "px-3 py-1 text-sm rounded-md",
                activeView === "week" ? "bg-primary text-white" : ""
              )}
              onClick={() => setActiveView("week")}
            >
              Week
            </Button>
            <Button
              variant={activeView === "day" ? "default" : "outline"}
              className={cn(
                "px-3 py-1 text-sm rounded-md",
                activeView === "day" ? "bg-primary text-white" : ""
              )}
              onClick={() => setActiveView("day")}
            >
              Day
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="grid grid-cols-7 text-center p-2 border-b border-gray-100">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 text-center">
          {calendarDays.map((day, index) => {
            const dayMeetings = getMeetingsForDay(day.date, day.currentMonth);
            const isCurrentDay = isToday(day.date);
            
            return (
              <div
                key={index}
                className={cn(
                  "calendar-day p-1 border border-gray-100 min-h-[100px]",
                  isCurrentDay ? "bg-gray-50" : ""
                )}
              >
                <p className={cn(
                  "text-sm",
                  !day.currentMonth ? "text-gray-400" : "",
                  isCurrentDay ? "font-semibold" : ""
                )}>
                  {day.date}
                </p>
                
                {dayMeetings.slice(0, 3).map((meeting, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "mt-1 px-1 py-0.5 text-[10px] rounded truncate",
                      {
                        "bg-accent text-white": idx === 0,
                        "bg-success bg-opacity-20 text-success": idx === 1,
                        "bg-gray-200 text-gray-600": idx === 2
                      }
                    )}
                  >
                    {meeting.client.name}
                  </div>
                ))}
                
                {dayMeetings.length > 3 && (
                  <div className="mt-1 px-1 py-0.5 text-[10px] bg-gray-100 rounded text-gray-600 truncate">
                    {dayMeetings.length - 3} more
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyCalendar;
