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
    <div className="flex h-full flex-col">
      {/* 角色标识 */}
      <div className="flex items-center gap-2 border-b border-slate-700/50 px-6 py-3">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full text-sm"
          style={{ backgroundColor: `${roleMeta.color}20` }}
        >
          <span>{roleMeta.emoji}</span>
        </div>
        <div>
          <span className="text-sm font-medium text-white">{roleMeta.label}</span>
          <span className="ml-2 text-[10px] text-slate-500">正在辅导你</span>
        </div>
      </div>

      {/* 对话区 */}
      <div className="flex-1 space-y-4 overflow-y-auto p-6">
        {messages.map(msg => {
          const isAI = msg.role === 'ai';
          const meta = msg.aiRole ? AIRoleMeta[msg.aiRole] : null;

          return (
            <div key={msg.id} className={`msg-animate flex ${isAI ? 'justify-start' : 'justify-end'}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 leading-relaxed ${
                  isAI
                    ? 'bg-slate-700/60 text-slate-200'
                    : 'bg-cyan-500/20 text-cyan-100'
                }`}
              >
                {isAI && meta && (
                  <div className="mb-1 flex items-center gap-1 text-[10px] opacity-60">
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
            <div className="rounded-2xl bg-slate-700/60 px-4 py-3">
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
      <div className="border-t border-slate-700/50 p-4">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="输入你的想法..."
            className="flex-1 rounded-lg border border-slate-600 bg-slate-700/50 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-cyan-500/50"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="rounded-lg bg-cyan-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            发送
          </button>
        </div>
      </div>
    </div>
  );
}
