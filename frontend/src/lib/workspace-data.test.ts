import { beforeEach, describe, expect, it } from 'vitest';
import { queueWorkspaceTransfer, readWorkspaceTransfers, resolveWorkspaceTransfer } from './workspace-data';

describe('workspace transfers', () => {
  beforeEach(() => localStorage.clear());

  it('queues and resolves an explicit transfer', () => {
    const transfer = queueWorkspaceTransfer('personal', 'business', 'Turn this idea into a business.');
    expect(readWorkspaceTransfers().some((item) => item.id === transfer.id && item.status === 'pending')).toBe(true);
    resolveWorkspaceTransfer(transfer.id, 'accepted');
    expect(readWorkspaceTransfers().find((item) => item.id === transfer.id)?.status).toBe('accepted');
  });
});
