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
    const outputs = await db.getOutputs(
      projectId,
      phase ? parseInt(phase) : undefined,
      step ? parseInt(step) : undefined
    );
    return NextResponse.json({ ok: true, data: outputs });
  } catch (err) {
    console.error('GET /api/output error:', err);
    return NextResponse.json({ ok: false, error: '读取失败', data: [] }, { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, phase, step, outputType, content, aiRoleUsed } = body;

    if (!projectId || !phase || !step) {
      return NextResponse.json({ ok: false, error: '缺少必要参数' }, { status: 400 });
    }

    const output = await db.upsertOutput(
      projectId,
      parseInt(phase),
      parseInt(step),
      outputType || 'text',
      content || '',
      aiRoleUsed || ''
    );

    return NextResponse.json({ ok: true, data: output });
  } catch (err) {
    console.error('POST /api/output error:', err);
    return NextResponse.json({ ok: false, error: '保存失败' }, { status: 200 });
  }
}
