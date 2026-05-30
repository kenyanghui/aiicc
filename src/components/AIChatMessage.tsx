'use client';

import { AIRole, AIRoleMeta } from '@/types/chat';

interface Props {
  message: {
    id: string;
    role: 'ai' | 'student';
    aiRole?: AIRole;
    content: string;
  };
  animate?: boolean;
}

export default function AIChatMessage({ message, animate = true }: Props) {
  const isAI = message.role === 'ai';
  const meta = message.aiRole ? AIRoleMeta[message.aiRole] : null;

  return (
    <div className={`flex ${isAI ? 'justify-start' : 'justify-end'} ${animate ? 'msg-animate' : ''}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 leading-relaxed ${
          isAI
            ? meta
              ? 'shadow-sm'
              : 'bg-slate-700/60 text-slate-200'
            : 'bg-cyan-500/20 text-cyan-100'
        }`}
        style={
          isAI && meta
            ? {
                backgroundColor: `${meta.color}15`,
                borderLeft: `3px solid ${meta.color}40`,
              }
            : undefined
        }
      >
        {isAI && meta && (
          <div className="mb-1.5 flex items-center gap-1.5">
            <span className="text-xs">{meta.emoji}</span>
            <span
              className="text-[10px] font-medium tracking-wide"
              style={{ color: meta.color }}
            >
              {meta.label}
            </span>
            <span className="text-[9px] text-slate-600">· AI 导师</span>
          </div>
        )}

        <div className="whitespace-pre-wrap text-sm leading-relaxed text-slate-200">
          {message.content}
        </div>
      </div>
    </div>
  );
}
