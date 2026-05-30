// ============================================================
// AIICC 步骤输出 → ICC 竞赛文档映射
// ============================================================
// 定义工作流中 20 个步骤的输出如何映射到 7 份竞赛文档
// 每步输出可贡献到多份文档的不同章节
// ============================================================

import { CompetitionDocType } from '@/types/document';

export interface DocSectionRef {
  docType: CompetitionDocType;
  section: string;
  variable: string;       // 模板中的变量名 {{variable}}
  description: string;    // 用途说明
}

// 每个步骤的产出映射到哪些文档的哪些章节
const stepDocMapping: Record<string, DocSectionRef[]> = {
  // ======== 阶段 1: 发现 ========
  '1-1': [
    { docType: 'project_application', section: '项目背景', variable: 'problem_background', description: '想解决的问题背景' },
    { docType: 'innovation_log', section: '阶段一·发现问题', variable: 'log_discover_problem', description: '日志1: 问题发现' },
  ],
  '1-2': [
    { docType: 'innovation_log', section: '阶段一·根因分析', variable: 'log_discover_rootcause', description: '日志2: 根因分析' },
    { docType: 'research_report', section: '研究背景', variable: 'research_problem_analysis', description: '问题分析' },
  ],
  '1-3': [
    { docType: 'project_application', section: '项目背景', variable: 'sdg_alignment', description: 'SDG 目标对齐' },
    { docType: 'poster', section: '问题发现', variable: 'poster_sdg', description: '展板 SDG 部分' },
  ],
  '1-4': [
    { docType: 'research_report', section: '用户分析', variable: 'research_user_persona', description: '用户画像分析' },
    { docType: 'project_application', section: '核心问题', variable: 'target_users', description: '目标用户描述' },
  ],

  // ======== 阶段 2: 定义 ========
  '2-1': [
    { docType: 'project_application', section: '解决方案', variable: 'solution_value_canvas', description: '价值画布' },
    { docType: 'poster', section: '解决方案', variable: 'poster_solution', description: '展板解决方案' },
  ],
  '2-2': [
    { docType: 'research_report', section: '现有方案分析', variable: 'research_competition', description: '竞品分析' },
    { docType: 'novelty_report', section: '查新对比', variable: 'novelty_existing', description: '现有方案' },
  ],
  '2-3': [
    { docType: 'project_application', section: '创新点', variable: 'innovation_assumptions', description: '关键假设' },
    { docType: 'innovation_log', section: '阶段二·方案决策', variable: 'log_define_assumptions', description: '日志: 信念飞跃假设' },
  ],
  '2-4': [
    { docType: 'project_application', section: '项目基本信息', variable: 'project_name_and_desc', description: '项目名称和一句话描述' },
    { docType: 'poster', section: '标题区', variable: 'poster_title', description: '展板标题' },
    { docType: 'pitch_script', section: '开场', variable: 'pitch_opening', description: '路演开场介绍' },
  ],

  // ======== 阶段 3: 构思 ========
  '3-1': [
    { docType: 'innovation_log', section: '阶段二·方案构思', variable: 'log_ideate_brainstorm', description: '日志3: 头脑风暴' },
    { docType: 'research_report', section: '方案设计', variable: 'research_alternatives', description: '方案备选' },
  ],
  '3-2': [
    { docType: 'innovation_log', section: '阶段二·方案确定', variable: 'log_ideate_selection', description: '日志4: 方案筛选' },
    { docType: 'project_application', section: '解决方案', variable: 'solution_selected', description: '选定方案' },
  ],
  '3-3': [
    { docType: 'research_report', section: '方案详情', variable: 'research_solution_detail', description: '方案详细描述' },
    { docType: 'project_application', section: '解决方案', variable: 'solution_features', description: '核心功能和场景' },
  ],
  '3-4': [
    { docType: 'novelty_report', section: '查新点', variable: 'novelty_points', description: '查新点: 新颖性评估结果' },
    { docType: 'project_application', section: '创新点', variable: 'innovation_novelty', description: '创新点论述' },
  ],

  // ======== 阶段 4: 原型 ========
  '4-1': [
    { docType: 'innovation_log', section: '阶段三·原型搭建', variable: 'log_prototype_mvp', description: '日志5: MVP 定义' },
    { docType: 'research_report', section: '原型实现', variable: 'research_mvp', description: 'MVP 描述' },
  ],
  '4-2': [
    { docType: 'poster', section: '原型展示', variable: 'poster_ui_description', description: '展板界面描述' },
    { docType: 'innovation_log', section: '阶段三·界面设计', variable: 'log_prototype_ui', description: '日志6: 界面设计' },
  ],
  '4-3': [
    { docType: 'research_report', section: '技术实现', variable: 'research_tech_stack', description: '技术栈选择' },
    { docType: 'poster', section: '技术方案', variable: 'poster_tech', description: '展板技术方案' },
  ],
  '4-4': [
    { docType: 'innovation_log', section: '阶段四·测试与优化', variable: 'log_prototype_bml', description: '日志8: BML 循环' },
    { docType: 'research_report', section: '测试与验证', variable: 'research_testing', description: '测试结果' },
  ],

  // ======== 阶段 5: 交付 ========
  '5-1': [
    { docType: 'innovation_log', section: '阶段四·最终搭建', variable: 'log_deliver_build', description: '日志: 最终搭建' },
    { docType: 'poster', section: '成果展示', variable: 'poster_final_product', description: '最终产品' },
  ],
  '5-2': [
    { docType: 'research_report', section: '创新核算', variable: 'research_innovation_accounting', description: '创新核算结果' },
    { docType: 'project_application', section: '项目成果', variable: 'project_results', description: '项目成果总结' },
  ],
  '5-3': [
    { docType: 'pitch_script', section: '正文', variable: 'pitch_full_script', description: '完整的路演稿' },
    { docType: 'poster', section: '一句话亮点', variable: 'poster_elevator_pitch', description: '展板一句话亮点' },
  ],
  '5-4': [
    { docType: 'submission_checklist', section: '全部', variable: 'checklist_items', description: '提交检查清单' },
    { docType: 'novelty_report', section: '补充说明', variable: 'novelty_appendices', description: '查新补充' },
  ],
};

/**
 * 获取某一步骤对应的文档章节引用列表
 */
export function getDocRefsForStep(stepKey: string): DocSectionRef[] {
  return stepDocMapping[stepKey] || [];
}

/**
 * 获取生成某份文档所需的所有步骤键列表
 */
export function getStepsForDocType(docType: CompetitionDocType): string[] {
  const steps: string[] = [];
  for (const [stepKey, refs] of Object.entries(stepDocMapping)) {
    if (refs.some(r => r.docType === docType)) {
      steps.push(stepKey);
    }
  }
  return steps;
}

/**
 * 获取某份文档所需的所有变量名列表
 */
export function getVariablesForDocType(docType: CompetitionDocType): string[] {
  const variables = new Set<string>();
  for (const refs of Object.values(stepDocMapping)) {
    for (const r of refs) {
      if (r.docType === docType) {
        variables.add(r.variable);
      }
    }
  }
  return Array.from(variables);
}

/**
 * 获取所有文档类型列表（按组排序）
 */
export function getDocTypesByGroup(): Record<string, CompetitionDocType[]> {
  const groups: Record<string, CompetitionDocType[]> = {
    '必交材料': ['project_application', 'research_report', 'innovation_log', 'novelty_report'],
    '展示材料': ['poster', 'pitch_script'],
    '提交辅助': ['submission_checklist'],
  };
  return groups;
}

export { stepDocMapping };
