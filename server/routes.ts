import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertClientSchema, insertMeetingSchema, insertCrmIntegrationSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Error handler middleware for Zod validation errors
  const validateRequest = (schema: z.ZodType<any, any>) => {
    return (req: Request, res: Response, next: Function) => {
      try {
        req.body = schema.parse(req.body);
        next();
      } catch (error) {
        if (error instanceof ZodError) {
          const validationError = fromZodError(error);
          res.status(400).json({ 
            error: "Validation error", 
            details: validationError.message 
          });
        } else {
          next(error);
        }
      }
    };
  };

  // API Routes
  // Clients
  app.get("/api/clients", async (_req, res) => {
    try {
      const clients = await storage.getClients();
      res.json(clients);
    } catch (error) {
      console.error("Error getting clients:", error);
      res.status(500).json({ error: "Failed to retrieve clients" });
    }
  });

  app.get("/api/clients/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid client ID" });
      }
      
      const client = await storage.getClient(id);
      if (!client) {
        return res.status(404).json({ error: "Client not found" });
      }
      
      res.json(client);
    } catch (error) {
      console.error("Error getting client:", error);
      res.status(500).json({ error: "Failed to retrieve client" });
    }
  });

  app.post("/api/clients", validateRequest(insertClientSchema), async (req, res) => {
    try {
      const client = await storage.createClient(req.body);
      res.status(201).json(client);
    } catch (error) {
      console.error("Error creating client:", error);
      res.status(500).json({ error: "Failed to create client" });
    }
  });

  app.patch("/api/clients/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid client ID" });
      }
      
      const client = await storage.updateClient(id, req.body);
      if (!client) {
        return res.status(404).json({ error: "Client not found" });
      }
      
      res.json(client);
    } catch (error) {
      console.error("Error updating client:", error);
      res.status(500).json({ error: "Failed to update client" });
    }
  });

  // Meetings
  app.get("/api/meetings", async (_req, res) => {
    try {
      const meetings = await storage.getMeetings();
      res.json(meetings);
    } catch (error) {
      console.error("Error getting meetings:", error);
      res.status(500).json({ error: "Failed to retrieve meetings" });
    }
  });

  app.get("/api/meetings/upcoming", async (_req, res) => {
    try {
      const meetings = await storage.getUpcomingMeetings();
      res.json(meetings);
    } catch (error) {
      console.error("Error getting upcoming meetings:", error);
      res.status(500).json({ error: "Failed to retrieve upcoming meetings" });
    }
  });

  app.get("/api/meetings/history", async (_req, res) => {
    try {
      const meetings = await storage.getMeetingHistory();
      res.json(meetings);
    } catch (error) {
      console.error("Error getting meeting history:", error);
      res.status(500).json({ error: "Failed to retrieve meeting history" });
    }
  });

  app.get("/api/meetings/calendar", async (_req, res) => {
    try {
      const meetings = await storage.getMeetings();
      res.json(meetings);
    } catch (error) {
      console.error("Error getting calendar meetings:", error);
      res.status(500).json({ error: "Failed to retrieve calendar meetings" });
    }
  });

  app.get("/api/meetings/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid meeting ID" });
      }
      
      const meeting = await storage.getMeeting(id);
      if (!meeting) {
        return res.status(404).json({ error: "Meeting not found" });
      }
      
      res.json(meeting);
    } catch (error) {
      console.error("Error getting meeting:", error);
      res.status(500).json({ error: "Failed to retrieve meeting" });
    }
  });

  app.post("/api/meetings", validateRequest(insertMeetingSchema), async (req, res) => {
    try {
      const meeting = await storage.createMeeting(req.body);
      res.status(201).json(meeting);
    } catch (error) {
      console.error("Error creating meeting:", error);
      res.status(500).json({ error: "Failed to create meeting" });
    }
  });

  app.patch("/api/meetings/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid meeting ID" });
      }
      
      const meeting = await storage.updateMeeting(id, req.body);
      if (!meeting) {
        return res.status(404).json({ error: "Meeting not found" });
      }
      
      res.json(meeting);
    } catch (error) {
      console.error("Error updating meeting:", error);
      res.status(500).json({ error: "Failed to update meeting" });
    }
  });

  // Meeting Types
  app.get("/api/meeting-types", async (_req, res) => {
    try {
      const meetingTypes = await storage.getMeetingTypes();
      res.json(meetingTypes);
    } catch (error) {
      console.error("Error getting meeting types:", error);
      res.status(500).json({ error: "Failed to retrieve meeting types" });
    }
  });

  // CRM Integrations
  app.get("/api/crm/status", async (_req, res) => {
    try {
      const crmIntegrations = await storage.getCrmIntegrations();
      res.json(crmIntegrations);
    } catch (error) {
      console.error("Error getting CRM integrations:", error);
      res.status(500).json({ error: "Failed to retrieve CRM integrations" });
    }
  });

  app.post("/api/crm/connect", validateRequest(insertCrmIntegrationSchema), async (req, res) => {
    try {
      const integration = await storage.createCrmIntegration(req.body);
      res.status(201).json(integration);
    } catch (error) {
      console.error("Error creating CRM integration:", error);
      res.status(500).json({ error: "Failed to create CRM integration" });
    }
  });

  app.patch("/api/crm/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid integration ID" });
      }
      
      const integration = await storage.updateCrmIntegration(id, req.body);
      if (!integration) {
        return res.status(404).json({ error: "Integration not found" });
      }
      
      res.json(integration);
    } catch (error) {
      console.error("Error updating CRM integration:", error);
      res.status(500).json({ error: "Failed to update CRM integration" });
    }
  });

  // Stats endpoint
  app.get("/api/stats", async (_req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      console.error("Error getting stats:", error);
      res.status(500).json({ error: "Failed to retrieve stats" });
    }
  });

  // Reports
  app.get("/api/reports", async (req, res) => {
    try {
      const timeRange = req.query.timeRange as string || 'month';
      
      // Mock report data structure
      const reportData = {
        summary: {
          totalMeetings: 32,
          totalMeetingsChange: 12,
          averageDuration: 45,
          averageDurationChange: 5,
          completionRate: 92,
          completionRateChange: 3
        },
        byTime: [
          { name: 'Week 1', scheduled: 10, completed: 9 },
          { name: 'Week 2', scheduled: 8, completed: 7 },
          { name: 'Week 3', scheduled: 12, completed: 11 },
          { name: 'Week 4', scheduled: 6, completed: 5 }
        ],
        byClient: [
          { name: 'Acme Corp', value: 12, color: '#4f46e5' },
          { name: 'TechStart', value: 8, color: '#22c55e' },
          { name: 'Global Shipping', value: 6, color: '#f59e0b' },
          { name: 'Nova Ventures', value: 4, color: '#ef4444' },
          { name: 'Others', value: 2, color: '#94a3b8' }
        ],
        byType: [
          { name: 'Strategy Review', value: 10, color: '#4f46e5' },
          { name: 'Contract Discussion', value: 8, color: '#22c55e' },
          { name: 'Partnership', value: 7, color: '#f59e0b' },
          { name: 'Product Demo', value: 5, color: '#ef4444' },
          { name: 'Introduction', value: 2, color: '#94a3b8' }
        ]
      };
      
      res.json(reportData);
    } catch (error) {
      console.error("Error getting reports:", error);
      res.status(500).json({ error: "Failed to retrieve reports" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
