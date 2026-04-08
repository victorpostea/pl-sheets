'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PinPad } from '@/components/PinPad'

export default function PinScreen() {
  const [error, setError] = useState('')
  const router = useRouter()

  async function handlePin(pin: string) {
    setError('')
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin }),
    })
    if (res.ok) {
      router.push('/select')
    } else {
      setError('Wrong PIN')
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-dvh gap-12 px-6">
      <div className="text-center">
        <h1 className="text-4xl font-black tracking-widest uppercase">PL Sheets</h1>
        <p className="text-gray-400 text-sm mt-2">Enter your PIN</p>
      </div>
      <PinPad onSubmit={handlePin} error={error} />
    </main>
  )
}
