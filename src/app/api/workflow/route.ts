import { NextRequest, NextResponse } from 'next/server';
import { workflowPhases } from '@/lib/workflow';

// GET /api/workflow — 获取工作流定义
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const phaseId = searchParams.get('phase');
  const stepNum = searchParams.get('step');

  if (phaseId) {
    const phase = workflowPhases.find(p => p.id === parseInt(phaseId, 10));
    if (!phase) {
      return NextResponse.json({ ok: false, error: 'Phase not found' }, { status: 404 });
    }

    if (stepNum) {
      const step = phase.steps.find(s => s.step === parseInt(stepNum, 10));
      if (!step) {
        return NextResponse.json({ ok: false, error: 'Step not found' }, { status: 404 });
      }
      return NextResponse.json({ ok: true, data: { phase, step } });
    }

    return NextResponse.json({ ok: true, data: phase });
  }

  // 返回完整工作流
  const totalSteps = workflowPhases.reduce((acc, p) => acc + p.steps.length, 0);
  return NextResponse.json({
    ok: true,
    data: {
      phases: workflowPhases,
      totalPhases: workflowPhases.length,
      totalSteps,
      summary: workflowPhases.map(p => ({
        id: p.id,
        name: p.name,
        icon: p.icon,
        stepCount: p.steps.length,
        description: p.description,
      })),
    },
  });
}

// POST /api/workflow/validate — 验证工作流步骤的产出
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phase, step, content } = body;

    const workflowPhase = workflowPhases.find(p => p.id === phase);
    if (!workflowPhase) {
      return NextResponse.json({ ok: false, error: 'Phase not found' }, { status: 404 });
    }

    const workflowStep = workflowPhase.steps.find(s => s.step === step);
    if (!workflowStep) {
      return NextResponse.json({ ok: false, error: 'Step not found' }, { status: 404 });
    }

    // Mock validation: check if content is non-empty
    const isValid = content && content.trim().length > 0;
    const suggestions = isValid
      ? []
      : ['请确保已经完成了对话讨论', '尝试用文字总结你的想法', '可以回顾 AI 给你的建议'];

    return NextResponse.json({
      ok: true,
      data: {
        valid: isValid,
        phase,
        step,
        stepTitle: workflowStep.title,
        suggestions,
      },
    });
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request' }, { status: 400 });
  }
}
