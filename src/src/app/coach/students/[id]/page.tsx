'use client';

import { useParams, useRouter } from 'next/navigation';
import { workflowPhases } from '@/lib/workflow';

// 模拟对话记录
const mockChatLog = [
  { role: 'ai', content: '你好！我们来聊聊你想解决什么问题。', time: '10:30' },
  { role: 'student', content: '我想帮助那些吃不饱饭的女孩。', time: '10:31' },
  { role: 'ai', content: '很好的出发点！为什么会关注这个群体呢？', time: '10:31' },
];

export default function StudentDetailPage() {
  const params = useParams();
  const router = useRouter();

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-4xl">
        {/* 头部 */}
        <button
          onClick={() => router.push('/coach')}
          className="mb-6 text-sm text-slate-500 transition hover:text-white"
        >
          ← 回到看板
        </button>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">学员详情</h1>
          <p className="mt-1 text-sm text-slate-400">ID: {params.id}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* 进度卡片 */}
          <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-6">
            <h2 className="mb-4 text-sm font-medium text-white">项目进度</h2>
            <div className="space-y-3">
              {workflowPhases.map(p => (
                <div key={p.id} className="flex items-center gap-3">
                  <span className="text-lg">{p.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300">{p.name}</span>
                      <span className="text-slate-500">
                        {p.id <= 2 ? `${p.steps.length}/${p.steps.length}` : '0/' + p.steps.length}
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 rounded-full bg-slate-700">
                      <div
                        className={`h-full rounded-full ${p.id <= 2 ? 'bg-cyan-500' : 'bg-slate-600'}`}
                        style={{ width: p.id <= 2 ? '100%' : '0%' }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 最近对话 */}
          <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-6">
            <h2 className="mb-4 text-sm font-medium text-white">最近对话</h2>
            <div className="space-y-3">
              {mockChatLog.map((msg, i) => (
                <div key={i} className={`rounded-lg px-3 py-2 ${
                  msg.role === 'ai' ? 'bg-slate-700/40' : 'bg-cyan-500/10'
                }`}>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500">
                    <span>{msg.role === 'ai' ? 'AI' : '学员'}</span>
                    <span>{msg.time}</span>
                  </div>
                  <div className="mt-0.5 text-xs text-slate-300">{msg.content}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 教练点评 */}
          <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-6 lg:col-span-2">
            <h2 className="mb-4 text-sm font-medium text-white">教练点评</h2>
            <textarea
              placeholder="给这个学员写点评..."
              className="min-h-[100px] w-full rounded-lg border border-slate-600 bg-slate-700/50 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-cyan-500/50"
            />
            <button className="mt-3 rounded-lg bg-cyan-500 px-4 py-2 text-xs font-medium text-white transition hover:bg-cyan-400">
              保存点评
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
