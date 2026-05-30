// ============================================================
// AIICC 竞赛文档类型定义
// ============================================================

export type CompetitionDocType =
  | 'project_application'   // 项目申报书
  | 'research_report'       // 研究报告
  | 'innovation_log'        // 发明日志
  | 'novelty_report'        // 查新报告
  | 'poster'                // 展板文案
  | 'pitch_script'          // 路演逐字稿
  | 'submission_checklist'; // 提交清单

export const DocTypeMeta: Record<CompetitionDocType, { label: string; icon: string; description: string; group: string }> = {
  project_application: {
    label: '项目申报书',
    icon: '📋',
    description: '项目基本信息、摘要、背景、解决方案、创新点',
    group: '必交材料',
  },
  research_report: {
    label: '研究报告',
    icon: '📄',
    description: '完整的研究报告，含理论框架、方法、方案、结论',
    group: '必交材料',
  },
  innovation_log: {
    label: '发明日志',
    icon: '📓',
    description: '记录从发现问题到方案迭代的完整过程',
    group: '必交材料',
  },
  novelty_report: {
    label: '查新报告',
    icon: '🔍',
    description: '查新点、关键词、检索说明',
    group: '必交材料',
  },
  poster: {
    label: '展板文案',
    icon: '🖼️',
    description: '用于制作发明展板的完整文案',
    group: '展示材料',
  },
  pitch_script: {
    label: '路演逐字稿',
    icon: '🎤',
    description: '路演视频的完整脚本和镜头编排',
    group: '展示材料',
  },
  submission_checklist: {
    label: '提交清单',
    icon: '✅',
    description: '最终提交前的所有材料核对清单',
    group: '提交辅助',
  },
};

export interface CompetitionDocument {
  id: string;
  projectId: string;
  docType: CompetitionDocType;
  title: string;
  content: string;
  status: 'draft' | 'final';
  createdAt: string;
  updatedAt: string;
}
