'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function HomePage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [code, setCode] = useState('');

  const handleStart = () => {
    if (!name.trim()) return;
    // 简单模式：用昵称创建或进入项目
    const projectId = `demo-${Date.now()}`;
    // 存储学员信息到 localStorage
    localStorage.setItem('aiicc_student', JSON.stringify({ name: name.trim(), code }));
    router.push(`/project/${projectId}`);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      {/* 背景装饰 */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-purple-500/8 blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo & 标题 */}
        <div className="mb-10 text-center">
          <div className="mb-4 text-5xl">🚀</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight">
            AIICC
          </h1>
          <p className="text-sm text-slate-400">
            AI 创新项目辅导平台
          </p>
        </div>

        {/* 学员入口 */}
        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-8 backdrop-blur-sm">
          <h2 className="mb-6 text-lg font-medium">开始你的 ICC 项目</h2>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm text-slate-400">
                你的名字
              </label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="输入昵称"
                className="w-full rounded-lg border border-slate-600 bg-slate-700/50 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20"
                onKeyDown={e => e.key === 'Enter' && handleStart()}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-slate-400">
                邀请码（选填）
              </label>
              <input
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="教练给你的邀请码"
                className="w-full rounded-lg border border-slate-600 bg-slate-700/50 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20"
                onKeyDown={e => e.key === 'Enter' && handleStart()}
              />
            </div>

            <button
              onClick={handleStart}
              disabled={!name.trim()}
              className="mt-2 w-full rounded-lg bg-cyan-500 py-2.5 text-sm font-medium text-white transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              开始项目 →
            </button>
          </div>

          <div className="mt-6 border-t border-slate-700/50 pt-4">
            <a href="/coach" className="text-xs text-slate-500 transition hover:text-slate-400">
              教练入口 →
            </a>
          </div>
        </div>

        {/* 项目阶段示意 */}
        <div className="mt-8 grid grid-cols-5 gap-2">
          {[
            { label: '发现', icon: '🔍' },
            { label: '定义', icon: '🎯' },
            { label: '构思', icon: '💡' },
            { label: '原型', icon: '🛠️' },
            { label: '交付', icon: '🚀' },
          ].map(phase => (
            <div key={phase.label} className="flex flex-col items-center gap-1 rounded-lg bg-slate-800/30 py-3">
              <span className="text-lg">{phase.icon}</span>
              <span className="text-[10px] text-slate-500">{phase.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
