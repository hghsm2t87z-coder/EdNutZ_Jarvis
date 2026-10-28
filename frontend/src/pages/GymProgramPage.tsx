import { Dumbbell, ExternalLink, PlayCircle } from 'lucide-react';

type Exercise = {
  name: string;
  sets: string;
  cues: string[];
  videoQuery: string;
};

type Day = { day: string; focus: string; exercises: Exercise[] };

const youtube = (query: string) => `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

const days: Day[] = [
  { day: 'Monday', focus: 'Chest + Back', exercises: [
    { name: 'Incline Press', sets: '3 × 5–6', cues: ['Shoulder blades back and down', 'Lower under control', 'Drive up without bouncing'], videoQuery: 'incline press proper form tutorial cues' },
    { name: 'Chest-Supported Row', sets: '3 × 5–6', cues: ['Keep chest planted', 'Lead with elbows', 'Pause without over-squeezing'], videoQuery: 'chest supported row proper form tutorial cues' },
    { name: 'Machine Chest Press', sets: '3 × 8–12', cues: ['Set handles near mid-chest', 'Keep shoulders down', 'Control the stretch'], videoQuery: 'machine chest press proper form tutorial cues' },
    { name: 'Lat Pulldown', sets: '3 × 8–12', cues: ['Drive elbows toward hips', 'Keep ribs controlled', 'Let lats stretch at the top'], videoQuery: 'lat pulldown proper form tutorial cues' },
    { name: 'Cable Fly', sets: '3 × 10–15', cues: ['Soft bend in elbows', 'Bring biceps toward chest', 'Use a controlled stretch'], videoQuery: 'cable chest fly proper form tutorial cues' },
    { name: 'Seated / Cable Row', sets: '3 × 10–15', cues: ['Stay tall', 'Pull elbows back', 'Do not turn it into a lower-back swing'], videoQuery: 'seated cable row proper form tutorial cues' },
  ]},
  { day: 'Tuesday', focus: 'Quads + Calves', exercises: [
    { name: 'Hack Squat', sets: '3 × 5–6', cues: ['Keep full foot planted', 'Let knees travel naturally', 'Use the deepest controlled range'], videoQuery: 'hack squat proper form quad cues' },
    { name: 'Leg Press', sets: '3 × 8–12', cues: ['Keep hips against pad', 'Control the bottom', 'Drive through the whole foot'], videoQuery: 'leg press proper form quad cues' },
    { name: 'Leg Extension', sets: '3 × 10–15', cues: ['Line knee with machine pivot', 'Lift smoothly', 'Squeeze quads without kicking'], videoQuery: 'leg extension proper form tutorial cues' },
    { name: 'Bulgarian Split Squat', sets: '3 × 8–12', cues: ['Use a stable stance', 'Control the descent', 'Drive through the front foot'], videoQuery: 'bulgarian split squat proper form tutorial' },
    { name: 'Standing Calf Raise', sets: '4 × 8–12', cues: ['Pause in the stretch', 'Rise through the big toe', 'Avoid bouncing'], videoQuery: 'standing calf raise proper form cues' },
    { name: 'Seated Calf Raise', sets: '3 × 12–15', cues: ['Use full range', 'Pause at bottom', 'Control every rep'], videoQuery: 'seated calf raise proper form cues' },
  ]},
  { day: 'Wednesday', focus: 'Shoulders + Arms', exercises: [
    { name: 'Machine / DB Shoulder Press', sets: '3 × 5–6', cues: ['Keep forearms stacked', 'Brace torso', 'Press without shrugging'], videoQuery: 'shoulder press proper form tutorial cues' },
    { name: 'Cable Lateral Raise', sets: '3 × 10–15', cues: ['Lead with elbow', 'Keep traps relaxed', 'Stop around shoulder height'], videoQuery: 'cable lateral raise proper form cues' },
    { name: 'Machine Lateral Raise', sets: '3 × 10–15', cues: ['Stay planted', 'Drive elbows outward', 'Control the negative'], videoQuery: 'machine lateral raise proper form cues' },
    { name: 'Rear-Delt Fly', sets: '3 × 12–15', cues: ['Keep shoulders down', 'Sweep arms out', 'Do not turn it into a row'], videoQuery: 'rear delt fly proper form cues' },
    { name: 'EZ-Bar Curl', sets: '3 × 8–12', cues: ['Keep elbows quiet', 'Curl without swinging', 'Lower slowly'], videoQuery: 'ez bar curl proper form cues' },
    { name: 'Incline Curl', sets: '3 × 10–12', cues: ['Let arms hang', 'Keep shoulder still', 'Use the long stretch'], videoQuery: 'incline dumbbell curl proper form cues' },
    { name: 'Triceps Pressdown', sets: '3 × 8–12', cues: ['Pin elbows near sides', 'Extend fully', 'Keep shoulders still'], videoQuery: 'triceps pressdown proper form cues' },
    { name: 'Overhead Triceps Extension', sets: '3 × 10–12', cues: ['Keep upper arms stable', 'Allow a deep stretch', 'Extend without flaring excessively'], videoQuery: 'overhead triceps extension proper form cues' },
  ]},
  { day: 'Saturday', focus: 'Hamstrings + Glutes', exercises: [
    { name: 'Romanian Deadlift', sets: '3 × 5–6', cues: ['Push hips back', 'Keep weight close to legs', 'Stop when hamstrings limit the hinge'], videoQuery: 'romanian deadlift proper form hamstring cues' },
    { name: 'Seated Leg Curl', sets: '3 × 8–12', cues: ['Lock hips into pad', 'Curl smoothly', 'Control the return'], videoQuery: 'seated leg curl proper form cues' },
    { name: 'Hip Thrust', sets: '3 × 8–12', cues: ['Keep ribs down', 'Drive through feet', 'Finish with glutes, not lower back'], videoQuery: 'hip thrust proper form glute cues' },
    { name: 'Lying Leg Curl', sets: '3 × 10–15', cues: ['Keep hips down', 'Curl without jerking', 'Slow the negative'], videoQuery: 'lying leg curl proper form cues' },
    { name: 'Glute-Focused Back Extension', sets: '3 × 10–15', cues: ['Round upper back slightly', 'Hinge at hips', 'Finish by squeezing glutes'], videoQuery: 'glute focused back extension proper form cues' },
    { name: 'Calves', sets: '3 × 10–15', cues: ['Full stretch', 'Hard controlled rise', 'No bouncing'], videoQuery: 'calf raise proper form cues' },
  ]},
  { day: 'Sunday', focus: 'Upper Body', exercises: [
    { name: 'Incline Machine Press', sets: '3 × 8–12', cues: ['Set shoulders down', 'Control the bottom', 'Press through a comfortable path'], videoQuery: 'incline machine press proper form cues' },
    { name: 'Neutral-Grip Pulldown', sets: '3 × 8–12', cues: ['Lead with elbows', 'Keep torso stable', 'Stretch lats fully'], videoQuery: 'neutral grip lat pulldown proper form cues' },
    { name: 'Chest Press', sets: '3 × 8–12', cues: ['Keep shoulder blades stable', 'Control the stretch', 'Drive evenly'], videoQuery: 'machine chest press proper form cues' },
    { name: 'Chest-Supported Row', sets: '3 × 8–12', cues: ['Chest stays planted', 'Pull through elbows', 'Use a controlled return'], videoQuery: 'chest supported row proper form cues' },
    { name: 'Lateral Raise', sets: '3 × 12–15', cues: ['Lead with elbows', 'Stay controlled', 'Keep traps relaxed'], videoQuery: 'lateral raise proper form cues' },
    { name: 'Rear-Delt Fly', sets: '3 × 12–15', cues: ['Move from shoulders', 'Sweep outward', 'Keep tension on rear delts'], videoQuery: 'rear delt fly proper form cues' },
    { name: 'Biceps', sets: '2 × 10–15', cues: ['Keep elbows stable', 'Squeeze without swinging', 'Control down'], videoQuery: 'biceps curl proper form cues' },
    { name: 'Triceps', sets: '2 × 10–15', cues: ['Keep upper arm stable', 'Reach full extension', 'Control return'], videoQuery: 'triceps exercise proper form cues' },
  ]},
];

export function GymProgramPage() {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 rounded-2xl p-5 sm:p-6" style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
          <div className="flex items-center gap-3"><Dumbbell size={24} style={{ color: 'var(--color-accent)' }} /><div><div className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-accent)' }}>Personal • Gym Program</div><h1 className="text-2xl font-semibold" style={{ color: 'var(--color-text)' }}>Eddy's 5-Day Bodybuilding Program</h1></div></div>
          <p className="mt-3 text-sm" style={{ color: 'var(--color-text-secondary)' }}>Heavy 5–6 rep work first, then controlled 8–15 rep hypertrophy work. Thursday and Friday are recovery days.</p>
        </header>

        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {days.map((d) => <a key={d.day} href={`#${d.day.toLowerCase()}`} className="rounded-xl p-3 text-center" style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}><div className="text-sm font-semibold">{d.day}</div><div className="mt-1 text-[11px]" style={{ color: 'var(--color-text-secondary)' }}>{d.focus}</div></a>)}
        </div>

        <div className="space-y-7">
          {days.map((d) => (
            <section key={d.day} id={d.day.toLowerCase()} className="scroll-mt-4">
              <div className="mb-3"><h2 className="text-xl font-semibold" style={{ color: 'var(--color-text)' }}>{d.day} — {d.focus}</h2></div>
              <div className="grid gap-3 sm:grid-cols-2">
                {d.exercises.map((e, i) => (
                  <article key={e.name} className="rounded-2xl p-4" style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
                    <div className="flex items-start justify-between gap-3"><div><div className="text-xs font-semibold" style={{ color: 'var(--color-accent)' }}>EXERCISE {i + 1}</div><h3 className="mt-1 font-semibold" style={{ color: 'var(--color-text)' }}>{e.name}</h3></div><div className="rounded-lg px-2.5 py-1 text-sm font-bold" style={{ background: 'var(--color-accent-subtle)', color: 'var(--color-accent)' }}>{e.sets}</div></div>
                    <div className="mt-4"><div className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--color-text-secondary)' }}>Cues</div><ul className="mt-2 space-y-1.5 text-sm" style={{ color: 'var(--color-text)' }}>{e.cues.map((cue) => <li key={cue}>• {cue}</li>)}</ul></div>
                    <a href={youtube(e.videoQuery)} target="_blank" rel="noreferrer" className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium" style={{ background: 'var(--color-accent)', color: 'var(--color-on-accent)' }}><PlayCircle size={16} /> Demo videos <ExternalLink size={13} /></a>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="my-8 rounded-2xl p-5" style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}><h2 className="font-semibold" style={{ color: 'var(--color-text)' }}>Training rules</h2><p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>Keep most working sets around 1–2 reps in reserve. Rest 2–3+ minutes for heavy sets and about 1.5–2 minutes for moderate-rep work. Use controlled technique and progressive overload. Avoid the high-row variation that repeatedly causes cramping; use a comfortable chest-supported row or pulldown instead.</p></div>
      </div>
    </div>
  );
}
