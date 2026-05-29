'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface StudentCard {
  id: string;
  name: string;
  age: string;
  projectName: string;
  phase: number;
  lastActive: string;
}

export default function CoachPage() {
  const router = useRouter();
  const [students] = useState<StudentCard[]>([
    { id: '1', name: '学员一', age: '10', projectName: '星星糖', phase: 2, lastActive: '今天' },
    { id: '2', name: '甄锦弘', age: '13', projectName: '自学星球', phase: 4, lastActive: '昨天' },
  ]);

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-5xl">
        {/* 头部 */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">教练看板</h1>
            <p className="mt-1 text-sm text-slate-400">
              管理你的学员项目
            </p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-400 transition hover:border-slate-500 hover:text-white"
          >
            ← 回到首页
          </button>
        </div>

        {/* 统计 */}
        <div className="mb-8 grid grid-cols-3 gap-4">
          {[
            { label: '辅导中学员', value: students.length.toString(), color: 'text-cyan-400' },
            { label: '进行中项目', value: students.filter(s => s.phase < 5).length.toString(), color: 'text-yellow-400' },
            { label: '已完成项目', value: students.filter(s => s.phase >= 5).length.toString(), color: 'text-green-400' },
          ].map(stat => (
            <div key={stat.label} className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-5">
              <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="mt-1 text-xs text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* 学员列表 */}
        <div className="rounded-xl border border-slate-700/50 bg-slate-800/30">
          <div className="border-b border-slate-700/50 px-6 py-4">
            <h2 className="text-sm font-medium text-white">学员项目</h2>
          </div>
          <div className="divide-y divide-slate-700/50">
            {students.map(s => {
              const phaseLabels = ['', '发现', '定义', '构思', '原型', '交付'];
              const phaseColors = ['', 'text-purple-400', 'text-blue-400', 'text-yellow-400', 'text-emerald-400', 'text-rose-400'];
              return (
                <div
                  key={s.id}
                  onClick={() => router.push(`/coach/students/${s.id}`)}
                  className="flex cursor-pointer items-center gap-4 px-6 py-4 transition hover:bg-slate-700/30"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-700 text-sm text-white">
                    {s.name[0]}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">{s.name}</div>
                    <div className="text-xs text-slate-500">{s.age}岁 · {s.projectName}</div>
                  </div>
                  <div className={`text-xs font-medium ${phaseColors[s.phase]}`}>
                    Phase {s.phase} · {phaseLabels[s.phase]}
                  </div>
                  <div className="text-xs text-slate-500">{s.lastActive}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
