import { NextRequest, NextResponse } from 'next/server';

// POST /api/chat — 发送消息给 AI
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { role, message, phase, step } = body;

    // Mock 响应：按角色返回不同风格的回复
    const mockResponses: Record<string, string> = {
      socrates: '嗯，这个角度很有意思。你为什么会这么认为呢？还有什么其他可能性吗？',
      analyst: '让我用结构化思维来分析一下。从三个维度看：用户需求、可行性、社会价值。\n\n你觉得哪个维度最需要优先考虑？',
      creative: '这个想法太棒了！✨ 如果把它再放大 10 倍会怎样？想象一下，如果资源无限，你会怎么做？',
      architect: '好的，我来帮你评估一下方案的技术可行性。考虑到你的情况，我建议先做一个小范围验证。',
      reviewer: '整体来看方向很不错。我建议从以下几个方面再完善：完整性、一致性、创新性。',
    };

    const response = mockResponses[role] || mockResponses.socrates;

    return NextResponse.json({
      ok: true,
      data: { content: response, role },
    });
  } catch (error) {
    return NextResponse.json({ ok: false, error: 'Invalid request' }, { status: 400 });
  }
}
