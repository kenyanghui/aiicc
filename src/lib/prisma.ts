// ============================================================
// 多策略数据存储 — Prisma (SQLite) + 内存回退
// 本地开发用 SQLite 持久化，Netlify Lambda 降级为内存存储
// ============================================================

import { PrismaClient } from '@prisma/client';

// 内存存储（用于 Lambda/Serverless 环境）
// 当 SQLite 不可用时自动启用，数据在 Lambda 热期间持续
class MemoryStore {
  phaseOutputs: Map<string, any> = new Map();
  chatMessages: Map<string, any[]> = new Map();
  documents: Map<string, any> = new Map();

  // PhaseOutput CRUD
  getOutput(projectId: string, phase?: number, step?: number) {
    const results: any[] = [];
    for (const [, val] of this.phaseOutputs) {
      if (val.projectId === projectId) {
        if (phase !== undefined && val.phase !== phase) continue;
        if (step !== undefined && val.step !== step) continue;
        results.push(val);
      }
    }
    return results;
  }

  upsertOutput(projectId: string, phase: number, step: number, outputType: string, content: string, aiRoleUsed: string) {
    const key = `${projectId}-${phase}-${step}`;
    const existing = this.phaseOutputs.get(key);
    const now = new Date().toISOString();
    if (existing) {
      const updated = { ...existing, outputType, content, aiRoleUsed };
      this.phaseOutputs.set(key, updated);
      return updated;
    }
    const created = {
      id: `mem-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      projectId,
      phase,
      step,
      outputType,
      content,
      aiRoleUsed,
      createdAt: now,
    };
    this.phaseOutputs.set(key, created);
    return created;
  }

  // ChatMessage CRUD
  getMessages(projectId: string, phase?: number, step?: number) {
    let msgs = this.chatMessages.get(projectId) || [];
    if (phase !== undefined) msgs = msgs.filter((m: any) => m.phase === phase);
    if (step !== undefined) msgs = msgs.filter((m: any) => m.step === step);
    return msgs.sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  addMessage(msg: any) {
    const key = msg.projectId;
    const existing = this.chatMessages.get(key) || [];
    const now = new Date().toISOString();
    const newMsg = { ...msg, id: msg.id || `mem-${Date.now()}`, createdAt: now };
    this.chatMessages.set(key, [...existing, newMsg]);
    return newMsg;
  }

  // Document CRUD
  getDocuments(projectId: string) {
    const results: any[] = [];
    for (const [, val] of this.documents) {
      if (val.projectId === projectId) results.push(val);
    }
    return results;
  }

  getDocument(id: string) {
    for (const [, val] of this.documents) {
      if (val.id === id) return val;
    }
    return null;
  }

  upsertDocument(projectId: string, docType: string, title: string, content: string) {
    const key = `${projectId}-${docType}`;
    const existing = this.documents.get(key);
    const now = new Date().toISOString();
    if (existing) {
      const updated = { ...existing, title, content, status: 'draft', updatedAt: now };
      this.documents.set(key, updated);
      return updated;
    }
    const created = {
      id: `doc-${Date.now()}`,
      projectId,
      docType,
      title,
      content,
      status: 'draft',
      createdAt: now,
      updatedAt: now,
    };
    this.documents.set(key, created);
    return created;
  }

  updateDocumentStatus(id: string, status: string) {
    for (const [, val] of this.documents) {
      if (val.id === id) {
        val.status = status;
        val.updatedAt = new Date().toISOString();
        return val;
      }
    }
    return null;
  }

  // Project CRUD
  getProject(id: string) {
    for (const [, val] of this.documents) {
      // dummy
    }
    return null;
  }
}

// 全局实例
const globalForStore = globalThis as unknown as { memStore: MemoryStore; prisma: PrismaClient | null; dbAvailable: boolean };
if (!globalForStore.memStore) globalForStore.memStore = new MemoryStore();

let prisma: PrismaClient | null = null;
let dbAvailable = false;

// 尝试初始化 Prisma
try {
  prisma = globalForStore.prisma ?? new PrismaClient();
  globalForStore.prisma = prisma;
  if (process.env.NODE_ENV !== 'production') globalForStore.prisma = prisma;
  dbAvailable = true;
} catch (e) {
  console.warn('[DB] Prisma init failed, using memory store:', (e as Error).message);
  dbAvailable = false;
}

// 导出统一数据接口
export const db = {
  available: dbAvailable,
  prisma: prisma as PrismaClient,
  mem: globalForStore.memStore,
};

export { prisma, dbAvailable };
