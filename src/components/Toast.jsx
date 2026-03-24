import React from 'react'

export default function Toast({ message }) {
  return (
    <div className="toast show">
      {message}
    </div>
  )
}
