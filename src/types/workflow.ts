// ============================================================
// AIICC 工作流类型定义
// ============================================================

import { AIRole } from './chat';

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

export interface WorkflowPhase {
  id: number;
  name: string;
  icon: string;
  description: string;
  steps: WorkflowStep[];
}
