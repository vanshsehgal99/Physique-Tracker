import React from 'react'

export default function Heatmap({ state, plan }) {
  const today = new Date()
  const todayKey = today.toISOString().slice(0, 10)
  const days = []

  for (let i = 29; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const key = d.toISOString().slice(0, 10)

    let className = 'heatmap-day'
    if (key === todayKey) className += ' today'

    if (state[key] && state[key].done) {
      const dow = d.getDay()
      const planDay = dow === 0 ? 4 : Math.min(dow - 1, 4)
      className += plan[planDay].type === 'rest' ? ' rested' : ' worked'
    }

    days.push(
      <div key={key} className={className}>
        {d.getDate()}
      </div>
    )
  }

  return (
    <div className="heatmap-section">
      <div className="section-title">30-Day Activity</div>
      <div className="heatmap-grid">
        {days}
      </div>
    </div>
  )
}
