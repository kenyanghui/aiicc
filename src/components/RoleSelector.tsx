'use client';

import { AIRole, AIRoleMeta } from '@/types/chat';

interface Props {
  currentRole: AIRole;
  onRoleChange: (role: AIRole) => void;
  disabled?: boolean;
}

export default function RoleSelector({ currentRole, onRoleChange, disabled }: Props) {
  const roles: AIRole[] = ['socrates', 'analyst', 'creative', 'architect', 'reviewer'];

  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4">
      <h3 className="mb-3 text-xs font-medium text-slate-400">切换 AI 角色</h3>
      <div className="flex flex-wrap gap-2">
        {roles.map(role => {
          const meta = AIRoleMeta[role];
          const isActive = role === currentRole;
          return (
            <button
              key={role}
              onClick={() => onRoleChange(role)}
              disabled={disabled}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs transition ${
                isActive
                  ? 'bg-slate-700/80 text-white ring-1 ring-slate-500'
                  : 'bg-slate-800/50 text-slate-500 hover:bg-slate-700/40 hover:text-slate-300'
              } disabled:cursor-not-allowed disabled:opacity-50`}
            >
              <span>{meta.emoji}</span>
              <span>{meta.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
