import { NextRequest, NextResponse } from 'next/server';
import { generateDocument, generateAllDocuments } from '@/lib/docgen/generator';
import { prisma } from '@/lib/prisma';
import { CompetitionDocType } from '@/types/document';

// POST /api/documents/generate — 生成单份文档
// POST /api/documents/generate?all=true — 生成全部文档
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const generateAll = searchParams.get('all') === 'true';

    if (generateAll) {
      const body = await request.json();
      const { projectId } = body;

      if (!projectId) {
        return NextResponse.json({ ok: false, error: '缺少 projectId' }, { status: 400 });
      }

      const results = await generateAllDocuments(projectId);
      return NextResponse.json({ ok: true, data: results });
    }

    const body = await request.json();
    const { projectId, docType } = body;

    if (!projectId || !docType) {
      return NextResponse.json({ ok: false, error: '缺少 projectId 或 docType' }, { status: 400 });
    }

    const result = await generateDocument(projectId, docType as CompetitionDocType);

    // 保存到数据库
    const existing = await prisma.document.findUnique({
      where: { projectId_docType: { projectId, docType } },
    });

    if (existing) {
      await prisma.document.update({
        where: { id: existing.id },
        data: { content: result.content, title: result.title, status: 'draft' },
      });
    } else {
      await prisma.document.create({
        data: { projectId, docType, title: result.title, content: result.content, status: 'draft' },
      });
    }

    // 重新读取以获得完整记录
    const doc = await prisma.document.findUnique({
      where: { projectId_docType: { projectId, docType } },
    });

    return NextResponse.json({ ok: true, data: { ...result, id: doc?.id } });
  } catch (err) {
    console.error('POST /api/documents/generate error:', err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
