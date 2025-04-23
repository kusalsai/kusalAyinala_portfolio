import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import ScheduleModal from "@/components/meetings/schedule-modal";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("month");
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const { data: meetings = [], isLoading } = useQuery({
    queryKey: ["/api/meetings", currentYear, currentMonth],
  });

  const navigateToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const navigateToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // Get days in the current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  // Get the first day of the month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  // Get days from previous month to display
  const daysFromPrevMonth = firstDayOfMonth;
  
  // Get days in previous month
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  const calendarDays = [];
  
  // Add days from previous month
  for (let i = daysInPrevMonth - daysFromPrevMonth + 1; i <= daysInPrevMonth; i++) {
    calendarDays.push({
      date: i,
      currentMonth: false,
      meetings: []
    });
  }
  
  // Add days from current month
  for (let i = 1; i <= daysInMonth; i++) {
    const dayMeetings = meetings.filter(meeting => {
      const meetingDate = new Date(meeting.startTime);
      return meetingDate.getDate() === i && 
             meetingDate.getMonth() === currentMonth &&
             meetingDate.getFullYear() === currentYear;
    });
    
    calendarDays.push({
      date: i,
      currentMonth: true,
      meetings: dayMeetings
    });
  }
  
  // Add days from next month to complete the grid
  const totalCalendarDays = 42; // 6 rows * 7 columns
  const daysFromNextMonth = totalCalendarDays - calendarDays.length;
  
  for (let i = 1; i <= daysFromNextMonth; i++) {
    calendarDays.push({
      date: i,
      currentMonth: false,
      meetings: []
    });
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <Button 
          className="bg-accent hover:bg-indigo-700 text-white"
          onClick={() => setIsScheduleModalOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          <span>Schedule Meeting</span>
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-4">
            <CardTitle>{formatDate(currentDate, "MMMM yyyy")}</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={navigateToPreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={navigateToNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Tabs value={view} onValueChange={setView}>
            <TabsList>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="day">Day</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <TabsContent value="month" className="mt-0">
            <div className="grid grid-cols-7 text-center p-2 border-b border-gray-100">
              {DAYS_OF_WEEK.map((day) => (
                <div key={day} className="text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 text-center">
              {isLoading ? (
                // Skeleton loading state
                Array.from({ length: 42 }).map((_, index) => (
                  <div key={index} className="min-h-[100px] p-1 border border-gray-100">
                    <Skeleton className="h-5 w-5 rounded-full mb-2" />
                    <Skeleton className="h-4 w-[80%] mb-2" />
                    <Skeleton className="h-4 w-[60%]" />
                  </div>
                ))
              ) : (
                calendarDays.map((day, index) => (
                  <div 
                    key={index} 
                    className={`calendar-day p-1 border border-gray-100 min-h-[100px] transition-colors ${
                      day.currentMonth ? "hover:bg-gray-50" : ""
                    }`}
                  >
                    <p className={`text-sm ${!day.currentMonth ? "text-gray-400" : ""}`}>
                      {day.date}
                    </p>
                    {day.meetings.slice(0, 3).map((meeting, idx) => (
                      <div 
                        key={idx}
                        className="mt-1 px-1 py-0.5 text-[10px] bg-accent text-white rounded truncate"
                      >
                        {meeting.client.name}
                      </div>
                    ))}
                    {day.meetings.length > 3 && (
                      <div className="mt-1 px-1 py-0.5 text-[10px] bg-gray-100 rounded text-gray-600 truncate">
                        +{day.meetings.length - 3} more
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="week">
            <div className="p-20 flex items-center justify-center text-gray-500">
              Week view coming soon
            </div>
          </TabsContent>
          
          <TabsContent value="day">
            <div className="p-20 flex items-center justify-center text-gray-500">
              Day view coming soon
            </div>
          </TabsContent>
        </CardContent>
      </Card>

      <ScheduleModal 
        isOpen={isScheduleModalOpen} 
        setIsOpen={setIsScheduleModalOpen} 
      />
    </div>
  );
};

export default Calendar;
