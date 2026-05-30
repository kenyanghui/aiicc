// ============================================================
// AIICC 竞赛文档生成器
// 将步骤输出聚合到 ICC 竞赛文档模板中
// ============================================================

import { prisma } from '@/lib/prisma';
import { CompetitionDocType } from '@/types/document';
import { getTemplate } from './templates';
import { getVariablesForDocType, getStepsForDocType, getDocRefsForStep } from '@/lib/doc-mapping';
import { workflowPhases } from '@/lib/workflow';

/**
 * 为指定项目生成指定类型的竞赛文档
 */
export async function generateDocument(
  projectId: string,
  docType: CompetitionDocType
): Promise<{ title: string; content: string; missingSteps: string[] }> {
  // 1. 加载项目信息
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) throw new Error('项目未找到');

  // 2. 加载所有阶段输出
  const outputs = await prisma.phaseOutput.findMany({
    where: { projectId },
  });

  // 构建 map: "phase-step" → content
  const outputMap = new Map<string, string>();
  for (const o of outputs) {
    const key = `${o.phase}-${o.step}`;
    // 保留最新的
    if (!outputMap.has(key)) outputMap.set(key, o.content);
  }

  // 3. 构建变量值 map
  const variables: Record<string, string> = {};
  const missingSteps: string[] = [];
  const neededVariables = getVariablesForDocType(docType);

  // 从项目信息提取基本变量
  variables['project_name_and_desc'] = project.projectName || '[请补充项目名称]';
  variables['project_summary'] = project.description || '[请补充项目摘要]';
  variables['core_problems'] = project.description || '[请补充核心问题]';
  variables['application_value'] = '[请补充应用价值]';
  variables['future_plans'] = '[请补充未来计划]';
  variables['research_title'] = project.projectName || '[请补充研究标题]';
  variables['research_abstract'] = project.description || '[请补充研究摘要]';
  variables['research_conclusion'] = '[请补充结论]';
  variables['research_innovation_points'] = '[请补充创新点]';
  variables['theoretical_framework'] = '[请补充理论基础]';
  variables['innovation_keywords'] = '[请补充创新关键词]';

  // 从步骤输出映射变量
  for (const stepKey of getStepsForDocType(docType)) {
    const [p, s] = stepKey.split('-');
    const content = outputMap.get(`${p}-${s}`);

    if (content && content.trim()) {
      const refs = getDocRefsForStep(stepKey);
      for (const ref of refs) {
        if (ref.docType === docType && !variables[ref.variable]) {
          variables[ref.variable] = content;
        }
      }
    } else {
      const phase = workflowPhases.find(ph => ph.id === parseInt(p));
      const step = phase?.steps.find(st => st.step === parseInt(s));
      const stepName = step ? `"${step.title}（${phase?.name}阶段）"` : `步骤${stepKey}`;
      missingSteps.push(stepKey);

      const refs = getDocRefsForStep(stepKey);
      for (const ref of refs) {
        if (ref.docType === docType && !variables[ref.variable]) {
          variables[ref.variable] = `[请先完成${stepName}步骤]`;
        }
      }
    }
  }

  // 为特别变量设置默认值
  const defaults: Record<string, string> = {
    poster_title: project.projectName || '[请补充项目名称]',
    poster_elevator_pitch: project.description?.slice(0, 100) || '[请补充一句话亮点]',
    poster_solution: '[请在此描述解决方案]',
    poster_sdg: '[请补充与 SDG 目标的关联]',
    poster_ui_description: '[请补充界面/用户体验描述]',
    poster_final_product: '[请补充最终产品描述]',
    poster_tech: '[请补充技术方案说明]',
    pitch_opening: `大家好！我们是【${project.projectName}】项目团队。今天由我们为大家介绍我们的创新项目。`,
    pitch_full_script: '[请补充路演正文]',
    pitch_closing: '以上就是我们的项目介绍，谢谢大家！',
    checklist_items: '- [ ] 项目申报书\n- [ ] 研究报告\n- [ ] 发明日志\n- [ ] 查新报告\n- [ ] 展板\n- [ ] 路演视频',
    novelty_points: '[请补充查新点]',
    novelty_keywords: '[请补充查新关键词]',
    novelty_search_strategy: '[请补充检索策略]',
    novelty_conclusion: '[请补充查新结论]',
    novelty_appendices: '',
    research_competition: '[请补充现有方案分析]',
    research_user_persona: '[请补充用户画像]',
    sdg_alignment: '[请补充 SDG 目标对齐]',
    solution_value_canvas: '[请补充价值画布]',
    solution_selected: '[请补充选定方案描述]',
    solution_features: '[请补充核心功能描述]',
    innovation_novelty: '[请补充创新点论述]',
    innovation_assumptions: '[请补充关键假设]',
    project_results: '[请补充项目成果]',
    target_users: '[请补充目标用户描述]',
    log_discover_problem: '[请补充问题发现日志]',
    log_discover_rootcause: '[请补充根因分析日志]',
    log_ideate_brainstorm: '[请补充头脑风暴日志]',
    log_ideate_selection: '[请补充方案筛选日志]',
    log_prototype_mvp: '[请补充 MVP 定义日志]',
    log_prototype_ui: '[请补充界面设计日志]',
    log_prototype_bml: '[请补充 BML 循环日志]',
    log_deliver_build: '[请补充最终搭建日志]',
    log_define_assumptions: '[请补充关键假设日志]',
    research_problem_analysis: project.description || '[请补充问题分析]',
    research_alternatives: '[请补充备选方案]',
    research_solution_detail: '[请补充方案详情]',
    research_mvp: '[请补充 MVP 描述]',
    research_tech_stack: '[请补充技术栈]',
    research_testing: '[请补充测试结果]',
    research_innovation_accounting: '[请补充创新核算]',
  };

  for (const [key, value] of Object.entries(defaults)) {
    if (!variables[key]) {
      variables[key] = value;
    }
  }

  // 4. 替换模板变量
  const tmpl = getTemplate(docType);
  let content = tmpl.template;

  for (const [key, value] of Object.entries(variables)) {
    const placeholder = `{{${key}}}`;
    // 只替换不在变量列表里的占位符
    if (content.includes(placeholder)) {
      content = content.replaceAll(placeholder, value);
    }
  }

  // 清理未替换的占位符
  content = content.replace(/\{\{[^}]+\}\}/g, '[请补充]');

  return {
    title: tmpl.title,
    content,
    missingSteps,
  };
}

/**
 * 生成项目所有 7 份文档
 */
export async function generateAllDocuments(projectId: string) {
  const docTypes: CompetitionDocType[] = [
    'project_application',
    'research_report',
    'innovation_log',
    'novelty_report',
    'poster',
    'pitch_script',
    'submission_checklist',
  ];

  const results = [];
  for (const docType of docTypes) {
    try {
      const result = await generateDocument(projectId, docType);
      // 保存到数据库
      const existing = await prisma.document.findUnique({
        where: { projectId_docType: { projectId, docType } },
      });

      if (existing) {
        await prisma.document.update({
          where: { id: existing.id },
          data: { content: result.content, title: result.title, status: 'draft' },
        });
      } else {
        await prisma.document.create({
          data: { projectId, docType, title: result.title, content: result.content, status: 'draft' },
        });
      }
      results.push({ docType, ok: true, missingSteps: result.missingSteps });
    } catch (err) {
      results.push({ docType, ok: false, error: String(err) });
    }
  }
  return results;
}

/**
 * 获取项目文档生成状态
 */
export async function getDocumentStatus(projectId: string) {
  const outputs = await prisma.phaseOutput.findMany({
    where: { projectId },
    select: { phase: true, step: true },
  });

  const completedSteps = new Set(outputs.map(o => `${o.phase}-${o.step}`));
  const totalSteps = 20;
  const completedCount = completedSteps.size;

  const docs = await prisma.document.findMany({ where: { projectId } });
  const docStatusMap = new Map(docs.map(d => [d.docType, d]));

  return {
    totalSteps,
    completedSteps: completedCount,
    progressPercent: Math.round((completedCount / totalSteps) * 100),
    documents: docStatusMap,
  };
}
