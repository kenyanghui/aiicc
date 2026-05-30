// ============================================================
// AIICC 方法论引擎 — 精益创业 & 更多
// ============================================================

export interface Methodology {
  id: string;
  name: string;
  description: string;
  frameworks: Framework[];
  phaseMapping: Record<number, string>; // phaseId -> 如何应用
}

export interface Framework {
  name: string;
  concept: string;
  steps: string[];
}

// ---- 精益创业 Lean Startup（中小学生友好版） ----
export const leanStartup: Methodology = {
  id: 'lean-startup',
  name: '精益创业',
  description: 'Eric Ries 想出的好方法——像做实验一样做项目：先猜、快试、边做边学',
  frameworks: [
    {
      name: '做出来 → 试一试 → 学一学',
      concept: '把你的想法做成东西 → 找人试试 → 看反馈决定继续还是换个方向',
      steps: [
        '想清楚你要验证什么（用户喜不喜欢？还是能不能传开？）',
        '设计最简单的实验来测试你最不确定的那个猜测',
        '想好用什么标准判断——不是"看起来好"而是"真正有用"的数据',
        '动手做实验，收集真实反馈',
        '根据结果决定：继续改进，还是换个新方向',
      ],
    },
    {
      name: '最简单版本怎么做？',
      concept: '不用一次做完美，用最快的方式验证你的想法',
      steps: [
        '拍个视频：把想法拍成演示视频，看别人感不感兴趣',
        '人工服务：先人工帮用户做，假装是产品在运行',
        '假装自动：看起来是全自动的，其实背后是人工操作',
        '测测兴趣：先放个"即将上线"的按钮，看看多少人会点',
      ],
    },
    {
      name: '怎么知道有没有进步？',
      concept: '用真正有用的数据来评判，而不是看起来漂亮的数据',
      steps: [
        '先做个最简单版本，拿到真实数据作为起点',
        '试着改进方案，看数据有没有变好',
        '如果怎么改数据都不好，就要考虑换个方向了',
      ],
    },
    {
      name: '怎么让更多人用？',
      concept: '持续增长主要靠这三种方式之一',
      steps: [
        '留人型：用户用了就不走 → 把产品做得更好',
        '传染型：用户主动告诉朋友 → 让分享变得更容易',
        '付费型：投广告吸引用户 → 让每个用户带来的钱 > 广告费',
      ],
    },
    {
      name: '连续追问"为什么"',
      concept: '找到问题的真正根因，而不是只看到表面',
      steps: [
        '描述你看到的问题',
        '连续问 5 次"为什么"，每次往深处挖一层',
        '找到最根本的原因',
        '在根源上想办法，而不是临时应付一下',
      ],
    },
  ],
  phaseMapping: {
    1: '发现阶段：用"连续追问为什么"找到问题的真正根源',
    2: '定义阶段：想清楚用户到底需不需要你的方案',
    3: '构思阶段：找出你方案里最关键的那个猜测',
    4: '原型阶段：用"做出来→试一试→学一学"小循环快速验证',
    5: '交付阶段：用真实数据评估进展，决定继续改进还是换方向',
  },
};

// ---- 可扩展更多方法论 ----
export const methodologies: Record<string, Methodology> = {
  'lean-startup': leanStartup,
};

export function getMethodology(id: string): Methodology | undefined {
  return methodologies[id];
}

export function getMethodologyForPhase(methodologyId: string, phaseId: number): string {
  const m = getMethodology(methodologyId);
  if (!m) return '';
  return m.phaseMapping[phaseId] || '';
}
