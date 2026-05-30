'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CompetitionDocType, DocTypeMeta } from '@/types/document';
import { getDocuments, getDocListFromData, DocListItem } from '@/lib/document-store';
import { generateDocument, generateAllDocuments, updateDocumentStatus } from '@/lib/document-store';
import DocumentCard from '@/components/DocumentCard';
import DocumentPreview from '@/components/DocumentPreview';
import { CompetitionDocument } from '@/types/document';

export default function DocumentsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [docList, setDocList] = useState<DocListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatingAll, setGeneratingAll] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<CompetitionDocument | null>(null);
  const [studentName, setStudentName] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('aiicc_student');
    if (stored) {
      try {
        const { name } = JSON.parse(stored);
        if (name) setStudentName(name);
      } catch {}
    }
  }, []);

  const loadDocs = async () => {
    setLoading(true);
    setError(null);
    try {
      const docs = await getDocuments(projectId);
      setDocList(getDocListFromData(docs));
    } catch (err) {
      setError('加载文档列表失败，请刷新重试');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) loadDocs();
  }, [projectId]);

  const handleGenerate = async (docType: CompetitionDocType) => {
    const result = await generateDocument(projectId, docType);
    if (result.ok) {
      await loadDocs();
    }
  };

  const handleGenerateAll = async () => {
    setGeneratingAll(true);
    try {
      const result = await generateAllDocuments(projectId);
      if (result.ok) {
        await loadDocs();
      }
    } finally {
      setGeneratingAll(false);
    }
  };

  const handlePreview = async (docType: CompetitionDocType) => {
    // Find from current list
    const item = docList.find(d => d.docType === docType);
    if (item?.id) {
      try {
        const res = await fetch(`/api/documents?id=${item.id}`);
        const json = await res.json();
        if (json.ok) setPreviewDoc(json.data);
      } catch {}
    }
  };

  const handleFinalize = async (docId: string) => {
    await updateDocumentStatus(docId, 'final');
    await loadDocs();
  };

  const handleDownload = (docType: CompetitionDocType) => {
    const item = docList.find(d => d.docType === docType);
    if (!item?.id) return;
    handlePreview(docType);
  };

  const completedCount = docList.filter(d => d.exists).length;
  const finalizedCount = docList.filter(d => d.status === 'final').length;
  const totalCount = docList.length;

  // Group docs
  const getGroupDocs = (group: string) => docList.filter(d => DocTypeMeta[d.docType].group === group);

  return (
    <div className="min-h-screen bg-[#07070d] text-white">
      {/* Preview modal */}
      {previewDoc && (
        <DocumentPreview
          document={previewDoc}
          onClose={() => setPreviewDoc(null)}
        />
      )}

      {/* Header */}
      <header className="border-b border-white/[0.06] bg-white/[0.02] backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <button onClick={() => router.push(`/project/${projectId}`)} className="hover:text-white transition">
                ← 返回项目
              </button>
              <span>/</span>
              <span className="text-cyan-400">竞赛文档中心</span>
            </div>
            <h1 className="mt-2 text-2xl font-bold text-white">竞赛文档中心</h1>
            <p className="mt-1 text-sm text-slate-400">
              {studentName ? `${studentName} 的项目文档` : '将所有阶段产出汇总为竞赛提交文档'}
            </p>
          </div>

          <div className="text-right">
            <div className="text-2xl font-bold text-white">{completedCount}/{totalCount}</div>
            <div className="text-xs text-slate-500">已生成文档 · {finalizedCount} 份终稿</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mx-auto max-w-5xl px-6 pb-4">
          <div className="flex gap-1">
            {docList.map((item) => {
              const meta = DocTypeMeta[item.docType];
              let bg = 'bg-slate-700/50';
              if (item.status === 'final') bg = 'bg-green-500';
              else if (item.exists) bg = 'bg-cyan-500';
              return (
                <div
                  key={item.docType}
                  className={`h-1.5 flex-1 rounded-full ${bg} transition`}
                  title={`${meta.label}: ${item.status === 'final' ? '终稿' : item.exists ? '草稿' : '未生成'}`}
                />
              );
            })}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        {/* Error state */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-6 py-4 text-sm text-red-300">
            {error}
            <button onClick={loadDocs} className="ml-3 underline hover:text-red-200">重试</button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && docList.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 text-4xl">📄</div>
            <h2 className="text-lg font-semibold text-white">还没有生成任何文档</h2>
            <p className="mt-2 text-sm text-slate-400">
              完成项目各阶段的步骤后，点击"生成文档"来创建竞赛提交文档。
            </p>
            <p className="mt-1 text-xs text-slate-500">
              即使只完成了部分步骤，也可以先生成草稿版本。
            </p>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-sm text-slate-500">加载中...</div>
          </div>
        )}

        {/* Generate All button */}
        {!loading && docList.length > 0 && (
          <div className="mb-6 flex items-center justify-between">
            <div className="text-sm text-slate-400">
              {completedCount === totalCount
                ? '✅ 所有文档已生成'
                : `已生成 ${completedCount}/${totalCount} 份文档`}
            </div>
            <button
              onClick={handleGenerateAll}
              disabled={generatingAll}
              className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-cyan-500/20 transition hover:from-cyan-400 hover:to-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {generatingAll ? '生成全部中...' : completedCount === totalCount ? '🔄 重新生成全部' : '⚡ 一键生成全部'}
            </button>
          </div>
        )}

        {/* Document groups */}
        {!loading && docList.length > 0 && (
          <div className="space-y-8">
            {/* 必交材料 */}
            <section>
              <h2 className="mb-4 text-base font-semibold text-white">
                📋 必交材料
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {getGroupDocs('必交材料').map((item) => (
                  <DocumentCard
                    key={item.docType}
                    item={item}
                    onGenerate={handleGenerate}
                    onPreview={handlePreview}
                    onFinalize={handleFinalize}
                    onDownload={handleDownload}
                  />
                ))}
              </div>
            </section>

            {/* 展示材料 */}
            <section>
              <h2 className="mb-4 text-base font-semibold text-white">
                🖼️ 展示材料
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {getGroupDocs('展示材料').map((item) => (
                  <DocumentCard
                    key={item.docType}
                    item={item}
                    onGenerate={handleGenerate}
                    onPreview={handlePreview}
                    onFinalize={handleFinalize}
                    onDownload={handleDownload}
                  />
                ))}
              </div>
            </section>

            {/* 提交辅助 */}
            <section>
              <h2 className="mb-4 text-base font-semibold text-white">
                ✅ 提交辅助
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {getGroupDocs('提交辅助').map((item) => (
                  <DocumentCard
                    key={item.docType}
                    item={item}
                    onGenerate={handleGenerate}
                    onPreview={handlePreview}
                    onFinalize={handleFinalize}
                    onDownload={handleDownload}
                  />
                ))}
              </div>
            </section>

            {/* All done state */}
            {finalizedCount === totalCount && (
              <div className="rounded-xl border border-green-500/20 bg-gradient-to-r from-green-500/10 to-emerald-500/10 px-6 py-5 text-center">
                <div className="text-3xl mb-2">🎉</div>
                <h3 className="text-base font-semibold text-green-300">所有文档已完成终稿！</h3>
                <p className="mt-1 text-sm text-slate-400">
                  请下载所有文档，并按提交清单核对真实信息后正式提交。
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
