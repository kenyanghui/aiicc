'use client';

import { CompetitionDocument, DocTypeMeta } from '@/types/document';

interface Props {
  document: CompetitionDocument;
  onClose: () => void;
}

function simpleMarkdownToHtml(md: string): string {
  let html = md
    // Headers
    .replace(/^### (.+)$/gm, '<h3 class="text-base font-semibold text-white mt-4 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-lg font-bold text-white mt-5 mb-2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-xl font-bold text-white mt-6 mb-3">$1</h1>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-cyan-300">$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // List items
    .replace(/^- \[ \] (.+)$/gm, '<li class="flex items-start gap-2 text-slate-300"><span class="mt-1 h-4 w-4 shrink-0 rounded border border-slate-500"></span><span>$1</span></li>')
    .replace(/^- \[x\] (.+)$/gm, '<li class="flex items-start gap-2 text-slate-300"><span class="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded bg-green-500/30 text-[10px] text-green-400">✓</span><span>$1</span></li>')
    .replace(/^- (.+)$/gm, '<li class="text-slate-300 ml-4 list-disc">$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li class="text-slate-300 ml-4 list-decimal">$1</li>')
    // Code blocks
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="my-3 rounded-lg bg-slate-900/80 p-4 text-xs text-slate-300 overflow-x-auto font-mono">$2</pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="rounded bg-slate-700/50 px-1.5 py-0.5 text-xs text-cyan-300 font-mono">$1</code>')
    // Horizontal rule
    .replace(/^---$/gm, '<hr class="my-4 border-slate-700/50" />')
    // Table
    .replace(/\|(.+)\|/g, (match) => {
      if (match.includes('---')) return '';
      const cells = match.split('|').filter(c => c.trim()).map(c => c.trim());
      return `<tr>${cells.map(c => `<td class="border border-slate-700/50 px-3 py-2 text-xs text-slate-300">${c}</td>`).join('')}</tr>`;
    })
    // Paragraphs (double newlines)
    .replace(/\n\n/g, '</p><p class="text-sm leading-relaxed text-slate-300 mb-3">')
    // Single newlines within paragraphs become spaces
    .replace(/\n(?!<\/?(?:h[1-3]|ul|ol|li|pre|table|tr|td|hr|p|div|strong))/g, ' ')
    .replace(/(<li[^>]*>.*?)<\/li>\n<li/g, '$1</li><li');

  return `<div class="space-y-3"><p class="text-sm leading-relaxed text-slate-300 mb-3">${html}</p></div>`;
}

export default function DocumentPreview({ document: doc, onClose }: Props) {
  const meta = DocTypeMeta[doc.docType as keyof typeof DocTypeMeta];
  const hasMissingData = doc.content.includes('[请');

  const handleDownloadMd = () => {
    const blob = new Blob([doc.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${meta?.label || 'document'}-${doc.projectId}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadHtml = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="utf-8"><title>${doc.title}</title>
<style>
  body { max-width: 800px; margin: 0 auto; padding: 2rem; font-family: system-ui, sans-serif; background: #0f172a; color: #e2e8f0; line-height: 1.7; }
  h1 { color: #f1f5f9; font-size: 1.5rem; border-bottom: 1px solid #334155; padding-bottom: 0.5rem; }
  h2 { color: #06b6d4; font-size: 1.2rem; margin-top: 2rem; }
  h3 { color: #e2e8f0; font-size: 1rem; }
  pre { background: #1e293b; padding: 1rem; border-radius: 8px; overflow-x: auto; }
  code { background: #334155; padding: 0.2rem 0.4rem; border-radius: 4px; font-size: 0.9em; }
  strong { color: #22d3ee; }
  table { border-collapse: collapse; width: 100%; margin: 1rem 0; }
  td, th { border: 1px solid #334155; padding: 0.5rem; }
  hr { border-color: #334155; margin: 2rem 0; }
  .warning { background: #f59e0b20; border: 1px solid #f59e0b40; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; }
</style>
</head>
<body>
${hasMissingData ? '<div class="warning">⚠️ 部分内容来自尚未完成的步骤，请在完成相关步骤后重新生成。</div>' : ''}
${simpleMarkdownToHtml(doc.content)}
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${meta?.label || 'document'}-${doc.projectId}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="mx-4 flex h-[85vh] w-full max-w-3xl flex-col rounded-2xl border border-slate-700/50 bg-slate-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700/50 px-6 py-4">
          <div>
            <h2 className="text-base font-semibold text-white">{doc.title}</h2>
            <p className="text-xs text-slate-400">
              {meta?.label} · {doc.status === 'final' ? '终稿' : '草稿'} · {new Date(doc.updatedAt).toLocaleString('zh-CN')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadMd}
              className="rounded-lg border border-slate-600 px-3 py-1.5 text-xs text-slate-300 transition hover:border-slate-500 hover:text-white"
            >
              下载 .md
            </button>
            <button
              onClick={handleDownloadHtml}
              className="rounded-lg border border-slate-600 px-3 py-1.5 text-xs text-slate-300 transition hover:border-slate-500 hover:text-white"
            >
              下载 .html
            </button>
            <button
              onClick={onClose}
              className="ml-2 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-700/50 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {hasMissingData && (
            <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs text-amber-300">
              ⚠️ 部分内容来自尚未完成的步骤。你仍然可以下载文稿，但建议完成所有相关步骤后重新生成。
            </div>
          )}
          <div
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: simpleMarkdownToHtml(doc.content) }}
          />
        </div>
      </div>
    </div>
  );
}
