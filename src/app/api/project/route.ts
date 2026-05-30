import { NextRequest, NextResponse } from 'next/server';

// POST /api/project — 创建新项目
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { studentName, studentAge, projectName, description } = body;

    const project = {
      id: `proj-${Date.now()}`,
      studentName,
      studentAge,
      projectName,
      description,
      currentPhase: 1,
      currentStep: 1,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ ok: true, data: project });
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request' }, { status: 400 });
  }
}

// GET /api/project — 获取项目列表
export async function GET() {
  const projects = [
    { id: 'demo-1', studentName: '学员', projectName: '星星糖', currentPhase: 2, status: 'active' },
  ];

  return NextResponse.json({ ok: true, data: projects });
}
