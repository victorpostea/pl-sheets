import { parseSheet } from '@/lib/parser'

// Mirrors "Victor Postea PREP 1 - Week 1.csv" exactly
const WEEK1_ROWS: string[][] = [
  ['Week 1', '', '', '', '', '', ''],
  ['April 6', '', '', '', '', '', ''],
  ['Day 1: Primary Squat + Bench', 'Sets', 'Weight Used', 'Reps', 'Prescribed RPE', 'Actual RPE', 'Notes'],
  ['Competition Squat: Top Set', '1', '', '3', '5', '', ''],
  ['Competition Squat: Backdown Sets', '2', '', '7', '5', '', ''],
  ['Competition Bench: Top Set', '1', '', '3', '5', '', ''],
  ['Competition Bench: Backdown Sets', '2', '', '7', '5', '', ''],
  ['Accessories', '', '', '', 'RIR', '', ''],
  ['Leg Press', '4', '', '6-8', '3', '', ''],
  ['Leg Extensions', '3', '', '10-12', '2', '', ''],
  ['Hamstring Curls', '3', '', '10-12', '2', '', ''],
  ['', '', '', '', '', '', ''],
  ['Day 2: Primary Deadlift + Tertiary Bench', 'Sets', 'Weight Used', 'Reps', 'RPE', '', 'Notes'],
  ['Competition Deadlift: Top Set', '1', '', '3', '5', '', ''],
  ['Competition Deadlift: Backdown Sets', '2', '', '7', '5', '', ''],
  ['Close Grip Bench: Top Set', '1', '', '6', '5', '', ''],
  ['Close Grip Bench: Backdown Sets', '2', '', '8', '5', '', ''],
  ['Accessories', '', '', '', 'RIR', '', ''],
  ['Lat Pulldown', '4', '', '6-8', '2', '', ''],
  ['Cable Rows', '4', '', '6-8', '2', '', ''],
  ['Preacher Curls', '3', '', '10-12', '2', '', ''],
]

describe('parseSheet', () => {
  it('returns 2 day blocks from 2-day input', () => {
    const result = parseSheet(WEEK1_ROWS)
    expect(result).toHaveLength(2)
  })

  it('parses Day 1 title and number', () => {
    const result = parseSheet(WEEK1_ROWS)
    expect(result[0].title).toBe('Primary Squat + Bench')
    expect(result[0].dayNumber).toBe(1)
  })

  it('parses Day 1 main lifts correctly', () => {
    const result = parseSheet(WEEK1_ROWS)
    const lifts = result[0].mainLifts
    expect(lifts).toHaveLength(4)
    expect(lifts[0].name).toBe('Competition Squat: Top Set')
    expect(lifts[0].sets).toBe('1')
    expect(lifts[0].reps).toBe('3')
    expect(lifts[0].prescribedRpe).toBe('5')
    expect(lifts[0].isAccessory).toBe(false)
  })

  it('assigns correct 1-based sheet row cell addresses', () => {
    const result = parseSheet(WEEK1_ROWS)
    // WEEK1_ROWS index 3 (0-based) → sheet row 4 (1-based)
    expect(result[0].mainLifts[0].weightCell).toBe('C4')
    expect(result[0].mainLifts[0].actualRpeCell).toBe('F4')
    // Index 4 → row 5
    expect(result[0].mainLifts[1].weightCell).toBe('C5')
  })

  it('parses Day 1 accessories as accessories', () => {
    const result = parseSheet(WEEK1_ROWS)
    const acc = result[0].accessories
    expect(acc).toHaveLength(3)
    expect(acc[0].name).toBe('Leg Press')
    expect(acc[0].isAccessory).toBe(true)
  })

  it('parses Day 2 correctly', () => {
    const result = parseSheet(WEEK1_ROWS)
    expect(result[1].title).toBe('Primary Deadlift + Tertiary Bench')
    expect(result[1].dayNumber).toBe(2)
    expect(result[1].mainLifts).toHaveLength(4)
    expect(result[1].accessories).toHaveLength(3)
  })

  it('reads existing cell values when the sheet already has data', () => {
    const rows = WEEK1_ROWS.map(r => [...r])
    rows[3] = ['Competition Squat: Top Set', '1', '140', '3', '5', '7', '']
    const result = parseSheet(rows)
    expect(result[0].mainLifts[0].weightUsed).toBe('140')
    expect(result[0].mainLifts[0].actualRpe).toBe('7')
  })

  it('resets isAccessory to false at the start of a new day block', () => {
    const result = parseSheet(WEEK1_ROWS)
    // Day 2 main lifts must NOT be marked as accessories,
    // even though Day 1 ended with an accessories section
    result[1].mainLifts.forEach(lift => {
      expect(lift.isAccessory).toBe(false)
    })
  })

  it('handles a sheet with no trailing empty row after the last day', () => {
    // Remove the trailing empty row from Day 2 (last row in fixture)
    const rowsNoTrailingEmpty = WEEK1_ROWS.slice(0, -1)
    const result = parseSheet(rowsNoTrailingEmpty)
    expect(result).toHaveLength(2)
    expect(result[1].title).toBe('Primary Deadlift + Tertiary Bench')
  })
})
