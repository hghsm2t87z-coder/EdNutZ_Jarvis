export type WorkspaceId = 'personal' | 'business' | 'work';

export interface WorkspaceDefinition {
  id: WorkspaceId;
  name: string;
  shortDescription: string;
  sections: string[];
}

export const WORKSPACES: WorkspaceDefinition[] = [
  {
    id: 'personal',
    name: 'Personal',
    shortDescription: 'Think, learn, grow, and turn ideas into projects.',
    sections: ['Brain Dump', 'Ideas', 'Goals', 'Research', 'Learning', 'Projects', 'Journal', 'Knowledge'],
  },
  {
    id: 'business',
    name: 'Business',
    shortDescription: 'Build and operate entrepreneurial ideas from validation to revenue.',
    sections: ['Ideas', 'Freight & Logistics', 'AI & Software', 'Content Agency', 'Real Estate Media', 'Leads', 'Launches', 'Revenue'],
  },
  {
    id: 'work',
    name: 'Work',
    shortDescription: 'Run warehouse, receiving, inventory, outbound, and freight workflows.',
    sections: ['Today', 'Inventory', 'Receiving', 'Outbound', 'Freight', 'SOPs', 'Improvement Ideas'],
  },
];

export const DEFAULT_WORKSPACE: WorkspaceId = 'personal';
const STORAGE_KEY = 'eddy-jarvis-active-workspace';

export function isWorkspaceId(value: string | null): value is WorkspaceId {
  return value === 'personal' || value === 'business' || value === 'work';
}

export function getStoredWorkspace(): WorkspaceId {
  if (typeof window === 'undefined') return DEFAULT_WORKSPACE;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return isWorkspaceId(stored) ? stored : DEFAULT_WORKSPACE;
}

export function storeWorkspace(workspace: WorkspaceId) {
  if (typeof window !== 'undefined') window.localStorage.setItem(STORAGE_KEY, workspace);
}

export function workspaceStorageKey(workspace: WorkspaceId, key: string) {
  return `eddy-jarvis:${workspace}:${key}`;
}
