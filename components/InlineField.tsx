'use client'
import { useState, useRef } from 'react'

interface Props {
  initialValue: string
  placeholder: string
  onSave: (value: string) => Promise<void>
  inputMode?: 'numeric' | 'decimal'
  isTextarea?: boolean
}

export function InlineField({ initialValue, placeholder, onSave, inputMode = 'decimal', isTextarea = false }: Props) {
  const [value, setValue] = useState(initialValue)
  const [status, setStatus] = useState<'idle' | 'saved' | 'error'>('idle')
  const inputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const savingRef = useRef(false)
  const enterSavedRef = useRef(false)

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

  const baseClass = `w-full bg-navy-deep rounded px-3 py-2 font-bold border transition-colors ${
    status === 'saved'
      ? 'border-green-400 text-green-400'
      : status === 'error'
      ? 'border-red-500 text-red-400'
      : 'border-navy-card text-white focus:border-accent'
  }`

  if (isTextarea) {
    return (
      <textarea
        ref={textareaRef}
        className={`${baseClass} text-sm resize-none min-h-[72px]`}
        value={value}
        placeholder={placeholder}
        onChange={e => setValue(e.target.value)}
        onBlur={e => trySave(e.target.value)}
      />
    )
  }

  return (
    <input
      ref={inputRef}
      className={`${baseClass} text-center text-lg`}
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
