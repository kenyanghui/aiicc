'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { workflowPhases, getStep } from '@/lib/workflow';
import WorkflowSidebar from '@/components/WorkflowSidebar';
import ChatPanel from '@/components/ChatPanel';
import MethodologyCard from '@/components/MethodologyCard';

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

  return (
    <div className="flex h-screen bg-[#07070d]">
      {/* 侧栏 */}
      <div className="w-64 shrink-0">
        <WorkflowSidebar
          currentPhase={currentPhase}
          currentStep={currentStep}
          onNavigate={handleNavigate}
        />
      </div>

      {/* 主区域 */}
      <div className="flex flex-1 flex-col">
        {/* 顶部导航 */}
        <header className="flex items-center justify-between border-b border-white/[0.06] px-6 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/')}
              className="text-sm text-slate-500 transition hover:text-white"
            >
              ← 返回
            </button>
            <span className="text-sm text-slate-600">/</span>
            <span className="text-sm text-slate-300">{studentName}</span>
            <span className="text-sm text-slate-600">/</span>
            <span className="text-sm text-cyan-400">
              {phase.icon} {phase.name}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>
              步骤 {phase.id}.{step.step} / 共 20 步
            </span>
          </div>
        </header>

        {/* 步骤说明 + 聊天 */}
        <div className="flex flex-1 overflow-hidden">
          {/* 步骤说明区 */}
          <div className="flex w-72 shrink-0 flex-col border-r border-white/[0.06] bg-white/[0.02] p-6">
            <div className="mb-1 text-xs text-slate-500">
              第 {phase.id} 阶段 · 第 {step.step} 步
            </div>
            <h3 className="mb-3 text-lg font-semibold text-white">
              {step.title}
            </h3>
            <p className="mb-6 text-sm leading-relaxed text-slate-400">
              {step.description}
            </p>

            <div className="mb-6 rounded-lg bg-white/[0.04] px-4 py-3">
              <div className="mb-1 text-[10px] uppercase tracking-wider text-slate-500">
                当前 AI 角色
              </div>
              <div className="flex items-center gap-2 text-sm text-white">
                <span>{step.aiRole === 'socrates' ? '🎭' : step.aiRole === 'analyst' ? '📊' : step.aiRole === 'creative' ? '✨' : step.aiRole === 'architect' ? '🏗️' : '🔍'}</span>
                <span>
                  {step.aiRole === 'socrates' ? '苏格拉底' : step.aiRole === 'analyst' ? '分析师' : step.aiRole === 'creative' ? '创意伙伴' : step.aiRole === 'architect' ? '架构师' : '审查官'}
                </span>
              </div>
            </div>

            {/* 产出类型 */}
            <div className="mb-6">
              <div className="mb-1 text-[10px] uppercase tracking-wider text-slate-500">产出类型</div>
              <span className="rounded-md bg-white/[0.04] px-2 py-1 text-xs text-slate-300">
                {step.outputType === 'text' ? '📝 文字' : step.outputType === 'canvas' ? '🎨 画布' : '📋 列表'}
              </span>
            </div>

            {/* 导航按钮 */}
            <div className="mt-auto space-y-3">
              <MethodologyCard phaseId={currentPhase} />
              <div className="flex gap-2">
                <button
                  onClick={goPrev}
                  className="flex-1 rounded-lg border border-white/[0.08] py-2 text-xs text-slate-400 transition hover:border-white/[0.15] hover:text-white"
                >
                  ← 上一步
                </button>
                <button
                  onClick={goNext}
                  className="flex-1 rounded-lg bg-cyan-500 py-2 text-xs font-medium text-white shadow-sm shadow-cyan-500/20 transition hover:bg-cyan-400"
                >
                  下一步 →
                </button>
              </div>
            </div>
          </div>

          {/* 对话面板 */}
          <div className="flex-1">
            <ChatPanel
              phase={currentPhase}
              step={currentStep}
              aiRole={step.aiRole}
              studentName={studentName}
              projectId={params.id as string}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
