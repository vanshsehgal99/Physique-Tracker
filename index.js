const PLAN = [
  {
    name: "Shoulders + Traps",
    type: "workout",
    exercises: [
      { name: "Lateral Raises", sets: "4×15" },
      { name: "Cable Lateral Raises", sets: "3×15" },
      { name: "Cable Shrugs", sets: "4×12" },
      { name: "Overhead Press", sets: "3×10" },
    ]
  },
  {
    name: "Back — Lat Focus",
    type: "workout",
    exercises: [
      { name: "Lat Pulldowns", sets: "4×10" },
      { name: "Pull-ups / Assisted", sets: "3×8" },
      { name: "Seated Cable Row", sets: "3×12" },
      { name: "Straight-arm Pulldown", sets: "3×15" },
    ]
  },
  {
    name: "Rest / Light Cardio",
    type: "rest",
    exercises: [
      { name: "20-min walk or stretching", sets: "1×20min" },
    ]
  },
  {
    name: "Chest + Arms",
    type: "workout",
    exercises: [
      { name: "Incline Dumbbell Press", sets: "4×10" },
      { name: "Cable Fly (upper angle)", sets: "3×15" },
      { name: "Dumbbell Curl", sets: "3×12" },
      { name: "Tricep Pushdown", sets: "3×12" },
      { name: "Rear Delt Fly", sets: "3×15" },
    ]
  },
  {
    name: "Shoulders — Volume",
    type: "workout",
    exercises: [
      { name: "Lateral Raises (dropset)", sets: "4×20→12" },
      { name: "Cable Lateral Raises", sets: "4×15" },
      { name: "Face Pulls", sets: "3×20" },
      { name: "Traps Shrug", sets: "3×15" },
    ]
  }
];

let state = JSON.parse(localStorage.getItem('physique_tracker') || '{}');
let weekOffset = 0;

function getWeekKey(offset = 0) {
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1) + offset * 7);
  return monday.toISOString().slice(0, 10);
}

function getDayKey(weekKey, dayIdx) {
  const d = new Date(weekKey);
  d.setDate(d.getDate() + dayIdx);
  return d.toISOString().slice(0, 10);
}

function saveState() {
  localStorage.setItem('physique_tracker', JSON.stringify(state));
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}

function toggleDay(dayKey, type) {
  if (!state[dayKey]) state[dayKey] = { done: false, exercises: {}, notes: '' };
  state[dayKey].done = !state[dayKey].done;
  saveState();
  render();
  if (state[dayKey].done) showToast(type === 'rest' ? '😴 Rest day logged!' : '💪 Workout done!');
}

function toggleExercise(dayKey, exIdx) {
  if (!state[dayKey]) state[dayKey] = { done: false, exercises: {}, notes: '' };
  if (!state[dayKey].exercises) state[dayKey].exercises = {};
  state[dayKey].exercises[exIdx] = !state[dayKey].exercises[exIdx];
  saveState();
  renderProgressBar();
}

function saveNotes(dayKey, val) {
  if (!state[dayKey]) state[dayKey] = { done: false, exercises: {}, notes: '' };
  state[dayKey].notes = val;
  saveState();
}

function toggleExpand(dayKey) {
  const panel = document.getElementById('panel-' + dayKey);
  panel.classList.toggle('open');
}

function changeWeek(dir) {
  weekOffset += dir;
  render();
}

function getStreak() {
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 60; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    if (state[key] && state[key].done) streak++;
    else if (i > 0) break;
  }
  return streak;
}

function renderProgressBar() {
  const weekKey = getWeekKey(weekOffset);
  let done = 0;
  for (let i = 0; i < 5; i++) {
    const dk = getDayKey(weekKey, i);
    if (state[dk] && state[dk].done) done++;
  }
  document.getElementById('progressFill').style.width = (done / 5 * 100) + '%';
  document.getElementById('progressLabel').textContent = done + ' / 5 days';
  document.getElementById('thisWeekDone').textContent = done;
}

function renderHeatmap() {
  const grid = document.getElementById('heatmapGrid');
  grid.innerHTML = '';
  const today = new Date();
  const todayKey = today.toISOString().slice(0, 10);
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const div = document.createElement('div');
    div.className = 'heatmap-day';
    if (key === todayKey) div.classList.add('today');
    if (state[key] && state[key].done) {
      // find which day plan
      const dow = d.getDay();
      const planDay = dow === 0 ? 4 : Math.min(dow - 1, 4);
      div.classList.add(PLAN[planDay].type === 'rest' ? 'rested' : 'worked');
    }
    div.textContent = d.getDate();
    grid.appendChild(div);
  }
}

function render() {
  const weekKey = getWeekKey(weekOffset);
  const grid = document.getElementById('daysGrid');
  grid.innerHTML = '';

  // Week label
  const wStart = new Date(weekKey);
  const wEnd = new Date(weekKey);
  wEnd.setDate(wEnd.getDate() + 4);
  document.getElementById('weekLabel').textContent =
    'WEEK OF ' + wStart.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }).toUpperCase() +
    ' – ' + wEnd.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }).toUpperCase();

  // Today
  const todayKey = new Date().toISOString().slice(0, 10);
  document.getElementById('dateDisplay').textContent =
    new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  PLAN.forEach((plan, i) => {
    const dk = getDayKey(weekKey, i);
    const dayState = state[dk] || { done: false, exercises: {}, notes: '' };
    const isToday = dk === todayKey;

    const card = document.createElement('div');
    card.className = 'day-card' + (dayState.done ? (plan.type === 'rest' ? ' rest-done' : ' done') : '') + (isToday ? ' today-card' : '');

    const exCompleted = plan.exercises.filter((_, ei) => dayState.exercises && dayState.exercises[ei]).length;

    card.innerHTML = `
      <div class="day-header" onclick="toggleExpand('${dk}')">
        <div class="day-num">D${i+1}</div>
        <div class="day-info">
          <div class="day-name">${plan.name} ${isToday ? '<span style="font-size:0.65rem;color:var(--accent);letter-spacing:0.1em;font-weight:700;margin-left:6px;">TODAY</span>' : ''}</div>
          <div class="day-muscles">${dk} · ${exCompleted}/${plan.exercises.length} exercises</div>
        </div>
        <div class="day-status">
          <div class="check-circle">
            <span class="check-icon">✓</span>
          </div>
        </div>
      </div>
      <div class="exercises-panel ${isToday && weekOffset === 0 ? 'open' : ''}" id="panel-${dk}">
        <div class="exercises-title">Exercises</div>
        ${plan.exercises.map((ex, ei) => `
          <div class="exercise-item">
            <div class="ex-check ${dayState.exercises && dayState.exercises[ei] ? 'checked' : ''}"
              onclick="toggleExercise('${dk}', ${ei}); event.stopPropagation();">
              ${dayState.exercises && dayState.exercises[ei] ? '✓' : ''}
            </div>
            <span class="ex-name">${ex.name}</span>
            <span class="ex-sets">${ex.sets}</span>
          </div>
        `).join('')}
        <div class="notes-area">
          <div class="notes-label">Notes / PRs</div>
          <textarea placeholder="Log weights, how it felt, PRs..." oninput="saveNotes('${dk}', this.value)">${dayState.notes || ''}</textarea>
        </div>
        <button class="mark-done-btn ${dayState.done ? 'undo' : ''}"
          onclick="toggleDay('${dk}', '${plan.type}'); event.stopPropagation();">
          ${dayState.done ? '↩ Mark as undone' : (plan.type === 'rest' ? '✓ Log Rest Day' : '✓ Mark Workout Done')}
        </button>
      </div>
    `;

    grid.appendChild(card);
  });

  renderProgressBar();

  // Stats
  const totalDone = Object.values(state).filter(d => d.done).length;
  document.getElementById('totalWorkouts').textContent = totalDone;
  const allLogged = Object.keys(state).length;
  document.getElementById('completionRate').textContent = allLogged > 0 ? Math.round(totalDone / allLogged * 100) + '%' : '—';
  document.getElementById('streakNum').textContent = getStreak();

  renderHeatmap();
}

render();