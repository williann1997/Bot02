import { 
  Collection, 
  InsertCollection, 
  Sale, 
  InsertSale, 
  SetRequest, 
  InsertSetRequest, 
  Ranking, 
  InsertRanking,
  User,
  InsertUser 
} from "@shared/schema";
import { db } from "./database";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Collections
  createCollection(collection: InsertCollection): Promise<Collection>;
  getCollections(): Promise<Collection[]>;
  getCollectionsByUser(userId: string): Promise<Collection[]>;

  // Sales
  createSale(sale: InsertSale): Promise<Sale>;
  getSales(): Promise<Sale[]>;
  getSalesByUser(userId: string): Promise<Sale[]>;

  // Set Requests
  createSetRequest(setRequest: InsertSetRequest): Promise<SetRequest>;
  getSetRequests(): Promise<SetRequest[]>;

  // Rankings
  updateRanking(userId: string, username: string): Promise<void>;
  getRankings(): Promise<Ranking[]>;
}

export class SQLiteStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(id) as User | undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
    return stmt.get(username) as User | undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    const stmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?) RETURNING *');
    return stmt.get(user.username, user.password) as User;
  }

  // Collections
  async createCollection(collection: InsertCollection): Promise<Collection> {
    const stmt = db.prepare(`
      INSERT INTO collections (name, user_id, quantity) 
      VALUES (?, ?, ?) 
      RETURNING *
    `);
    const result = stmt.get(collection.name, collection.userId, collection.quantity) as Collection;
    await this.updateRanking(collection.userId, collection.name);
    return result;
  }

  async getCollections(): Promise<Collection[]> {
    const stmt = db.prepare('SELECT * FROM collections ORDER BY created_at DESC');
    return stmt.all() as Collection[];
  }

  async getCollectionsByUser(userId: string): Promise<Collection[]> {
    const stmt = db.prepare('SELECT * FROM collections WHERE user_id = ? ORDER BY created_at DESC');
    return stmt.all(userId) as Collection[];
  }

  // Sales
  async createSale(sale: InsertSale): Promise<Sale> {
    const stmt = db.prepare(`
      INSERT INTO sales (name, user_id, description, status, total_value) 
      VALUES (?, ?, ?, ?, ?) 
      RETURNING *
    `);
    const result = stmt.get(
      sale.name, 
      sale.userId, 
      sale.description, 
      sale.status, 
      sale.totalValue
    ) as Sale;
    await this.updateRanking(sale.userId, sale.name);
    return result;
  }

  async getSales(): Promise<Sale[]> {
    const stmt = db.prepare('SELECT * FROM sales ORDER BY created_at DESC');
    return stmt.all() as Sale[];
  }

  async getSalesByUser(userId: string): Promise<Sale[]> {
    const stmt = db.prepare('SELECT * FROM sales WHERE user_id = ? ORDER BY created_at DESC');
    return stmt.all(userId) as Sale[];
  }

  // Set Requests
  async createSetRequest(setRequest: InsertSetRequest): Promise<SetRequest> {
    const stmt = db.prepare(`
      INSERT INTO set_requests (user_id, username) 
      VALUES (?, ?) 
      RETURNING *
    `);
    return stmt.get(setRequest.userId, setRequest.username) as SetRequest;
  }

  async getSetRequests(): Promise<SetRequest[]> {
    const stmt = db.prepare('SELECT * FROM set_requests ORDER BY created_at DESC');
    return stmt.all() as SetRequest[];
  }

  // Rankings
  async updateRanking(userId: string, username: string): Promise<void> {
    // Get current stats
    const collectionsStmt = db.prepare('SELECT COUNT(*) as count FROM collections WHERE user_id = ?');
    const salesStmt = db.prepare('SELECT COUNT(*) as count, COALESCE(SUM(total_value), 0) as total FROM sales WHERE user_id = ?');
    
    const collectionsResult = collectionsStmt.get(userId) as { count: number };
    const salesResult = salesStmt.get(userId) as { count: number; total: number };

    // Update or insert ranking
    const upsertStmt = db.prepare(`
      INSERT INTO rankings (user_id, username, total_collections, total_sales, total_value, updated_at)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id) DO UPDATE SET
        username = excluded.username,
        total_collections = excluded.total_collections,
        total_sales = excluded.total_sales,
        total_value = excluded.total_value,
        updated_at = excluded.updated_at
    `);

    upsertStmt.run(
      userId,
      username,
      collectionsResult.count,
      salesResult.count,
      salesResult.total
    );
  }

  async getRankings(): Promise<Ranking[]> {
    const stmt = db.prepare(`
      SELECT * FROM rankings 
      ORDER BY (total_collections + total_sales) DESC, total_value DESC
    `);
    return stmt.all() as Ranking[];
  }
}

export const storage = new SQLiteStorage();
