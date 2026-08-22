import fs from 'fs';
import path from 'path';
import { SEED_USERS, SEED_CATEGORIES, SEED_PRODUCTS, SEED_COUPONS, SEED_PROMOTIONS } from '@ecom/contracts';

const DATA_DIR = path.join(__dirname, '..', '..', 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export class JsonDbStore<T extends { id?: string; _id?: string }> {
  private filePath: string;
  private data: T[] = [];

  constructor(filename: string, seedData?: T[]) {
    this.filePath = path.join(DATA_DIR, filename);
    this.load(seedData);
  }

  private load(seedData?: T[]) {
    if (fs.existsSync(this.filePath)) {
      try {
        const fileContent = fs.readFileSync(this.filePath, 'utf-8');
        this.data = JSON.parse(fileContent);
      } catch (err) {
        console.error(`Error reading ${this.filePath}, resetting to empty/seed.`, err);
        this.data = seedData || [];
        this.save();
      }
    } else {
      this.data = seedData || [];
      this.save();
    }
  }

  public save() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error(`Failed to save database file ${this.filePath}`, err);
    }
  }

  public getAll(): T[] {
    return [...this.data];
  }

  public find(predicate: (item: T) => boolean): T[] {
    return this.data.filter(predicate);
  }

  public findOne(predicate: (item: T) => boolean): T | undefined {
    return this.data.find(predicate);
  }

  public findById(id: string): T | undefined {
    return this.data.find(item => (item.id === id || item._id === id));
  }

  public insert(item: Omit<T, 'id' | '_id' | 'createdAt' | 'updatedAt'> & { id?: string; _id?: string }): T {
    const timestamp = new Date().toISOString();
    const id = item.id || item._id || Math.random().toString(36).substring(2, 11);
    
    const record = {
      ...item,
      id,
      _id: id,
      createdAt: timestamp,
      updatedAt: timestamp,
    } as unknown as T;

    this.data.push(record);
    this.save();
    return record;
  }

  public update(id: string, updates: Partial<T>): T | null {
    const idx = this.data.findIndex(item => (item.id === id || item._id === id));
    if (idx === -1) return null;

    const record = {
      ...this.data[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.data[idx] = record;
    this.save();
    return record;
  }

  public delete(id: string): boolean {
    const idx = this.data.findIndex(item => (item.id === id || item._id === id));
    if (idx === -1) return false;

    this.data.splice(idx, 1);
    this.save();
    return true;
  }

  public deleteMany(predicate: (item: T) => boolean): number {
    const beforeCount = this.data.length;
    this.data = this.data.filter(item => !predicate(item));
    this.save();
    return beforeCount - this.data.length;
  }
}

// Instantiate database tables with seed fallbacks
export const jsonUsers = new JsonDbStore<any>('users.json', SEED_USERS as any);
export const jsonAddresses = new JsonDbStore<any>('addresses.json', []);
export const jsonCategories = new JsonDbStore<any>('categories.json', SEED_CATEGORIES as any);
export const jsonProducts = new JsonDbStore<any>('products.json', SEED_PRODUCTS as any);
export const jsonCarts = new JsonDbStore<any>('carts.json', []);
export const jsonWishlists = new JsonDbStore<any>('wishlists.json', []);
export const jsonCoupons = new JsonDbStore<any>('coupons.json', SEED_COUPONS as any);
export const jsonOrders = new JsonDbStore<any>('orders.json', []);
export const jsonReviews = new JsonDbStore<any>('reviews.json', []);
export const jsonPromotions = new JsonDbStore<any>('promotions.json', SEED_PROMOTIONS as any);
export const jsonAuditLogs = new JsonDbStore<any>('auditLogs.json', []);
export const jsonSessions = new JsonDbStore<any>('sessions.json', []);
