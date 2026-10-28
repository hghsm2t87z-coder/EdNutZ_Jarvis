import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Bot, Building2, CheckCircle2, CircleDollarSign, Lightbulb, Plus, Target, Trash2, Truck } from 'lucide-react';
import { useNavigate } from 'react-router';

type Venture = { id: string; name: string; category: string; stage: string; monthlyRevenue: number; nextAction: string };
type Lead = { id: string; name: string; business: string; status: string; nextStep: string };
type Task = { id: string; text: string; done: boolean };

type BusinessState = { ventures: Venture[]; leads: Lead[]; tasks: Task[] };

const STORAGE_KEY = 'eddy-jarvis-business-command-center-v1';
const initialState: BusinessState = {
  ventures: [
    { id: 'freight', name: 'Freight & Logistics', category: 'Brokerage / Forwarding', stage: 'Build', monthlyRevenue: 0, nextAction: 'Define first service offer and ideal customer.' },
    { id: 'content', name: 'AI Content Agency', category: 'Video / Social / SEO', stage: 'Idea', monthlyRevenue: 0, nextAction: 'Create one simple monthly service package.' },
    { id: 'warehouse', name: 'Warehouse Software', category: 'SaaS / Operations', stage: 'Prototype', monthlyRevenue: 0, nextAction: 'Turn the item-pulling workflow into a demo.' },
    { id: 'realestate', name: 'Real Estate Media', category: 'Listing Content', stage: 'Idea', monthlyRevenue: 0, nextAction: 'Build a sample listing-video offer for agents.' },
  ],
  leads: [],
  tasks: [
    { id: 't1', text: 'Choose the first Freight & Logistics service to sell', done: false },
    { id: 't2', text: 'Write a one-sentence offer and target customer', done: false },
    { id: 't3', text: 'Add the first 10 prospects to Leads', done: false },
  ],
};

function loadState(): BusinessState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.ventures) || !Array.isArray(parsed.leads) || !Array.isArray(parsed.tasks)) return initialState;
    return parsed;
  } catch { return initialState; }
}

export function BusinessCommandCenterPage() {
  const navigate = useNavigate();
  const [state, setState] = useState<BusinessState>(loadState);
  const [leadName, setLeadName] = useState('');
  const [leadNext, setLeadNext] = useState('');
  const [taskText, setTaskText] = useState('');

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }, [state]);
  const revenue = useMemo(() => state.ventures.reduce((sum, v) => sum + (Number(v.monthlyRevenue) || 0), 0), [state.ventures]);
  const openTasks = state.tasks.filter((t) => !t.done).length;

  const updateVenture = (id: string, patch: Partial<Venture>) => setState((s) => ({ ...s, ventures: s.ventures.map((v) => v.id === id ? { ...v, ...patch } : v) }));
  const addLead = () => {
    if (!leadName.trim()) return;
    setState((s) => ({ ...s, leads: [...s.leads, { id: crypto.randomUUID(), name: leadName.trim(), business: 'Freight & Logistics', status: 'New', nextStep: leadNext.trim() || 'Contact prospect' }] }));
    setLeadName(''); setLeadNext('');
  };
  const addTask = () => {
    if (!taskText.trim()) return;
    setState((s) => ({ ...s, tasks: [...s.tasks, { id: crypto.randomUUID(), text: taskText.trim(), done: false }] }));
    setTaskText('');
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-6xl space-y-5">
        <button onClick={() => navigate('/workspace')} className="inline-flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}><ArrowLeft size={16}/> Business workspace</button>
        <header className="rounded-2xl p-5 sm:p-6" style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
          <div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: 'var(--color-accent-subtle)', color: 'var(--color-accent)' }}><Building2/></div><div><div className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--color-accent)' }}>Business Brain</div><h1 className="text-2xl font-semibold" style={{ color: 'var(--color-text)' }}>Money-Making Command Center</h1></div></div>
          <p className="mt-3 text-sm" style={{ color: 'var(--color-text-secondary)' }}>Track ventures, leads, next actions, tasks, and revenue in one place. Saved on this device.</p>
        </header>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[['Active Businesses', state.ventures.length, Lightbulb], ['Leads', state.leads.length, Target], ['Open Tasks', openTasks, CheckCircle2], ['Monthly Revenue', `$${revenue.toLocaleString()}`, CircleDollarSign]].map(([label, value, Icon]: any) => <div key={label} className="rounded-xl p-4" style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}><Icon size={18} style={{ color: 'var(--color-accent)' }}/><div className="mt-3 text-xl font-semibold" style={{ color: 'var(--color-text)' }}>{value}</div><div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{label}</div></div>)}
        </div>

        <section><div className="mb-3 flex items-center justify-between"><h2 className="font-semibold" style={{ color: 'var(--color-text)' }}>Business Portfolio</h2><span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Freight first</span></div><div className="grid gap-3 sm:grid-cols-2">
          {state.ventures.map((v) => <div key={v.id} className="rounded-xl p-4" style={{ background: 'var(--color-bg-secondary)', border: v.id === 'freight' ? '1px solid var(--color-accent)' : '1px solid var(--color-border)' }}>
            <div className="flex items-start justify-between gap-3"><div><div className="flex items-center gap-2 font-semibold" style={{ color: 'var(--color-text)' }}>{v.id === 'freight' ? <Truck size={17}/> : <Lightbulb size={17}/>} {v.name}</div><div className="mt-1 text-xs" style={{ color: 'var(--color-text-secondary)' }}>{v.category}</div></div><select value={v.stage} onChange={(e) => updateVenture(v.id, { stage: e.target.value })} className="rounded-lg px-2 py-1 text-xs" style={{ background: 'var(--color-bg)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}><option>Idea</option><option>Research</option><option>Build</option><option>Prototype</option><option>Launch</option><option>Revenue</option></select></div>
            <label className="mt-4 block text-xs" style={{ color: 'var(--color-text-secondary)' }}>Next action</label><input value={v.nextAction} onChange={(e) => updateVenture(v.id, { nextAction: e.target.value })} className="mt-1 w-full rounded-lg px-3 py-2 text-sm" style={{ background: 'var(--color-bg)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}/>
            <label className="mt-3 block text-xs" style={{ color: 'var(--color-text-secondary)' }}>Monthly revenue</label><input type="number" min="0" inputMode="decimal" value={v.monthlyRevenue} onChange={(e) => updateVenture(v.id, { monthlyRevenue: Math.max(0, Number(e.target.value)) })} className="mt-1 w-full rounded-lg px-3 py-2 text-sm" style={{ background: 'var(--color-bg)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}/>
          </div>)}
        </div></section>

        <div className="grid gap-5 lg:grid-cols-2">
          <section className="rounded-xl p-4" style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}><div className="mb-3 flex items-center gap-2 font-semibold" style={{ color: 'var(--color-text)' }}><Target size={18}/> Leads</div><div className="grid gap-2"><input placeholder="Prospect / company" value={leadName} onChange={(e) => setLeadName(e.target.value)} className="rounded-lg px-3 py-2 text-sm" style={{ background: 'var(--color-bg)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}/><input placeholder="Next step" value={leadNext} onChange={(e) => setLeadNext(e.target.value)} className="rounded-lg px-3 py-2 text-sm" style={{ background: 'var(--color-bg)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}/><button onClick={addLead} className="inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium" style={{ background: 'var(--color-accent)', color: 'var(--color-on-accent)' }}><Plus size={16}/> Add lead</button></div><div className="mt-3 space-y-2">{state.leads.map((lead) => <div key={lead.id} className="flex items-start justify-between gap-2 rounded-lg p-3" style={{ background: 'var(--color-bg)' }}><div><div className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{lead.name}</div><div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{lead.status} · {lead.nextStep}</div></div><button aria-label="Delete lead" onClick={() => setState((s) => ({ ...s, leads: s.leads.filter((l) => l.id !== lead.id) }))}><Trash2 size={16}/></button></div>)}</div></section>

          <section className="rounded-xl p-4" style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}><div className="mb-3 flex items-center gap-2 font-semibold" style={{ color: 'var(--color-text)' }}><CheckCircle2 size={18}/> Next Actions</div><div className="flex gap-2"><input placeholder="Add a task" value={taskText} onChange={(e) => setTaskText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addTask()} className="min-w-0 flex-1 rounded-lg px-3 py-2 text-sm" style={{ background: 'var(--color-bg)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}/><button onClick={addTask} className="rounded-lg px-3" style={{ background: 'var(--color-accent)', color: 'var(--color-on-accent)' }}><Plus size={17}/></button></div><div className="mt-3 space-y-2">{state.tasks.map((task) => <label key={task.id} className="flex items-center gap-3 rounded-lg p-3" style={{ background: 'var(--color-bg)' }}><input type="checkbox" checked={task.done} onChange={() => setState((s) => ({ ...s, tasks: s.tasks.map((t) => t.id === task.id ? { ...t, done: !t.done } : t) }))}/><span className="flex-1 text-sm" style={{ color: task.done ? 'var(--color-text-secondary)' : 'var(--color-text)', textDecoration: task.done ? 'line-through' : 'none' }}>{task.text}</span><button aria-label="Delete task" onClick={(e) => { e.preventDefault(); setState((s) => ({ ...s, tasks: s.tasks.filter((t) => t.id !== task.id) })); }}><Trash2 size={15}/></button></label>)}</div></section>
        </div>

        <section className="rounded-xl p-4" style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}><div className="flex items-center gap-2 font-semibold" style={{ color: 'var(--color-text)' }}><Bot size={18}/> AI Agent Layer</div><p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>Prepared for dedicated Freight, Content, Warehouse SaaS, and Real Estate agents. The dashboard works locally now; agent research can be connected when the OpenJarvis backend is online.</p></section>
      </div>
    </div>
  );
}
