import { AIRole, ChatMessage } from '@/types';
import { getSystemPrompt, getStepOpeningMessage } from './prompts';

// ============================================================
// AI 对话引擎（Mock 版 — 后续接入真实 API）
// ============================================================

// Mock 响应（按角色风格）
const mockResponses: Record<AIRole, string[]> = {
  socrates: [
    '嗯，这个问题很有意思。你为什么会觉得这是一个重要的问题呢？',
    '我理解你的想法。不过，如果站在用户的角度看，他们会怎么想？',
    '好的，我们已经找到了一层原因。再来一次——为什么？',
    '你说得很好。但这个问题的根源会不会在别的地方？比如，有没有可能是系统性的原因？',
    '想象一下，如果你有魔法棒一挥就能解决这个问题，你会从哪里开始？',
  ],
  analyst: [
    '我来帮你分析一下。从三个维度看：\n\n1. **用户需求**：...\n2. **市场现状**：...\n3. **可行性**：...\n\n你觉得哪个维度最关键？',
    '好的，我用价值画布来整理你的思路：\n\n- **用户痛点**：\n- **解决方案**：\n- **独特价值**：\n\n来看看哪里还需要补充。',
    '我注意到一个逻辑点需要再确认一下——你的方案和用户痛点之间的因果关系成立吗？',
  ],
  creative: [
    '这个想法太棒了！✨ 如果把它再夸张一点会怎样？',
    '好！已经 3 个了，再来 3 个！想象一下，如果马云来做这个项目，他会怎么做？',
    '有趣的方向！来做个"概念组合"——把你的 idea 和「游戏化」结合一下会变成什么？',
    '很好很好，这个方向很有潜力！现在换个角度想：如果你是用户，你希望这个方案怎么为你服务？',
  ],
  architect: [
    '这个 MVP 范围我觉得可以。按优先级排一下：\n\n1. **必须有**：...\n2. **应该有**：...\n3. **可以有**：...\n\n先从 P0 开始做。',
    '技术选型方面，考虑到你的情况，我建议用... 原因是：\n\n- 上手快\n- 文档多\n- 够用',
    '好的，我们来画一下用户流程。用户打开产品后：\n\n第一步 → 第二步 → 第三步 → 完成\n\n这个流程通顺吗？',
  ],
  reviewer: [
    '整体来看方案很不错！有几个地方可以再打磨一下：\n\n✅ 好的：\n- 创新性很强\n- 用户痛点抓得准\n\n⚠️ 建议：\n- 可不可再加一个验证环节？\n- 技术方案能不能更轻量？\n\n加油，已经很接近了！',
    '我来做一轮审查：\n\n**完整性**：✅ 基本完整\n**一致性**：⚠️ 这里和前面说的有点矛盾...\n**可行性**：✅ 在可控范围内\n\n改完上面那个矛盾点就完美了！',
  ],
};

interface ChatRequest {
  role: AIRole;
  message: string;
  phase: number;
  step: number;
  history: ChatMessage[];
}

interface ChatResponse {
  content: string;
  role: AIRole;
}

export async function sendChatMessage(req: ChatRequest): Promise<ChatResponse> {
  // Mock 实现 — 从对应角色的回复池里轮换选一条
  const responses = mockResponses[req.role];
  const idx = Math.floor(Math.random() * responses.length);
  const content = responses[idx];

  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 600));

  return {
    content,
    role: req.role,
  };
}

export function getOpeningMessage(phase: number, step: number, studentName: string): ChatMessage {
  return {
    id: `opening-${Date.now()}`,
    projectId: '',
    phase,
    step,
    role: 'ai',
    content: getStepOpeningMessage(phase, step, studentName),
    createdAt: new Date().toISOString(),
  };
}
