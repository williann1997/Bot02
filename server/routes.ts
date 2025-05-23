import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for web dashboard (optional)
  
  // Get all collections
  app.get('/api/collections', async (req, res) => {
    try {
      const collections = await storage.getCollections();
      res.json(collections);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch collections' });
    }
  });

  // Get all sales
  app.get('/api/sales', async (req, res) => {
    try {
      const sales = await storage.getSales();
      res.json(sales);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch sales' });
    }
  });

  // Get rankings
  app.get('/api/rankings', async (req, res) => {
    try {
      const rankings = await storage.getRankings();
      res.json(rankings);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch rankings' });
    }
  });

  // Get set requests
  app.get('/api/set-requests', async (req, res) => {
    try {
      const setRequests = await storage.getSetRequests();
      res.json(setRequests);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch set requests' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
