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

  // Fetch last week's data to show previous weights
  const lastWeekName = `${week.replace('Week ', '') - 1}Week ` +
    'Sheet'
  let lastWeekData: any = null
  try {
    if (week === 'Week 2' || week === '1Week Sheet') {
      lastWeekData = { name: 'Prep Sheet' }
    } else {
      const lastWeekRows = await getSheetData(session.sheetId!, lastWeekName)
      const lastWeekDays = parseSheet(lastWeekRows)
      const lastWeekDayBlock = lastWeekDays.find(d => d.dayNumber === day)
      if (lastWeekDayBlock) {
        lastWeekData = lastWeekDayBlock
      }
    }
  } catch (e) {
    // Last week doesn't exist yet
  }

  if (!dayBlock) {
    return NextResponse.json({ error: 'Day not found' }, { status: 404 })
  }

  // Merge last week's weights into current exercises
  if (dayBlock && lastWeekData) {
    const mergedExercises: any[] = []
    const seenNames = new Set<string>()

    // Process current exercises
    for (const exercise of dayBlock.mainLifts) {
      // Check if data already exists for this name
      if (seenNames.has(exercise.name)) continue
      seenNames.add(exercise.name)

      // Find matching exercise from last week
      const lastWeekExercise = lastWeekData.mainLifts.find(
        (e: any) => e.name.trim() === exercise.name.trim()
      )
      if (lastWeekExercise) {
        mergedExercises.push({
          ...exercise,
          lastWeekWeight: lastWeekExercise.weightUsed,
          lastWeekRpe: lastWeekExercise.actualRpe,
        })
      } else {
        mergedExercises.push(exercise)
      }
    }

    // Process accessories
    for (const exercise of dayBlock.accessories) {
      if (seenNames.has(exercise.name)) continue
      seenNames.add(exercise.name)
      mergedExercises.push(exercise)
    }

    // Sort by exercise name for consistent display order
    const sortedMerged = mergedExercises.sort((a, b) => {
      const priority = a.isAccessory ? 1 : 0
      const priority2 = b.isAccessory ? 1 : 0
      if (priority !== priority2) return priority - priority2
      return a.name.localeCompare(b.name)
    })

    return NextResponse.json({
      ...dayBlock,
      mainLifts: sortedMerged.filter((e: any) => e.isAccessory === false),
      accessories: sortedMerged.filter((e: any) => e.isAccessory === true),
    })
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
