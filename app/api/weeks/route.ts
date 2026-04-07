import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getSheetTabs } from '@/lib/sheets'

export async function GET() {
  const session = await getSession()
  if (!session.userName) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const weeks = await getSheetTabs(session.sheetId!)
  return NextResponse.json({ weeks })
}
