import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/chat/history?projectId=xxx&phase=1&step=1 — 获取聊天历史
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

    const messages = await prisma.chatMessage.findMany({
      where,
      orderBy: { createdAt: 'asc' },
      take: 200,
    });

    return NextResponse.json({ ok: true, data: messages });
  } catch (err) {
    console.error('GET /api/chat/history error:', err);
    return NextResponse.json({ ok: false, error: '读取失败' }, { status: 500 });
  }
}

// POST /api/chat/history — 保存单条消息
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, phase, step, role, aiRole, content } = body;

    if (!projectId || !content) {
      return NextResponse.json({ ok: false, error: '缺少必要参数' }, { status: 400 });
    }

    const message = await prisma.chatMessage.create({
      data: {
        projectId,
        phase: parseInt(phase) || 0,
        step: parseInt(step) || 0,
        role: role || 'student',
        aiRole: aiRole || null,
        content,
      },
    });

    return NextResponse.json({ ok: true, data: message });
  } catch (err) {
    console.error('POST /api/chat/history error:', err);
    return NextResponse.json({ ok: false, error: '保存失败' }, { status: 500 });
  }
}
