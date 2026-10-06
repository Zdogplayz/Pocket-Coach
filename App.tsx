import { useState, type ReactNode } from "react";

type IconName =
  | "home"
  | "swing"
  | "stats"
  | "account"
  | "plan"
  | "bell"
  | "arrow"
  | "spark"
  | "play"
  | "check";

const iconPaths: Record<IconName, ReactNode> = {
  home: <><path d="M3 10.8 12 3l9 7.8"/><path d="M5.5 9.5V21h13V9.5"/><path d="M9.5 21v-7h5v7"/></>,
  swing: <><path d="M6 3c6 3 9 8 10 15"/><path d="m13 18 6-2 1 3-6 2z"/><path d="M4 20h5"/></>,
  stats: <><path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-7"/><path d="M22 20H2"/></>,
  account: <><circle cx="12" cy="8" r="4"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/></>,
  plan: <><rect x="3" y="5" width="18" height="15" rx="3"/><path d="M3 10h18"/><path d="M8 15h3"/></>,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
  arrow: <><path d="M5 12h14"/><path d="m14 7 5 5-5 5"/></>,
  spark: <><path d="m12 3 1.4 4.1L17 9l-3.6 1.9L12 15l-1.4-4.1L7 9l3.6-1.9z"/><path d="m5 15 .7 2.3L8 18l-2.3.7L5 21l-.7-2.3L2 18l2.3-.7z"/></>,
  play: <path d="m9 7 8 5-8 5z"/>,
  check: <path d="m5 12 4 4L19 6"/>,
};

function Icon({ name, className = "size-5" }: { name: IconName; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {iconPaths[name]}
    </svg>
  );
}

const navItems: { label: string; icon: IconName }[] = [
  { label: "Home", icon: "home" },
  { label: "Swing", icon: "swing" },
  { label: "Stats", icon: "stats" },
  { label: "Account", icon: "account" },
  { label: "Plan", icon: "plan" },
];

function StatCard({ value, label, detail, accent }: { value: string; label: string; detail: string; accent?: boolean }) {
  return (
    <div className={`min-w-36 flex-1 rounded-3xl border p-5 ${accent ? "border-emerald-300/30 bg-emerald-300 text-neutral-950" : "border-white/8 bg-neutral-900 text-white"}`}>
      <p className={`text-xs font-semibold uppercase tracking-widest ${accent ? "text-neutral-700" : "text-neutral-500"}`}>{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p>
      <p className={`mt-1 text-xs ${accent ? "text-neutral-700" : "text-neutral-400"}`}>{detail}</p>
    </div>
  );
}

function Dashboard({ onNavigate }: { onNavigate: (index: number) => void }) {
  return (
    <>
      <section className="mt-8">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="text-sm text-neutral-500">Weekly overview</p>
            <h2 className="mt-1 text-xl font-semibold">Your game at a glance</h2>
          </div>
          <button onClick={() => onNavigate(2)} className="text-sm font-semibold text-emerald-300 transition hover:text-emerald-200">View stats</button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          <StatCard value="8.4" label="Handicap" detail="↓ 0.7 this month" accent />
          <StatCard value="104" label="Club speed" detail="mph · Driver" />
          <StatCard value="72%" label="Consistency" detail="+6% this week" />
        </div>
      </section>

      <section className="relative mt-7 min-h-64 overflow-hidden rounded-[2rem] border border-white/10">
        <img
          src="https://images.unsplash.com/photo-1633597468433-fdb200b73f62?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1200"
          alt="Golfer practicing a swing on the course"
          className="absolute inset-0 size-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/85 to-neutral-950/20" />
        <div className="relative flex min-h-64 max-w-sm flex-col justify-between p-6">
          <span className="flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium backdrop-blur">
            <span className="size-1.5 rounded-full bg-emerald-300" /> Next session
          </span>
          <div>
            <h2 className="text-2xl font-semibold leading-tight">Dial in your<br />tempo today.</h2>
            <p className="mt-2 text-sm text-neutral-300">12 min · Driver fundamentals</p>
            <button onClick={() => onNavigate(1)} className="mt-5 flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-emerald-200">
              <Icon name="play" className="size-4 fill-current" /> Start practice
            </button>
          </div>
        </div>
      </section>

      <section className="mt-7">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent swings</h2>
          <button onClick={() => onNavigate(1)} className="rounded-full border border-white/10 p-2 text-neutral-300 transition hover:bg-white/10" aria-label="View all swings">
            <Icon name="arrow" className="size-4" />
          </button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { club: "7 Iron", time: "Today, 8:42 AM", score: "87", note: "Great tempo" },
            { club: "Driver", time: "Yesterday, 5:16 PM", score: "74", note: "Check alignment" },
          ].map((swing) => (
            <button key={swing.club} onClick={() => onNavigate(1)} className="group flex items-center gap-4 rounded-3xl border border-white/8 bg-neutral-900 p-4 text-left transition hover:border-emerald-300/30 hover:bg-neutral-800">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-neutral-800 text-emerald-300 group-hover:bg-neutral-700"><Icon name="swing" /></span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold">{swing.club}</span>
                <span className="mt-1 block text-xs text-neutral-500">{swing.time}</span>
              </span>
              <span className="text-right">
                <span className="block text-lg font-semibold">{swing.score}</span>
                <span className="block text-xs text-neutral-500">{swing.note}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <button onClick={() => onNavigate(4)} className="mt-7 flex w-full items-center gap-4 rounded-3xl border border-violet-300/20 bg-violet-300/10 p-5 text-left transition hover:bg-violet-300/15">
        <span className="grid size-11 place-items-center rounded-2xl bg-violet-300 text-neutral-950"><Icon name="spark" /></span>
        <span className="flex-1">
          <span className="block font-semibold">Pocket Coach Pro</span>
          <span className="mt-1 block text-xs text-neutral-400">Renews May 24 · All features active</span>
        </span>
        <Icon name="arrow" className="size-5 text-violet-200" />
      </button>
    </>
  );
}

function DetailView({ active }: { active: number }) {
  const views = [
    null,
    { eyebrow: "Swing Lab", title: "Build a repeatable swing.", copy: "Record your next swing for instant tempo, plane, and posture feedback.", action: "Record a swing", metric: "18", label: "Swings this week" },
    { eyebrow: "Performance", title: "Your game is trending up.", copy: "You gained 11% consistency over the last four weeks.", action: "Open full report", metric: "8.4", label: "Current handicap" },
    { eyebrow: "Profile", title: "Alex Morgan", copy: "Right-handed · Intermediate · Member since 2024", action: "Edit profile", metric: "24", label: "Practice streak" },
    { eyebrow: "Membership", title: "Pocket Coach Pro", copy: "Your plan is active and renews on May 24, 2025.", action: "Manage subscription", metric: "$12", label: "Monthly plan" },
  ][active];

  if (!views) return null;
  return (
    <section className="mt-10 animate-in">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">{views.eyebrow}</p>
      <h2 className="mt-3 max-w-md text-4xl font-semibold tracking-tight">{views.title}</h2>
      <p className="mt-4 max-w-lg leading-7 text-neutral-400">{views.copy}</p>
      <div className="mt-8 rounded-[2rem] border border-white/10 bg-neutral-900 p-6">
        <div className="flex items-end justify-between">
          <div><p className="text-5xl font-semibold tracking-tight">{views.metric}</p><p className="mt-2 text-sm text-neutral-500">{views.label}</p></div>
          <div className="grid size-12 place-items-center rounded-full bg-emerald-300 text-neutral-950"><Icon name="check" /></div>
        </div>
        <div className="mt-8 h-2 overflow-hidden rounded-full bg-neutral-800"><div className="h-full w-3/4 rounded-full bg-emerald-300" /></div>
      </div>
      <button className="mt-5 flex w-full items-center justify-between rounded-2xl bg-white px-5 py-4 font-semibold text-neutral-950 transition hover:bg-emerald-200">
        {views.action}<Icon name="arrow" />
      </button>
    </section>
  );
}

export default function App() {
  const [active, setActive] = useState(0);

  return (
    <main className="min-h-screen bg-neutral-950 text-white selection:bg-emerald-300 selection:text-neutral-950">
      <div className="mx-auto min-h-screen max-w-3xl px-5 pb-36 pt-6 sm:px-8 sm:pt-10">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-sm text-neutral-500">Monday, May 19</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">Morning, Alex.</h1>
          </div>
          <button className="relative grid size-11 place-items-center rounded-full border border-white/10 bg-neutral-900 text-neutral-300 transition hover:bg-neutral-800" aria-label="Notifications">
            <Icon name="bell" />
            <span className="absolute right-2 top-2 size-2 rounded-full border-2 border-neutral-900 bg-emerald-300" />
          </button>
        </header>

        {active === 0 ? <Dashboard onNavigate={setActive} /> : <DetailView active={active} />}
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-xl px-4 pb-4 sm:pb-6" aria-label="Primary navigation">
        <div className="relative grid grid-cols-5 rounded-[1.75rem] border border-white/10 bg-neutral-900/90 p-1.5 shadow-2xl shadow-black/50 backdrop-blur-xl">
          <span
            className="absolute bottom-1.5 left-1.5 top-1.5 w-[calc((100%_-_0.75rem)/5)] rounded-[1.35rem] bg-emerald-300 transition-transform duration-300 ease-out"
            style={{ transform: `translateX(${active * 100}%)` }}
          />
          {navItems.map((item, index) => (
            <button
              key={item.label}
              onClick={() => setActive(index)}
              className={`relative z-10 flex min-w-0 flex-col items-center gap-1.5 rounded-2xl py-2.5 text-[0.65rem] font-medium transition-colors ${active === index ? "text-neutral-950" : "text-neutral-500 hover:text-white"}`}
              aria-current={active === index ? "page" : undefined}
            >
              <Icon name={item.icon} className="size-5" />
              <span className="truncate">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </main>
  );
}