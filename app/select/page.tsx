'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SelectPage() {
  const [weeks, setWeeks] = useState<string[]>([])
  const [selectedWeek, setSelectedWeek] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/weeks')
      .then(r => r.json())
      .then(data => setWeeks(data.weeks ?? []))
  }, [])

  function goToSession(week: string, day: number) {
    router.push(`/session/${encodeURIComponent(week)}/${day}`)
  }

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="bg-gradient-to-r from-accent to-accent-dark px-6 py-5">
        <h1 className="text-2xl font-black tracking-widest uppercase">PL Sheets</h1>
      </header>

      <main className="flex-1 px-4 py-6 flex flex-col gap-8">
        {/* Week selector */}
        <section>
          <h2 className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-3">
            Select Week
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {weeks.map(week => (
              <button
                key={week}
                onClick={() => setSelectedWeek(week)}
                className={`py-4 rounded-lg font-bold text-sm uppercase tracking-wide border-2 transition-colors ${
                  selectedWeek === week
                    ? 'bg-accent border-accent text-white'
                    : 'bg-navy-card border-navy-card text-gray-300 active:border-accent'
                }`}
              >
                {week}
              </button>
            ))}
          </div>
        </section>

        {/* Day selector — appears after a week is selected */}
        {selectedWeek && (
          <section>
            <h2 className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-3">
              Select Day
            </h2>
            <div className="flex flex-col gap-3">
              {[1, 2, 3, 4].map(day => (
                <button
                  key={day}
                  onClick={() => goToSession(selectedWeek, day)}
                  className="bg-navy-card rounded-lg px-5 py-5 text-left border-2 border-navy-card active:border-accent transition-colors"
                >
                  <span className="text-accent font-black text-xl">Day {day}</span>
                </button>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
