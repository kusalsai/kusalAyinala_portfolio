import { Button } from "@/components/ui/button";
import { PlusIcon, UserPlusIcon, Download } from "lucide-react";
import StatsCard from "@/components/dashboard/stats-card";
import UpcomingMeetings from "@/components/dashboard/upcoming-meetings";
import MonthlyCalendar from "@/components/dashboard/monthly-calendar";
import MeetingHistory from "@/components/dashboard/meeting-history";
import CrmIntegration from "@/components/dashboard/crm-integration";
import ScheduleModal from "@/components/meetings/schedule-modal";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

const Dashboard = () => {
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/stats'],
  });

  const { data: upcomingMeetings, isLoading: meetingsLoading } = useQuery({
    queryKey: ['/api/meetings/upcoming'],
  });

  const { data: meetingHistory, isLoading: historyLoading } = useQuery({
    queryKey: ['/api/meetings/history'],
  });

  const { data: crmStatus, isLoading: crmLoading } = useQuery({
    queryKey: ['/api/crm/status'],
  });

  return (
    <div className="animate-in fade-in">
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4 mb-6">
        <Button 
          className="bg-accent hover:bg-indigo-700 text-white"
          onClick={() => setIsScheduleModalOpen(true)}
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          <span>Schedule Meeting</span>
        </Button>
        
        <Button variant="outline">
          <UserPlusIcon className="h-4 w-4 mr-2" />
          <span>Add Client</span>
        </Button>
        
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          <span>Export Reports</span>
        </Button>
      </div>
      
      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatsCard 
          title="Upcoming Meetings"
          value={statsLoading ? "-" : stats?.upcomingMeetings.count.toString() || "0"}
          description={statsLoading ? "" : stats?.upcomingMeetings.description || ""}
          change={statsLoading ? "" : stats?.upcomingMeetings.change || ""}
          icon="calendar"
          iconColor="text-accent"
        />
        
        <StatsCard 
          title="Follow-ups Due"
          value={statsLoading ? "-" : stats?.followups.count.toString() || "0"}
          description={statsLoading ? "" : stats?.followups.description || ""}
          change={statsLoading ? "" : stats?.followups.change || ""}
          icon="checkbox"
          iconColor="text-warning"
        />
        
        <StatsCard 
          title="Monthly Meetings"
          value={statsLoading ? "-" : stats?.monthlyMeetings.count.toString() || "0"}
          description={statsLoading ? "" : stats?.monthlyMeetings.description || ""}
          change={statsLoading ? "" : stats?.monthlyMeetings.change || ""}
          icon="chart"
          iconColor="text-secondary"
        />
        
        <StatsCard 
          title="CRM Sync Status"
          value={statsLoading ? "" : stats?.crmSync.status || "Unknown"}
          description={statsLoading ? "" : stats?.crmSync.description || ""}
          icon="refresh"
          iconColor="text-success"
          valueClassName={statsLoading ? "" : "text-success font-medium"}
        />
      </div>
      
      {/* Upcoming Meetings & Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <UpcomingMeetings 
          meetings={upcomingMeetings || []} 
          isLoading={meetingsLoading} 
        />
        <div className="lg:col-span-2">
          <MonthlyCalendar />
        </div>
      </div>
      
      {/* Meeting History & CRM Integration */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <MeetingHistory 
          meetings={meetingHistory || []} 
          isLoading={historyLoading} 
          className="lg:col-span-2"
        />
        <CrmIntegration 
          integrations={crmStatus || []} 
          isLoading={crmLoading} 
        />
      </div>

      <ScheduleModal 
        isOpen={isScheduleModalOpen} 
        setIsOpen={setIsScheduleModalOpen} 
      />
    </div>
  );
};

export default Dashboard;
