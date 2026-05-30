export interface StepOutput {
  id: string;
  projectId: string;
  phase: number;
  step: number;
  outputType: string;
  content: string;
  aiRoleUsed: string;
  createdAt: string;
}

export async function saveOutput(
  projectId: string,
  phase: number,
  step: number,
  outputType: string,
  content: string,
  aiRoleUsed?: string
): Promise<StepOutput | null> {
  try {
    const res = await fetch('/api/output', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, phase, step, outputType, content, aiRoleUsed }),
    });
    const json = await res.json();
    if (json.ok) return json.data;
    return null;
  } catch {
    return null;
  }
}

export async function loadOutputs(
  projectId: string,
  phase?: number,
  step?: number
): Promise<StepOutput[]> {
  try {
    const params = new URLSearchParams({ projectId });
    if (phase !== undefined) params.set('phase', String(phase));
    if (step !== undefined) params.set('step', String(step));
    const res = await fetch(`/api/output?${params}`);
    const json = await res.json();
    if (json.ok) return json.data;
    return [];
  } catch {
    return [];
  }
}

export async function loadStepOutput(
  projectId: string,
  phase: number,
  step: number
): Promise<StepOutput | null> {
  const outputs = await loadOutputs(projectId, phase, step);
  return outputs[0] || null;
}
