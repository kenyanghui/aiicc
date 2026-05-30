'use client';

import { useState, useEffect, useRef } from 'react';
import { AIRole, AIRoleMeta, ChatMessage } from '@/types';
import { sendChatMessage, getOpeningMessage } from '@/lib/ai';

interface Props {
  phase: number;
  step: number;
  aiRole: AIRole;
  studentName: string;
  projectId: string;
}

export default function ChatPanel({ phase, step, aiRole, studentName, projectId }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const roleMeta = AIRoleMeta[aiRole];

  // 进入新步骤时，显示开场消息
  useEffect(() => {
    const opening = getOpeningMessage(phase, step, studentName);
    setMessages([opening]);
  }, [phase, step, studentName]);

  // 自动滚到底部
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      projectId,
      phase,
      step,
      role: 'student',
      content: input.trim(),
      createdAt: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await sendChatMessage({
        role: aiRole,
        message: userMsg.content,
        phase,
        step,
        history: messages,
      });

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        projectId,
        phase,
        step,
        role: 'ai',
        aiRole,
        content: res.content,
        createdAt: new Date().toISOString(),
      };

      setMessages(prev => [...prev, aiMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))]">
      {/* 角色标识 */}
      <div className="border-b border-white/[0.06] bg-white/[0.02] px-4 sm:px-6 py-3 sm:py-5">
        <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-2xl text-lg"
              style={{ backgroundColor: `${roleMeta.color}20`, color: roleMeta.color }}
            >
              <span>{roleMeta.emoji}</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-medium text-white">{roleMeta.label}</span>
                <span className="rounded-full border border-white/[0.08] px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-slate-400">
                  AI 伙伴
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                第 {phase} 阶段 · 第 {step} 步，跟着我的引导一步一步来
              </p>
            </div>
          </div>

          <div className="hidden sm:block rounded-2xl border border-white/[0.06] bg-black/20 px-3 py-2 text-right">
            <div className="text-[10px] uppercase tracking-[0.16em] text-slate-500">同学</div>
            <div className="mt-1 text-sm text-slate-200">{studentName}</div>
          </div>
        </div>
      </div>

      {/* 对话区 */}
      <div className="flex-1 space-y-4 overflow-y-auto px-4 sm:px-6 py-4 sm:py-5">
        {messages.map(msg => {
          const isAI = msg.role === 'ai';
          const meta = msg.aiRole ? AIRoleMeta[msg.aiRole] : null;

          return (
            <div key={msg.id} className={`msg-animate flex ${isAI ? 'justify-start' : 'justify-end'}`}>
              <div
                className={`max-w-[92%] sm:max-w-[82%] rounded-[22px] border px-4 py-3.5 leading-relaxed shadow-lg shadow-black/10 ${
                  isAI
                    ? 'border-white/[0.06] bg-white/[0.05] text-slate-200'
                    : 'border-cyan-400/20 bg-cyan-500/15 text-cyan-100'
                }`}
              >
                {isAI && meta && (
                  <div className="mb-2 flex items-center gap-2 text-[10px] opacity-70">
                    <span>{meta.emoji}</span>
                    <span>{meta.label}</span>
                  </div>
                )}
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {msg.content}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="msg-animate flex justify-start">
            <div className="rounded-[22px] border border-white/[0.06] bg-white/[0.05] px-4 py-3">
              <div className="flex gap-1.5">
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-500" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-500" style={{ animationDelay: '0.1s' }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-500" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* 输入区 */}
      <div className="border-t border-white/[0.06] bg-black/10 p-3 sm:p-4">
        <div className="mb-2 sm:mb-3 flex items-center justify-between text-[11px] sm:text-xs text-slate-500">
          <span className="truncate">把你的想法写下来～</span>
          <span className="shrink-0">{loading ? 'AI 正在思考...' : 'Enter 发送'}</span>
        </div>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="输入你的想法..."
            className="flex-1 rounded-2xl border border-white/[0.08] bg-white/[0.04] px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-cyan-500/50"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="rounded-2xl bg-cyan-500 px-4 sm:px-5 py-2.5 sm:py-3 text-sm font-medium text-white transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            发送
          </button>
        </div>
      </div>
    </div>
  );
}
