import { NextRequest, NextResponse } from 'next/server'
import { getSession, verifyPin } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const user = verifyPin(body.pin ?? '')
  if (!user) {
    return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 })
  }
  const session = await getSession()
  session.userName = user.name
  session.sheetId = user.sheetId
  await session.save()
  return NextResponse.json({ name: user.name })
}
