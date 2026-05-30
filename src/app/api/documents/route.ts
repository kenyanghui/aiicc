import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId');
  const id = searchParams.get('id');

  try {
    if (id) {
      const doc = await db.getDocument(id);
      if (!doc) return NextResponse.json({ ok: false, error: '文档未找到' }, { status: 404 });
      return NextResponse.json({ ok: true, data: doc });
    }

    if (!projectId) {
      return NextResponse.json({ ok: false, error: '缺少 projectId' }, { status: 400 });
    }

    const docs = await db.getDocuments(projectId);
    return NextResponse.json({ ok: true, data: docs });
  } catch (err) {
    console.error('GET /api/documents error:', err);
    return NextResponse.json({ ok: false, error: '读取失败', data: [] }, { status: 200 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ ok: false, error: '缺少必要参数' }, { status: 400 });
    }

    const doc = await db.updateDocumentStatus(id, status);
    if (!doc) return NextResponse.json({ ok: false, error: '文档未找到' }, { status: 404 });

    return NextResponse.json({ ok: true, data: doc });
  } catch (err) {
    console.error('PATCH /api/documents error:', err);
    return NextResponse.json({ ok: false, error: '更新失败' }, { status: 200 });
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ ok: false, error: '缺少 id' }, { status: 400 });
  }

  try {
    await db.deleteDocument(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('DELETE /api/documents error:', err);
    return NextResponse.json({ ok: false, error: '删除失败' }, { status: 200 });
  }
}
