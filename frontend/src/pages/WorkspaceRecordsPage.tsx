import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Plus, Search, Trash2, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { useAppStore } from '../lib/store';
import { WORKSPACES } from '../lib/workspaces';
import {
  createWorkspaceRecord,
  deleteWorkspaceRecord,
  loadWorkspaceRecords,
  saveWorkspaceRecords,
  type RecordStatus,
  type WorkspaceRecord,
} from '../lib/workspace-data';

const STATUSES: RecordStatus[] = ['new', 'active', 'waiting', 'done'];

export function WorkspaceRecordsPage() {
  const navigate = useNavigate();
  const { section = '' } = useParams();
  const activeWorkspace = useAppStore((s) => s.activeWorkspace);
  const workspace = WORKSPACES.find((item) => item.id === activeWorkspace)!;
  const sectionName = decodeURIComponent(section);
  const [records, setRecords] = useState<WorkspaceRecord[]>([]);
  const [query, setQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', reference: '', category: '', location: '', lastUsedJob: '', notes: '' });

  const refresh = () => setRecords(loadWorkspaceRecords(activeWorkspace));
  useEffect(refresh, [activeWorkspace]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return records.filter((record) => {
      if (record.section !== sectionName) return false;
      if (!q) return true;
      return [record.title, record.description, record.reference, record.category, record.location, record.lastUsedJob, record.notes]
        .some((value) => value?.toLowerCase().includes(q));
    });
  }, [records, query, sectionName]);

  const submit = () => {
    if (!form.title.trim()) return;
    createWorkspaceRecord(activeWorkspace, {
      section: sectionName,
      title: form.title.trim(),
      description: form.description.trim(),
      status: 'new',
      reference: form.reference.trim(),
      category: form.category.trim(),
      location: form.location.trim(),
      lastUsedJob: form.lastUsedJob.trim(),
      notes: form.notes.trim(),
    });
    setForm({ title: '', description: '', reference: '', category: '', location: '', lastUsedJob: '', notes: '' });
    setShowForm(false);
    refresh();
  };

  const setStatus = (record: WorkspaceRecord, status: RecordStatus) => {
    const next = records.map((item) => item.id === record.id ? { ...item, status, updatedAt: Date.now() } : item);
    setRecords(next);
    saveWorkspaceRecords(activeWorkspace, next);
  };

  const remove = (id: string) => {
    deleteWorkspaceRecord(activeWorkspace, id);
    refresh();
  };

  const isWorkInventory = activeWorkspace === 'work' && sectionName === 'Inventory';

  return (
    <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-5 flex items-center gap-3">
          <button onClick={() => navigate('/workspace')} className="rounded-lg p-2" style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text-secondary)' }}><ArrowLeft size={18} /></button>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-accent)' }}>{workspace.name}</div>
            <h1 className="truncate text-xl font-semibold" style={{ color: 'var(--color-text)' }}>{sectionName}</h1>
          </div>
          <button onClick={() => setShowForm(true)} className="inline-flex min-h-11 items-center gap-2 rounded-xl px-4 text-sm font-medium" style={{ background: 'var(--color-accent)', color: 'var(--color-on-accent)' }}><Plus size={17} /> Add</button>
        </div>

        <div className="mb-4 flex items-center gap-2 rounded-xl px-3 py-3" style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
          <Search size={17} style={{ color: 'var(--color-text-tertiary)' }} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={`Search ${sectionName}...`} className="min-w-0 flex-1 bg-transparent text-sm outline-none" style={{ color: 'var(--color-text)' }} />
        </div>

        {showForm && (
          <div className="mb-5 rounded-2xl p-4 sm:p-5" style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
            <div className="mb-4 flex items-center justify-between"><h2 className="font-semibold" style={{ color: 'var(--color-text)' }}>New {sectionName} item</h2><button onClick={() => setShowForm(false)}><X size={18} /></button></div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder={isWorkInventory ? 'Item description' : 'Title'} className="rounded-xl px-3 py-3 text-sm outline-none" style={{ background: 'var(--color-bg-tertiary)', color: 'var(--color-text)' }} />
              {isWorkInventory && <input value={form.reference} onChange={(e) => setForm({ ...form, reference: e.target.value })} placeholder="Reference #" className="rounded-xl px-3 py-3 text-sm outline-none" style={{ background: 'var(--color-bg-tertiary)', color: 'var(--color-text)' }} />}
              <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Category" className="rounded-xl px-3 py-3 text-sm outline-none" style={{ background: 'var(--color-bg-tertiary)', color: 'var(--color-text)' }} />
              {activeWorkspace === 'work' && <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Location" className="rounded-xl px-3 py-3 text-sm outline-none" style={{ background: 'var(--color-bg-tertiary)', color: 'var(--color-text)' }} />}
              {isWorkInventory && <input value={form.lastUsedJob} onChange={(e) => setForm({ ...form, lastUsedJob: e.target.value })} placeholder="Last used job" className="rounded-xl px-3 py-3 text-sm outline-none" style={{ background: 'var(--color-bg-tertiary)', color: 'var(--color-text)' }} />}
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" className="min-h-24 rounded-xl px-3 py-3 text-sm outline-none sm:col-span-2" style={{ background: 'var(--color-bg-tertiary)', color: 'var(--color-text)' }} />
              <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Notes" className="min-h-20 rounded-xl px-3 py-3 text-sm outline-none sm:col-span-2" style={{ background: 'var(--color-bg-tertiary)', color: 'var(--color-text)' }} />
            </div>
            <button onClick={submit} className="mt-4 min-h-11 w-full rounded-xl text-sm font-medium" style={{ background: 'var(--color-accent)', color: 'var(--color-on-accent)' }}>Save item</button>
          </div>
        )}

        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="rounded-2xl p-8 text-center text-sm" style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}>No items yet. Tap Add to create the first one.</div>
          ) : filtered.map((record) => (
            <article key={record.id} className="rounded-2xl p-4" style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold" style={{ color: 'var(--color-text)' }}>{record.title}</h3>{record.reference && <span className="rounded-md px-2 py-0.5 text-xs" style={{ background: 'var(--color-bg-tertiary)', color: 'var(--color-text-secondary)' }}>{record.reference}</span>}</div>
                  {record.description && <p className="mt-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>{record.description}</p>}
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{record.category && <span>Category: {record.category}</span>}{record.location && <span>Location: {record.location}</span>}{record.lastUsedJob && <span>Last job: {record.lastUsedJob}</span>}</div>
                </div>
                <button onClick={() => remove(record.id)} className="p-2" style={{ color: 'var(--color-text-tertiary)' }} title="Delete"><Trash2 size={16} /></button>
              </div>
              <div className="mt-4 grid grid-cols-4 gap-1.5">{STATUSES.map((status) => <button key={status} onClick={() => setStatus(record, status)} className="rounded-lg px-2 py-2 text-[11px] font-medium capitalize" style={{ background: record.status === status ? 'var(--color-accent-subtle)' : 'var(--color-bg-tertiary)', color: record.status === status ? 'var(--color-accent)' : 'var(--color-text-secondary)', border: record.status === status ? '1px solid var(--color-accent)' : '1px solid transparent' }}>{status}</button>)}</div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
