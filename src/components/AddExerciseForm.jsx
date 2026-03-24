import React, { useState } from 'react'

export default function AddExerciseForm({ onAddExercise, onClose }) {
  const [name, setName] = useState('')
  const [sets, setSets] = useState('')
  const [reps, setReps] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!name.trim() || !sets.trim() || !reps.trim()) {
      alert('Please fill in all fields')
      return
    }

    const exercise = {
      name: name.trim(),
      sets: `${sets}×${reps}`
    }

    onAddExercise(exercise)
    setName('')
    setSets('')
    setReps('')
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Custom Exercise</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="exercise-form">
          <div className="form-group">
            <label htmlFor="exercise-name">Exercise Name</label>
            <input
              id="exercise-name"
              type="text"
              placeholder="e.g., Barbell Squats"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="sets">Sets</label>
              <input
                id="sets"
                type="number"
                min="1"
                max="10"
                placeholder="e.g., 4"
                value={sets}
                onChange={(e) => setSets(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="reps">Reps</label>
              <input
                id="reps"
                type="text"
                placeholder="e.g., 10 or 10-12"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
              />
            </div>
          </div>

          <div className="form-preview">
            <span>Preview: </span>
            <strong>{sets && reps ? `${sets}×${reps}` : 'Sets×Reps'}</strong>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Add Exercise
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
