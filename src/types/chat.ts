// ============================================================
// AIICC AI 对话类型定义
// ============================================================

export type AIRole = 'socrates' | 'analyst' | 'creative' | 'architect' | 'reviewer';

export const AIRoleMeta: Record<AIRole, { label: string; color: string; emoji: string }> = {
  socrates:  { label: '苏格拉底', color: '#8B5CF6', emoji: '🎭' },
  analyst:   { label: '分析师',   color: '#3B82F6', emoji: '📊' },
  creative:  { label: '创意伙伴', color: '#F59E0B', emoji: '✨' },
  architect: { label: '架构师',   color: '#10B981', emoji: '🏗️' },
  reviewer:  { label: '审查官',   color: '#EF4444', emoji: '🔍' },
};

export interface ChatMessage {
  id: string;
  projectId: string;
  phase: number;
  step: number;
  role: 'ai' | 'student';
  aiRole?: AIRole;
  content: string;
  createdAt: string;
}
