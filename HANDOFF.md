# HANDOFF — Claude ↔ Codex 接力文档

## 当前项目
> AIICC — AI 商科辅导平台

## 任务状态
- [x] PRD 已产出
- [x] 架构方案已产出
- [ ] 平台基础骨架 ← **当前交棒位置：Codex**
- [ ] AI 多角色对话引擎
- [ ] 工作流引擎
- [ ] 教练后台
- [ ] 代码审查 & 优化

## 上下文
- **产品定位**: AI 驱动的 ICC 项目辅导平台
- **核心技术**: Next.js + 多角色 AI + 工作流引擎
- **5 个 AI 角色**: 苏格拉底、分析师、创意伙伴、架构师、审查官
- **5 个辅导阶段**: 发现 → 定义 → 构思 → 原型 → 交付
- **方法论文持**: 心光微笑模型、设计思维、精益创业
- **用户类型**: 学员（8-18岁）+ 教练（你）

## 给 Codex 的具体指令

在 `src/` 下创建 AIICC 平台项目骨架（Next.js + Tailwind）。

### 1. 项目初始化
```bash
cd src/
npx create-next-app@latest aiicc --typescript --tailwind --eslint --app --src-dir
cd aiicc
npm install prisma @prisma/client
npx prisma init --datasource-provider sqlite
```

### 2. 页面清单
| 路径 | 页面 | 说明 |
|------|------|------|
| `/` | 首页 | 学员入口 + 平台介绍 |
| `/project/new` | 创建项目 | 学员信息 + 项目初始 |
| `/project/[id]` | 项目工作区 | 工作流侧栏 + 对话主区 |
| `/project/[id]/phase/[phaseId]` | 阶段详情 | 具体步骤执行 |
| `/coach` | 教练看板 | 学员总览 |
| `/coach/students/[id]` | 学员详情 | 对话记录、进度、点评 |

### 3. 先搭结构用 mock 数据
- AI 对话返回预设回复
- 工作流步骤从 JSON 配置读取
- 学员数据用内存存储

### 4. 关键组件优先级
1. WorkflowSidebar — 五阶段导航
2. ChatPanel — AI 对话界面（气泡式）
3. AIChatMessage — 不同角色不同颜色
4. RoleSelector — 切换 AI 角色
5. PhaseProgress — 进度条
6. CoachDashboard — 学员卡片网格

### 5. 设计风格
- 专业、干净、教育感
- 主色：深蓝 #0f172a + 青色 #06b6d4
- 每个 AI 角色有独立的色彩标识
- 移动端适配

---

## 交棒记录
| 时间 | 从 | 到 | 说明 |
|------|----|----|------|
| 2026-05-29 | Claude | Codex | AIICC 平台骨架生成 |
