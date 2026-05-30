'use client';

import { workflowPhases } from '@/lib/workflow';

interface Props {
  currentPhase: number;
  currentStep: number;
  onNavigate: (phase: number, step: number) => void;
}

export default function WorkflowSidebar({ currentPhase, currentStep, onNavigate }: Props) {
  return (
    <nav className="flex h-full flex-col overflow-y-auto border-r border-white/[0.06] bg-white/[0.02]">
      <div className="border-b border-white/[0.06] p-4">
        <h2 className="text-sm font-semibold text-cyan-400">项目工作流</h2>
        <p className="mt-0.5 text-[10px] text-slate-500">5 阶段 · 20 步骤</p>
      </div>

      <div className="flex-1 space-y-1 p-3">
        {workflowPhases.map(phase => {
          const isActive = phase.id === currentPhase;
          const isPast = phase.id < currentPhase;
          const progress = phase.steps.filter(s => {
            if (phase.id < currentPhase) return true;
            if (phase.id === currentPhase) return s.step <= currentStep;
            return false;
          }).length;

          return (
            <div key={phase.id}>
              {/* 阶段标题 */}
              <button
                onClick={() => onNavigate(phase.id, 1)}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium transition ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-300'
                    : isPast
                      ? 'text-slate-300'
                      : 'text-slate-500'
                }`}
              >
                <span className="text-base">{phase.icon}</span>
                <span className="flex-1">{phase.name}</span>
                {isPast && <span className="text-green-400">✓</span>}
                {isActive && (
                  <span className="rounded-full bg-cyan-500/20 px-1.5 py-0.5 text-[10px] text-cyan-300">
                    {progress}/{phase.steps.length}
                  </span>
                )}
              </button>

              {/* 步骤列表（仅当前阶段展开） */}
              {isActive && (
                <div className="ml-4 mt-1 space-y-0.5 border-l border-white/[0.06] pl-3">
                  {phase.steps.map(step => {
                    const isStepActive = step.step === currentStep;
                    const isStepDone = step.step < currentStep;
                    return (
                      <button
                        key={step.id}
                        onClick={() => onNavigate(phase.id, step.step)}
                        className={`flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-left text-[11px] transition ${
                          isStepActive
                            ? 'bg-white/[0.06] text-white'
                            : isStepDone
                              ? 'text-slate-400'
                              : 'text-white/[0.2]'
                        }`}
                      >
                        {isStepDone ? (
                          <span className="text-green-400">✓</span>
                        ) : (
                          <span className="text-white/[0.25]">{step.step}</span>
                        )}
                        <span className="truncate">{step.title}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
