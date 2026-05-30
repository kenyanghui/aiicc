import { NextRequest, NextResponse } from 'next/server';
import { generateDocument, generateAllDocuments } from '@/lib/docgen/generator';
import { db } from '@/lib/db';
import { CompetitionDocType } from '@/types/document';

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

    // 保存到数据库（使用兼容接口）
    const doc = await db.upsertDocument(
      projectId,
      docType,
      result.title,
      result.content
    );

    return NextResponse.json({
      ok: true,
      data: {
        ...result,
        id: doc?.id,
      },
    });
  } catch (err) {
    console.error('POST /api/documents/generate error:', err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 200 });
  }
}
