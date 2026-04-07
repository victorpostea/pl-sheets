import { DayBlock, Exercise } from './types'

export function parseSheet(rows: string[][]): DayBlock[] {
  const days: DayBlock[] = []
  let currentDay: DayBlock | null = null
  let isAccessory = false

  for (let i = 2; i < rows.length; i++) {
    const row = rows[i]
    const sheetRow = i + 1  // rows array is 0-based; sheet rows are 1-based

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
      sets: row[1] ?? '',
      reps: row[3] ?? '',
      prescribedRpe: row[4] ?? '',
      weightCell: `C${sheetRow}`,
      actualRpeCell: `F${sheetRow}`,
      weightUsed: row[2] ?? '',
      actualRpe: row[5] ?? '',
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
