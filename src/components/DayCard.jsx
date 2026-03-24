import React, { useState } from 'react'

export default function DayCard({
  dayKey,
  dayIndex,
  plan,
  dayState,
  isToday,
  toggleDay,
  toggleExercise,
  saveNotes,
  onRemoveCustom
}) {
  const [isOpen, setIsOpen] = useState(isToday)

  const exCompleted = plan.exercises.filter(
    (_, ei) => dayState.exercises && dayState.exercises[ei]
  ).length

  const isDone = dayState.done
  const cardClass = `day-card ${isDone ? (plan.type === 'rest' ? 'rest-done' : 'done') : ''} ${isToday ? 'today-card' : ''}`

  return (
    <div className={cardClass}>
      <div className="day-header" onClick={() => setIsOpen(!isOpen)}>
        <div className="day-num">D{dayIndex + 1}</div>
        <div className="day-info">
          <div className="day-name">
            {plan.name}
            {isToday && (
              <span style={{
                fontSize: '0.65rem',
                color: 'var(--accent)',
                letterSpacing: '0.1em',
                fontWeight: '700',
                marginLeft: '6px'
              }}>
                TODAY
              </span>
            )}
          </div>
          <div className="day-muscles">{dayKey} · {exCompleted}/{plan.exercises.length} exercises</div>
        </div>
        <div className="day-status">
          <div className="check-circle">
            <span className="check-icon">✓</span>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="exercises-panel open">
          <div className="exercises-title">Exercises</div>
          {plan.exercises.map((ex, ei) => (
            <div key={ei} className="exercise-item">
              <div
                className={`ex-check ${dayState.exercises && dayState.exercises[ei] ? 'checked' : ''}`}
                onClick={(e) => {
                  toggleExercise(dayKey, ei)
                  e.stopPropagation()
                }}
              >
                {dayState.exercises && dayState.exercises[ei] ? '✓' : ''}
              </div>
              <span className="ex-name">{ex.name}</span>
              <span className="ex-sets">{ex.sets}</span>
              {ex._customIndex !== undefined && (
                <button
                  className="remove-ex-btn"
                  onClick={(e) => {
                    onRemoveCustom(ex._customIndex)
                    e.stopPropagation()
                  }}
                  title="Remove custom exercise"
                >
                  ×
                </button>
              )}
            </div>
          ))}

          <div className="notes-area">
            <div className="notes-label">Notes / PRs</div>
            <textarea
              placeholder="Log weights, how it felt, PRs..."
              value={dayState.notes || ''}
              onChange={(e) => saveNotes(dayKey, e.target.value)}
            />
          </div>

          <button
            className={`mark-done-btn ${isDone ? 'undo' : ''}`}
            onClick={(e) => {
              toggleDay(dayKey, plan.type)
              e.stopPropagation()
            }}
          >
            {isDone
              ? '↩ Mark as undone'
              : (plan.type === 'rest' ? '✓ Log Rest Day' : '✓ Mark Workout Done')}
          </button>
        </div>
      )}
    </div>
  )
}
