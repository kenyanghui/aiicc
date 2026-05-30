import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/documents?projectId=xxx — 列出已生成的文档
// GET /api/documents?id=xxx — 获取单份文档
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId');
  const id = searchParams.get('id');

  try {
    if (id) {
      const doc = await prisma.document.findUnique({ where: { id } });
      if (!doc) return NextResponse.json({ ok: false, error: '文档未找到' }, { status: 404 });
      return NextResponse.json({ ok: true, data: doc });
    }

    if (!projectId) {
      return NextResponse.json({ ok: false, error: '缺少 projectId' }, { status: 400 });
    }

    const docs = await prisma.document.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ ok: true, data: docs });
  } catch (err) {
    console.error('GET /api/documents error:', err);
    return NextResponse.json({ ok: false, error: '读取失败' }, { status: 500 });
  }
}

// PATCH /api/documents — 更新文档状态
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ ok: false, error: '缺少必要参数' }, { status: 400 });
    }

    const doc = await prisma.document.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ ok: true, data: doc });
  } catch (err) {
    console.error('PATCH /api/documents error:', err);
    return NextResponse.json({ ok: false, error: '更新失败' }, { status: 500 });
  }
}

// DELETE /api/documents?id=xxx — 删除文档
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ ok: false, error: '缺少 id' }, { status: 400 });
  }

  try {
    await prisma.document.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('DELETE /api/documents error:', err);
    return NextResponse.json({ ok: false, error: '删除失败' }, { status: 500 });
  }
}
