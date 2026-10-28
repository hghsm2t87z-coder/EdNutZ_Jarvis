import { type WorkspaceId, workspaceStorageKey } from './workspaces';

export type RecordStatus = 'new' | 'active' | 'waiting' | 'done';

export interface WorkspaceRecord {
  id: string;
  workspaceId: WorkspaceId;
  section: string;
  title: string;
  description: string;
  status: RecordStatus;
  reference?: string;
  category?: string;
  location?: string;
  lastUsedJob?: string;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

const RECORDS_KEY = 'records';

export function loadWorkspaceRecords(workspaceId: WorkspaceId): WorkspaceRecord[] {
  try {
    const raw = localStorage.getItem(workspaceStorageKey(workspaceId, RECORDS_KEY));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveWorkspaceRecords(workspaceId: WorkspaceId, records: WorkspaceRecord[]) {
  localStorage.setItem(workspaceStorageKey(workspaceId, RECORDS_KEY), JSON.stringify(records));
}

export function createWorkspaceRecord(
  workspaceId: WorkspaceId,
  input: Omit<WorkspaceRecord, 'id' | 'workspaceId' | 'createdAt' | 'updatedAt'>,
): WorkspaceRecord {
  const now = Date.now();
  const record: WorkspaceRecord = {
    ...input,
    id: `${now.toString(36)}${Math.random().toString(36).slice(2, 8)}`,
    workspaceId,
    createdAt: now,
    updatedAt: now,
  };
  const records = loadWorkspaceRecords(workspaceId);
  saveWorkspaceRecords(workspaceId, [record, ...records]);
  return record;
}

export function updateWorkspaceRecord(workspaceId: WorkspaceId, record: WorkspaceRecord) {
  const records = loadWorkspaceRecords(workspaceId).map((item) =>
    item.id === record.id ? { ...record, updatedAt: Date.now() } : item,
  );
  saveWorkspaceRecords(workspaceId, records);
}

export function deleteWorkspaceRecord(workspaceId: WorkspaceId, id: string) {
  saveWorkspaceRecords(
    workspaceId,
    loadWorkspaceRecords(workspaceId).filter((item) => item.id !== id),
  );
}
