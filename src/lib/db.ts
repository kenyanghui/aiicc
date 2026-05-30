// ============================================================
// AIICC 数据存储层
// 使用内存 Map 存储（兼容 Netlify Lambda 无持久化环境）
// 数据在 Lambda 热期间持续，冷启动后重置
// ============================================================

// ===== 内存存储 =====

class MemoryStore {
  phaseOutputs = new Map<string, any>();
  chatMessages = new Map<string, any[]>();
  documents = new Map<string, any>();

  // === PhaseOutput ===
  getOutputs(projectId: string, phase?: number, step?: number): any[] {
    return Array.from(this.phaseOutputs.values()).filter((o: any) => {
      if (o.projectId !== projectId) return false;
      if (phase !== undefined && o.phase !== phase) return false;
      if (step !== undefined && o.step !== step) return false;
      return true;
    });
  }

  upsertOutput(projectId: string, phase: number, step: number, outputType: string, content: string, aiRoleUsed: string): any {
    const key = `${projectId}-${phase}-${step}`;
    const existing = this.phaseOutputs.get(key);
    if (existing) {
      const updated = { ...existing, outputType, content, aiRoleUsed };
      this.phaseOutputs.set(key, updated);
      return updated;
    }
    const created = {
      id: `out-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      projectId, phase, step, outputType, content, aiRoleUsed,
      createdAt: new Date().toISOString(),
    };
    this.phaseOutputs.set(key, created);
    return created;
  }

  // === ChatMessage ===
  getMessages(projectId: string, phase?: number, step?: number): any[] {
    const msgs = this.chatMessages.get(projectId) || [];
    return msgs.filter((m: any) => {
      if (phase !== undefined && m.phase !== phase) return false;
      if (step !== undefined && m.step !== step) return false;
      return true;
    }).sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  addMessage(projectId: string, phase: number, step: number, role: string, content: string, aiRole?: string | null): any {
    const list = this.chatMessages.get(projectId) || [];
    const newMsg: any = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      projectId, phase, step, role, content,
      aiRole: aiRole || null,
      createdAt: new Date().toISOString(),
    };
    this.chatMessages.set(projectId, [...list, newMsg]);
    return newMsg;
  }

  // === Document ===
  getDocuments(projectId: string): any[] {
    return Array.from(this.documents.values()).filter((d: any) => d.projectId === projectId);
  }

  getDocument(id: string): any {
    for (const [, val] of this.documents) if (val.id === id) return val;
    return null;
  }

  upsertDocument(projectId: string, docType: string, title: string, content: string): any {
    const key = `${projectId}-${docType}`;
    const existing = this.documents.get(key);
    const now = new Date().toISOString();
    if (existing) {
      const updated = { ...existing, title, content, status: 'draft', updatedAt: now };
      this.documents.set(key, updated);
      return updated;
    }
    const created: any = {
      id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      projectId, docType, title, content, status: 'draft',
      createdAt: now, updatedAt: now,
    };
    this.documents.set(key, created);
    return created;
  }

  updateDocumentStatus(id: string, status: string): any {
    for (const [, val] of this.documents) {
      if (val.id === id) { val.status = status; val.updatedAt = new Date().toISOString(); return val; }
    }
    return null;
  }

  deleteDocument(id: string): boolean {
    for (const [key, val] of this.documents) {
      if (val.id === id) { this.documents.delete(key); return true; }
    }
    return false;
  }
}

// ===== 全局单例 =====

const globalForDb = globalThis as unknown as { __memStore: MemoryStore };
if (!globalForDb.__memStore) globalForDb.__memStore = new MemoryStore();
const mem = globalForDb.__memStore;

// ===== 统一导出 API =====

type OutputItem = { projectId: string; phase: number; step: number; outputType: string; content: string; aiRoleUsed: string; [key: string]: any };
type DocItem = { id: string; projectId: string; docType: string; title: string; content: string; status: string; [key: string]: any };

export const db = {
  /** 是否有持久化数据库（当前仅内存模式） */
  isPersistent: false,

  // === PhaseOutput ===
  getOutputs(projectId: string, phase?: number, step?: number): Promise<OutputItem[]> {
    return Promise.resolve(mem.getOutputs(projectId, phase, step));
  },

  upsertOutput(projectId: string, phase: number, step: number, outputType: string, content: string, aiRoleUsed: string): Promise<any> {
    return Promise.resolve(mem.upsertOutput(projectId, phase, step, outputType, content, aiRoleUsed));
  },

  // === ChatMessage ===
  getMessages(projectId: string, phase?: number, step?: number): Promise<any[]> {
    return Promise.resolve(mem.getMessages(projectId, phase, step));
  },

  addMessage(projectId: string, phase: number, step: number, role: string, content: string, aiRole?: string | null): Promise<any> {
    return Promise.resolve(mem.addMessage(projectId, phase, step, role, content, aiRole));
  },

  // === Document ===
  getDocuments(projectId: string): Promise<any[]> {
    return Promise.resolve(mem.getDocuments(projectId));
  },

  getDocument(id: string): Promise<any> {
    return Promise.resolve(mem.getDocument(id));
  },

  upsertDocument(projectId: string, docType: string, title: string, content: string): Promise<any> {
    return Promise.resolve(mem.upsertDocument(projectId, docType, title, content));
  },

  updateDocumentStatus(id: string, status: string): Promise<any> {
    return Promise.resolve(mem.updateDocumentStatus(id, status));
  },

  deleteDocument(id: string): Promise<boolean> {
    return Promise.resolve(mem.deleteDocument(id));
  },
};
