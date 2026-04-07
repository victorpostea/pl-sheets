import { DayBlock, Exercise } from './types'

export function parseSheet(rows: string[][]): DayBlock[] {
  const days: DayBlock[] = []
  let currentDay: DayBlock | null = null
  let isAccessory = false

  for (let i = 2; i < rows.length; i++) {
    const row = rows[i]
    const sheetRow = i + 1  // 1-based sheet row (assumes CSV exported starting from row 1)

    // Empty row — end the current day block
    if (!row || row.every(cell => !cell)) {
      if (currentDay) {
        days.push(currentDay)
        currentDay = null
        isAccessory = false
      }
      continue
    }

    const cellA = (row[0] ?? '').trim()

    // Day header: "Day 1: Primary Squat + Bench"
    if (cellA.startsWith('Day ')) {
      const match = cellA.match(/^Day (\d+):\s*(.+)$/)
      if (match) {
        currentDay = {
          title: match[2].trim(),
          dayNumber: parseInt(match[1], 10),
          mainLifts: [],
          accessories: [],
        }
        isAccessory = false
      }
      continue
    }

    // Accessories section marker row
    if (cellA === 'Accessories') {
      isAccessory = true
      continue
    }

    // Skip if no active day, no name, or it's a stray column-header row
    if (!currentDay || !cellA || cellA === 'Sets') continue

    const exercise: Exercise = {
      name: cellA,
      sets: row[1] ?? '',        // col B
      weightUsed: row[2] ?? '',  // col C — user fills this in
      reps: row[3] ?? '',        // col D
      prescribedRpe: row[4] ?? '', // col E (RPE or RIR)
      weightCell: `C${sheetRow}`,
      actualRpeCell: `F${sheetRow}`,
      actualRpe: row[5] ?? '',   // col F — user fills this in
      isAccessory,
    }

    if (isAccessory) {
      currentDay.accessories.push(exercise)
    } else {
      currentDay.mainLifts.push(exercise)
    }
  }

  // Handle sheet with no trailing empty row after last day
  if (currentDay) days.push(currentDay)

  return days
}
