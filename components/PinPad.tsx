'use client'
import { useState } from 'react'

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫']

interface Props {
  onSubmit: (pin: string) => void
  error?: string
}

export function PinPad({ onSubmit, error }: Props) {
  const [pin, setPin] = useState('')

  function press(key: string) {
    if (key === '⌫') {
      setPin(p => p.slice(0, -1))
      return
    }
    if (pin.length >= 4) return
    const next = pin + key
    setPin(next)
    if (next.length === 4) {
      onSubmit(next)
      setPin('')
    }
  }

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Dots showing how many digits have been entered */}
      <div className="flex gap-4">
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            data-testid="dot"
            className={`w-4 h-4 rounded-full border-2 border-white transition-colors ${
              i < pin.length ? 'bg-white' : 'bg-transparent'
            }`}
          />
        ))}
      </div>

      {/* Error message */}
      {error && <p className="text-accent text-sm font-bold">{error}</p>}

      {/* Numpad grid */}
      <div className="grid grid-cols-3 gap-4">
        {KEYS.map((key, i) =>
          key ? (
            <button
              key={key === '⌫' ? 'del' : key}
              onClick={() => press(key)}
              aria-label={key === '⌫' ? 'Delete' : undefined}
              className="w-20 h-20 rounded-full text-2xl font-bold transition-colors bg-navy-card text-white active:bg-accent"
            >
              {key}
            </button>
          ) : (
            <div key="empty" />
          )
        )}
      </div>
    </div>
  )
}
