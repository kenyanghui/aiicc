'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { workflowPhases, getStep } from '@/lib/workflow';
import { AIRoleMeta } from '@/types';
import WorkflowSidebar from '@/components/WorkflowSidebar';
import ChatPanel from '@/components/ChatPanel';
import MethodologyCard from '@/components/MethodologyCard';
import PhaseProgress from '@/components/PhaseProgress';

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const [studentName, setStudentName] = useState('学员');

  const [currentPhase, setCurrentPhase] = useState(1);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const stored = localStorage.getItem('aiicc_student');
    if (stored) {
      try {
        const { name } = JSON.parse(stored);
        if (name) setStudentName(name);
      } catch {}
    }
  }, []);

  const phase = workflowPhases.find(p => p.id === currentPhase);
  const step = getStep(currentPhase, currentStep);
  const totalStepsCount = workflowPhases.reduce((acc, item) => acc + item.steps.length, 0);
  const completedSteps = workflowPhases.reduce((acc, item) => {
    if (item.id < currentPhase) return acc + item.steps.length;
    if (item.id === currentPhase) return acc + currentStep;
    return acc;
  }, 0);
  const overallPercent = Math.round((completedSteps / totalStepsCount) * 100);
  const currentGlobalStep = workflowPhases.reduce((acc, item) => {
    if (item.id < currentPhase) return acc + item.steps.length;
    return acc;
  }, 0) + currentStep;

  const handleNavigate = (phaseId: number, stepNum: number) => {
    setCurrentPhase(phaseId);
    setCurrentStep(stepNum);
  };

  const goNext = () => {
    if (!phase) return;
    const currentIdx = phase.steps.findIndex(s => s.step === currentStep);
    if (currentIdx < phase.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      const nextPhase = workflowPhases.find(p => p.id === currentPhase + 1);
      if (nextPhase) {
        setCurrentPhase(currentPhase + 1);
        setCurrentStep(1);
      }
    }
  };

  const goPrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else if (currentPhase > 1) {
      const prevPhase = workflowPhases.find(p => p.id === currentPhase - 1);
      if (prevPhase) {
        setCurrentPhase(currentPhase - 1);
        setCurrentStep(prevPhase.steps.length);
      }
    }
  };

  if (!phase || !step) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500">
        阶段或步骤未找到
      </div>
    );
  }

  const roleMeta = AIRoleMeta[step.aiRole];
  const outputMeta = step.outputType === 'text'
    ? { label: '文字推演', icon: '📝', hint: '通过对话逐步沉淀问题、判断和结论。' }
    : step.outputType === 'canvas'
      ? { label: '画布梳理', icon: '🎨', hint: '适合结构化整理价值主张和关键假设。' }
      : { label: '清单输出', icon: '📋', hint: '适合生成要点、待办和验证条目。' };

  return (
    <div className="min-h-screen overflow-hidden bg-[#07070d] text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-12%] top-[-8%] h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-[-18%] right-[-8%] h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="relative flex min-h-screen">
        <aside className="w-[320px] shrink-0 border-r border-white/[0.06] bg-black/20 backdrop-blur-xl">
          <WorkflowSidebar
            currentPhase={currentPhase}
            currentStep={currentStep}
            onNavigate={handleNavigate}
          />
        </aside>

        <main className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-white/[0.06] bg-white/[0.02] backdrop-blur-xl">
            <div className="flex flex-wrap items-start justify-between gap-4 px-8 py-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <button
                    onClick={() => router.push('/')}
                    className="rounded-full border border-white/[0.08] px-3 py-1.5 text-slate-400 transition hover:border-white/[0.16] hover:text-white"
                  >
                    ← 返回首页
                  </button>
                  <span className="text-slate-600">/</span>
                  <span className="text-slate-300">{studentName}</span>
                  <span className="text-slate-600">/</span>
                  <span className="text-cyan-300">{phase.icon} {phase.name}</span>
                </div>

                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    <span>项目工作流台</span>
                    <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2 py-1 text-cyan-300">
                      Phase {phase.id}
                    </span>
                  </div>
                  <h1 className="text-3xl font-semibold tracking-tight text-white">
                    {step.title}
                  </h1>
                  <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-400">
                    {step.description}
                  </p>
                </div>
              </div>

              <div className="grid min-w-[280px] gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.04] px-4 py-3">
                  <div className="text-[11px] uppercase tracking-[0.16em] text-slate-500">整体推进</div>
                  <div className="mt-2 flex items-end justify-between">
                    <div>
                      <div className="text-2xl font-semibold text-white">{overallPercent}%</div>
                      <div className="text-xs text-slate-400">
                        第 {currentGlobalStep} / {totalStepsCount} 步
                      </div>
                    </div>
                    <div className="text-right text-xs text-slate-500">
                      <div>已完成 {completedSteps} 步</div>
                      <div>剩余 {totalStepsCount - completedSteps} 步</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-br from-cyan-500/12 to-blue-500/10 px-4 py-3">
                  <div className="text-[11px] uppercase tracking-[0.16em] text-cyan-200/70">当前引导</div>
                  <div className="mt-2 flex items-center gap-3">
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-2xl text-lg"
                      style={{ backgroundColor: `${roleMeta.color}20`, color: roleMeta.color }}
                    >
                      {roleMeta.emoji}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{roleMeta.label}</div>
                      <div className="text-xs text-slate-300">正在陪你完成这一小步</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-hidden p-6">
            <div className="grid h-full min-h-0 grid-cols-1 gap-6 xl:grid-cols-[380px,minmax(0,1fr)]">
              <section className="min-h-0 overflow-y-auto rounded-[28px] border border-white/[0.06] bg-white/[0.03] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
                <div className="rounded-3xl border border-cyan-500/15 bg-gradient-to-br from-cyan-500/14 via-cyan-500/8 to-transparent p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="rounded-full border border-white/[0.08] bg-black/20 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-300">
                      Current Mission
                    </span>
                    <span className="text-xs text-slate-400">
                      第 {phase.id} 阶段 · 第 {step.step} 步
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold text-white">{step.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    先围绕这一步把想法说清楚，再进入下一步。你不需要一次说完整，先抛出一个最直觉的答案就够了。
                  </p>
                </div>

                <div className="mt-5 rounded-3xl border border-white/[0.06] bg-black/20 p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-white">进度总览</div>
                      <div className="text-xs text-slate-500">随时知道自己现在走到哪一步</div>
                    </div>
                    <span className="rounded-full bg-white/[0.06] px-3 py-1 text-xs text-slate-300">
                      {completedSteps}/{totalStepsCount}
                    </span>
                  </div>
                  <PhaseProgress currentPhase={currentPhase} currentStep={currentStep} />
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                  <div className="rounded-3xl border border-white/[0.06] bg-white/[0.03] p-5">
                    <div className="mb-3 text-[11px] uppercase tracking-[0.18em] text-slate-500">本步角色</div>
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-2xl text-xl"
                        style={{ backgroundColor: `${roleMeta.color}20`, color: roleMeta.color }}
                      >
                        {roleMeta.emoji}
                      </div>
                      <div>
                        <div className="font-medium text-white">{roleMeta.label}</div>
                        <div className="text-xs text-slate-400">
                          用 {roleMeta.label} 的视角帮你思考问题
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/[0.06] bg-white/[0.03] p-5">
                    <div className="mb-3 text-[11px] uppercase tracking-[0.18em] text-slate-500">建议产出</div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.06] text-xl">
                        {outputMeta.icon}
                      </div>
                      <div>
                        <div className="font-medium text-white">{outputMeta.label}</div>
                        <div className="text-xs leading-5 text-slate-400">
                          {outputMeta.hint}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <MethodologyCard phaseId={currentPhase} />
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <button
                    onClick={goPrev}
                    className="rounded-2xl border border-white/[0.08] bg-white/[0.02] px-4 py-3 text-sm text-slate-300 transition hover:border-white/[0.16] hover:bg-white/[0.05] hover:text-white"
                  >
                    ← 上一步
                  </button>
                  <button
                    onClick={goNext}
                    className="rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-400"
                  >
                    下一步 →
                  </button>
                </div>
              </section>

              <section className="min-h-0 overflow-hidden rounded-[28px] border border-white/[0.06] bg-white/[0.03] shadow-2xl shadow-black/20 backdrop-blur-xl">
                <ChatPanel
                  phase={currentPhase}
                  step={currentStep}
                  aiRole={step.aiRole}
                  studentName={studentName}
                  projectId={params.id as string}
                />
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
