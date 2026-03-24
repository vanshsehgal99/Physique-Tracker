import React, { useState, useEffect, useCallback } from 'react'
import './App.css'
import Header from './components/Header'
import Stats from './components/Stats'
import ProgressSection from './components/ProgressSection'
import WeekNav from './components/WeekNav'
import DayCards from './components/DayCards'
import Heatmap from './components/Heatmap'
import Toast from './components/Toast'
import AddExerciseForm from './components/AddExerciseForm'

const PLAN = []

function getWeekKey(offset = 0) {
  const now = new Date()
  const day = now.getDay()
  const monday = new Date(now)
  monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1) + offset * 7)
  return monday.toISOString().slice(0, 10)
}

function getDayKey(weekKey, dayIdx) {
  const d = new Date(weekKey)
  d.setDate(d.getDate() + dayIdx)
  return d.toISOString().slice(0, 10)
}

function getStreak(state) {
  let streak = 0
  const today = new Date()
  for (let i = 0; i < 60; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    if (state[key] && state[key].done) streak++
    else if (i > 0) break
  }
  return streak
}

export default function App() {
  const [state, setState] = useState(() => {
    const saved = localStorage.getItem('physique_tracker')
    return saved ? JSON.parse(saved) : {}
  })
  const [customExercises, setCustomExercises] = useState(() => {
    const saved = localStorage.getItem('physique_tracker_custom')
    return saved ? JSON.parse(saved) : []
  })
  const [weekOffset, setWeekOffset] = useState(0)
  const [toast, setToast] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    localStorage.setItem('physique_tracker', JSON.stringify(state))
  }, [state])

  useEffect(() => {
    localStorage.setItem('physique_tracker_custom', JSON.stringify(customExercises))
  }, [customExercises])

  const showToast = useCallback((msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2200)
  }, [])

  const toggleDay = useCallback((dayKey, type) => {
    setState(prev => {
      const updated = { ...prev }
      if (!updated[dayKey]) updated[dayKey] = { done: false, exercises: {}, notes: '' }
      updated[dayKey].done = !updated[dayKey].done
      
      if (updated[dayKey].done) {
        showToast(type === 'rest' ? '😴 Rest day logged!' : '💪 Workout done!')
      }
      
      return updated
    })
  }, [showToast])

  const toggleExercise = useCallback((dayKey, exIdx) => {
    setState(prev => {
      const updated = { ...prev }
      if (!updated[dayKey]) updated[dayKey] = { done: false, exercises: {}, notes: '' }
      if (!updated[dayKey].exercises) updated[dayKey].exercises = {}
      updated[dayKey].exercises[exIdx] = !updated[dayKey].exercises[exIdx]
      return updated
    })
  }, [])

  const saveNotes = useCallback((dayKey, notes) => {
    setState(prev => {
      const updated = { ...prev }
      if (!updated[dayKey]) updated[dayKey] = { done: false, exercises: {}, notes: '' }
      updated[dayKey].notes = notes
      return updated
    })
  }, [])

  const changeWeek = useCallback((dir) => {
    setWeekOffset(prev => prev + dir)
  }, [])

  const addCustomExercise = useCallback((exercise) => {
    setCustomExercises(prev => [...prev, exercise])
    showToast('✅ Custom exercise added!')
  }, [showToast])

  const removeCustomExercise = useCallback((index) => {
    setCustomExercises(prev => prev.filter((_, i) => i !== index))
    showToast('🗑️ Exercise removed')
  }, [showToast])

  // Merge custom exercises with the plan
  const planWithCustom = [
    ...PLAN,
    ...(customExercises.length > 0 ? [{
      name: "My Custom Exercises",
      type: "custom",
      exercises: customExercises.map((ex, idx) => ({ 
        ...ex, 
        _customIndex: idx 
      }))
    }] : [])
  ]

  const weekKey = getWeekKey(weekOffset)
  const todayKey = new Date().toISOString().slice(0, 10)

  const stats = {
    totalWorkouts: Object.values(state).filter(d => d.done).length,
    thisWeekDone: Array.from({ length: planWithCustom.length }, (_, i) => {
      const dk = getDayKey(weekKey, i)
      return state[dk] && state[dk].done ? 1 : 0
    }).reduce((a, b) => a + b, 0),
    completionRate: Object.keys(state).length > 0
      ? Math.round(Object.values(state).filter(d => d.done).length / Object.keys(state).length * 100)
      : 0,
    streak: getStreak(state)
  }

  const progressDays = Array.from({ length: planWithCustom.length }, (_, i) => {
    const dk = getDayKey(weekKey, i)
    return state[dk] && state[dk].done ? 1 : 0
  }).reduce((a, b) => a + b, 0)

  return (
    <div className="wrap">
      <Header streak={stats.streak} />
      <DateDisplay />
      <Stats {...stats} />
      <ProgressSection progressDays={progressDays} />
      <WeekNav weekOffset={weekOffset} changeWeek={changeWeek} />
      
      <div className="add-exercise-container">
        <button className="btn-add-exercise" onClick={() => setShowAddForm(true)}>
          <span>+</span>
          Add Custom Exercise
        </button>
      </div>

      <DayCards
        plan={planWithCustom}
        weekKey={weekKey}
        state={state}
        todayKey={todayKey}
        toggleDay={toggleDay}
        toggleExercise={toggleExercise}
        saveNotes={saveNotes}
        onRemoveCustom={removeCustomExercise}
      />
      <Heatmap state={state} plan={planWithCustom} />
      <Footer />
      {toast && <Toast message={toast} />}
      {showAddForm && (
        <AddExerciseForm
          onAddExercise={addCustomExercise}
          onClose={() => setShowAddForm(false)}
        />
      )}
    </div>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>made by vansh sehgal</p>
      </div>
    </footer>
  )
}

function DateDisplay() {
  const today = new Date()
  const dateStr = today.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  return <div className="date-display">{dateStr}</div>
}
