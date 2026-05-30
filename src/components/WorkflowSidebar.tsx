'use client';

import { workflowPhases } from '@/lib/workflow';

interface Props {
  currentPhase: number;
  currentStep: number;
  onNavigate: (phase: number, step: number) => void;
}

export default function WorkflowSidebar({ currentPhase, currentStep, onNavigate }: Props) {
  const totalSteps = workflowPhases.reduce((acc, phase) => acc + phase.steps.length, 0);
  const completedSteps = workflowPhases.reduce((acc, phase) => {
    if (phase.id < currentPhase) return acc + phase.steps.length;
    if (phase.id === currentPhase) return acc + currentStep;
    return acc;
  }, 0);
  const overallPercent = Math.round((completedSteps / totalSteps) * 100);

  return (
    <nav className="flex h-full flex-col overflow-y-auto">
      <div className="border-b border-white/[0.06] px-4 sm:px-5 py-4 sm:py-6">
        <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">AIICC Studio</div>
        <h2 className="mt-2 text-lg sm:text-xl font-semibold tracking-tight text-white">项目工作流</h2>
        <p className="mt-1 text-xs leading-5 text-slate-400 hidden sm:block">
          从发现到交付，沿着 5 个阶段逐步推进你的创新项目。
        </p>

        <div className="mt-5 rounded-3xl border border-white/[0.06] bg-white/[0.03] p-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">总进度</span>
            <span className="font-medium text-cyan-300">{overallPercent}%</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 transition-all duration-500"
              style={{ width: `${overallPercent}%` }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
            <span>{workflowPhases.length} 阶段</span>
            <span>{completedSteps}/{totalSteps} 步</span>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-3 p-3 sm:p-4">
        {workflowPhases.map(phase => {
          const isActive = phase.id === currentPhase;
          const isPast = phase.id < currentPhase;
          const progress = phase.steps.filter(s => {
            if (phase.id < currentPhase) return true;
            if (phase.id === currentPhase) return s.step <= currentStep;
            return false;
          }).length;

          return (
            <section
              key={phase.id}
              className={`rounded-3xl border p-3 transition ${
                isActive
                  ? 'border-cyan-500/20 bg-cyan-500/8 shadow-lg shadow-cyan-950/10'
                  : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]'
              }`}
            >
              <button
                onClick={() => onNavigate(phase.id, 1)}
                className="flex w-full items-start gap-3 text-left"
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-lg ${
                    isActive ? 'bg-cyan-500/15' : isPast ? 'bg-green-500/12' : 'bg-white/[0.05]'
                  }`}
                >
                  {phase.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${isActive ? 'text-white' : isPast ? 'text-slate-200' : 'text-slate-300'}`}>
                      {phase.name}
                    </span>
                    {isPast && (
                      <span className="rounded-full bg-green-500/12 px-2 py-0.5 text-[10px] text-green-300">
                        已完成
                      </span>
                    )}
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                    {phase.description}
                  </p>
                </div>
              </button>

              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                <span>阶段 {phase.id}</span>
                <span>{progress}/{phase.steps.length} 步</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isPast ? 'bg-green-400' : isActive ? 'bg-cyan-400' : 'bg-slate-700'
                  }`}
                  style={{ width: `${Math.round((progress / phase.steps.length) * 100)}%` }}
                />
              </div>

              {isActive && (
                <div className="mt-4 space-y-2">
                  {phase.steps.map(step => {
                    const isStepActive = step.step === currentStep;
                    const isStepDone = step.step < currentStep;
                    return (
                      <button
                        key={step.id}
                        onClick={() => onNavigate(phase.id, step.step)}
                        className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition ${
                          isStepActive
                            ? 'bg-white/[0.08] text-white'
                            : isStepDone
                              ? 'bg-white/[0.03] text-slate-300'
                              : 'text-slate-500 hover:bg-white/[0.04] hover:text-slate-300'
                        }`}
                      >
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] ${
                            isStepDone
                              ? 'bg-green-500/15 text-green-300'
                              : isStepActive
                                ? 'bg-cyan-500/15 text-cyan-300'
                                : 'bg-white/[0.05] text-slate-500'
                          }`}
                        >
                          {isStepDone ? '✓' : step.step}
                        </span>
                        <span className="truncate text-xs">{step.title}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </nav>
  );
}
