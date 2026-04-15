import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getSheetData, getSheetTabs, writeCell } from '@/lib/sheets'
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

  // Try to fetch last week's data to show previous weights
  try {
    const allTabs = await getSheetTabs(session.sheetId!)
    const currentIndex = allTabs.indexOf(week)
    if (currentIndex > 0) {
      const lastWeekTab = allTabs[currentIndex - 1]
      const lastWeekRows = await getSheetData(session.sheetId!, lastWeekTab)
      const lastWeekDays = parseSheet(lastWeekRows)
      const lastWeekDayBlock = lastWeekDays.find(d => d.dayNumber === day)

      if (lastWeekDayBlock) {
        // Build a lookup map by exercise name → last week's weight
        const lastWeekMap = new Map<string, string>()
        for (const ex of [...lastWeekDayBlock.mainLifts, ...lastWeekDayBlock.accessories]) {
          if (ex.weightUsed) lastWeekMap.set(ex.name.trim(), ex.weightUsed)
        }

        // Merge last week weight into current exercises
        const mergeWeight = (exercises: typeof dayBlock.mainLifts) =>
          exercises.map(ex => ({
            ...ex,
            lastWeekWeight: lastWeekMap.get(ex.name.trim()) ?? '',
          }))

        return NextResponse.json({
          ...dayBlock,
          mainLifts: mergeWeight(dayBlock.mainLifts),
          accessories: mergeWeight(dayBlock.accessories),
        })
      }
    }
  } catch {
    // Last week data unavailable — just return current data
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
