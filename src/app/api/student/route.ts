import { NextRequest, NextResponse } from 'next/server';

// 内存存储（Mock）
const students: Array<{
  id: string;
  name: string;
  age: number;
  projectName: string;
  projectDescription: string;
  phase: number;
  coachNotes: string;
  status: 'active' | 'paused' | 'completed';
  lastActive: string;
}> = [
  {
    id: '1',
    name: '学员一',
    age: 10,
    projectName: '星星糖 StarCandy',
    projectDescription: '解决 SDG 2 零饥饿问题的创新糖果方案',
    phase: 2,
    coachNotes: '',
    status: 'active',
    lastActive: '今天',
  },
  {
    id: '2',
    name: '甄锦弘',
    age: 13,
    projectName: '自学星球',
    projectDescription: '提升自主学习力的文具与工具套件',
    phase: 4,
    coachNotes: '需要关注 MVP 验证计划的完成度',
    status: 'active',
    lastActive: '昨天',
  },
  {
    id: '3',
    name: '学员三',
    age: 11,
    projectName: '绿色校园',
    projectDescription: '校园垃圾分类与资源回收的智能解决方案',
    phase: 1,
    coachNotes: '',
    status: 'paused',
    lastActive: '3天前',
  },
  {
    id: '4',
    name: '学员四',
    age: 15,
    projectName: '银发助手',
    projectDescription: '帮助老年人使用智能设备的便捷工具',
    phase: 5,
    coachNotes: '准备提交材料',
    status: 'active',
    lastActive: '今天',
  },
];

// GET /api/student — 获取学员列表
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (id) {
    const student = students.find(s => s.id === id);
    if (!student) {
      return NextResponse.json({ ok: false, error: 'Student not found' }, { status: 404 });
    }
    return NextResponse.json({ ok: true, data: student });
  }

  return NextResponse.json({ ok: true, data: students });
}

// POST /api/student — 创建学员
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, age, projectName, projectDescription } = body;

    const student = {
      id: `student-${Date.now()}`,
      name: name || '新学员',
      age: age || 10,
      projectName: projectName || '新项目',
      projectDescription: projectDescription || '',
      phase: 1,
      coachNotes: '',
      status: 'active' as const,
      lastActive: '刚刚',
    };

    students.push(student);

    return NextResponse.json({ ok: true, data: student });
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request' }, { status: 400 });
  }
}

// PATCH /api/student — 更新学员信息
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, coachNotes, status } = body;

    const student = students.find(s => s.id === id);
    if (!student) {
      return NextResponse.json({ ok: false, error: 'Student not found' }, { status: 404 });
    }

    if (coachNotes !== undefined) student.coachNotes = coachNotes;
    if (status !== undefined) student.status = status;

    return NextResponse.json({ ok: true, data: student });
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request' }, { status: 400 });
  }
}
