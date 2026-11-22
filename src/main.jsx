import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Activity, Apple, ArrowLeft, ArrowRight, Bell, CalendarDays, ChevronRight,
  Clock3, Dumbbell, Flame, Footprints, HeartPulse, Home, Leaf, Link2,
  LockKeyhole, Menu, MessageCircle, Play, Plus, Search, Settings, ShieldCheck,
  Sparkles, Trophy, UserRound, Users, X, Zap
} from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import './styles.css';

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'plan', label: 'My plan', icon: CalendarDays },
  { id: 'progress', label: 'Progress', icon: Activity },
  { id: 'nutrition', label: 'Nutrition', icon: Apple },
  { id: 'community', label: 'Community', icon: Users },
];

const planDays = [
  { day: 'MON', date: '12', type: 'Strength', title: 'Upper Body', done: true },
  { day: 'TUE', date: '13', type: 'Mobility', title: 'Recovery Flow', done: true },
  { day: 'WED', date: '14', type: 'Strength', title: 'Lower Body', done: false, active: true },
  { day: 'THU', date: '15', type: 'Cardio', title: 'Zone 2 Run', done: false },
  { day: 'FRI', date: '16', type: 'Strength', title: 'Full Body', done: false },
];

const chartData = [
  { name: 'Mon', value: 48 }, { name: 'Tue', value: 54 }, { name: 'Wed', value: 51 },
  { name: 'Thu', value: 62 }, { name: 'Fri', value: 58 }, { name: 'Sat', value: 68 },
  { name: 'Sun', value: 64 }
];

function App() {
  const [screen, setScreen] = useState('home');
  const [onboarding, setOnboarding] = useState(false);
  const [onboardStep, setOnboardStep] = useState(0);
  const [goal, setGoal] = useState('Build strength');
  const [experience, setExperience] = useState('Intermediate');
  const [syncMode, setSyncMode] = useState('local');
  const [toast, setToast] = useState('');
  const [workoutOpen, setWorkoutOpen] = useState(false);
  const [hydration, setHydration] = useState(5);
  const [habitDone, setHabitDone] = useState([true, true, false]);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('pulse-onboarded')) setOnboarding(true);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  const notify = (message) => setToast(message);
  const finishOnboarding = () => {
    localStorage.setItem('pulse-onboarded', 'true');
    localStorage.setItem('pulse-profile', JSON.stringify({ goal, experience, syncMode }));
    setOnboarding(false);
  };

  return (
    <div className="app-shell">
      {onboarding && (
        <Onboarding
          step={onboardStep}
          setStep={setOnboardStep}
          goal={goal}
          setGoal={setGoal}
          experience={experience}
          setExperience={setExperience}
          syncMode={syncMode}
          setSyncMode={setSyncMode}
          onFinish={finishOnboarding}
        />
      )}

      <aside className={`sidebar ${mobileMenu ? 'open' : ''}`}>
        <button className="brand" onClick={() => setScreen('home')}>
          <span className="brand-mark"><Activity size={21} strokeWidth={2.6} /></span>
          <span>pulse</span>
        </button>
        <nav>
          {navItems.map(({ id, label, icon: Icon }) => (
            <button key={id} className={screen === id ? 'active' : ''} onClick={() => { setScreen(id); setMobileMenu(false); }}>
              <Icon size={20} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <button onClick={() => notify('Settings saved locally')}><Settings size={19}/><span>Settings</span></button>
          <div className="profile-mini">
            <div className="avatar">AM</div>
            <div><strong>Alex Morgan</strong><small>Pulse member</small></div>
            <ChevronRight size={16}/>
          </div>
        </div>
      </aside>

      <main>
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMobileMenu(true)}><Menu size={22}/></button>
          <div className="search"><Search size={18}/><input aria-label="Search" placeholder="Search workouts, exercises..." /></div>
          <button className="icon-button" onClick={() => notify('You’re all caught up')}><Bell size={19}/><span className="notification-dot" /></button>
        </header>

        {screen === 'home' && <HomeScreen setWorkoutOpen={setWorkoutOpen} setScreen={setScreen} hydration={hydration} setHydration={setHydration} habitDone={habitDone} setHabitDone={setHabitDone} />}
        {screen === 'plan' && <PlanScreen setWorkoutOpen={setWorkoutOpen} notify={notify} />}
        {screen === 'progress' && <ProgressScreen />}
        {screen === 'nutrition' && <NutritionScreen hydration={hydration} setHydration={setHydration} />}
        {screen === 'community' && <CommunityScreen notify={notify} />}
      </main>

      {mobileMenu && <div className="overlay" onClick={() => setMobileMenu(false)} />}
      {workoutOpen && <WorkoutModal onClose={() => setWorkoutOpen(false)} notify={notify} />}
      {toast && <div className="toast"><ShieldCheck size={17}/>{toast}</div>}
    </div>
  );
}

function Onboarding({ step, setStep, goal, setGoal, experience, setExperience, syncMode, setSyncMode, onFinish }) {
  const goals = [
    ['Build strength', Dumbbell], ['Improve fitness', HeartPulse], ['Lose weight', Flame], ['Move consistently', Footprints]
  ];
  const levels = ['Beginner', 'Intermediate', 'Advanced'];
  return (
    <div className="onboarding">
      <div className="onboard-card">
        <div className="onboard-brand"><Activity size={21}/> pulse</div>
        {step === 0 && <>
          <div className="step-label">STEP 1 OF 3</div>
          <h1>What brings you here?</h1>
          <p>Choose your main goal. We’ll shape your plan around it.</p>
          <div className="goal-grid">
            {goals.map(([name, Icon]) => <button key={name} className={goal === name ? 'selected' : ''} onClick={() => setGoal(name)}><Icon size={24}/><span>{name}</span></button>)}
          </div>
        </>}
        {step === 1 && <>
          <div className="step-label">STEP 2 OF 3</div>
          <h1>What’s your experience?</h1>
          <p>Every level deserves a plan that meets you where you are.</p>
          <div className="level-list">
            {levels.map(level => <button key={level} className={experience === level ? 'selected' : ''} onClick={() => setExperience(level)}><span>{level}</span><div>{level === 'Beginner' ? 'Just getting started' : level === 'Intermediate' ? 'Training regularly' : 'Highly consistent'}</div></button>)}
          </div>
        </>}
        {step === 2 && <>
          <div className="step-label">STEP 3 OF 3</div>
          <h1>Where should your progress live?</h1>
          <p>You can change this later in settings.</p>
          <div className="mode-list">
            <button className={syncMode === 'local' ? 'selected' : ''} onClick={() => setSyncMode('local')}><LockKeyhole/><div><strong>Use locally</strong><span>Private to this device</span></div></button>
            <button className={syncMode === 'account' ? 'selected' : ''} onClick={() => setSyncMode('account')}><Link2/><div><strong>Create an account</strong><span>Sync across your devices</span></div></button>
          </div>
        </>}
        <div className="onboard-footer">
          {step > 0 && <button className="back-button" onClick={() => setStep(step - 1)}><ArrowLeft size={18}/> Back</button>}
          <button className="primary-button" onClick={() => step < 2 ? setStep(step + 1) : onFinish()}>{step < 2 ? 'Continue' : 'Start my plan'}<ArrowRight size={18}/></button>
        </div>
      </div>
      <div className="onboard-art"><div className="art-ring ring-one"/><div className="art-ring ring-two"/><Activity size={72}/></div>
    </div>
  );
}

function HomeScreen({ setWorkoutOpen, setScreen, hydration, setHydration, habitDone, setHabitDone }) {
  return (
    <div className="page home-page">
      <div className="welcome-row">
        <div><p className="eyebrow">WEDNESDAY, NOVEMBER 22</p><h1>Good morning, Alex</h1></div>
        <button className="primary-button" onClick={() => setWorkoutOpen(true)}><Play size={17} fill="currentColor"/> Start workout</button>
      </div>

      <section className="hero-card">
        <div className="hero-copy">
          <div className="live-label"><span/> TODAY’S WORKOUT</div>
          <h2>Lower Body<br/><em>Strength</em></h2>
          <div className="hero-meta"><span><Clock3 size={16}/> 42 min</span><span><Dumbbell size={16}/> 6 exercises</span><span><Flame size={16}/> 320 kcal</span></div>
          <button onClick={() => setWorkoutOpen(true)}>Start workout <ArrowRight size={18}/></button>
        </div>
        <div className="hero-visual">
          <div className="motion-arch arch-a"/><div className="motion-arch arch-b"/><div className="body-glyph"><Footprints size={88}/></div>
        </div>
      </section>

      <div className="dashboard-grid">
        <section className="card week-card">
          <div className="card-heading"><div><p className="eyebrow">THIS WEEK</p><h3>Your momentum</h3></div><button onClick={() => setScreen('progress')}>View progress <ChevronRight size={15}/></button></div>
          <div className="stats-row">
            <Stat icon={Flame} value="4" label="Workouts" color="coral"/><Stat icon={Clock3} value="3h 12m" label="Active time" color="blue"/><Stat icon={Zap} value="12,480" label="Total kcal" color="yellow"/>
          </div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}><defs><linearGradient id="pulseChart" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#5275c8" stopOpacity={0.28}/><stop offset="100%" stopColor="#5275c8" stopOpacity={0}/></linearGradient></defs><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill:'#9a9b96',fontSize:11}}/><Tooltip/><Area type="monotone" dataKey="value" stroke="#5275c8" strokeWidth={3} fill="url(#pulseChart)"/></AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="card habits-card">
          <div className="card-heading"><div><p className="eyebrow">DAILY HABITS</p><h3>Small wins</h3></div><span className="streak"><Flame size={14} fill="currentColor"/> 8 day streak</span></div>
          <div className="habit-list">
            {['Water — 2.5L', 'Stretch for 10 min', 'Protein at every meal'].map((habit, i) => <button key={habit} className={habitDone[i] ? 'done' : ''} onClick={() => setHabitDone(prev => prev.map((v,j) => j === i ? !v : v))}><span className="habit-check">{habitDone[i] ? '✓' : ''}</span><span>{habit}</span></button>)}
          </div>
        </section>
      </div>

      <div className="bottom-grid">
        <section className="card hydration-card">
          <div className="card-heading"><div><p className="eyebrow">HYDRATION</p><h3>{hydration * 0.35 > 2.4 ? 'Goal reached' : `${(hydration * 0.35).toFixed(1)} / 2.5 L`}</h3></div><button className="add-button" onClick={() => setHydration(v => Math.min(v + 1, 8))}><Plus size={17}/> 250 ml</button></div>
          <div className="water-dots">{Array.from({length:8}).map((_,i)=><span key={i} className={i<hydration?'filled':''}/>)}</div>
        </section>
        <section className="card challenge-card">
          <div className="challenge-icon"><Trophy size={22}/></div>
          <div><p className="eyebrow">COMMUNITY CHALLENGE</p><h3>November 100K</h3><p>68,420 / 100,000 steps</p></div>
          <button onClick={() => setScreen('community')}><ChevronRight size={18}/></button>
        </section>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, value, label, color }) {
  return <div className="stat"><span className={`stat-icon ${color}`}><Icon size={18}/></span><div><strong>{value}</strong><small>{label}</small></div></div>;
}

function PlanScreen({ setWorkoutOpen, notify }) {
  const exercises = [
    ['Goblet squat','3 × 12','squat'], ['Romanian deadlift','3 × 10','hinge'], ['Walking lunge','3 × 10','lunge'], ['Hip thrust','3 × 12','thrust'], ['Standing calf raise','3 × 15','calf'], ['Core finisher','2 × 45 sec','core']
  ];
  return <div className="page plan-page">
    <div className="page-heading"><div><p className="eyebrow">NOVEMBER 12–18</p><h1>My workout plan</h1></div><button className="outline-button" onClick={() => notify('Plan customization opened')}><Sparkles size={17}/> Customize</button></div>
    <div className="week-strip">{planDays.map(d => <button key={d.date} className={`${d.active?'active':''} ${d.done?'done':''}`}><span>{d.day}</span><strong>{d.date}</strong><small>{d.done?'✓':d.type}</small></button>)}</div>
    <div className="plan-layout">
      <section className="exercise-list card"><div className="card-heading"><div><p className="eyebrow">TODAY • LOWER BODY</p><h3>Strength session</h3></div><span>42 min</span></div>{exercises.map(([name,reps,kind],i)=><div className="exercise-row" key={name}><div className={`exercise-thumb ${kind}`}><Dumbbell size={22}/></div><div className="exercise-name"><strong>{name}</strong><span>{i === 0 ? 'Glutes + quads' : i === 1 ? 'Hamstrings' : 'Lower body'}</span></div><strong className="reps">{reps}</strong><button onClick={()=>setWorkoutOpen(true)} aria-label={`Start ${name}`}><Play size={16} fill="currentColor"/></button></div>)}</section>
      <aside className="plan-aside"><section className="next-card"><p className="eyebrow">NEXT UP</p><h3>Recovery Flow</h3><p>Tomorrow · 20 min</p><button onClick={()=>notify('Recovery flow added to your reminders')}>View session <ArrowRight size={16}/></button></section><section className="card focus-card"><p className="eyebrow">THIS WEEK’S FOCUS</p><h3>Glute activation</h3><div className="progress-track"><span style={{width:'68%'}}/></div><p>68% complete</p></section></aside>
    </div>
  </div>
}

function ProgressScreen() {
  return <div className="page"><div className="page-heading"><div><p className="eyebrow">YOUR JOURNEY</p><h1>Progress</h1></div><button className="outline-button"><CalendarDays size={17}/> Last 30 days</button></div><div className="progress-stats"><Stat icon={Activity} value="24" label="Workouts" color="blue"/><Stat icon={Clock3} value="14h" label="Training time" color="coral"/><Stat icon={Trophy} value="6" label="Personal records" color="yellow"/><Stat icon={Flame} value="8" label="Day streak" color="coral"/></div><section className="card progress-chart-card"><div className="card-heading"><div><p className="eyebrow">STRENGTH</p><h3>Training volume</h3></div><strong>+18% <small>this month</small></strong></div><div className="large-chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData.map((d,i)=>({...d,value:d.value+i*7}))}><defs><linearGradient id="largeChart" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#d16d54" stopOpacity={0.25}/><stop offset="100%" stopColor="#d16d54" stopOpacity={0}/></linearGradient></defs><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill:'#9a9b96',fontSize:12}}/><Tooltip/><Area type="monotone" dataKey="value" stroke="#d16d54" strokeWidth={3} fill="url(#largeChart)"/></AreaChart></ResponsiveContainer></div></section></div>
}

function NutritionScreen({ hydration, setHydration }) {
  const meals = [['Breakfast','Oatmeal bowl','420 kcal','/'],['Lunch','Chicken power bowl','580 kcal','/'],['Snack','Greek yogurt + berries','210 kcal','/']];
  return <div className="page"><div className="page-heading"><div><p className="eyebrow">TODAY’S FUEL</p><h1>Nutrition</h1></div><button className="primary-button"><Plus size={17}/> Log meal</button></div><div className="nutrition-layout"><section className="card calories-card"><p className="eyebrow">DAILY CALORIES</p><div className="calorie-ring"><div><strong>1,210</strong><span>of 2,100 kcal</span></div></div><div className="macro-row"><span><strong>142g</strong><small>Protein</small></span><span><strong>118g</strong><small>Carbs</small></span><span><strong>42g</strong><small>Fats</small></span></div></section><section className="card meal-list"><div className="card-heading"><h3>Meals today</h3><button>View diary <ChevronRight size={15}/></button></div>{meals.map(([meal,name,kcal])=> <div className="meal-row" key={meal}><div className="meal-icon"><Leaf size={19}/></div><div><small>{meal}</small><strong>{name}</strong></div><span>{kcal}</span></div>)}</section><section className="card nutrition-water"><div className="card-heading"><div><p className="eyebrow">HYDRATION</p><h3>{(hydration*.35).toFixed(1)} L</h3></div><button className="add-button" onClick={()=>setHydration(v=>Math.min(v+1,8))}><Plus size={16}/> Add</button></div><div className="water-dots">{Array.from({length:8}).map((_,i)=><span key={i} className={i<hydration?'filled':''}/>)}</div></section></div></div>
}

function CommunityScreen({ notify }) {
  const leaders = [['1','Maya Chen','92,480'],['2','Liam Foster','88,210'],['3','Sam Rivera','81,770']];
  return <div className="page"><div className="page-heading"><div><p className="eyebrow">MOVE TOGETHER</p><h1>Community</h1></div><button className="primary-button" onClick={()=>notify('Challenge invite copied')}><Plus size={17}/> Invite friends</button></div><section className="community-banner"><div><p className="eyebrow">MONTHLY CHALLENGE</p><h2>November 100K</h2><p>Take 100,000 steps this month. Every step counts.</p></div><div className="banner-stat"><strong>68,420</strong><span>of 100K steps</span></div></section><div className="community-grid"><section class="card leaderboard"><div className="card-heading"><h3>Leaderboard</h3><Trophy size={20}/></div>{leaders.map(([rank,name,steps])=><div className="leader-row" key={rank}><strong>{rank}</strong><div className="leader-avatar">{name.split(' ').map(n=>n[0]).join('')}</div><span>{name}</span><strong>{steps}</strong></div>)}</section><section className="card connections"><div className="card-heading"><h3>Friends activity</h3><button><MessageCircle size={16}/> Send</button></div><div className="activity-feed"><div><div className="feed-avatar">MC</div><p><strong>Maya</strong> completed a 5K run<br/><small>18 min ago</small></p><span>🔥 12</span></div><div><div className="feed-avatar blue">LF</div><p><strong>Liam</strong> hit a new deadlift PR<br/><small>1 hr ago</small></p><span>💪 8</span></div></div></section></div></div>
}

function WorkoutModal({ onClose, notify }) {
  const [started, setStarted] = useState(false);
  const [seconds, setSeconds] = useState(0);
  useEffect(()=>{if(!started)return;const i=setInterval(()=>setSeconds(s=>s+1),1000);return()=>clearInterval(i)},[started]);
  const time = `${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;
  return <div className="modal-backdrop"><div className="workout-modal"><div className="modal-top"><button onClick={onClose}><X size={20}/></button><span>{started?'WORKOUT IN PROGRESS':'READY TO START'}</span><button onClick={()=>notify('Workout saved as draft')}><Bell size={18}/></button></div><div className="workout-focus"><p className="eyebrow">EXERCISE 1 OF 6</p><h2>Goblet squat</h2><div className="exercise-preview"><div className="pulse-person"><Footprints size={120}/></div></div><div className="set-row"><div><span>SETS</span><strong>3</strong></div><div><span>REPS</span><strong>12</strong></div><div><span>REST</span><strong>60 sec</strong></div></div></div><div className="modal-action"><div className="timer"><Clock3 size={17}/>{time}</div>{!started?<button className="primary-button" onClick={()=>setStarted(true)}><Play size={18} fill="currentColor"/> Start exercise</button>:<button className="primary-button" onClick={()=>{notify('Set logged successfully');setStarted(false);}}><ShieldCheck size={18}/> Log set</button>}</div></div></div>
}

createRoot(document.getElementById('root')).render(<App />);
