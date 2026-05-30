'use client';

export interface StudentData {
  id: string;
  name: string;
  age: number;
  projectName: string;
  projectDescription: string;
  phase: number;
  lastActive: string;
  status: 'active' | 'paused' | 'completed';
}

interface Props {
  student: StudentData;
  onClick: () => void;
}

const phaseColors: Record<number, string> = {
  1: 'text-purple-400 border-purple-500/30',
  2: 'text-blue-400 border-blue-500/30',
  3: 'text-yellow-400 border-yellow-500/30',
  4: 'text-emerald-400 border-emerald-500/30',
  5: 'text-rose-400 border-rose-500/30',
};

const phaseLabels: Record<number, string> = {
  1: '发现',
  2: '定义',
  3: '构思',
  4: '原型',
  5: '交付',
};

const phaseIcons: Record<number, string> = {
  1: '🔍',
  2: '🎯',
  3: '💡',
  4: '🛠️',
  5: '🚀',
};

const statusColors: Record<string, string> = {
  active: 'bg-green-500',
  paused: 'bg-yellow-500',
  completed: 'bg-blue-500',
};

export default function StudentCard({ student, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer rounded-xl border border-slate-700/50 bg-slate-800/30 p-5 transition hover:border-slate-600 hover:bg-slate-800/50"
    >
      {/* 头部 */}
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-700 text-sm font-medium text-white">
          {student.name[0]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-white truncate">{student.name}</span>
            <span className={`h-1.5 w-1.5 rounded-full ${statusColors[student.status]}`} />
          </div>
          <div className="text-xs text-slate-500">{student.age}岁</div>
        </div>
      </div>

      {/* 项目信息 */}
      <div className="mb-3">
        <div className="text-xs font-medium text-slate-300 truncate">{student.projectName}</div>
        <div className="mt-0.5 text-[10px] text-slate-600 line-clamp-2">{student.projectDescription}</div>
      </div>

      {/* 进度 */}
      <div className="flex items-center justify-between">
        <div className={`rounded-md border px-2 py-0.5 text-[10px] font-medium ${phaseColors[student.phase] || 'text-slate-500'}`}>
          {phaseIcons[student.phase]} Phase {student.phase} · {phaseLabels[student.phase]}
        </div>
        <div className="text-[10px] text-slate-600">{student.lastActive}</div>
      </div>
    </div>
  );
}
