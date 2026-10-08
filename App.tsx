import { useState, type ReactNode } from "react";
import fairwaysLogo from "./assets/fairways-logo.png";

type IconName =
  | "home"
  | "swing"
  | "stats"
  | "practice"
  | "profile"
  | "camera"
  | "target"
  | "spark"
  | "play"
  | "arrow"
  | "chevron"
  | "check"
  | "settings"
  | "bell"
  | "bookmark";

type Screen =
  | "home"
  | "swing"
  | "stats"
  | "practice"
  | "profile"
  | "diagnosis"
  | "analysis"
  | "premium";

const iconPaths: Record<IconName, ReactNode> = {
  home: <><path d="m3 10 9-7 9 7" /><path d="M5 9v11h14V9M9 20v-6h6v6" /></>,
  swing: <><path d="M7 3c5 2 8 6 9 12" /><path d="M4 5c7 1 12 5 14 12" /><path d="m16 15 3 4M15 19h6" /></>,
  stats: <><path d="M4 19V9M10 19V5M16 19v-7M22 19H2" /></>,
  practice: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" /><path d="M12 2v3M22 12h-3" /></>,
  profile: <><circle cx="12" cy="8" r="4" /><path d="M4.5 21c.8-4.3 3.3-6.5 7.5-6.5s6.7 2.2 7.5 6.5" /></>,
  camera: <><path d="M4 7h4l1.5-2h5L16 7h4v12H4z" /><circle cx="12" cy="13" r="3.5" /></>,
  target: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" /><path d="m14 10 6-6M16 4h4v4" /></>,
  spark: <><path d="M12 3c.5 4.5 2.5 6.5 7 7-4.5.5-6.5 2.5-7 7-.5-4.5-2.5-6.5-7-7 4.5-.5 6.5-2.5 7-7Z" /><path d="M19 16c.2 1.7 1 2.5 2.7 2.7-1.7.2-2.5 1-2.7 2.7-.2-1.7-1-2.5-2.7-2.7 1.7-.2 2.5-1 2.7-2.7Z" /></>,
  play: <path d="m9 7 8 5-8 5Z" />,
  arrow: <><path d="M5 12h14M14 7l5 5-5 5" /></>,
  chevron: <path d="m9 6 6 6-6 6" />,
  check: <path d="m5 12 4 4L19 6" />,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.4-2.4 1A7 7 0 0 0 15 6l-.3-2.5h-4L10.4 6a7 7 0 0 0-1.6 1L6.5 6l-2 3.4 2 1.5a7 7 0 0 0 0 2.1l-2 1.5 2 3.4 2.4-1a7 7 0 0 0 1.6 1l.3 2.5h4L15 18a7 7 0 0 0 1.6-1l2.4 1 2-3.4-2-1.5c.1-.4.1-.7.1-1Z" /></>,
  bell: <><path d="M6 17h12l-1.5-2v-4.5a4.5 4.5 0 0 0-9 0V15Z" /><path d="M10 20h4" /></>,
  bookmark: <path d="M6 4h12v17l-6-4-6 4Z" />,
};

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return (
    <svg
      aria-hidden="true"
      className="icon"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      {iconPaths[name]}
    </svg>
  );
}

function Button({
  children,
  variant = "primary",
  onClick,
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "text";
  onClick?: () => void;
}) {
  return (
    <button className={`button button--${variant}`} onClick={onClick}>
      {children}
    </button>
  );
}

function ScreenHeader({
  title,
  eyebrow,
  onBack,
}: {
  title: string;
  eyebrow?: string;
  onBack?: () => void;
}) {
  return (
    <header className="screen-header">
      {onBack && (
        <button aria-label="Go back" className="back-button" onClick={onBack}>
          <Icon name="chevron" />
        </button>
      )}
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <div className="screen-title">{title}</div>
      </div>
    </header>
  );
}

function BrandMark() {
  return (
    <div className="brand-mark" aria-label="Fairways">
      <img src={fairwaysLogo} alt="Fairways" />
    </div>
  );
}

function MiniChart({ tall = false }: { tall?: boolean }) {
  return (
    <div className={tall ? "chart chart--tall" : "chart"}>
      <svg preserveAspectRatio="none" viewBox="0 0 320 90">
        <defs>
          <linearGradient id={`fill-${tall}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="var(--accent)" stopOpacity=".22" />
            <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path className="chart-grid" d="M0 20H320M0 50H320M0 80H320" />
        <path className="chart-fill" d="M0 76C30 72 42 66 65 68s42-25 70-20 36 9 59-5 35-26 59-18 41-8 67-18V90H0Z" fill={`url(#fill-${tall})`} />
        <path className="chart-line" d="M0 76C30 72 42 66 65 68s42-25 70-20 36 9 59-5 35-26 59-18 41-8 67-18" />
        <circle className="chart-dot" cx="320" cy="7" r="4" />
      </svg>
    </div>
  );
}

function HomeScreen({ goTo }: { goTo: (screen: Screen) => void }) {
  return (
    <main className="page home-page">
      <header className="home-header">
        <div>
          <div className="brand-row"><BrandMark /></div>
          <div className="greeting">Good morning, John</div>
          <p className="subtle-copy">Ready to improve your swing?</p>
        </div>
        <button className="avatar" onClick={() => goTo("profile")} aria-label="Open profile">
          <span>JD</span>
          <i />
        </button>
      </header>

      <section className="summary-row" aria-label="Player summary">
        <div><span>HANDICAP</span><strong>18.4</strong></div>
        <div><span>CURRENT STREAK</span><strong>4 <small>DAYS</small></strong></div>
        <div><span>SWINGS</span><strong>127</strong></div>
      </section>

      <section className="coach-card">
        <div className="coach-glow" />
        <div className="coach-topline">
          <div className="ai-badge"><Icon name="spark" size={16} /> AI COACH</div>
          <div className="trajectory" aria-hidden="true"><i /><i /><i /></div>
        </div>
        <div className="coach-heading">Your AI Coach</div>
        <p className="coach-subtitle">Let's work on your swing.</p>
        <div className="focus-block">
          <div className="eyebrow accent">TODAY'S FOCUS</div>
          <div className="focus-title">Clubface Control</div>
          <p>Your recent swings show an open clubface at impact. Let's keep the face square through impact.</p>
        </div>
        <Button onClick={() => goTo("swing")}>
          START SESSION <Icon name="arrow" size={18} />
        </Button>
      </section>

      <section>
        <div className="section-label">QUICK ACTIONS</div>
        <div className="quick-grid">
          <button className="quick-card quick-card--featured" onClick={() => goTo("swing")}>
            <span className="quick-icon"><Icon name="camera" /></span>
            <span>Analyze<br />Swing</span>
          </button>
          <button className="quick-card" onClick={() => goTo("practice")}>
            <span className="quick-icon"><Icon name="target" /></span>
            <span>Practice</span>
          </button>
          <button className="quick-card" onClick={() => goTo("diagnosis")}>
            <span className="quick-icon"><Icon name="spark" /></span>
            <span>Why Did I<br />Hit That?</span>
          </button>
        </div>
      </section>

      <section>
        <div className="section-head">
          <div className="section-title">Recent Performance</div>
          <div className="positive">+8% this week</div>
        </div>
        <div className="performance-card card">
          <div className="score-ring">
            <svg viewBox="0 0 100 100">
              <circle className="ring-track" cx="50" cy="50" r="42" />
              <circle className="ring-value" cx="50" cy="50" r="42" />
            </svg>
            <div><strong>78</strong><span>/100</span></div>
          </div>
          <div className="performance-details">
            <div className="eyebrow">SWING SCORE</div>
            <div className="metric-row"><span>Consistency</span><strong>74%</strong></div>
            <div className="meter"><i style={{ width: "74%" }} /></div>
            <div className="metric-row"><span>Contact</span><strong>81%</strong></div>
            <div className="meter"><i style={{ width: "81%" }} /></div>
            <div className="metric-row"><span>Accuracy</span><strong className="positive">↗ 12%</strong></div>
          </div>
        </div>
      </section>

      <section className="card progress-card">
        <div className="section-head">
          <div className="section-title">Your Progress</div>
          <span className="pill">7 SESSIONS</span>
        </div>
        <div className="comparison">
          <div><span>LAST WEEK</span><strong>62</strong></div>
          <Icon name="arrow" />
          <div><span>THIS WEEK</span><strong>78</strong></div>
          <div className="delta">+16</div>
        </div>
        <MiniChart />
        <p><Icon name="spark" size={15} /> Your swing consistency is improving.</p>
      </section>

      <section className="card goal-card">
        <div className="section-head">
          <div className="section-title">Current Goal</div>
          <Icon name="target" />
        </div>
        <div className="goal-name">Reduce your driver miss</div>
        <div className="goal-stats">
          <div><span>CURRENT</span><strong>23 yds right</strong></div>
          <div><span>GOAL</span><strong>Under 15 yds</strong></div>
        </div>
        <div className="metric-row"><span>Progress</span><strong>68%</strong></div>
        <div className="meter meter--large"><i style={{ width: "68%" }} /></div>
      </section>

      <section>
        <div className="section-title section-title--standalone">Last Session</div>
        <div className="card session-card">
          <div className="video-thumb">
            <div className="swing-figure"><i /><i /><i /></div>
            <span><Icon name="play" size={16} /></span>
            <small>00:08</small>
          </div>
          <div className="session-info">
            <div className="session-title">7 Iron <span>12 swings</span></div>
            <div className="issue"><span>PRIMARY ISSUE</span>Open clubface</div>
            <div className="result">↗ Dispersion improved 18%</div>
            <Button variant="text" onClick={() => goTo("analysis")}>VIEW SESSION <Icon name="arrow" size={15} /></Button>
          </div>
        </div>
      </section>
    </main>
  );
}

function SwingScreen({ goTo }: { goTo: (screen: Screen) => void }) {
  const [videoName, setVideoName] = useState("");
  const [coachPrompt, setCoachPrompt] = useState("");

  return (
    <main className="page">
      <ScreenHeader eyebrow="AI SWING LAB" title="Record Your Swing" />
      <p className="page-intro">Set up your phone, frame your swing, and let Fairways find your next improvement.</p>
      <section className="camera-stage">
        <div className="scan-line" />
        <div className="frame-corner c1" /><div className="frame-corner c2" />
        <div className="frame-corner c3" /><div className="frame-corner c4" />
        <div className="golfer-outline"><i className="head" /><i className="body" /><i className="arms" /><i className="club" /><i className="legs" /></div>
        <div className="camera-status"><span /> READY</div>
        <div className="angle-switch"><button className="active">FACE-ON</button><button>DOWN-LINE</button></div>
      </section>
      <Button onClick={() => goTo("analysis")}><Icon name="camera" size={18} /> RECORD SWING</Button>
      <section className="card setup-card">
        <div className="setup-row"><span>CLUB</span><strong>7 Iron <Icon name="chevron" size={16} /></strong></div>
        <div className="setup-row"><span>SHOT SHAPE</span><strong>Straight <Icon name="chevron" size={16} /></strong></div>
        <div className="setup-row"><span>TARGET</span><strong className="muted">Optional <Icon name="chevron" size={16} /></strong></div>
      </section>
      <div className="analysis-note"><Icon name="spark" /><div><strong>Automatic AI analysis</strong><span>Mechanics, clubface, path, tempo, contact, and direction.</span></div></div>

      <section className="swing-tools">
        <div className="section-title section-title--standalone">Analyze Another Way</div>
        <label className={`upload-card ${videoName ? "has-file" : ""}`}>
          <input
            accept="video/*"
            type="file"
            onChange={(event) => setVideoName(event.target.files?.[0]?.name ?? "")}
          />
          <span className="upload-icon"><Icon name={videoName ? "check" : "camera"} /></span>
          <span>
            <strong>{videoName || "Upload a swing video"}</strong>
            <small>{videoName ? "Ready for Fairways analysis" : "Choose from your camera roll · MOV or MP4"}</small>
          </span>
          <i>{videoName ? "CHANGE" : "BROWSE"}</i>
        </label>

        <section className="card coach-chat">
          <div className="coach-chat-head">
            <span><Icon name="spark" size={17} /></span>
            <div><strong>Ask your AI Coach</strong><small>Get personalized guidance or learn a new shot.</small></div>
          </div>
          <textarea
            aria-label="Ask your AI coach"
            onChange={(event) => setCoachPrompt(event.target.value)}
            placeholder="What do you want to work on? Try “How can I hit the ball further?”"
            value={coachPrompt}
          />
          <div className="prompt-chips">
            {["Hit a draw", "More distance", "Fix my slice"].map((prompt) => (
              <button key={prompt} onClick={() => setCoachPrompt(prompt)}>{prompt}</button>
            ))}
          </div>
          <Button variant={coachPrompt ? "primary" : "secondary"}>
            ASK FAIRWAYS <Icon name="arrow" size={16} />
          </Button>
        </section>
      </section>
    </main>
  );
}

function AnalysisScreen({ goTo }: { goTo: (screen: Screen) => void }) {
  return (
    <main className="page">
      <ScreenHeader eyebrow="SESSION COMPLETE" title="Swing Analysis" onBack={() => goTo("home")} />
      <section className="analysis-score">
        <div className="score-ring score-ring--large">
          <svg viewBox="0 0 100 100"><circle className="ring-track" cx="50" cy="50" r="42" /><circle className="ring-value" cx="50" cy="50" r="42" /></svg>
          <div><strong>78</strong><span>/100</span></div>
        </div>
        <div><span>SWING SCORE</span><strong>Solid swing</strong><small>+6 from last session</small></div>
      </section>
      <section className="card diagnosis-card">
        <div className="eyebrow accent">YOUR #1 ISSUE</div>
        <div className="diagnosis-title">Open Clubface</div>
        <p>Your clubface is open at impact, causing the ball to start right and fade further away from the target.</p>
        <div className="impact-visual"><div className="target-line" /><div className="ball-path" /><span>IMPACT</span></div>
      </section>
      <section className="advice-grid">
        <div className="card advice-card"><span><Icon name="check" /></span><div className="eyebrow">WHAT TO DO</div><p>Keep your lead wrist flatter through impact.</p></div>
        <div className="card advice-card"><span><Icon name="practice" /></span><div className="eyebrow">TRY THIS DRILL</div><p>Half-Swing Clubface Drill</p></div>
      </section>
      <Button onClick={() => goTo("practice")}>START DRILL <Icon name="arrow" size={18} /></Button>
      <Button variant="secondary" onClick={() => goTo("swing")}><Icon name="camera" size={18} /> RECORD ANOTHER SWING</Button>
      <div className="loop-copy">ANALYZE <i /> FIX <i /> PRACTICE <i /> RE-TEST</div>
    </main>
  );
}

function DiagnosisScreen({ goTo }: { goTo: (screen: Screen) => void }) {
  return (
    <main className="page">
      <ScreenHeader eyebrow="FAIRWAYS AI" title="Why Did I Hit That?" onBack={() => goTo("home")} />
      <section className="shot-result card">
        <div><span>SHOT</span><strong>7 Iron</strong></div>
        <div><span>RESULT</span><strong>18 yds right</strong></div>
        <div className="shot-map"><i className="center-line" /><i className="shot-line" /><b /></div>
      </section>
      <section className="coach-message">
        <div className="ai-badge"><Icon name="spark" size={16} /> AI DIAGNOSIS</div>
        <div className="message-title">Your face was open at impact.</div>
        <p>Your swing path stayed relatively neutral, so the clubface—not the path—was the main reason this shot finished right.</p>
      </section>
      <section className="card explanation-card">
        <div className="eyebrow">WHY IT HAPPENED</div>
        <p>An open clubface added sidespin and caused the ball to start right.</p>
        <div className="divider" />
        <div className="eyebrow accent">NEXT SWING</div>
        <p className="next-tip">Feel like the back of your lead hand points toward the target through impact.</p>
      </section>
      <Button onClick={() => goTo("swing")}>TRY AGAIN <Icon name="arrow" size={18} /></Button>
    </main>
  );
}

const statRows = [
  ["Consistency", "64%", "81%", "+17%"],
  ["Clubface", "68%", "76%", "+8%"],
  ["Swing Path", "71%", "79%", "+8%"],
  ["Tempo", "74%", "82%", "+8%"],
  ["Contact", "69%", "81%", "+12%"],
];

const clubBag = [
  { club: "Driver", distance: "238 yds", grade: "B+", score: 86 },
  { club: "3 Wood", distance: "214 yds", grade: "B", score: 81 },
  { club: "5 Wood", distance: "198 yds", grade: "B−", score: 77 },
  { club: "4 Iron", distance: "183 yds", grade: "C+", score: 72 },
  { club: "5 Iron", distance: "172 yds", grade: "B−", score: 78 },
  { club: "6 Iron", distance: "161 yds", grade: "B", score: 82 },
  { club: "7 Iron", distance: "149 yds", grade: "B+", score: 87 },
  { club: "8 Iron", distance: "137 yds", grade: "A−", score: 91 },
  { club: "9 Iron", distance: "124 yds", grade: "B+", score: 88 },
  { club: "Pitching Wedge", distance: "108 yds", grade: "A−", score: 92 },
  { club: "Sand Wedge", distance: "82 yds", grade: "B", score: 83 },
  { club: "Putter", distance: "—", grade: "B+", score: 89 },
];

function StatsScreen() {
  return (
    <main className="page">
      <ScreenHeader eyebrow="PERFORMANCE" title="Your Stats" />
      <div className="segmented"><button>7 DAYS</button><button className="active">30 DAYS</button><button>ALL TIME</button></div>
      <div className="club-filter"><button>Driver</button><button>3 Wood</button><button className="active">7 Iron</button><button>9 Iron</button><button>Wedge</button></div>
      <section className="card stats-hero">
        <div className="section-head"><div><div className="eyebrow">SWING SCORE</div><div className="big-stat">78 <small>/100</small></div></div><div className="change-badge">↗ 16</div></div>
        <MiniChart tall />
        <div className="chart-labels"><span>APR 02</span><span>TODAY</span></div>
      </section>
      <section className="card metric-list">
        <div className="metric-list-head"><span>METRIC</span><span>START</span><span>NOW</span><span>CHANGE</span></div>
        {statRows.map(([label, start, now, change]) => (
          <div className="stat-row" key={label}><strong>{label}</strong><span>{start}</span><span>{now}</span><span className="positive">{change}</span></div>
        ))}
      </section>
      <div className="insight-strip"><Icon name="spark" /><div><span>AI INSIGHT</span><strong>Your contact is improving fastest.</strong></div></div>
      <section className="bag-section">
        <div className="section-head">
          <div>
            <div className="section-title">Your Bag</div>
            <p>Typical carry distance and swing grade</p>
          </div>
          <span className="bag-count">12 CLUBS</span>
        </div>
        <div className="card bag-card">
          <div className="bag-table-head"><span>CLUB</span><span>CARRY</span><span>GRADE</span></div>
          {clubBag.map((item) => (
            <div className="club-row" key={item.club}>
              <div className="club-name">
                <span className="club-icon"><i /></span>
                <strong>{item.club}</strong>
              </div>
              <span className="club-distance">{item.distance}</span>
              <div className="club-grade">
                <i><b style={{ width: `${item.score}%` }} /></i>
                <strong>{item.grade}</strong>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

const practices = [
  { name: "Fix Your Slice", time: "15 MIN", swings: "20 swings", progress: 68, icon: "↗" },
  { name: "Improve Contact", time: "10 MIN", swings: "15 swings", progress: 42, icon: "◎" },
  { name: "Clubface Control", time: "15 MIN", swings: "20 swings", progress: 24, icon: "◒" },
  { name: "Consistency Challenge", time: "20 MIN", swings: "30 swings", progress: 0, icon: "⌁" },
];

function PracticeScreen() {
  return (
    <main className="page">
      <ScreenHeader eyebrow="TRAINING" title="Practice" />
      <p className="page-intro">Turn your analysis into improvement.</p>
      <section className="featured-practice">
        <div className="eyebrow accent">RECOMMENDED FOR YOU</div>
        <div className="practice-hero-title">Fix Your Slice</div>
        <p>Build a more neutral clubface through impact with a focused 15-minute session.</p>
        <div className="practice-meta"><span>20 SWINGS</span><span>15 MIN</span><span>DRIVER</span></div>
        <Button>START SESSION <Icon name="arrow" size={18} /></Button>
      </section>
      <div className="section-title section-title--standalone">Your Sessions</div>
      <section className="practice-list">
        {practices.map((item) => (
          <div className="card practice-row" key={item.name}>
            <div className="practice-symbol">{item.icon}</div>
            <div className="practice-info">
              <div><strong>{item.name}</strong><span>{item.time}</span></div>
              <p>{item.swings} · Reduce right-side miss</p>
              <div className="meter"><i style={{ width: `${item.progress}%` }} /></div>
            </div>
            <button aria-label={`Start ${item.name}`}><Icon name="chevron" /></button>
          </div>
        ))}
      </section>
    </main>
  );
}

function ProfileScreen({ goTo }: { goTo: (screen: Screen) => void }) {
  const menu: [IconName, string][] = [["stats", "Golf Stats"], ["bookmark", "Saved Sessions"], ["target", "Personal Goals"], ["bell", "Notifications"], ["settings", "Settings"]];
  return (
    <main className="page">
      <ScreenHeader eyebrow="ACCOUNT" title="Profile" />
      <section className="profile-hero">
        <div className="profile-avatar">JD</div>
        <div><div className="profile-name">John</div><p>Handicap 18.4 · Intermediate</p></div>
        <button aria-label="Edit profile">EDIT</button>
      </section>
      <button className="premium-banner" onClick={() => goTo("premium")}>
        <span><Icon name="spark" /></span>
        <div><small>FAIRWAYS PREMIUM</small><strong>Unlock your full AI coach</strong></div>
        <Icon name="chevron" />
      </button>
      <section className="card coach-profile">
        <div className="section-head"><div className="section-title">Your AI Coach Profile</div><span className="learning-dot">LEARNING</span></div>
        <p>Fairways adapts its coaching as it learns your swing.</p>
        <div className="profile-grid">
          <div><span>EXPERIENCE</span><strong>Intermediate</strong></div>
          <div><span>TYPICAL MISS</span><strong>Right</strong></div>
          <div><span>DRIVER</span><strong>Fade</strong></div>
          <div><span>7 IRON</span><strong>Slight fade</strong></div>
        </div>
        <div className="current-focus"><span>CURRENT FOCUS</span><strong>Clubface Control</strong></div>
      </section>
      <section className="card menu-list">
        {menu.map(([icon, label]) => <button key={label}><span><Icon name={icon} /></span><strong>{label}</strong><Icon name="chevron" size={17} /></button>)}
      </section>
    </main>
  );
}

function PremiumScreen({ goTo }: { goTo: (screen: Screen) => void }) {
  const features = ["Unlimited swing analysis", "Advanced AI diagnosis", "Personal swing profile", "Full swing history", "Personalized practice plans", "Why Did I Hit That?"];
  return (
    <main className="page premium-page">
      <ScreenHeader eyebrow="FAIRWAYS" title="Premium" onBack={() => goTo("profile")} />
      <div className="premium-orbit"><BrandMark /><i /><i /></div>
      <div className="premium-title">Unlock your full<br /><span>AI coach.</span></div>
      <p>Sharper insights. Personalized practice. Measurable improvement.</p>
      <section className="feature-list">{features.map((feature) => <div key={feature}><span><Icon name="check" size={15} /></span>{feature}</div>)}</section>
      <section className="plans">
        <button><span>MONTHLY<strong>$9.99 <small>/ month</small></strong></span><i /></button>
        <button className="selected"><b>BEST VALUE</b><span>ANNUAL<strong>$79.99 <small>/ year</small></strong></span><i><Icon name="check" size={14} /></i></button>
      </section>
      <Button>START PREMIUM <Icon name="arrow" size={18} /></Button>
      <Button variant="text" onClick={() => goTo("profile")}>Continue with Free</Button>
      <div className="legal-copy">Cancel anytime · Restore purchases</div>
    </main>
  );
}

const navItems: { id: Screen; label: string; icon: IconName }[] = [
  { id: "home", label: "Home", icon: "home" },
  { id: "swing", label: "Swing", icon: "swing" },
  { id: "stats", label: "Stats", icon: "stats" },
  { id: "practice", label: "Practice", icon: "practice" },
  { id: "profile", label: "Profile", icon: "profile" },
];

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const rootScreen = ["diagnosis", "analysis", "premium"].includes(screen) ? "" : screen;
  const showNav = !["diagnosis", "analysis", "premium"].includes(screen);

  return (
    <div className="app-shell">
      <div className="phone-status"><span>9:41</span><div><i /><i /><b /></div></div>
      <div className="screen-scroll">
        {screen === "home" && <HomeScreen goTo={setScreen} />}
        {screen === "swing" && <SwingScreen goTo={setScreen} />}
        {screen === "stats" && <StatsScreen />}
        {screen === "practice" && <PracticeScreen />}
        {screen === "profile" && <ProfileScreen goTo={setScreen} />}
        {screen === "analysis" && <AnalysisScreen goTo={setScreen} />}
        {screen === "diagnosis" && <DiagnosisScreen goTo={setScreen} />}
        {screen === "premium" && <PremiumScreen goTo={setScreen} />}
      </div>
      {showNav && (
        <nav className="bottom-nav">
          {navItems.map((item) => (
            <button className={rootScreen === item.id ? "active" : ""} key={item.id} onClick={() => setScreen(item.id)}>
              <Icon name={item.icon} /><span>{item.label}</span>
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}
