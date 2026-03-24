import React, { useState } from 'react'
import DayCard from './DayCard'

function getDayKey(weekKey, dayIdx) {
  const d = new Date(weekKey)
  d.setDate(d.getDate() + dayIdx)
  return d.toISOString().slice(0, 10)
}

export default function DayCards({
  plan,
  weekKey,
  state,
  todayKey,
  toggleDay,
  toggleExercise,
  saveNotes,
  onRemoveCustom
}) {
  return (
    <div className="days-grid">
      {plan.map((dayPlan, i) => {
        const dk = getDayKey(weekKey, i)
        const dayState = state[dk] || { done: false, exercises: {}, notes: '' }
        const isToday = dk === todayKey

        return (
          <DayCard
            key={dk}
            dayKey={dk}
            dayIndex={i}
            plan={dayPlan}
            dayState={dayState}
            isToday={isToday}
            toggleDay={toggleDay}
            toggleExercise={toggleExercise}
            saveNotes={saveNotes}
            onRemoveCustom={onRemoveCustom}
          />
        )
      })}
    </div>
  )
}
