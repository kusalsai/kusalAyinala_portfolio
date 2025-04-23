import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useQuery, queryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { insertMeetingSchema } from "@shared/schema";

interface ScheduleModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const meetingFormSchema = insertMeetingSchema.extend({
  duration: z.string().min(1, "Please select a duration"),
  meetingPlatform: z.string().min(1, "Please select a platform"),
  syncWithCrm: z.boolean().default(true),
  sendCalendarInvites: z.boolean().default(true),
});

type MeetingFormValues = z.infer<typeof meetingFormSchema>;

const ScheduleModal = ({ isOpen, setIsOpen }: ScheduleModalProps) => {
  const { toast } = useToast();
  const [selectedDuration, setSelectedDuration] = useState("60");
  const [selectedPlatform, setSelectedPlatform] = useState("teams");

  const { data: clients = [] } = useQuery({
    queryKey: ["/api/clients"],
    enabled: isOpen,
  });

  const { data: meetingTypes = [] } = useQuery({
    queryKey: ["/api/meeting-types"],
    enabled: isOpen,
  });

  const form = useForm<MeetingFormValues>({
    resolver: zodResolver(meetingFormSchema),
    defaultValues: {
      clientId: "",
      type: "",
      date: new Date().toISOString().split("T")[0],
      time: "09:00",
      duration: "60",
      participants: "",
      meetingPlatform: "teams",
      agenda: "",
      syncWithCrm: true,
      sendCalendarInvites: true,
    },
  });

  const onSubmit = async (data: MeetingFormValues) => {
    try {
      // Convert form data to API format
      const [hours, minutes] = data.time.split(":");
      const startDate = new Date(data.date);
      startDate.setHours(parseInt(hours), parseInt(minutes), 0);
      
      const endDate = new Date(startDate);
      endDate.setMinutes(startDate.getMinutes() + parseInt(data.duration));
      
      const participants = data.participants
        .split(",")
        .map((p) => p.trim())
        .filter((p) => p);
      
      const apiData = {
        clientId: parseInt(data.clientId),
        title: data.title,
        type: data.type,
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
        participants,
        location: data.meetingPlatform,
        agenda: data.agenda,
        syncWithCrm: data.syncWithCrm,
        sendCalendarInvites: data.sendCalendarInvites,
      };
      
      await apiRequest("POST", "/api/meetings", apiData);
      
      queryClient.invalidateQueries({ queryKey: ["/api/meetings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/meetings/upcoming"] });
      queryClient.invalidateQueries({ queryKey: ["/api/meetings/calendar"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      
      toast({
        title: "Meeting scheduled",
        description: "Your meeting has been scheduled successfully.",
      });
      
      setIsOpen(false);
      form.reset();
    } catch (error) {
      console.error("Error scheduling meeting:", error);
      toast({
        title: "Failed to schedule meeting",
        description: "There was an error scheduling your meeting. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDurationSelect = (duration: string) => {
    setSelectedDuration(duration);
    form.setValue("duration", duration);
  };

  const handlePlatformSelect = (platform: string) => {
    setSelectedPlatform(platform);
    form.setValue("meetingPlatform", platform);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Schedule New Meeting</DialogTitle>
          <DialogDescription>
            Fill in the details to schedule a new client meeting
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a client" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id.toString()}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meeting Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter meeting title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meeting Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {meetingTypes.map((type) => (
                          <SelectItem key={type.id} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Duration</FormLabel>
                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        variant={selectedDuration === "30" ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => handleDurationSelect("30")}
                      >
                        30 min
                      </Button>
                      <Button
                        type="button"
                        variant={selectedDuration === "45" ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => handleDurationSelect("45")}
                      >
                        45 min
                      </Button>
                      <Button
                        type="button"
                        variant={selectedDuration === "60" ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => handleDurationSelect("60")}
                      >
                        60 min
                      </Button>
                      <Button
                        type="button"
                        variant={
                          selectedDuration !== "30" &&
                          selectedDuration !== "45" &&
                          selectedDuration !== "60"
                            ? "default"
                            : "outline"
                        }
                        className="flex-1"
                        onClick={() => handleDurationSelect("90")}
                      >
                        Custom
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="participants"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Participants</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter participant names or emails separated by commas"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="meetingPlatform"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Location / Platform</FormLabel>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant={selectedPlatform === "zoom" ? "default" : "outline"}
                        className="flex items-center"
                        onClick={() => handlePlatformSelect("zoom")}
                      >
                        <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22 11C22 16.5228 17.5228 21 12 21C6.47715 21 2 16.5228 2 11C2 5.47715 6.47715 1 12 1C17.5228 1 22 5.47715 22 11Z" stroke="currentColor" strokeWidth="2"/>
                          <path d="M8 11V8L14 11L8 14V11Z" fill="currentColor"/>
                        </svg>
                        Zoom
                      </Button>
                      <Button
                        type="button"
                        variant={selectedPlatform === "teams" ? "default" : "outline"}
                        className="flex items-center"
                        onClick={() => handlePlatformSelect("teams")}
                      >
                        {/* Microsoft icon */}
                        <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                          <rect x="4" y="4" width="7" height="7" />
                          <rect x="13" y="4" width="7" height="7" />
                          <rect x="4" y="13" width="7" height="7" />
                          <rect x="13" y="13" width="7" height="7" />
                        </svg>
                        Teams
                      </Button>
                      <Button
                        type="button"
                        variant={selectedPlatform === "google-meet" ? "default" : "outline"}
                        className="flex items-center"
                        onClick={() => handlePlatformSelect("google-meet")}
                      >
                        {/* Google icon */}
                        <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M8 12h8" />
                          <path d="M12 8v8" />
                        </svg>
                        Google Meet
                      </Button>
                      <Button
                        type="button"
                        variant={selectedPlatform === "in-person" ? "default" : "outline"}
                        className="flex items-center"
                        onClick={() => handlePlatformSelect("in-person")}
                      >
                        <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 22C12 22 19 18 19 11.5C19 6.8056 15.9728 3 12 3C8.02725 3 5 6.8056 5 11.5C5 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        In Person
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="agenda"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Agenda / Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add meeting agenda or preparation notes..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="md:col-span-2 space-y-2">
                <FormField
                  control={form.control}
                  name="syncWithCrm"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm cursor-pointer">
                        Sync with CRM systems
                      </FormLabel>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="sendCalendarInvites"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm cursor-pointer">
                        Send calendar invites to participants
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-accent hover:bg-indigo-700 text-white">
                Schedule Meeting
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleModal;
