import React from 'react'

export default function Stats({ totalWorkouts, thisWeekDone, completionRate, streak }) {
  return (
    <div className="stats-row">
      <div className="stat-card">
        <div className="stat-val">{totalWorkouts}</div>
        <div className="stat-label">Total Sessions</div>
      </div>
      <div className="stat-card">
        <div className="stat-val">{thisWeekDone}</div>
        <div className="stat-label">This Week</div>
      </div>
      <div className="stat-card">
        <div className="stat-val">{completionRate}%</div>
        <div className="stat-label">Completion</div>
      </div>
    </div>
  )
}
