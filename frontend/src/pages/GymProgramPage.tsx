import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Dumbbell, ExternalLink, PlayCircle } from 'lucide-react';

type Exercise = { name: string; sets: string; setCount: number; cues: string[]; videoQuery: string };
type Day = { day: string; focus: string; exercises: Exercise[] };
type SetLog = { weight: string; reps: string; done: boolean };
type ExerciseLog = { machine: string; notes: string; sets: SetLog[] };
type Logs = Record<string, ExerciseLog>;

const youtube = (query: string) => `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
const days: Day[] = [
  { day: 'Monday', focus: 'Chest + Back', exercises: [
    { name: 'Incline Press', sets: '3 × 5–6', setCount: 3, cues: ['Shoulder blades back and down', 'Lower under control', 'Drive up without bouncing'], videoQuery: 'incline press proper form tutorial cues' },
    { name: 'Chest-Supported Row', sets: '3 × 5–6', setCount: 3, cues: ['Keep chest planted', 'Lead with elbows', 'Pause without over-squeezing'], videoQuery: 'chest supported row proper form tutorial cues' },
    { name: 'Machine Chest Press', sets: '3 × 8–12', setCount: 3, cues: ['Set handles near mid-chest', 'Keep shoulders down', 'Control the stretch'], videoQuery: 'machine chest press proper form tutorial cues' },
    { name: 'Lat Pulldown', sets: '3 × 8–12', setCount: 3, cues: ['Drive elbows toward hips', 'Keep ribs controlled', 'Let lats stretch at the top'], videoQuery: 'lat pulldown proper form tutorial cues' },
    { name: 'Cable Fly', sets: '3 × 10–15', setCount: 3, cues: ['Soft bend in elbows', 'Bring biceps toward chest', 'Use a controlled stretch'], videoQuery: 'cable chest fly proper form tutorial cues' },
    { name: 'Seated / Cable Row', sets: '3 × 10–15', setCount: 3, cues: ['Stay tall', 'Pull elbows back', 'Do not turn it into a lower-back swing'], videoQuery: 'seated cable row proper form tutorial cues' },
  ]},
  { day: 'Tuesday', focus: 'Quads + Calves', exercises: [
    { name: 'Hack Squat', sets: '3 × 5–6', setCount: 3, cues: ['Keep full foot planted', 'Let knees travel naturally', 'Use the deepest controlled range'], videoQuery: 'hack squat proper form quad cues' },
    { name: 'Leg Press', sets: '3 × 8–12', setCount: 3, cues: ['Keep hips against pad', 'Control the bottom', 'Drive through the whole foot'], videoQuery: 'leg press proper form quad cues' },
    { name: 'Leg Extension', sets: '3 × 10–15', setCount: 3, cues: ['Line knee with machine pivot', 'Lift smoothly', 'Squeeze quads without kicking'], videoQuery: 'leg extension proper form tutorial cues' },
    { name: 'Bulgarian Split Squat', sets: '3 × 8–12', setCount: 3, cues: ['Use a stable stance', 'Control the descent', 'Drive through the front foot'], videoQuery: 'bulgarian split squat proper form tutorial' },
    { name: 'Standing Calf Raise', sets: '4 × 8–12', setCount: 4, cues: ['Pause in the stretch', 'Rise through the big toe', 'Avoid bouncing'], videoQuery: 'standing calf raise proper form cues' },
    { name: 'Seated Calf Raise', sets: '3 × 12–15', setCount: 3, cues: ['Use full range', 'Pause at bottom', 'Control every rep'], videoQuery: 'seated calf raise proper form cues' },
  ]},
  { day: 'Wednesday', focus: 'Shoulders + Arms', exercises: [
    { name: 'Machine / DB Shoulder Press', sets: '3 × 5–6', setCount: 3, cues: ['Keep forearms stacked', 'Brace torso', 'Press without shrugging'], videoQuery: 'shoulder press proper form tutorial cues' },
    { name: 'Cable Lateral Raise', sets: '3 × 10–15', setCount: 3, cues: ['Lead with elbow', 'Keep traps relaxed', 'Stop around shoulder height'], videoQuery: 'cable lateral raise proper form cues' },
    { name: 'Machine Lateral Raise', sets: '3 × 10–15', setCount: 3, cues: ['Stay planted', 'Drive elbows outward', 'Control the negative'], videoQuery: 'machine lateral raise proper form cues' },
    { name: 'Rear-Delt Fly', sets: '3 × 12–15', setCount: 3, cues: ['Keep shoulders down', 'Sweep arms out', 'Do not turn it into a row'], videoQuery: 'rear delt fly proper form cues' },
    { name: 'EZ-Bar Curl', sets: '3 × 8–12', setCount: 3, cues: ['Keep elbows quiet', 'Curl without swinging', 'Lower slowly'], videoQuery: 'ez bar curl proper form cues' },
    { name: 'Incline Curl', sets: '3 × 10–12', setCount: 3, cues: ['Let arms hang', 'Keep shoulder still', 'Use the long stretch'], videoQuery: 'incline dumbbell curl proper form cues' },
    { name: 'Triceps Pressdown', sets: '3 × 8–12', setCount: 3, cues: ['Pin elbows near sides', 'Extend fully', 'Keep shoulders still'], videoQuery: 'triceps pressdown proper form cues' },
    { name: 'Overhead Triceps Extension', sets: '3 × 10–12', setCount: 3, cues: ['Keep upper arms stable', 'Allow a deep stretch', 'Extend without flaring excessively'], videoQuery: 'overhead triceps extension proper form cues' },
  ]},
  { day: 'Saturday', focus: 'Hamstrings + Glutes', exercises: [
    { name: 'Romanian Deadlift', sets: '3 × 5–6', setCount: 3, cues: ['Push hips back', 'Keep weight close to legs', 'Stop when hamstrings limit the hinge'], videoQuery: 'romanian deadlift proper form hamstring cues' },
    { name: 'Seated Leg Curl', sets: '3 × 8–12', setCount: 3, cues: ['Lock hips into pad', 'Curl smoothly', 'Control the return'], videoQuery: 'seated leg curl proper form cues' },
    { name: 'Hip Thrust', sets: '3 × 8–12', setCount: 3, cues: ['Keep ribs down', 'Drive through feet', 'Finish with glutes, not lower back'], videoQuery: 'hip thrust proper form glute cues' },
    { name: 'Lying Leg Curl', sets: '3 × 10–15', setCount: 3, cues: ['Keep hips down', 'Curl without jerking', 'Slow the negative'], videoQuery: 'lying leg curl proper form cues' },
    { name: 'Glute-Focused Back Extension', sets: '3 × 10–15', setCount: 3, cues: ['Round upper back slightly', 'Hinge at hips', 'Finish by squeezing glutes'], videoQuery: 'glute focused back extension proper form cues' },
    { name: 'Calves', sets: '3 × 10–15', setCount: 3, cues: ['Full stretch', 'Hard controlled rise', 'No bouncing'], videoQuery: 'calf raise proper form cues' },
  ]},
  { day: 'Sunday', focus: 'Upper Body', exercises: [
    { name: 'Incline Machine Press', sets: '3 × 8–12', setCount: 3, cues: ['Set shoulders down', 'Control the bottom', 'Press through a comfortable path'], videoQuery: 'incline machine press proper form cues' },
    { name: 'Neutral-Grip Pulldown', sets: '3 × 8–12', setCount: 3, cues: ['Lead with elbows', 'Keep torso stable', 'Stretch lats fully'], videoQuery: 'neutral grip lat pulldown proper form cues' },
    { name: 'Chest Press', sets: '3 × 8–12', setCount: 3, cues: ['Keep shoulder blades stable', 'Control the stretch', 'Drive evenly'], videoQuery: 'machine chest press proper form cues' },
    { name: 'Chest-Supported Row', sets: '3 × 8–12', setCount: 3, cues: ['Chest stays planted', 'Pull through elbows', 'Use a controlled return'], videoQuery: 'chest supported row proper form cues' },
    { name: 'Lateral Raise', sets: '3 × 12–15', setCount: 3, cues: ['Lead with elbows', 'Stay controlled', 'Keep traps relaxed'], videoQuery: 'lateral raise proper form cues' },
    { name: 'Rear-Delt Fly', sets: '3 × 12–15', setCount: 3, cues: ['Move from shoulders', 'Sweep outward', 'Keep tension on rear delts'], videoQuery: 'rear delt fly proper form cues' },
    { name: 'Biceps', sets: '2 × 10–15', setCount: 2, cues: ['Keep elbows stable', 'Squeeze without swinging', 'Control down'], videoQuery: 'biceps curl proper form cues' },
    { name: 'Triceps', sets: '2 × 10–15', setCount: 2, cues: ['Keep upper arm stable', 'Reach full extension', 'Control return'], videoQuery: 'triceps exercise proper form cues' },
  ]},
];

const keyFor = (day: string, exercise: string) => `${day}:${exercise}`;
const blankLog = (count: number): ExerciseLog => ({ machine: '', notes: '', sets: Array.from({ length: count }, () => ({ weight: '', reps: '', done: false })) });

export function GymProgramPage() {
  const [logs, setLogs] = useState<Logs>(() => {
    try { return JSON.parse(localStorage.getItem('eddy-gym-logs-v1') || '{}') as Logs; } catch { return {}; }
  });
  useEffect(() => { localStorage.setItem('eddy-gym-logs-v1', JSON.stringify(logs)); }, [logs]);

  const updateLog = (day: string, e: Exercise, fn: (log: ExerciseLog) => ExerciseLog) => {
    const key = keyFor(day, e.name);
    setLogs((prev) => ({ ...prev, [key]: fn(prev[key] || blankLog(e.setCount)) }));
  };

  const totalSets = useMemo(() => days.reduce((n, d) => n + d.exercises.reduce((m, e) => m + e.setCount, 0), 0), []);
  const completedSets = Object.values(logs).reduce((n, log) => n + log.sets.filter((s) => s.done).length, 0);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 rounded-2xl p-5 sm:p-6" style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
          <div className="flex items-center gap-3"><Dumbbell size={24} style={{ color: 'var(--color-accent)' }} /><div><div className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-accent)' }}>Personal • Interactive Gym Tracker</div><h1 className="text-2xl font-semibold" style={{ color: 'var(--color-text)' }}>Eddy's 5-Day Bodybuilding Program</h1></div></div>
          <p className="mt-3 text-sm" style={{ color: 'var(--color-text-secondary)' }}>Log your machine, weight, reps, notes, and completed sets. Your entries are remembered on this device.</p>
          <div className="mt-4"><div className="mb-1 flex justify-between text-xs" style={{ color: 'var(--color-text-secondary)' }}><span>Overall set progress</span><span>{completedSets}/{totalSets}</span></div><div className="h-2 overflow-hidden rounded-full" style={{ background: 'var(--color-border)' }}><div className="h-full rounded-full" style={{ width: `${Math.round((completedSets / totalSets) * 100)}%`, background: 'var(--color-accent)' }} /></div></div>
        </header>

        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">{days.map((d) => <a key={d.day} href={`#${d.day.toLowerCase()}`} className="rounded-xl p-3 text-center" style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}><div className="text-sm font-semibold">{d.day}</div><div className="mt-1 text-[11px]" style={{ color: 'var(--color-text-secondary)' }}>{d.focus}</div></a>)}</div>

        <div className="space-y-7">{days.map((d) => {
          const dayTotal = d.exercises.reduce((n, e) => n + e.setCount, 0);
          const dayDone = d.exercises.reduce((n, e) => n + (logs[keyFor(d.day, e.name)]?.sets.filter((s) => s.done).length || 0), 0);
          return <section key={d.day} id={d.day.toLowerCase()} className="scroll-mt-4">
            <div className="mb-3 flex items-end justify-between gap-3"><h2 className="text-xl font-semibold" style={{ color: 'var(--color-text)' }}>{d.day} — {d.focus}</h2><span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{dayDone}/{dayTotal} sets</span></div>
            <div className="grid gap-3 sm:grid-cols-2">{d.exercises.map((e, i) => {
              const log = logs[keyFor(d.day, e.name)] || blankLog(e.setCount);
              const exerciseDone = log.sets.length > 0 && log.sets.every((s) => s.done);
              return <article key={e.name} className="rounded-2xl p-4" style={{ background: 'var(--color-bg-secondary)', border: `1px solid ${exerciseDone ? 'var(--color-accent)' : 'var(--color-border)'}` }}>
                <div className="flex items-start justify-between gap-3"><div><div className="flex items-center gap-2 text-xs font-semibold" style={{ color: 'var(--color-accent)' }}>EXERCISE {i + 1}{exerciseDone && <CheckCircle2 size={15} />}</div><h3 className="mt-1 font-semibold" style={{ color: 'var(--color-text)' }}>{e.name}</h3></div><div className="rounded-lg px-2.5 py-1 text-sm font-bold" style={{ background: 'var(--color-accent-subtle)', color: 'var(--color-accent)' }}>{e.sets}</div></div>

                <label className="mt-4 block text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--color-text-secondary)' }}>Machine used</label>
                <input value={log.machine} onChange={(ev) => updateLog(d.day, e, (x) => ({ ...x, machine: ev.target.value }))} placeholder="e.g. Hammer Strength Incline Press" className="mt-1 min-h-11 w-full rounded-xl border bg-transparent px-3 text-base outline-none" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }} />

                <div className="mt-4 space-y-2">{log.sets.map((set, si) => <div key={si} className="grid grid-cols-[auto_1fr_1fr_auto] items-center gap-2"><span className="text-xs font-semibold" style={{ color: 'var(--color-text-secondary)' }}>S{si + 1}</span><input inputMode="decimal" value={set.weight} onChange={(ev) => updateLog(d.day, e, (x) => ({ ...x, sets: x.sets.map((s, j) => j === si ? { ...s, weight: ev.target.value } : s) }))} placeholder="lb" aria-label={`Set ${si + 1} weight`} className="min-h-11 min-w-0 rounded-xl border bg-transparent px-2 text-base outline-none" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }} /><input inputMode="numeric" value={set.reps} onChange={(ev) => updateLog(d.day, e, (x) => ({ ...x, sets: x.sets.map((s, j) => j === si ? { ...s, reps: ev.target.value } : s) }))} placeholder="reps" aria-label={`Set ${si + 1} reps`} className="min-h-11 min-w-0 rounded-xl border bg-transparent px-2 text-base outline-none" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }} /><button type="button" aria-label={`Mark set ${si + 1} complete`} onClick={() => updateLog(d.day, e, (x) => ({ ...x, sets: x.sets.map((s, j) => j === si ? { ...s, done: !s.done } : s) }))} className="flex h-11 w-11 items-center justify-center rounded-xl border" style={{ borderColor: set.done ? 'var(--color-accent)' : 'var(--color-border)', background: set.done ? 'var(--color-accent-subtle)' : 'transparent', color: set.done ? 'var(--color-accent)' : 'var(--color-text-secondary)' }}><CheckCircle2 size={20} /></button></div>)}</div>

                <label className="mt-4 block text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--color-text-secondary)' }}>Notes / setup</label><input value={log.notes} onChange={(ev) => updateLog(d.day, e, (x) => ({ ...x, notes: ev.target.value }))} placeholder="Seat, handle, grip, setup notes…" className="mt-1 min-h-11 w-full rounded-xl border bg-transparent px-3 text-base outline-none" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }} />

                <details className="mt-4"><summary className="cursor-pointer text-sm font-semibold" style={{ color: 'var(--color-text)' }}>Technique cues</summary><ul className="mt-2 space-y-1.5 text-sm" style={{ color: 'var(--color-text-secondary)' }}>{e.cues.map((cue) => <li key={cue}>• {cue}</li>)}</ul></details>
                <a href={youtube(e.videoQuery)} target="_blank" rel="noreferrer" className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium" style={{ background: 'var(--color-accent)', color: 'var(--color-on-accent)' }}><PlayCircle size={16} /> Demo videos <ExternalLink size={13} /></a>
              </article>;
            })}</div>
          </section>;
        })}</div>

        <div className="my-8 rounded-2xl p-5" style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}><h2 className="font-semibold" style={{ color: 'var(--color-text)' }}>Training rules</h2><p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>Keep most working sets around 1–2 reps in reserve. Rest 2–3+ minutes for heavy sets and about 1.5–2 minutes for moderate-rep work. Use controlled technique and progressive overload.</p></div>
      </div>
    </div>
  );
}
