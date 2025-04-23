import { 
  clients, type Client, type InsertClient,
  meetings, type Meeting, type InsertMeeting,
  meetingTypes, type MeetingType, type InsertMeetingType,
  crmIntegrations, type CrmIntegration, type InsertCrmIntegration
} from "@shared/schema";
import { addDays, isPast, isToday, differenceInDays } from "date-fns";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // Client methods
  getClients(): Promise<Client[]>;
  getClient(id: number): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: number, client: Partial<Client>): Promise<Client | undefined>;
  
  // Meeting methods
  getMeetings(): Promise<Meeting[]>;
  getMeeting(id: number): Promise<Meeting | undefined>;
  getMeetingsByClient(clientId: number): Promise<Meeting[]>;
  getUpcomingMeetings(): Promise<Meeting[]>;
  getMeetingHistory(): Promise<Meeting[]>;
  createMeeting(meeting: InsertMeeting): Promise<Meeting>;
  updateMeeting(id: number, meeting: Partial<Meeting>): Promise<Meeting | undefined>;
  
  // Meeting types methods
  getMeetingTypes(): Promise<MeetingType[]>;
  createMeetingType(meetingType: InsertMeetingType): Promise<MeetingType>;
  
  // CRM integration methods
  getCrmIntegrations(): Promise<CrmIntegration[]>;
  getCrmIntegration(id: number): Promise<CrmIntegration | undefined>;
  createCrmIntegration(integration: InsertCrmIntegration): Promise<CrmIntegration>;
  updateCrmIntegration(id: number, integration: Partial<CrmIntegration>): Promise<CrmIntegration | undefined>;
  
  // Stats methods
  getStats(): Promise<any>;
}

export class MemStorage implements IStorage {
  private clients: Map<number, Client>;
  private meetings: Map<number, Meeting>;
  private meetingTypes: Map<number, MeetingType>;
  private crmIntegrations: Map<number, CrmIntegration>;
  
  private clientsId: number;
  private meetingsId: number;
  private meetingTypesId: number;
  private crmIntegrationsId: number;

  constructor() {
    // Initialize maps for storage
    this.clients = new Map();
    this.meetings = new Map();
    this.meetingTypes = new Map();
    this.crmIntegrations = new Map();
    
    // Initialize IDs
    this.clientsId = 1;
    this.meetingsId = 1;
    this.meetingTypesId = 1;
    this.crmIntegrationsId = 1;
    
    // Seed default meeting types
    this.seedMeetingTypes();
    
    // Seed default CRM integrations
    this.seedCrmIntegrations();
    
    // Seed some sample clients
    this.seedClients();
    
    // Seed some sample meetings
    this.seedMeetings();
  }

  // Client methods
  async getClients(): Promise<Client[]> {
    return Array.from(this.clients.values());
  }

  async getClient(id: number): Promise<Client | undefined> {
    return this.clients.get(id);
  }

  async createClient(insertClient: InsertClient): Promise<Client> {
    const id = this.clientsId++;
    const now = new Date();
    const client: Client = { ...insertClient, id, createdAt: now, lastMeeting: null };
    this.clients.set(id, client);
    return client;
  }

  async updateClient(id: number, clientData: Partial<Client>): Promise<Client | undefined> {
    const client = this.clients.get(id);
    if (!client) return undefined;
    
    const updatedClient = { ...client, ...clientData };
    this.clients.set(id, updatedClient);
    return updatedClient;
  }

  // Meeting methods
  async getMeetings(): Promise<Meeting[]> {
    const allMeetings = Array.from(this.meetings.values());
    return this.enrichMeetingsWithClients(allMeetings);
  }

  async getMeeting(id: number): Promise<Meeting | undefined> {
    const meeting = this.meetings.get(id);
    if (!meeting) return undefined;
    
    const client = this.clients.get(meeting.clientId);
    if (!client) return undefined;
    
    return { ...meeting, client };
  }

  async getMeetingsByClient(clientId: number): Promise<Meeting[]> {
    const clientMeetings = Array.from(this.meetings.values())
      .filter(meeting => meeting.clientId === clientId);
      
    return this.enrichMeetingsWithClients(clientMeetings);
  }

  async getUpcomingMeetings(): Promise<Meeting[]> {
    const now = new Date();
    const upcomingMeetings = Array.from(this.meetings.values())
      .filter(meeting => {
        const meetingStart = new Date(meeting.startTime);
        return meetingStart >= now || isToday(meetingStart);
      })
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
      
    return this.enrichMeetingsWithClients(upcomingMeetings);
  }

  async getMeetingHistory(): Promise<Meeting[]> {
    const now = new Date();
    const pastMeetings = Array.from(this.meetings.values())
      .filter(meeting => {
        const meetingStart = new Date(meeting.startTime);
        return meetingStart < now && !isToday(meetingStart);
      })
      .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
      
    return this.enrichMeetingsWithClients(pastMeetings);
  }

  async createMeeting(insertMeeting: InsertMeeting): Promise<Meeting> {
    const id = this.meetingsId++;
    const now = new Date();
    
    // Default fields
    const meeting: Meeting = {
      ...insertMeeting,
      id,
      status: insertMeeting.status || "scheduled",
      followUpStatus: "none",
      followUpDays: null,
      syncedWithCrm: false,
      createdAt: now,
    };
    
    this.meetings.set(id, meeting);
    
    // Update client's last meeting date
    const client = this.clients.get(meeting.clientId);
    if (client) {
      this.clients.set(client.id, {
        ...client,
        lastMeeting: meeting.startTime
      });
    }
    
    const enrichedMeeting = await this.getMeeting(id);
    return enrichedMeeting!;
  }

  async updateMeeting(id: number, meetingData: Partial<Meeting>): Promise<Meeting | undefined> {
    const meeting = this.meetings.get(id);
    if (!meeting) return undefined;
    
    const updatedMeeting = { ...meeting, ...meetingData };
    this.meetings.set(id, updatedMeeting);
    
    return this.getMeeting(id);
  }

  // Meeting types methods
  async getMeetingTypes(): Promise<MeetingType[]> {
    return Array.from(this.meetingTypes.values());
  }

  async createMeetingType(meetingType: InsertMeetingType): Promise<MeetingType> {
    const id = this.meetingTypesId++;
    const newMeetingType: MeetingType = { ...meetingType, id };
    this.meetingTypes.set(id, newMeetingType);
    return newMeetingType;
  }

  // CRM integration methods
  async getCrmIntegrations(): Promise<CrmIntegration[]> {
    return Array.from(this.crmIntegrations.values());
  }

  async getCrmIntegration(id: number): Promise<CrmIntegration | undefined> {
    return this.crmIntegrations.get(id);
  }

  async createCrmIntegration(integration: InsertCrmIntegration): Promise<CrmIntegration> {
    const id = this.crmIntegrationsId++;
    const now = new Date();
    const newIntegration: CrmIntegration = {
      ...integration,
      id,
      lastSync: null,
      createdAt: now
    };
    this.crmIntegrations.set(id, newIntegration);
    return newIntegration;
  }

  async updateCrmIntegration(
    id: number,
    integrationData: Partial<CrmIntegration>
  ): Promise<CrmIntegration | undefined> {
    const integration = this.crmIntegrations.get(id);
    if (!integration) return undefined;
    
    const updatedIntegration = { ...integration, ...integrationData };
    this.crmIntegrations.set(id, updatedIntegration);
    return updatedIntegration;
  }

  // Stats methods
  async getStats(): Promise<any> {
    const upcomingMeetings = await this.getUpcomingMeetings();
    const allMeetings = await this.getMeetings();
    const pastMeetings = await this.getMeetingHistory();
    
    // Calculate today's meetings
    const todayMeetings = upcomingMeetings.filter(meeting => isToday(new Date(meeting.startTime)));
    
    // Calculate overdue and due soon follow-ups
    const overdueFollowups = pastMeetings.filter(
      meeting => meeting.followUpStatus === "overdue"
    );
    
    // Calculate monthly meetings (current month)
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthlyMeetings = allMeetings.filter(
      meeting => new Date(meeting.startTime) >= firstDayOfMonth
    );
    
    // Last month meetings count for comparison
    const firstDayOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastDayOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    const lastMonthMeetings = allMeetings.filter(
      meeting => {
        const meetingDate = new Date(meeting.startTime);
        return meetingDate >= firstDayOfLastMonth && meetingDate <= lastDayOfLastMonth;
      }
    );
    
    // Calculate monthly change percentage
    const monthlyChange = lastMonthMeetings.length 
      ? Math.round(((monthlyMeetings.length - lastMonthMeetings.length) / lastMonthMeetings.length) * 100) 
      : 100;
      
    // Get CRM sync status
    const crmSyncInfo = await this.getCrmSyncStatus();
    
    return {
      upcomingMeetings: {
        count: upcomingMeetings.length,
        change: todayMeetings.length > 0 ? `+${todayMeetings.length} today` : "None today",
        description: upcomingMeetings.length > 0 
          ? `Next in ${this.getTimeToNextMeeting(upcomingMeetings[0].startTime)}` 
          : "No upcoming meetings"
      },
      followups: {
        count: overdueFollowups.length,
        change: overdueFollowups.length > 0 ? `${overdueFollowups.length} overdue` : "",
        description: overdueFollowups.length > 0 
          ? `Oldest from ${this.getOldestOverdueFollowup(overdueFollowups)}` 
          : "No follow-ups needed"
      },
      monthlyMeetings: {
        count: monthlyMeetings.length,
        change: `${monthlyChange > 0 ? '+' : ''}${monthlyChange}% vs last month`,
        description: `Goal: ${monthlyMeetings.length + 5}`
      },
      crmSync: crmSyncInfo
    };
  }

  // Helper methods
  private async enrichMeetingsWithClients(meetings: Meeting[]): Promise<Meeting[]> {
    return meetings.map(meeting => {
      const client = this.clients.get(meeting.clientId);
      return { ...meeting, client: client! };
    });
  }

  private getTimeToNextMeeting(nextMeetingTime: Date | string): string {
    const now = new Date();
    const meetingTime = new Date(nextMeetingTime);
    const diffMs = meetingTime.getTime() - now.getTime();
    
    if (diffMs < 0) return "in progress";
    
    const diffMin = Math.floor(diffMs / 60000);
    
    if (diffMin < 60) {
      return `${diffMin} minutes`;
    } else {
      const hours = Math.floor(diffMin / 60);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
    }
  }

  private getOldestOverdueFollowup(overdueFollowups: Meeting[]): string {
    if (overdueFollowups.length === 0) return "";
    
    // Sort by meeting date
    const sorted = [...overdueFollowups].sort(
      (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );
    
    // Format the date of the oldest meeting
    const oldestDate = new Date(sorted[0].startTime);
    return `${oldestDate.toLocaleString('default', { month: 'short' })} ${oldestDate.getDate()}`;
  }

  private async getCrmSyncStatus(): Promise<any> {
    const crms = await this.getCrmIntegrations();
    
    // Check if any are connected
    const connectedCrms = crms.filter(crm => crm.status === "connected");
    
    if (connectedCrms.length === 0) {
      return {
        status: "Not Connected",
        description: "No CRM integrations"
      };
    }
    
    // Get the most recent sync
    const sortedBySyncTime = [...connectedCrms].sort((a, b) => {
      if (!a.lastSync) return 1;
      if (!b.lastSync) return -1;
      return new Date(b.lastSync).getTime() - new Date(a.lastSync).getTime();
    });
    
    const mostRecent = sortedBySyncTime[0];
    
    if (!mostRecent.lastSync) {
      return {
        status: "Connected",
        description: "No sync yet"
      };
    }
    
    // Calculate time since last sync
    const syncTime = new Date(mostRecent.lastSync);
    const now = new Date();
    const diffMin = Math.floor((now.getTime() - syncTime.getTime()) / 60000);
    
    let syncTimeText;
    if (diffMin < 60) {
      syncTimeText = `${diffMin} min ago`;
    } else {
      const hours = Math.floor(diffMin / 60);
      syncTimeText = `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    }
    
    // Get connected CRM names
    const connectedNames = connectedCrms.map(crm => crm.name).join(", ");
    
    return {
      status: "Synced",
      description: `${syncTimeText}`,
      connectedServices: connectedNames
    };
  }

  // Seed methods
  private seedMeetingTypes(): void {
    const types = [
      { label: "Strategy Review", value: "strategy-review" },
      { label: "Sales Pitch", value: "sales-pitch" },
      { label: "Contract Discussion", value: "contract-discussion" },
      { label: "Introduction", value: "introduction" },
      { label: "Partnership Discussion", value: "partnership-discussion" },
      { label: "Product Demo", value: "product-demo" },
      { label: "Investment Opportunity", value: "investment-opportunity" },
    ];
    
    types.forEach(type => {
      const id = this.meetingTypesId++;
      this.meetingTypes.set(id, { ...type, id });
    });
  }
  
  private seedCrmIntegrations(): void {
    const integrations = [
      { 
        name: "Salesforce", 
        type: "salesforce", 
        status: "connected", 
        config: {},
        lastSync: new Date(Date.now() - 15 * 60 * 1000) // 15 minutes ago
      },
      { 
        name: "Microsoft Dynamics", 
        type: "microsoft", 
        status: "pending", 
        config: {},
        lastSync: null
      },
      { 
        name: "Google Calendar", 
        type: "google", 
        status: "connected", 
        config: {},
        lastSync: new Date(Date.now() - 15 * 60 * 1000) // 15 minutes ago
      },
      { 
        name: "HubSpot", 
        type: "hubspot", 
        status: "disconnected", 
        config: {},
        lastSync: null
      }
    ];
    
    integrations.forEach(integration => {
      const id = this.crmIntegrationsId++;
      this.crmIntegrations.set(id, { 
        ...integration, 
        id, 
        createdAt: new Date() 
      });
    });
  }
  
  private seedClients(): void {
    const clients = [
      {
        name: "Acme Corporation",
        company: "Acme Inc.",
        email: "john.smith@acme.com",
        phone: "555-123-4567",
        status: "active",
        avatarBg: "bg-indigo-100",
        avatarColor: "text-accent",
        notes: "Major client, interested in a full platform license",
        contacts: [
          { name: "John Smith", title: "CEO", email: "john.smith@acme.com", phone: "555-123-4567" },
          { name: "Emily Davis", title: "CTO", email: "emily.davis@acme.com", phone: "555-987-6543" }
        ]
      },
      {
        name: "TechStart Inc.",
        company: "TechStart",
        email: "michael.johnson@techstart.com",
        phone: "555-222-3333",
        status: "active",
        avatarBg: "bg-blue-100",
        avatarColor: "text-blue-600",
        notes: "Startup looking for enterprise tools",
        contacts: [
          { name: "Michael Johnson", title: "Product Manager", email: "michael.johnson@techstart.com", phone: "555-222-3333" }
        ]
      },
      {
        name: "Global Shipping",
        company: "Global Shipping Partners",
        email: "robert.chen@globalshipping.com",
        phone: "555-444-5555",
        status: "active",
        avatarBg: "bg-green-100",
        avatarColor: "text-green-600",
        notes: "Interested in logistics optimization",
        contacts: [
          { name: "Robert Chen", title: "VP Operations", email: "robert.chen@globalshipping.com", phone: "555-444-5555" }
        ]
      },
      {
        name: "Nova Ventures",
        company: "Nova Ventures LLC",
        email: "sarah.kim@novaventures.com",
        phone: "555-666-7777",
        status: "potential",
        avatarBg: "bg-purple-100",
        avatarColor: "text-purple-600",
        notes: "Looking for investment opportunities in tech",
        contacts: [
          { name: "Sarah Kim", title: "Managing Partner", email: "sarah.kim@novaventures.com", phone: "555-666-7777" }
        ]
      }
    ];
    
    clients.forEach(client => {
      const id = this.clientsId++;
      this.clients.set(id, { 
        ...client, 
        id, 
        createdAt: new Date(),
        lastMeeting: null
      });
    });
  }
  
  private seedMeetings(): void {
    // Create a mix of upcoming and past meetings
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    // Today's meetings
    const todayMeetings = [
      {
        clientId: 1, // Acme Corporation
        title: "Acme Corp Strategy Review",
        type: "strategy-review",
        startTime: new Date(`${todayStr}T11:00:00`),
        endTime: new Date(`${todayStr}T12:00:00`),
        location: "teams",
        status: "confirmed",
        participants: [
          { name: "John Smith", email: "john.smith@acme.com" },
          { name: "Emily Davis", email: "emily.davis@acme.com" },
          { name: "Sarah Johnson", email: "sarah.johnson@yourdomain.com" }
        ],
        agenda: "Review Q3 strategy and discuss expansion plans",
        followUpStatus: "none"
      },
      {
        clientId: 2, // TechStart Inc
        title: "TechStart Product Demo",
        type: "product-demo",
        startTime: new Date(`${todayStr}T13:30:00`),
        endTime: new Date(`${todayStr}T14:30:00`),
        location: "zoom",
        status: "scheduled",
        participants: [
          { name: "Michael Johnson", email: "michael.johnson@techstart.com" },
          { name: "Sarah Johnson", email: "sarah.johnson@yourdomain.com" }
        ],
        agenda: "Demonstrate new features of the platform",
        followUpStatus: "none"
      },
      {
        clientId: 3, // Global Shipping
        title: "Global Shipping Partners",
        type: "partnership-discussion",
        startTime: new Date(`${todayStr}T15:00:00`),
        endTime: new Date(`${todayStr}T16:00:00`),
        location: "in-person",
        status: "scheduled",
        participants: [
          { name: "Robert Chen", email: "robert.chen@globalshipping.com" },
          { name: "Sarah Johnson", email: "sarah.johnson@yourdomain.com" }
        ],
        agenda: "Discuss logistics partnership opportunities",
        followUpStatus: "none"
      }
    ];
    
    // Past meetings
    const pastMeetings = [
      {
        clientId: 1, // Acme Corporation
        title: "Acme Corporation Strategy Review",
        type: "strategy-review",
        startTime: new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
        endTime: new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000), // 1 hour long
        location: "teams",
        status: "completed",
        participants: [
          { name: "John Smith", email: "john.smith@acme.com" },
          { name: "Sarah Johnson", email: "sarah.johnson@yourdomain.com" }
        ],
        agenda: "Initial review of strategy for Q3",
        notes: "Client interested in expanding partnership. Follow up needed on pricing details.",
        followUpStatus: "due-soon",
        followUpDays: 1
      },
      {
        clientId: 2, // TechStart Inc
        title: "TechStart Inc. Contract Negotiation",
        type: "contract-discussion",
        startTime: new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
        endTime: new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000), // 1.5 hours long
        location: "zoom",
        status: "completed",
        participants: [
          { name: "Michael Johnson", email: "michael.johnson@techstart.com" },
          { name: "Sarah Johnson", email: "sarah.johnson@yourdomain.com" }
        ],
        agenda: "Review contract terms and negotiate pricing",
        notes: "Need to follow up with revised proposal",
        followUpStatus: "overdue",
        followUpDays: 2
      },
      {
        clientId: 3, // Global Shipping
        title: "Global Shipping Partnership Discussion",
        type: "partnership-discussion",
        startTime: new Date(today.getTime() - 9 * 24 * 60 * 60 * 1000), // 9 days ago
        endTime: new Date(today.getTime() - 9 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000), // 45 minutes long
        location: "in-person",
        status: "completed",
        participants: [
          { name: "Robert Chen", email: "robert.chen@globalshipping.com" },
          { name: "Sarah Johnson", email: "sarah.johnson@yourdomain.com" }
        ],
        agenda: "Initial partnership discussion",
        notes: "Successful meeting, all follow-ups completed",
        followUpStatus: "completed",
        followUpDays: null
      },
      {
        clientId: 4, // Nova Ventures
        title: "Nova Ventures Investment Opportunity",
        type: "investment-opportunity",
        startTime: new Date(today.getTime() - 12 * 24 * 60 * 60 * 1000), // 12 days ago
        endTime: new Date(today.getTime() - 12 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000), // 1 hour long
        location: "google-meet",
        status: "rescheduled",
        participants: [
          { name: "Sarah Kim", email: "sarah.kim@novaventures.com" },
          { name: "Sarah Johnson", email: "sarah.johnson@yourdomain.com" }
        ],
        agenda: "Present investment opportunity",
        notes: "Rescheduled due to client emergency",
        followUpStatus: "not-required",
        followUpDays: null
      }
    ];
    
    // Add meetings to storage
    [...todayMeetings, ...pastMeetings].forEach(meeting => {
      const id = this.meetingsId++;
      this.meetings.set(id, { 
        ...meeting, 
        id, 
        syncedWithCrm: false,
        createdAt: new Date(meeting.startTime.getTime() - 7 * 24 * 60 * 60 * 1000) // Created 7 days before meeting
      });
      
      // Update client's last meeting date
      const client = this.clients.get(meeting.clientId);
      if (client) {
        // Only update if this meeting is more recent than the client's last meeting
        if (!client.lastMeeting || new Date(meeting.startTime) > new Date(client.lastMeeting)) {
          this.clients.set(client.id, {
            ...client,
            lastMeeting: meeting.startTime
          });
        }
      }
    });
  }
}

export const storage = new MemStorage();
