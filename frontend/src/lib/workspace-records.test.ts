import { beforeEach, describe, expect, it } from 'vitest';
import { addWorkspaceRecord, loadWorkspaceRecords, removeWorkspaceRecord, updateWorkspaceRecord } from './workspace-records';

describe('workspace records', () => {
  beforeEach(() => localStorage.clear());

  it('keeps records isolated by workspace', () => {
    addWorkspaceRecord('personal', { section: 'Ideas', title: 'Personal idea', status: 'Idea' });
    addWorkspaceRecord('business', { section: 'Leads', title: 'Business lead', status: 'New' });
    expect(loadWorkspaceRecords('personal')).toHaveLength(1);
    expect(loadWorkspaceRecords('business')).toHaveLength(1);
    expect(loadWorkspaceRecords('work')).toHaveLength(0);
  });

  it('updates and removes a record', () => {
    const record = addWorkspaceRecord('work', { section: 'Inventory', title: 'Display crate', status: 'Ready' });
    updateWorkspaceRecord('work', record.id, { status: 'Pulled' });
    expect(loadWorkspaceRecords('work')[0].status).toBe('Pulled');
    removeWorkspaceRecord('work', record.id);
    expect(loadWorkspaceRecords('work')).toHaveLength(0);
  });
});
