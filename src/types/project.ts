// ============================================================
// AIICC 项目类型定义
// ============================================================

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
  coachNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PhaseOutput {
  id: string;
  projectId: string;
  phase: number;
  step: number;
  outputType: string;
  content: string;
  aiRoleUsed: string;
  createdAt: string;
}
