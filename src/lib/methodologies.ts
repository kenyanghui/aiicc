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

// ---- 精益创业 Lean Startup ----
export const leanStartup: Methodology = {
  id: 'lean-startup',
  name: '精益创业',
  description: 'Eric Ries 提出，用科学方法管理创业——假设驱动、快速验证、迭代学习',
  frameworks: [
    {
      name: 'Build-Measure-Learn',
      concept: '把想法转化为产品 → 测量用户反馈 → 学习是否 pivot 或 persevere',
      steps: [
        '明确要验证的假设（价值假设 / 增长假设）',
        '设计最小实验（MVP）来测试最冒险的假设',
        '定义可操作的指标，而非虚荣指标',
        '执行实验，收集数据',
        '根据数据决定：坚持(persevere)还是转向(pivot)',
      ],
    },
    {
      name: 'MVP 类型',
      concept: 'MVP 不是 1.0 版本，而是最快验证假设的实验',
      steps: [
        '视频 MVP：用视频演示产品概念，看用户是否感兴趣',
        '礼宾(Concierge) MVP：人工提供服务，模拟产品体验',
        '绿野仙踪(Wizard of Oz) MVP：看起来全自动，背后人工操作',
        '假门(Fake Door) MVP：先放一个"即将推出"的按钮，测量点击率',
      ],
    },
    {
      name: '创新核算',
      concept: '用可操作的指标衡量创业进展，而非虚荣指标',
      steps: [
        '建立基准线：用 MVP 获取当前真实数据',
        '调整引擎：尝试改进方案，看是否优化了指标',
        '决定 pivot/persevere：如果调整没有改善指标，就 pivot',
      ],
    },
    {
      name: '增长引擎',
      concept: '可持续增长来自三大引擎之一',
      steps: [
        '黏着式增长：用户留存率高，不流失 → 改进产品',
        '病毒式增长：用户带来用户 → 提高病毒系数',
        '付费式增长：广告获客 → 提升 LTV > CAC',
      ],
    },
    {
      name: '5 个为什么',
      concept: '根因分析法，找到问题的根本原因而非表面症状',
      steps: [
        '描述问题现象',
        '连续问 5 次"为什么"，每次深入一层',
        '找到系统层面的根本原因',
        '在根源层面制定对策，而非临时补救',
      ],
    },
  ],
  phaseMapping: {
    1: '发现阶段：用"5 个为什么"深挖用户问题根源',
    2: '定义阶段：明确价值假设和增长假设，这是后续验证的基础',
    3: '构思阶段：识别最冒险的假设(leap-of-faith assumptions)，选择 MVP 类型',
    4: '原型阶段：实施 Build-Measure-Learn 循环，用 MVP 快速验证',
    5: '交付阶段：用创新核算评估进展，决定 pivot/persevere，识别增长引擎',
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
