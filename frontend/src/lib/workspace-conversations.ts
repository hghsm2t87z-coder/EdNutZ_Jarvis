import type { Conversation } from '../types';
import type { WorkspaceId } from './workspaces';

export interface WorkspaceConversationStore {
  version: 1;
  conversations: Record<string, Conversation>;
  activeId: string | null;
}

const LEGACY_KEY = 'openjarvis-conversations';
const MIGRATION_KEY = 'ednutz-workspace-conversations-migrated';

export function workspaceConversationKey(workspaceId: WorkspaceId): string {
  return `ednutz-conversations-${workspaceId}`;
}

export function emptyWorkspaceConversationStore(): WorkspaceConversationStore {
  return { version: 1, conversations: {}, activeId: null };
}

export function migrateLegacyConversations(): void {
  if (localStorage.getItem(MIGRATION_KEY) === '1') return;

  const personalKey = workspaceConversationKey('personal');
  if (!localStorage.getItem(personalKey)) {
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) localStorage.setItem(personalKey, legacy);
  }

  localStorage.setItem(MIGRATION_KEY, '1');
}

export function loadWorkspaceConversations(workspaceId: WorkspaceId): WorkspaceConversationStore {
  migrateLegacyConversations();
  try {
    const raw = localStorage.getItem(workspaceConversationKey(workspaceId));
    if (!raw) return emptyWorkspaceConversationStore();
    const parsed = JSON.parse(raw) as WorkspaceConversationStore;
    if (parsed.version !== 1) return emptyWorkspaceConversationStore();
    return parsed;
  } catch {
    return emptyWorkspaceConversationStore();
  }
}

export function saveWorkspaceConversations(
  workspaceId: WorkspaceId,
  store: WorkspaceConversationStore,
): void {
  localStorage.setItem(workspaceConversationKey(workspaceId), JSON.stringify(store));
}
