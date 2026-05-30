'use client';

import { workflowPhases } from '@/lib/workflow';

interface Props {
  currentPhase: number;
  currentStep: number;
}

export default function PhaseProgress({ currentPhase, currentStep }: Props) {
  const totalPhases = workflowPhases.length;
  const totalSteps = workflowPhases.reduce((acc, p) => acc + p.steps.length, 0);
  const completedSteps = workflowPhases.reduce((acc, p) => {
    if (p.id < currentPhase) return acc + p.steps.length;
    if (p.id === currentPhase) return acc + Math.min(currentStep, p.steps.length);
    return acc;
  }, 0);
  const overallPercent = Math.round((completedSteps / totalSteps) * 100);

  return (
    <div className="space-y-3">
      {/* 总体进度 */}
      <div>
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="text-slate-400">总进度</span>
          <span className="text-cyan-300">{overallPercent}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-700">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-cyan-400 transition-all duration-500"
            style={{ width: `${overallPercent}%` }}
          />
        </div>
      </div>

      {/* 阶段进度 */}
      <div className="space-y-2">
        {workflowPhases.map(phase => {
          const isActive = phase.id === currentPhase;
          const isCompleted = phase.id < currentPhase;
          const phaseCompleted = phase.id < currentPhase
            ? phase.steps.length
            : phase.id === currentPhase
              ? Math.min(currentStep, phase.steps.length)
              : 0;
          const phasePercent = Math.round((phaseCompleted / phase.steps.length) * 100);

          return (
            <div key={phase.id} className="flex items-center gap-2">
              <span className={`text-xs ${isActive ? 'text-cyan-300' : isCompleted ? 'text-green-400' : 'text-slate-600'}`}>
                {phase.icon}
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className={`${isActive ? 'text-slate-300' : isCompleted ? 'text-slate-400' : 'text-slate-600'}`}>
                    {phase.name}
                  </span>
                  <span className="text-slate-500">{phaseCompleted}/{phase.steps.length}</span>
                </div>
                <div className="mt-0.5 h-1 rounded-full bg-slate-700">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isCompleted ? 'bg-green-500' : isActive ? 'bg-cyan-500' : 'bg-slate-600'
                    }`}
                    style={{ width: `${phasePercent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
