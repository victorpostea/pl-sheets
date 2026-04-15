'use client'
import { useState, useRef } from 'react'

interface Props {
  initialValue: string
  placeholder: string
  onSave: (value: string) => Promise<void>
  inputMode?: 'numeric' | 'decimal'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function InlineField({ initialValue, placeholder, onSave, inputMode = 'decimal' }: Props) {
  const [value, setValue] = useState(initialValue)
  const [status, setStatus] = useState<'idle' | 'saved' | 'error'>('idle')
  const inputRef = useRef<HTMLInputElement>(null)
  const savingRef = useRef(false)
  const enterSavedRef = useRef(false)  // prevents blur from double-saving after Enter

  async function trySave(currentValue: string) {
    if (currentValue === initialValue) return
    if (savingRef.current) return
    savingRef.current = true
    try {
      await onSave(currentValue)
      setStatus('saved')
      setTimeout(() => setStatus('idle'), 1500)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 2000)
    } finally {
      savingRef.current = false
    }
  }

  return (
    <input
      ref={inputRef}
      className={`w-full bg-navy-deep rounded px-3 py-2 text-center font-bold border transition-colors ${
        status === 'saved'
          ? 'border-green-400 text-green-400'
          : status === 'error'
          ? 'border-red-500 text-red-400'
          : 'border-navy-card text-white focus:border-accent'
      } ${className || ''}`}
      style={{
        fontSize: size === 'sm' ? '0.875rem' : size === 'lg' ? '1.25rem' : '1rem',
        paddingBlock: size === 'sm' ? '0.5rem' : size === 'lg' ? '0.75rem' : '0.625rem',
      }}
      value={value}
      placeholder={placeholder}
      inputMode={inputMode}
      onChange={e => setValue(e.target.value)}
      onBlur={e => {
        if (enterSavedRef.current) {
          enterSavedRef.current = false
          return
        }
        trySave(e.target.value)
      }}
      onKeyDown={e => {
        if (e.key === 'Enter') {
          enterSavedRef.current = true
          trySave(value)
          inputRef.current?.blur()
        }
      }}
    />
  )
}
