import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/output?projectId=xxx — 获取项目所有阶段输出
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId');
  const phase = searchParams.get('phase');
  const step = searchParams.get('step');

  if (!projectId) {
    return NextResponse.json({ ok: false, error: '缺少 projectId' }, { status: 400 });
  }

  try {
    const where: any = { projectId };
    if (phase) where.phase = parseInt(phase);
    if (step) where.step = parseInt(step);

    const outputs = await prisma.phaseOutput.findMany({
      where,
      orderBy: [{ phase: 'asc' }, { step: 'asc' }, { createdAt: 'desc' }],
      take: 100,
    });

    const latest = new Map<string, typeof outputs[0]>();
    for (const o of outputs) {
      const key = `${o.phase}-${o.step}`;
      if (!latest.has(key)) latest.set(key, o);
    }

    return NextResponse.json({ ok: true, data: Array.from(latest.values()) });
  } catch (err) {
    console.error('GET /api/output error:', err);
    return NextResponse.json({ ok: false, error: '读取失败' }, { status: 500 });
  }
}

// POST /api/output — 保存/更新阶段输出
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, phase, step, outputType, content, aiRoleUsed } = body;

    if (!projectId || !phase || !step) {
      return NextResponse.json({ ok: false, error: '缺少必要参数' }, { status: 400 });
    }

    const existing = await prisma.phaseOutput.findFirst({
      where: { projectId, phase: parseInt(phase), step: parseInt(step) },
    });

    let output;
    if (existing) {
      output = await prisma.phaseOutput.update({
        where: { id: existing.id },
        data: {
          content: content || '',
          outputType: outputType || existing.outputType,
          aiRoleUsed: aiRoleUsed || existing.aiRoleUsed,
        },
      });
    } else {
      output = await prisma.phaseOutput.create({
        data: {
          projectId,
          phase: parseInt(phase),
          step: parseInt(step),
          outputType: outputType || 'text',
          content: content || '',
          aiRoleUsed: aiRoleUsed || '',
        },
      });
    }

    return NextResponse.json({ ok: true, data: output });
  } catch (err) {
    console.error('POST /api/output error:', err);
    return NextResponse.json({ ok: false, error: '保存失败' }, { status: 500 });
  }
}
