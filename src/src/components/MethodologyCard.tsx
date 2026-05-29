'use client';

import { leanStartup, getMethodologyForPhase } from '@/lib/methodologies';
import { useState } from 'react';

interface Props {
  phaseId: number;
  methodologyId?: string;
}

export default function MethodologyCard({ phaseId, methodologyId = 'lean-startup' }: Props) {
  const [expanded, setExpanded] = useState(false);
  const m = methodologyId === 'lean-startup' ? leanStartup : undefined;
  if (!m) return null;

  const phaseHint = getMethodologyForPhase(methodologyId, phaseId);

  return (
    <div className="rounded-lg border border-amber-500/20 bg-amber-500/5">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-2 px-4 py-3 text-left text-xs"
      >
        <span>📘</span>
        <span className="font-medium text-amber-300">精益创业</span>
        <span className="text-slate-500">— 当前阶段的应用</span>
        <span className="ml-auto text-slate-500">{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div className="border-t border-amber-500/10 px-4 py-3">
          <p className="mb-3 text-xs leading-relaxed text-slate-400">{phaseHint}</p>

          <div className="space-y-2">
            {m.frameworks.slice(0, 3).map(fw => (
              <div key={fw.name} className="rounded-md bg-slate-800/50 px-3 py-2">
                <div className="text-[11px] font-medium text-amber-300">{fw.name}</div>
                <div className="mt-0.5 text-[10px] leading-relaxed text-slate-500">{fw.concept}</div>
              </div>
            ))}
          </div>

          <a
            href="https://skills.sh/booklib-ai/skills/lean-startup"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 block text-[10px] text-slate-600 transition hover:text-slate-400"
          >
            了解更多 → lean-startup skill
          </a>
        </div>
      )}
    </div>
  );
}
