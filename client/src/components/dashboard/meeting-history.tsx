import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateTime, calculateDuration } from "@/lib/utils";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import AvatarInitial from "@/components/ui/avatar-initial";
import StatusBadge from "@/components/ui/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Meeting } from "@shared/schema";

interface MeetingHistoryProps {
  meetings: Meeting[];
  isLoading: boolean;
  className?: string;
}

const MeetingHistory = ({ meetings, isLoading, className }: MeetingHistoryProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMeetings = searchTerm
    ? meetings.filter(
        (meeting) =>
          meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          meeting.client.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : meetings;

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-semibold">Recent Meeting History</h3>
          <div className="flex items-center">
            <Skeleton className="h-9 w-56 mr-2" />
            <Skeleton className="h-5 w-16" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Follow-up</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 4 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="ml-3">
                          <Skeleton className="h-4 w-28" />
                          <Skeleton className="h-3 w-20 mt-1" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><Skeleton className="h-4 w-36" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="p-4 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-semibold">Recent Meeting History</h3>
        <div className="flex items-center">
          <div className="relative mr-2">
            <Search className="h-4 w-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search meetings..."
              className="pl-8 h-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="link" size="sm" className="text-accent">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Follow-up</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMeetings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No meetings found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredMeetings.map((meeting) => (
                  <TableRow key={meeting.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center">
                        <AvatarInitial
                          name={meeting.client.name}
                          bgColorClass={
                            meeting.client.avatarBg || "bg-indigo-100"
                          }
                          textColorClass={
                            meeting.client.avatarColor || "text-accent"
                          }
                        />
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {meeting.client.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {meeting.type}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-gray-500">
                      {formatDateTime(meeting.startTime)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-gray-500">
                      {calculateDuration(meeting.startTime, meeting.endTime)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <StatusBadge status={meeting.status as any} />
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm">
                      {meeting.followUpStatus === "overdue" ? (
                        <span className="text-destructive">Overdue ({meeting.followUpDays} days)</span>
                      ) : meeting.followUpStatus === "due-soon" ? (
                        <span className="text-warning">Due Tomorrow</span>
                      ) : meeting.followUpStatus === "completed" ? (
                        <span className="text-gray-500">Completed</span>
                      ) : meeting.followUpStatus === "not-required" ? (
                        <span className="text-gray-500">Not required</span>
                      ) : (
                        <span className="text-gray-500">No follow-up set</span>
                      )}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <Button variant="link" size="sm" className="text-accent h-8">
                        Notes
                      </Button>
                      <Button variant="link" size="sm" className="text-accent h-8">
                        {meeting.followUpStatus === "completed" || meeting.followUpStatus === "not-required" 
                          ? "Details" 
                          : "Follow-up"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default MeetingHistory;
