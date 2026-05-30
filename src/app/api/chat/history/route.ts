import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId');
  const phase = searchParams.get('phase');
  const step = searchParams.get('step');

  if (!projectId) {
    return NextResponse.json({ ok: false, error: '缺少 projectId' }, { status: 400 });
  }

  try {
    const messages = await db.getMessages(
      projectId,
      phase ? parseInt(phase) : undefined,
      step ? parseInt(step) : undefined
    );
    return NextResponse.json({ ok: true, data: messages });
  } catch (err) {
    console.error('GET /api/chat/history error:', err);
    return NextResponse.json({ ok: false, error: '读取失败', data: [] }, { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, phase, step, role, aiRole, content } = body;

    if (!projectId || !content) {
      return NextResponse.json({ ok: false, error: '缺少必要参数' }, { status: 400 });
    }

    const message = await db.addMessage(
      projectId,
      parseInt(phase) || 0,
      parseInt(step) || 0,
      role || 'student',
      content,
      aiRole || null
    );

    return NextResponse.json({ ok: true, data: message });
  } catch (err) {
    console.error('POST /api/chat/history error:', err);
    return NextResponse.json({ ok: false, error: '保存失败' }, { status: 200 });
  }
}
