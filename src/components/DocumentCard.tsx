'use client';

import { useState } from 'react';
import { CompetitionDocType, DocTypeMeta } from '@/types/document';
import { DocListItem } from '@/lib/document-store';

interface Props {
  item: DocListItem;
  onGenerate: (docType: CompetitionDocType) => Promise<void>;
  onPreview: (docType: CompetitionDocType) => void;
  onFinalize: (docId: string) => Promise<void>;
  onDownload: (docType: CompetitionDocType) => void;
}

export default function DocumentCard({ item, onGenerate, onPreview, onFinalize, onDownload }: Props) {
  const [generating, setGenerating] = useState(false);
  const meta = DocTypeMeta[item.docType];

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await onGenerate(item.docType);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div
      className={`rounded-xl border p-5 transition ${
        item.status === 'final'
          ? 'border-green-500/30 bg-green-500/5'
          : item.exists
            ? 'border-cyan-500/30 bg-cyan-500/5'
            : 'border-slate-700/50 bg-slate-800/30'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ${
              item.status === 'final'
                ? 'bg-green-500/20'
                : item.exists
                  ? 'bg-cyan-500/20'
                  : 'bg-slate-700/50'
            }`}
          >
            {meta.icon}
          </div>
          <div>
            <h3 className="text-sm font-medium text-white">{meta.label}</h3>
            <p className="mt-0.5 text-xs text-slate-400">{meta.description}</p>
          </div>
        </div>

        {item.status === 'final' && (
          <span className="rounded-full bg-green-500/20 px-2.5 py-1 text-[10px] font-medium text-green-400">
            终稿
          </span>
        )}
        {item.status === 'draft' && (
          <span className="rounded-full bg-cyan-500/20 px-2.5 py-1 text-[10px] font-medium text-cyan-400">
            草稿
          </span>
        )}
        {!item.exists && (
          <span className="rounded-full bg-slate-700/50 px-2.5 py-1 text-[10px] font-medium text-slate-500">
            未生成
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {!item.exists ? (
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="rounded-lg bg-cyan-500 px-4 py-2 text-xs font-medium text-white transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {generating ? '生成中...' : '生成文档'}
          </button>
        ) : (
          <>
            <button
              onClick={() => onPreview(item.docType)}
              className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-xs font-medium text-cyan-300 transition hover:bg-cyan-500/20"
            >
              预览
            </button>
            <button
              onClick={() => onDownload(item.docType)}
              className="rounded-lg border border-slate-500/30 bg-slate-500/10 px-4 py-2 text-xs font-medium text-slate-300 transition hover:bg-slate-500/20"
            >
              下载
            </button>
            {item.status === 'draft' && item.id && (
              <button
                onClick={() => onFinalize(item.id!)}
                className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-2 text-xs font-medium text-green-300 transition hover:bg-green-500/20"
              >
                标记为终稿
              </button>
            )}
            {item.status !== 'draft' && (
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="rounded-lg border border-slate-500/30 bg-slate-500/10 px-4 py-2 text-xs font-medium text-slate-300 transition hover:bg-slate-500/20"
              >
                {generating ? '生成中...' : '重新生成'}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
