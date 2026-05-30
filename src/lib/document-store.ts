import { CompetitionDocument, CompetitionDocType, DocTypeMeta } from '@/types/document';

export interface DocListItem {
  docType: CompetitionDocType;
  exists: boolean;
  status: 'draft' | 'final' | null;
  id: string | null;
  updatedAt: string | null;
}

export async function getDocuments(projectId: string): Promise<CompetitionDocument[]> {
  try {
    const res = await fetch(`/api/documents?projectId=${projectId}`);
    const json = await res.json();
    if (json.ok) return json.data;
    return [];
  } catch {
    return [];
  }
}

export async function generateDocument(
  projectId: string,
  docType: CompetitionDocType
): Promise<{ ok: boolean; data?: any; error?: string }> {
  try {
    const res = await fetch('/api/documents/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, docType }),
    });
    return await res.json();
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

export async function generateAllDocuments(
  projectId: string
): Promise<{ ok: boolean; data?: any; error?: string }> {
  try {
    const res = await fetch('/api/documents/generate?all=true', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId }),
    });
    return await res.json();
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

export async function updateDocumentStatus(
  id: string,
  status: 'draft' | 'final'
): Promise<boolean> {
  try {
    const res = await fetch('/api/documents', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    const json = await res.json();
    return json.ok;
  } catch {
    return false;
  }
}

export function getDocListFromData(
  docs: CompetitionDocument[]
): DocListItem[] {
  const allTypes: CompetitionDocType[] = [
    'project_application',
    'research_report',
    'innovation_log',
    'novelty_report',
    'poster',
    'pitch_script',
    'submission_checklist',
  ];

  const docMap = new Map(docs.map(d => [d.docType, d]));

  return allTypes.map((docType) => {
    const meta = DocTypeMeta[docType];
    const existing = docMap.get(docType);
    return {
      docType,
      exists: !!existing,
      status: existing?.status as 'draft' | 'final' | null,
      id: existing?.id || null,
      updatedAt: existing?.updatedAt || null,
      ...meta,
    };
  });
}
