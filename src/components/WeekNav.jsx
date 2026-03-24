import React from 'react'

function getWeekKey(offset = 0) {
  const now = new Date()
  const day = now.getDay()
  const monday = new Date(now)
  monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1) + offset * 7)
  return monday.toISOString().slice(0, 10)
}

export default function WeekNav({ weekOffset, changeWeek }) {
  const weekKey = getWeekKey(weekOffset)
  const wStart = new Date(weekKey)
  const wEnd = new Date(weekKey)
  wEnd.setDate(wEnd.getDate() + 4)

  const weekLabel = 'WEEK OF ' +
    wStart.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }).toUpperCase() +
    ' – ' +
    wEnd.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }).toUpperCase()

  return (
    <div className="week-nav">
      <button className="nav-btn" onClick={() => changeWeek(-1)}>←</button>
      <span className="week-label">{weekLabel}</span>
      <button className="nav-btn" onClick={() => changeWeek(1)}>→</button>
    </div>
  )
}
