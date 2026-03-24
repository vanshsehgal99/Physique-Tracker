import React from 'react'

export default function Header({ streak }) {
  return (
    <header>
      <div className="header-top">
        <div>
          <h1>PHYSIQUE<br />TRACKER</h1>
          <p className="tagline">Weekly Log</p>
        </div>
        <div className="streak-badge">
          <div className="streak-num">{streak}</div>
          <div className="streak-label">🔥 Streak</div>
        </div>
      </div>
    </header>
  )
}
