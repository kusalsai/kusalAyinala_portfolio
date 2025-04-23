import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Link2 } from "lucide-react";
import { formatTime } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import StatusBadge from "@/components/ui/status-badge";
import { Meeting } from "@shared/schema";

interface UpcomingMeetingsProps {
  meetings: Meeting[];
  isLoading: boolean;
}

const UpcomingMeetings = ({ meetings, isLoading }: UpcomingMeetingsProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-semibold">Today's Meetings</h3>
          <Button variant="link" size="sm" className="text-accent">
            View All
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100 max-h-[380px] overflow-y-auto">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="p-4">
                <div className="flex justify-between mb-2">
                  <Skeleton className="h-5 w-[200px]" />
                  <Skeleton className="h-5 w-[80px]" />
                </div>
                <Skeleton className="h-4 w-[180px] mb-2" />
                <Skeleton className="h-4 w-[250px] mb-3" />
                <div className="flex space-x-2">
                  <Skeleton className="h-8 w-[90px]" />
                  <Skeleton className="h-8 w-[90px]" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="p-4 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-semibold">Today's Meetings</h3>
        <Button variant="link" size="sm" className="text-accent">
          View All
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-100 max-h-[380px] overflow-y-auto">
          {meetings.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-gray-500">No meetings scheduled for today</p>
            </div>
          ) : (
            meetings.map((meeting) => (
              <div key={meeting.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between mb-2">
                  <p className="font-medium">{meeting.title}</p>
                  <StatusBadge status={meeting.status as any} />
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <svg
                    className="h-4 w-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>
                    {formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <svg
                    className="h-4 w-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span>
                    {meeting.participants.map((p) => p.name).join(", ")}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="text-xs">
                    <FileText className="h-3 w-3 mr-1" />
                    {meeting.notes ? "View Notes" : "Add Notes"}
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs">
                    <Link2 className="h-3 w-3 mr-1" />
                    {meeting.location.includes("http") ? "Join Call" : meeting.location}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingMeetings;
