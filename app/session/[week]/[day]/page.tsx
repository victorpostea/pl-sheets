'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { DayBlock } from '@/lib/types'
import { ExerciseCard } from '@/components/ExerciseCard'

export default function SessionPage() {
  const params = useParams()
  const router = useRouter()

  let weekName = ''
  try {
    weekName = decodeURIComponent(params.week as string)
  } catch {
    // malformed percent-sequence in URL — treat as invalid
  }
  const dayNum = parseInt(params.day as string, 10)

  const [dayBlock, setDayBlock] = useState<DayBlock | null>(null)
  const [error, setError] = useState(() => {
    if (!weekName) return 'Invalid week parameter'
    if (isNaN(dayNum)) return 'Invalid day parameter'
    return ''
  })

  useEffect(() => {
    if (error) return  // don't fetch if params are invalid
    fetch(`/api/session?week=${encodeURIComponent(weekName)}&day=${dayNum}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) setError(data.error)
        else setDayBlock(data)
      })
      .catch(() => setError('Failed to load session'))
  }, [weekName, dayNum, error])

  async function handleSave(cell: string, value: string) {
    const res = await fetch('/api/session', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ week: weekName, cell, value }),
    })
    if (!res.ok) throw new Error('Save failed')
  }

  if (error) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center gap-4">
        <p className="text-accent font-bold">{error}</p>
        <button
          onClick={() => router.push('/select')}
          className="text-gray-400 underline text-sm"
        >
          Back to selector
        </button>
      </div>
    )
  }

  if (!dayBlock) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="bg-gradient-to-r from-accent to-accent-dark px-4 py-4 flex items-center gap-4">
        <button
          onClick={() => router.push('/select')}
          className="text-white font-black text-2xl p-3 active:opacity-70"
          aria-label="Back"
        >
          ←
        </button>
        <div>
          <div className="text-white/70 text-xs font-bold uppercase tracking-widest">
            {weekName} · Day {dayNum}
          </div>
          <div className="text-white font-black text-lg uppercase tracking-wide leading-tight">
            {dayBlock.title}
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 flex flex-col gap-8 pb-12">
        {dayBlock.mainLifts.length > 0 && (
          <section>
            <h2 className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-3">
              Main Lifts
            </h2>
            <div className="flex flex-col gap-3">
              {dayBlock.mainLifts.map((exercise, i) => (
                <ExerciseCard key={exercise.weightCell} exercise={exercise} onSave={handleSave} />
              ))}
            </div>
          </section>
        )}

        {dayBlock.accessories.length > 0 && (
          <section>
            <h2 className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-3">
              Accessories
            </h2>
            <div className="flex flex-col gap-3">
              {dayBlock.accessories.map((exercise, i) => (
                <ExerciseCard key={exercise.weightCell} exercise={exercise} onSave={handleSave} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
