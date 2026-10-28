import { getStoredWorkspace, type WorkspaceId, WORKSPACES } from './workspaces';

export interface WorkspaceContext {
  workspaceId: WorkspaceId;
  label: string;
  purpose: string;
  systemContext: string;
}

const PURPOSES: Record<WorkspaceId, string> = {
  personal: 'Private creative space for thinking, learning, goals, research, journaling and personal projects.',
  business: 'Entrepreneurial command center for validating ideas, launching businesses, managing leads and growing revenue.',
  work: 'Warehouse and logistics operations workspace for daily priorities, inventory, receiving, outbound freight and SOPs.',
};

const SYSTEM_CONTEXT: Record<WorkspaceId, string> = {
  personal: 'Treat this as Eddy’s private Personal workspace. Keep its ideas, projects and memory separate from Business and Work unless Eddy explicitly asks to transfer something.',
  business: 'Treat this as Eddy’s Business workspace. Focus on execution, validation, customers, operations and revenue. Do not pull private Personal or employer Work context into this workspace unless Eddy explicitly transfers it.',
  work: 'Treat this as Eddy’s Work workspace for warehouse/logistics operations. Prioritize fast, mobile-friendly operational help. Keep employer/work data separate from Personal and Business unless Eddy explicitly asks to transfer an item.',
};

export function getWorkspaceContext(workspaceId: WorkspaceId = getActiveWorkspace()): WorkspaceContext {
  const workspace = WORKSPACES.find((item) => item.id === workspaceId)!;
  return {
    workspaceId,
    label: workspace.name,
    purpose: PURPOSES[workspaceId],
    systemContext: SYSTEM_CONTEXT[workspaceId],
  };
}

export function prefixPromptWithWorkspaceContext(prompt: string, workspaceId?: WorkspaceId): string {
  const context = getWorkspaceContext(workspaceId);
  return `[Workspace: ${context.label}]\n${context.systemContext}\n\n${prompt}`;
}
