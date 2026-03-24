import React from 'react'

export default function ProgressSection({ progressDays }) {
  const percentage = (progressDays / 5) * 100

  return (
    <div className="progress-section">
      <div className="progress-meta">
        <span className="progress-title">Week Progress</span>
        <span className="progress-count">{progressDays} / 5 days</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  )
}
