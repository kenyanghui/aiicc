'use client';

import { useState } from 'react';

interface Props {
  outputType: 'text' | 'canvas' | 'list';
  title: string;
  content?: string;
  onSave?: (content: string) => void;
  readOnly?: boolean;
}

export default function OutputTemplate({ outputType, title, content: initialContent, onSave, readOnly }: Props) {
  const [content, setContent] = useState(initialContent || '');
  const [saved, setSaved] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleSave = () => {
    if (onSave) onSave(content);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-800/30">
      <button
        onClick={() => !readOnly && setExpanded(!expanded)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left"
      >
        <span className="text-base">
          {outputType === 'text' ? '📝' : outputType === 'canvas' ? '🎨' : '📋'}
        </span>
        <div className="flex-1">
          <div className="text-xs font-medium text-slate-300">{title}</div>
          <div className="text-[10px] text-slate-500">
            {outputType === 'text' ? '文本产出' : outputType === 'canvas' ? '画布产出' : '列表产出'}
          </div>
        </div>
        {!readOnly && (
          <span className="text-xs text-slate-500">{expanded ? '收起 ▲' : '展开 ▼'}</span>
        )}
      </button>

      {(expanded || readOnly) && (
        <div className="border-t border-slate-700/50 p-4">
          {outputType === 'list' ? (
            <ListEditor content={content} onChange={setContent} readOnly={readOnly} />
          ) : outputType === 'canvas' ? (
            <CanvasEditor content={content} onChange={setContent} readOnly={readOnly} />
          ) : (
            <TextEditor content={content} onChange={setContent} readOnly={readOnly} />
          )}

          {!readOnly && (
            <button
              onClick={handleSave}
              className={`mt-3 rounded-lg px-4 py-2 text-xs font-medium transition ${
                saved
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20'
              }`}
            >
              {saved ? '✓ 已保存' : '保存产出'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function TextEditor({ content, onChange, readOnly }: { content: string; onChange: (v: string) => void; readOnly?: boolean }) {
  return (
    <textarea
      value={content}
      onChange={e => onChange(e.target.value)}
      readOnly={readOnly}
      placeholder="在此记录你的思考成果..."
      className="min-h-[120px] w-full rounded-lg border border-slate-600 bg-slate-700/30 px-4 py-3 text-sm text-slate-200 placeholder-slate-600 outline-none transition focus:border-cyan-500/50 read-only:cursor-default read-only:opacity-80"
    />
  );
}

function CanvasEditor({ content, onChange, readOnly }: { content: string; onChange: (v: string) => void; readOnly?: boolean }) {
  const sections = ['用户痛点', '解决方案', '独特价值', '目标用户'];

  return (
    <div className="grid gap-2">
      {sections.map(section => (
        <div key={section}>
          <label className="mb-1 block text-[10px] font-medium text-slate-500">{section}</label>
          <input
            type="text"
            value={content}
            onChange={e => onChange(e.target.value)}
            readOnly={readOnly}
            placeholder={`输入${section}...`}
            className="w-full rounded-lg border border-slate-600 bg-slate-700/30 px-3 py-2 text-xs text-slate-200 placeholder-slate-600 outline-none transition focus:border-cyan-500/50 read-only:cursor-default read-only:opacity-80"
          />
        </div>
      ))}
    </div>
  );
}

function ListEditor({ content, onChange, readOnly }: { content: string; onChange: (v: string) => void; readOnly?: boolean }) {
  const items = content ? content.split('\n') : [''];

  const updateItem = (idx: number, value: string) => {
    const newItems = [...items];
    newItems[idx] = value;
    onChange(newItems.filter(i => i !== '' || newItems.length === 1).join('\n'));
  };

  const addItem = () => {
    onChange([...items, ''].join('\n'));
  };

  const removeItem = (idx: number) => {
    const newItems = items.filter((_, i) => i !== idx);
    onChange(newItems.length === 0 ? '' : newItems.join('\n'));
  };

  return (
    <div className="space-y-2">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-700 text-[10px] text-slate-400">
            {idx + 1}
          </span>
          <input
            type="text"
            value={item}
            onChange={e => updateItem(idx, e.target.value)}
            readOnly={readOnly}
            placeholder={`条目 ${idx + 1}`}
            className="flex-1 rounded-lg border border-slate-600 bg-slate-700/30 px-3 py-2 text-xs text-slate-200 placeholder-slate-600 outline-none transition focus:border-cyan-500/50 read-only:cursor-default read-only:opacity-80"
          />
          {!readOnly && items.length > 1 && (
            <button onClick={() => removeItem(idx)} className="text-xs text-slate-600 hover:text-red-400">
              ✕
            </button>
          )}
        </div>
      ))}
      {!readOnly && (
        <button
          onClick={addItem}
          className="w-full rounded-lg border border-dashed border-slate-600 py-2 text-xs text-slate-500 transition hover:border-slate-500 hover:text-slate-400"
        >
          + 添加条目
        </button>
      )}
    </div>
  );
}
