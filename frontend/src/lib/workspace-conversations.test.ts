import { beforeEach, describe, expect, it } from 'vitest';
import { loadWorkspaceConversations, saveWorkspaceConversations } from './workspace-conversations';
import type { Conversation } from '../types';

function conversation(id: string): Conversation {
  return { id, title: 'Test', messages: [], createdAt: 1, updatedAt: 1, model: 'test-model' };
}

describe('workspace conversations', () => {
  beforeEach(() => localStorage.clear());

  it('stores separate conversation collections', () => {
    saveWorkspaceConversations('personal', { version: 1, activeId: 'p1', conversations: { p1: conversation('p1') } });
    saveWorkspaceConversations('work', { version: 1, activeId: 'w1', conversations: { w1: conversation('w1') } });
    expect(loadWorkspaceConversations('personal').activeId).toBe('p1');
    expect(loadWorkspaceConversations('work').activeId).toBe('w1');
    expect(loadWorkspaceConversations('business').activeId).toBeNull();
  });
});
