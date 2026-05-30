// ============================================================
// AIICC 竞赛文档模板
// 使用 {{variable_name}} 占位符，由 generator.ts 替换
// ============================================================

import { CompetitionDocType } from '@/types/document';

interface DocTemplate {
  title: string;
  template: string;
}

const templates: Record<CompetitionDocType, DocTemplate> = {
  // ===== 项目申报书 =====
  project_application: {
    title: '项目申报书',
    template: `# 项目申报书

## 一、项目基本信息

- 项目名称：{{project_name_and_desc}}
- 参赛主题：[请补充]
- 参赛组别：[请补充]
- 参赛形式：团队项目
- 团队成员：[请补充]
- 指导教师：[请补充]

## 二、项目摘要

{{project_summary}}

## 三、项目背景

{{problem_background}}

### 与联合国可持续发展目标的关联

{{sdg_alignment}}

## 四、要解决的核心问题

{{core_problems}}

### 目标用户

{{target_users}}

## 五、解决方案

### 价值主张

{{solution_value_canvas}}

### 方案描述

{{solution_features}}

## 六、项目创新点

{{innovation_novelty}}

## 七、项目成果

{{project_results}}

## 八、应用价值

{{application_value}}

## 九、未来计划

{{future_plans}}
`,
  },

  // ===== 研究报告 =====
  research_report: {
    title: '研究报告',
    template: `# 研究报告

## 一、项目名称

{{research_title}}

## 二、参赛信息

- 参赛主题：[请补充]
- 参赛组别：[请补充]
- 团队成员：[请补充]
- 指导教师：[请补充]

## 三、摘要

{{research_abstract}}

## 四、研究背景与问题提出

### 1. 现实背景

{{research_problem_analysis}}

### 2. 现有方案分析

{{research_competition}}

## 五、理论基础

{{theoretical_framework}}

## 六、方案设计

### 备选方案

{{research_alternatives}}

### 方案详情

{{research_solution_detail}}

## 七、原型实现

{{research_mvp}}

### 技术实现

{{research_tech_stack}}

## 八、测试与验证

{{research_testing}}

## 九、项目创新点

{{research_innovation_points}}

## 十、结论

{{research_conclusion}}

## 十一、参考文献

[请补充参考文献]
`,
  },

  // ===== 发明日志 =====
  innovation_log: {
    title: '发明日志',
    template: `# 发明日志

## 一、项目信息

- 项目名称：{{project_name_and_desc}}
- 参赛主题：[请补充]
- 团队成员：[请补充]
- 指导教师：[请补充]

## 二、发明过程总览

本项目围绕"{{core_problems}}"这一问题展开，整体经历了"发现问题 - 方案构思 - 原型搭建 - 迭代优化"的过程。

## 三、发明日志正文

### 阶段一：发现问题

{{log_discover_problem}}

#### 日志 1：问题发现

{{log_discover_problem}}

---

#### 日志 2：根因分析

{{log_discover_rootcause}}

阶段结论：明确了项目要解决的核心问题。

### 阶段二：方案构思

{{log_ideate_brainstorm}}

#### 日志 3：头脑风暴

{{log_ideate_brainstorm}}

---

#### 日志 4：方案筛选与确定

{{log_ideate_selection}}

阶段结论：确定了最终方案方向。

### 阶段三：内容设计与原型搭建

{{log_prototype_mvp}}

#### 日志 5：MVP 定义

{{log_prototype_mvp}}

---

#### 日志 6：界面设计

{{log_prototype_ui}}

---

#### 日志 7：技术实现

{{log_define_assumptions}}

---

#### 日志 8：BML 循环

{{log_prototype_bml}}

### 阶段四：测试与优化

{{log_deliver_build}}

阶段结论：项目已具备完整的原型和展示基础。

## 四、成员分工说明

[请补充真实的成员分工]

## 五、最终提交前补齐清单

- 所有日志补真实日期
- 补每阶段的过程照片、截图或草图
- 补成员讨论记录
- 补用户反馈或试用记录
- 导出 PDF 版作为正式提交材料
`,
  },

  // ===== 查新报告 =====
  novelty_report: {
    title: '查新报告（委托草案）',
    template: `# 查新报告

## 一、查新项目名称

{{project_name_and_desc}}

## 二、查新点

{{novelty_points}}

## 三、查新关键词

{{novelty_keywords}}

## 四、检索范围与策略

{{novelty_search_strategy}}

## 五、与现有方案的对比分析

{{novelty_existing}}

## 六、查新结论

{{novelty_conclusion}}

## 七、补充说明

{{novelty_appendices}}

---

> **注意**：本文档为查新委托草案，正式提交需获得查新机构盖章版本。
`,
  },

  // ===== 展板文案 =====
  poster: {
    title: '发明展板文案',
    template: `# 发明展板文案

## 一、展板标题区

### 主标题

{{poster_title}}

### 一句话亮点

{{poster_elevator_pitch}}

### 基本信息

- 参赛主题：[请补充]
- 参赛组别：[请补充]
- 团队成员：[请补充]
- 指导教师：[请补充]

---

## 二、问题发现

{{problem_background}}

### 与可持续发展目标的关联

{{poster_sdg}}

---

## 三、解决方案

{{poster_solution}}

### 系统架构

\`\`\`
[请在此插入方案架构图]
\`\`\`

---

## 四、三大模块详解

{{poster_ui_description}}

---

## 五、项目创新点

{{research_innovation_points}}

---

## 六、项目原型与成果

{{poster_final_product}}

### 配图建议

- [请插入首页截图]
- [请插入核心页面截图]
- [请插入原型照片]

---

## 七、技术方案

{{poster_tech}}

---

## 八、项目价值

{{application_value}}

---

## 九、研究时间线

[请补充项目时间线]

---

## 十、展板底部信息

**提交前确认**：
- [ ] 指导教师信息已补充
- [ ] 原型截图和实物照片已插入
- [ ] 发明日志时间线已对齐
- [ ] 查新结论已更新
`,
  },

  // ===== 路演逐字稿 =====
  pitch_script: {
    title: '路演逐字稿',
    template: `# 路演逐字稿

## 一、项目信息

- 项目名称：{{project_name_and_desc}}
- 参赛主题：[请补充]
- 参赛组别：[请补充]
- 团队成员：[请补充]

## 二、开场

{{pitch_opening}}

## 三、正文

{{pitch_full_script}}

## 四、结束语

{{pitch_closing}}

---

## 五、镜头编排建议

### 场景一：开场（约 30 秒）
- 镜头：全员出镜
- 内容：介绍团队和项目名称

### 场景二：问题发现（约 60 秒）
- 镜头：主讲人 + 展板
- 内容：说明要解决的问题

### 场景三：方案展示（约 90 秒）
- 镜头：主讲人 + 原型演示
- 内容：展示方案和原型

### 场景四：创新与价值（约 30 秒）
- 镜头：全员出镜
- 内容：创新点和项目价值

### 场景五：结尾（约 30 秒）
- 镜头：全员出镜
- 内容：总结和致谢

---

## 六、答辩问题准备

[请准备 3-5 个常见问题及答案]
`,
  },

  // ===== 提交清单 =====
  submission_checklist: {
    title: '材料提交清单',
    template: `# 材料提交清单

## 一、团队基本信息

- 项目名称：{{project_name_and_desc}}
- 参赛主题：[请补充]
- 参赛组别：[请补充]
- 团队成员：[请补充]
- 指导教师：[请补充]

## 二、必交材料清单

{{checklist_items}}

### 1. 项目申报书
- [ ] 已检查项目名称一致性
- [ ] 已补充指导教师信息
- [ ] 已检查字数符合报名系统要求

### 2. 研究报告
- [ ] 已补充参考文献
- [ ] 已统一项目名称和成员信息
- [ ] 已导出 PDF

### 3. 发明日志
- [ ] 所有日志已补充真实日期
- [ ] 已插入过程照片和截图
- [ ] 已导出 PDF

### 4. 查新报告
- [ ] 已获得正式盖章版本
- [ ] 查新点与项目描述一致

### 5. 发明展板
- [ ] 已排成正式展板
- [ ] 已放入原型图和照片
- [ ] 已按官方尺寸导出

### 6. 路演视频
- [ ] 所有成员已出镜
- [ ] 已控制在规定时间内
- [ ] 已导出 MP4

## 三、冲奖补强材料

- [ ] 原型迭代前后对比图
- [ ] 用户试用反馈
- [ ] 团队分工说明页

## 四、提交前统一核对

- [ ] 项目名称在所有材料中一致
- [ ] 参赛主题统一
- [ ] 组别统一
- [ ] 成员姓名和学校完全一致
- [ ] 创新点表述一致

## 五、最容易丢分的地方

1. 发明日志像事后补写，没有真实过程感
2. 路演只有一个人讲
3. 展板图太花，问题、方案、亮点不清楚
4. 查新报告没有正式盖章
5. 作品介绍像"品牌项目"而不是"发明项目"
`,
  },
};

export function getTemplate(docType: CompetitionDocType): DocTemplate {
  return templates[docType];
}

export { templates };
