'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { workflowPhases, getStep } from '@/lib/workflow';
import ChatPanel from '@/components/ChatPanel';

export default function PrototypePhasePage() {
  const params = useParams();
  const router = useRouter();
  const [studentName, setStudentName] = useState('学员');
  const [currentStep, setCurrentStep] = useState(1);

  const phaseId = 4;
  const phase = workflowPhases.find(p => p.id === phaseId);
  const step = getStep(phaseId, currentStep);

  useEffect(() => {
    const stored = localStorage.getItem('aiicc_student');
    if (stored) {
      try {
        const { name } = JSON.parse(stored);
        if (name) setStudentName(name);
      } catch {}
    }
  }, []);

  if (!phase || !step) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500">
        阶段或步骤未找到
      </div>
    );
  }

  const goNext = () => {
    if (currentStep < phase.steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goPrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-[#07070d]">
      {/* 顶部导航 */}
      <header className="flex items-center justify-between border-b border-white/[0.06] px-6 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(`/project/${params.id}`)}
            className="text-sm text-slate-500 transition hover:text-white"
          >
            ← 返回工作区
          </button>
          <span className="text-sm text-slate-600">/</span>
          <span className="text-sm text-cyan-400">🛠️ 原型阶段</span>
        </div>
        <div className="text-xs text-slate-500">
          步骤 {currentStep} / {phase.steps.length}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* 步骤侧栏 */}
        <div className="flex w-64 shrink-0 flex-col border-r border-white/[0.06] bg-white/[0.02] p-4">
          <h3 className="mb-3 text-xs font-semibold text-slate-500">阶段步骤</h3>
          <div className="flex-1 space-y-1">
            {phase.steps.map(s => {
              const isActive = s.step === currentStep;
              const isDone = s.step < currentStep;
              const roleEmoji = s.aiRole === 'socrates' ? '🎭' : s.aiRole === 'analyst' ? '📊' : '❓';
              return (
                <button
                  key={s.id}
                  onClick={() => setCurrentStep(s.step)}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs transition ${
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-300'
                      : isDone
                        ? 'text-slate-400'
                        : 'text-white/[0.2]'
                  }`}
                >
                  {isDone ? (
                    <span className="text-green-400">✓</span>
                  ) : (
                    <span className="text-white/[0.25]">{s.step}</span>
                  )}
                  <span className="truncate flex-1">{s.title}</span>
                  <span className="text-[10px] opacity-50">{roleEmoji}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 主内容区 */}
        <div className="flex flex-1 flex-col">
          {/* 步骤说明 */}
          <div className="border-b border-white/[0.06] bg-white/[0.015] px-6 py-4">
            <div className="mb-1 text-[10px] text-slate-500">
              第 {phaseId} 阶段 · 第 {currentStep} 步
            </div>
            <h2 className="text-lg font-semibold text-white">{step.title}</h2>
            <p className="mt-1 text-sm text-slate-400">{step.description}</p>
          </div>

          {/* 对话面板 */}
          <div className="flex-1">
            <ChatPanel
              phase={phaseId}
              step={currentStep}
              aiRole={step.aiRole}
              studentName={studentName}
              projectId={params.id as string}
            />
          </div>

          {/* 底部导航 */}
          <div className="flex items-center justify-between border-t border-white/[0.06] px-6 py-3">
            <button
              onClick={goPrev}
              disabled={currentStep === 1}
              className="rounded-lg border border-white/[0.08] px-4 py-2 text-xs text-slate-400 transition hover:border-white/[0.15] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              ← 上一步
            </button>
            <span className="text-xs text-slate-500">
              {currentStep} / {phase.steps.length}
            </span>
            <button
              onClick={goNext}
              disabled={currentStep >= phase.steps.length}
              className="rounded-lg bg-cyan-500 px-4 py-2 text-xs font-medium text-white shadow-sm shadow-cyan-500/20 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              下一步 →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
