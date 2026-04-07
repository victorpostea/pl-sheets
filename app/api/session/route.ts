import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getSheetData, writeCell } from '@/lib/sheets'
import { parseSheet } from '@/lib/parser'

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session.userName) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const week = searchParams.get('week')
  const day = parseInt(searchParams.get('day') ?? '1', 10)

  if (!week) {
    return NextResponse.json({ error: 'Missing week param' }, { status: 400 })
  }

  const rows = await getSheetData(session.sheetId!, week)
  const days = parseSheet(rows)
  const dayBlock = days.find(d => d.dayNumber === day)

  if (!dayBlock) {
    return NextResponse.json({ error: 'Day not found' }, { status: 404 })
  }

  return NextResponse.json(dayBlock)
}

export async function PATCH(req: NextRequest) {
  const session = await getSession()
  if (!session.userName) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { week, cell, value } = await req.json()

  if (!week || !cell || value === undefined) {
    return NextResponse.json({ error: 'Missing fields: week, cell, value required' }, { status: 400 })
  }

  await writeCell(session.sheetId!, week, cell, value)
  return NextResponse.json({ ok: true })
}
