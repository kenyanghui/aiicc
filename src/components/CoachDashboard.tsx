'use client';

import StudentCard, { type StudentData } from './StudentCard';

interface Props {
  students: StudentData[];
  onSelectStudent: (id: string) => void;
}

export default function CoachDashboard({ students, onSelectStudent }: Props) {
  const activeStudents = students.filter(s => s.status === 'active');
  const completedStudents = students.filter(s => s.status === 'completed');

  return (
    <div className="space-y-8">
      {/* 统计总览 */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: '学员总数', value: students.length, color: 'text-cyan-400' },
          { label: '辅导中', value: activeStudents.length, color: 'text-yellow-400' },
          { label: '已完成', value: completedStudents.length, color: 'text-green-400' },
          { label: '平均进度', value: `${Math.round(students.reduce((a, s) => a + (s.phase - 1) * 20, 0) / Math.max(students.length, 1))}%`, color: 'text-purple-400' },
        ].map(stat => (
          <div key={stat.label} className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4">
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="mt-1 text-xs text-slate-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* 辅导中学员 */}
      <div>
        <h3 className="mb-4 text-sm font-medium text-white">辅导中学员</h3>
        {activeStudents.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-700/50 py-12 text-center">
            <p className="text-sm text-slate-500">暂无辅导中学员</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {activeStudents.map(student => (
              <StudentCard
                key={student.id}
                student={student}
                onClick={() => onSelectStudent(student.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* 已完成学员 */}
      {completedStudents.length > 0 && (
        <div>
          <h3 className="mb-4 text-sm font-medium text-slate-400">已完成</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {completedStudents.map(student => (
              <StudentCard
                key={student.id}
                student={student}
                onClick={() => onSelectStudent(student.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
