import { BriefcaseBusiness, Building2, UserRound } from 'lucide-react';
import { WORKSPACES, type WorkspaceId } from '../lib/workspaces';
import { useAppStore } from '../lib/store';

const icons = {
  personal: UserRound,
  business: Building2,
  work: BriefcaseBusiness,
};

export function WorkspaceSwitcher() {
  const active = useAppStore((s) => s.activeWorkspace);
  const switchWorkspace = useAppStore((s) => s.switchWorkspace);
  const isStreaming = useAppStore((s) => s.streamState.isStreaming);

  const selectWorkspace = (workspace: WorkspaceId) => {
    if (workspace === active || isStreaming) return;
    switchWorkspace(workspace);
  };

  return (
    <div className="px-3 pb-3">
      <div
        className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-[0.18em]"
        style={{ color: 'var(--color-text-tertiary)' }}
      >
        Workspace
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {WORKSPACES.map((workspace) => {
          const Icon = icons[workspace.id];
          const selected = workspace.id === active;
          return (
            <button
              key={workspace.id}
              onClick={() => selectWorkspace(workspace.id)}
              disabled={isStreaming && !selected}
              className="flex min-w-0 flex-col items-center gap-1 rounded-lg px-1 py-2 text-[10px] transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                background: selected ? 'var(--color-accent-subtle)' : 'var(--color-bg-secondary)',
                border: `1px solid ${selected ? 'var(--color-accent)' : 'var(--color-border)'}`,
                color: selected ? 'var(--color-text)' : 'var(--color-text-secondary)',
              }}
              title={
                isStreaming && !selected
                  ? 'Finish the current response before switching workspaces.'
                  : workspace.shortDescription
              }
            >
              <Icon size={15} style={selected ? { color: 'var(--color-accent)' } : undefined} />
              <span className="truncate w-full text-center">{workspace.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
