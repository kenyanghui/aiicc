// ============================================================
// AIICC 通用数据库接口
// 本地开发: Prisma + SQLite（持久化写入文件）
// Netlify Lambda: 内存存储（热期间持续，冷启动后重置）
// ============================================================

// ---------- 内存存储层 ----------

class MemoryStore {
  phaseOutputs = new Map<string, any>();
  chatMessages = new Map<string, any[]>();
  documents = new Map<string, any>();

  // === PhaseOutput ===
  getOutputs(projectId: string, phase?: number, step?: number) {
    return Array.from(this.phaseOutputs.values()).filter(o => {
      if (o.projectId !== projectId) return false;
      if (phase !== undefined && o.phase !== phase) return false;
      if (step !== undefined && o.step !== step) return false;
      return true;
    });
  }

  upsertOutput(projectId: string, phase: number, step: number, outputType: string, content: string, aiRoleUsed: string) {
    const key = `${projectId}-${phase}-${step}`;
    const existing = this.phaseOutputs.get(key);
    if (existing) {
      const updated = { ...existing, outputType, content, aiRoleUsed };
      this.phaseOutputs.set(key, updated);
      return updated;
    }
    const created = {
      id: `mem-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      projectId, phase, step, outputType, content, aiRoleUsed,
      createdAt: new Date().toISOString(),
    };
    this.phaseOutputs.set(key, created);
    return created;
  }

  // === ChatMessage ===
  getMessages(projectId: string, phase?: number, step?: number) {
    const msgs = this.chatMessages.get(projectId) || [];
    return msgs.filter(m => {
      if (phase !== undefined && m.phase !== phase) return false;
      if (step !== undefined && m.step !== step) return false;
      return true;
    }).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  addMessage(msg: any) {
    const list = this.chatMessages.get(msg.projectId) || [];
    const newMsg = { ...msg, id: msg.id || `mem-${Date.now()}`, createdAt: new Date().toISOString() };
    this.chatMessages.set(msg.projectId, [...list, newMsg]);
    return newMsg;
  }

  // === Document ===
  getDocuments(projectId: string) {
    return Array.from(this.documents.values()).filter(d => d.projectId === projectId);
  }

  getDocument(id: string) {
    for (const [, val] of this.documents) if (val.id === id) return val;
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
      id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      projectId, docType, title, content, status: 'draft',
      createdAt: now, updatedAt: now,
    };
    this.documents.set(key, created);
    return created;
  }

  updateDocumentStatus(id: string, status: string) {
    for (const [, val] of this.documents) {
      if (val.id === id) { val.status = status; val.updatedAt = new Date().toISOString(); return val; }
    }
    return null;
  }

  deleteDocument(id: string) {
    for (const [key, val] of this.documents) {
      if (val.id === id) { this.documents.delete(key); return true; }
    }
    return false;
  }
}

// ---------- 全局单例 ----------

const globalForDb = globalThis as unknown as {
  __memStore: MemoryStore;
  __prisma: any;
  __dbAvailable: boolean;
};

if (!globalForDb.__memStore) globalForDb.__memStore = new MemoryStore();

// 尝试初始化 Prisma（可能失败）
let prisma: any = null;
let prismaAvailable = false;

try {
  // 动态导入避免在 import 阶段崩溃
  const { PrismaClient } = require('@prisma/client');
  prisma = globalForDb.__prisma ?? new PrismaClient();
  globalForDb.__prisma = prisma;
  prismaAvailable = true;
} catch (e) {
  console.warn('[DB] SQLite/Prisma not available, using memory store.');
  prismaAvailable = false;
}

const mem = globalForDb.__memStore;

// ---------- 统一导出 API ----------

export const db = {
  /** 当前是否使用 Prisma + SQLite（持久化） */
  isPersistent: prismaAvailable,

  // === PhaseOutput API ===
  async getOutputs(projectId: string, phase?: number, step?: number) {
    if (prismaAvailable) {
      try {
        const where: any = { projectId };
        if (phase !== undefined) where.phase = phase;
        if (step !== undefined) where.step = step;
        const outputs = await prisma.phaseOutput.findMany({ where, orderBy: [{ phase: 'asc' }, { step: 'asc' }] });
        const latest = new Map<string, any>();
        for (const o of outputs) {
          const key = `${o.phase}-${o.step}`;
          if (!latest.has(key)) latest.set(key, o);
        }
        return Array.from(latest.values());
      } catch { /* fall through to memory */ }
    }
    return mem.getOutputs(projectId, phase, step);
  },

  async upsertOutput(projectId: string, phase: number, step: number, outputType: string, content: string, aiRoleUsed: string) {
    if (prismaAvailable) {
      try {
        const existing = await prisma.phaseOutput.findFirst({ where: { projectId, phase, step } });
        if (existing) {
          return await prisma.phaseOutput.update({
            where: { id: existing.id },
            data: { content, outputType, aiRoleUsed },
          });
        }
        return await prisma.phaseOutput.create({
          data: { projectId, phase, step, outputType, content, aiRoleUsed: aiRoleUsed || '' },
        });
      } catch { /* fall through */ }
    }
    return mem.upsertOutput(projectId, phase, step, outputType, content, aiRoleUsed);
  },

  // === ChatMessage API ===
  async getMessages(projectId: string, phase?: number, step?: number) {
    if (prismaAvailable) {
      try {
        const where: any = { projectId };
        if (phase !== undefined) where.phase = phase;
        if (step !== undefined) where.step = step;
        return await prisma.chatMessage.findMany({ where, orderBy: { createdAt: 'asc' }, take: 200 });
      } catch { /* fall through */ }
    }
    return mem.getMessages(projectId, phase, step);
  },

  async addMessage(projectId: string, phase: number, step: number, role: string, content: string, aiRole?: string | null) {
    if (prismaAvailable) {
      try {
        return await prisma.chatMessage.create({
          data: { projectId, phase, step, role, aiRole: aiRole || null, content },
        });
      } catch { /* fall through */ }
    }
    return mem.addMessage({ projectId, phase, step, role, aiRole, content });
  },

  // === Document API ===
  async getDocuments(projectId: string) {
    if (prismaAvailable) {
      try {
        return await prisma.document.findMany({ where: { projectId }, orderBy: { createdAt: 'desc' } });
      } catch { /* fall through */ }
    }
    return mem.getDocuments(projectId);
  },

  async getDocument(id: string) {
    if (prismaAvailable) {
      try {
        return await prisma.document.findUnique({ where: { id } });
      } catch { /* fall through */ }
    }
    return mem.getDocument(id);
  },

  async upsertDocument(projectId: string, docType: string, title: string, content: string) {
    if (prismaAvailable) {
      try {
        const existing = await prisma.document.findUnique({
          where: { projectId_docType: { projectId, docType } },
        });
        if (existing) {
          return await prisma.document.update({
            where: { id: existing.id },
            data: { content, title, status: 'draft' },
          });
        }
        return await prisma.document.create({
          data: { projectId, docType, title, content, status: 'draft' },
        });
      } catch { /* fall through */ }
    }
    return mem.upsertDocument(projectId, docType, title, content);
  },

  async updateDocumentStatus(id: string, status: string) {
    if (prismaAvailable) {
      try {
        return await prisma.document.update({ where: { id }, data: { status } });
      } catch { /* fall through */ }
    }
    return mem.updateDocumentStatus(id, status);
  },

  async deleteDocument(id: string) {
    if (prismaAvailable) {
      try {
        await prisma.document.delete({ where: { id } });
        return true;
      } catch { return false; }
    }
    return mem.deleteDocument(id);
  },
};
