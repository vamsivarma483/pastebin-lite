import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

interface Paste {
  id: string;
  content: string;
  createdAt: Date;
  expiresAt: Date | null;
  maxViews: number | null;
  viewCount: number;
}

// Path to pastes.json - use dynamic resolution to work in both dev and prod
let dbFile: string;
if (process.env.NODE_ENV === 'production' || __dirname.includes('dist')) {
  // In production/compiled mode: dist/prisma/../../pastes.json -> backend/pastes.json
  dbFile = path.join(__dirname, '../../pastes.json');
} else {
  // In dev mode: src/prisma/../../pastes.json -> backend/pastes.json
  dbFile = path.join(__dirname, '../../pastes.json');
}

function loadDatabase(): Record<string, Paste> {
  try {
    if (fs.existsSync(dbFile)) {
      const raw = JSON.parse(fs.readFileSync(dbFile, 'utf-8'));
      // Convert date strings back to Date objects
      Object.values(raw).forEach((paste: any) => {
        if (paste.createdAt) paste.createdAt = new Date(paste.createdAt);
        if (paste.expiresAt) paste.expiresAt = new Date(paste.expiresAt);
      });
      return raw;
    }
  } catch (error) {
    console.error('Error loading database:', error);
  }
  return {};
}

function saveDatabase(data: Record<string, Paste>) {
  try {
    fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving database:', error);
  }
}

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    console.log('✅ Database initialized (using JSON file storage for demo)');
  }

  async onModuleDestroy() {
    console.log('Shutting down database connection');
  }

  get paste() {
    return {
      create: async (data: { data: { content: string; expiresAt: Date | null; maxViews: number | null } }) => {
        const id = Math.random().toString(36).substring(7);
        const db = loadDatabase();
        const paste: Paste = {
          id,
          content: data.data.content,
          createdAt: new Date(),
          expiresAt: data.data.expiresAt,
          maxViews: data.data.maxViews,
          viewCount: 0,
        };
        db[id] = paste;
        saveDatabase(db);
        return paste;
      },
      findUnique: async (query: { where: { id: string } }) => {
        const db = loadDatabase();
        return db[query.where.id] || null;
      },
      update: async (query: { where: { id: string }; data: { viewCount: number } }) => {
        const db = loadDatabase();
        const paste = db[query.where.id];
        if (paste) {
          paste.viewCount = query.data.viewCount;
          saveDatabase(db);
        }
        return paste;
      },
    };
  }

  async $queryRaw(query: any) {
    return { ok: true };
  }
}
