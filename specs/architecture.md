# AIICC — 技术架构方案

> Next.js + 多角色 AI 引擎 + 工作流引擎

---

## 1. 技术栈

| 层级 | 技术 | 选型理由 |
|------|------|---------|
| **前端** | Next.js 14 (App Router) | 前后端一体，快速迭代 |
| **样式** | Tailwind CSS + shadcn/ui | 专业 UI，开发效率高 |
| **数据库** | SQLite via Prisma | 零配置，单文件部署 |
| **AI 引擎** | MiniMax / Claude API | 多角色对话能力 |
| **状态管理** | React Context + localStorage | 轻量，无需额外依赖 |
| **部署** | Vercel Railway | 快速部署 |

---

## 2. 项目结构

```
aiicc/
├── src/
│   ├── app/
│   │   ├── page.tsx              # 平台首页（项目选择/创建）
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   │
│   │   ├── project/[id]/         # 学员项目工作区
│   │   │   ├── page.tsx          # 项目概览
│   │   │   ├── discover/         # Phase 1 发现
│   │   │   ├── define/           # Phase 2 定义
│   │   │   ├── ideate/           # Phase 3 构思
│   │   │   ├── prototype/        # Phase 4 原型
│   │   │   └── deliver/          # Phase 5 交付
│   │   │
│   │   ├── coach/                # 教练后台
│   │   │   ├── page.tsx          # 看板
│   │   │   ├── students/         # 学员列表
│   │   │   └── templates/        # 模板管理
│   │   │
│   │   └── api/                  # API 路由
│   │       ├── chat/             # AI 对话
│   │       ├── project/          # 项目 CRUD
│   │       ├── student/          # 学员管理
│   │       └── workflow/         # 工作流引擎
│   │
│   ├── components/
│   │   ├── WorkflowSidebar.tsx   # 工作流导航
│   │   ├── ChatPanel.tsx         # AI 对话面板
│   │   ├── AIChatMessage.tsx     # 对话气泡
│   │   ├── RoleSelector.tsx      # AI 角色切换
│   │   ├── PhaseProgress.tsx     # 阶段进度
│   │   ├── OutputTemplate.tsx    # 结构化产出模板
│   │   ├── CoachDashboard.tsx    # 教练看板
│   │   ├── StudentCard.tsx       # 学员卡片
│   │   └── MethodologyCard.tsx   # 方法论卡片
│   │
│   ├── lib/
│   │   ├── ai.ts                 # AI 多角色引擎
│   │   ├── workflow.ts           # 工作流定义
│   │   ├── prompts.ts            # 各角色系统提示词
│   │   ├── prisma.ts             # 数据库
│   │   └── methodologies.ts      # 方法论定义
│   │
│   └── types/
│       ├── project.ts
│       ├── workflow.ts
│       └── chat.ts
│
├── prisma/
│   └── schema.prisma
├── .env.local
└── package.json
```

---

## 3. 数据模型

```
Project
  id              String  (PK)
  studentName     String
  studentAge      Int
  projectName     String
  description     String
  sdgGoal         String?  (SDG 编号)
  currentPhase    Int      (1-5)
  currentStep     Int
  status          Enum    (ACTIVE / PAUSED / COMPLETED)
  coachNotes      String?
  createdAt       DateTime
  updatedAt       DateTime

PhaseOutput
  id              String  (PK)
  projectId       String  (FK → Project)
  phase           Int     (1-5)
  step            Int
  outputType      String  (TEXT / CANVAS / LIST / FILE)
  content         String  (JSON)
  aiRoleUsed      String  (苏格拉底/分析师/创意伙伴/架构师/审查官)
  createdAt       DateTime

ChatMessage
  id              String  (PK)
  projectId       String  (FK → Project)
  phase           Int
  step            Int
  role            Enum    (AI / STUDENT)
  aiRole          String? (当前 AI 角色)
  content         String
  metadata        String? (JSON)
  createdAt       DateTime

WorkflowTemplate
  id              String  (PK)
  name            String
  description     String
  phases          String  (JSON — 五阶段定义)
  isDefault       Boolean
  createdAt       DateTime
```

---

## 4. AI 多角色引擎

### 4.1 角色系统提示词 (System Prompts)

每个 AI 角色有独立的 system prompt，定义人设、语气、行为边界：

```
苏格拉底:
  你是一位善用提问引导思考的导师。
  规则：永远不直接给答案，用反问引导学员自己发现。
  句式："你为什么这么想？""如果反过来会怎样？""还有别的可能吗？"

分析师:
  你是一位理性、结构化的分析师。
  擅长：逻辑推理、数据分析、框架化思考。
  规则：用结构化的方式输出分析结果，多用框架和模型。

创意伙伴:
  你是一位热情、天马行空的创意达人。
  擅长：头脑风暴、联想、发散思维。
  规则：鼓励一切想法，先发散后收敛。

架构师:
  你是一位经验丰富的技术/产品架构师。
  擅长：方案设计、可行性评估、技术选型。
  规则：给出务实可行的建议，说明权衡。

审查官:
  你是一位严谨但善意的评审专家。
  擅长：发现漏洞、风险评估、质量提升。
  规则：指出问题的同时给出改进建议。
```

### 4.2 角色切换逻辑

```
用户触发某个步骤 → 系统自动匹配 AI 角色 →
  发送 system prompt + 上下文 + 用户输入 →
  返回 AI 响应 → 流式展示
```

---

## 5. 工作流引擎

工作流定义在 `src/lib/workflow.ts` 中：

```typescript
interface WorkflowStep {
  id: string;
  phase: number;
  step: number;
  title: string;
  description: string;
  aiRole: 'socrates' | 'analyst' | 'creative' | 'architect' | 'reviewer';
  outputType: 'text' | 'canvas' | 'list';
  promptTemplate: string;
}

interface WorkflowPhase {
  id: number;
  name: string;
  icon: string;
  steps: WorkflowStep[];
}
```

工作流数据驱动 UI 渲染：每个步骤自动加载对应的 AI 角色、输入模板和产出模板。

---

## 6. 页面设计概要

### 首页
- 极简风格："你的 ICC 项目，从一次对话开始"
- 输入学员昵称 + 邀请码 → 进入/创建项目
- Coach 入口（隐藏 URL 或密码保护）

### 项目工作区
```
┌─────────────────────────────────────┐
│ 导航栏                               │
├──────────┬──────────────────────────┤
│ 工作流侧栏 │  主内容区                  │
│          │                          │
│ Phase 1  │  [当前步骤标题]            │
│  ├ Step1 │  [步骤说明]               │
│  ├ Step2 │  [AI 对话面板 / 产出面板]  │
│  ├ Step3 │                          │
│ Phase 2  │                          │
│ Phase 3  │                          │
└──────────┴──────────────────────────┘
```

### 教练后台
```
┌─────────────────────────────────────┐
│ 学员总览 | 模板管理 | 设置            │
├─────────────────────────────────────┤
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ │
│ │ 学员1 │ │ 学员2 │ │ 学员3 │ │ 学员4 │ │
│ │ Phase3│ │ Phase1│ │ Phase5│ │ Phase2│ │
│ └──────┘ └──────┘ └──────┘ └──────┘ │
├─────────────────────────────────────┤
│ 点击学员 → 查看详情、对话记录、点评   │
└─────────────────────────────────────┘
```

---

## 7. 与 icc-agents 和 selflearnstar 的关系

| 项目 | 角色 | AIICC 平台的支持方式 |
|------|------|---------------------|
| icc-agents (StarCandy) | 参赛项目 | 学员可在 AIICC 上完成工作流，代码生成走 Claude/Codex |
| selflearnstar (自学星球) | 参赛项目 | 同上 |
| 未来更多项目 | 参赛项目 | 标准工作流支持 |

**数据不互通**：三个项目各自独立。AIICC 是"辅导平台"，icc-agents 和 selflearnstar 是"参赛项目"。
