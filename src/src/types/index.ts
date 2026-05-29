// ============================================================
// AIICC 核心类型定义
// ============================================================

// AI 角色
export type AIRole = 'socrates' | 'analyst' | 'creative' | 'architect' | 'reviewer';

export const AIRoleMeta: Record<AIRole, { label: string; color: string; emoji: string }> = {
  socrates:  { label: '苏格拉底', color: '#8B5CF6', emoji: '🎭' },
  analyst:   { label: '分析师',   color: '#3B82F6', emoji: '📊' },
  creative:  { label: '创意伙伴', color: '#F59E0B', emoji: '✨' },
  architect: { label: '架构师',   color: '#10B981', emoji: '🏗️' },
  reviewer:  { label: '审查官',   color: '#EF4444', emoji: '🔍' },
};

// 工作流步骤
export interface WorkflowStep {
  id: string;
  phase: number;
  step: number;
  title: string;
  description: string;
  aiRole: AIRole;
  outputType: 'text' | 'canvas' | 'list';
  promptHint: string;
}

// 工作流阶段
export interface WorkflowPhase {
  id: number;
  name: string;
  icon: string;
  description: string;
  steps: WorkflowStep[];
}

// 项目
export interface Project {
  id: string;
  studentName: string;
  studentAge: number;
  projectName: string;
  description: string;
  sdgGoal?: string;
  currentPhase: number;
  currentStep: number;
  status: 'active' | 'paused' | 'completed';
  createdAt: string;
  updatedAt: string;
}

// 对话消息
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

// 阶段产出
export interface PhaseOutput {
  id: string;
  projectId: string;
  phase: number;
  step: number;
  outputType: string;
  content: string;
  aiRoleUsed: AIRole;
  createdAt: string;
}
