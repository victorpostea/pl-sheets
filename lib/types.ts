export interface User {
  name: string
  sheetId: string
}

export interface SessionData {
  userName?: string
  sheetId?: string
}

export interface Exercise {
  name: string
  sets: string
  reps: string
  prescribedRpe: string  // RPE for main lifts, RIR for accessories
  weightCell: string     // e.g. "C4" — exact cell address for write-back
  actualRpeCell: string  // e.g. "F4"
  notesCell: string      // e.g. "G4" — notes column
  weightUsed: string     // current value already in the sheet (may be empty string)
  actualRpe: string      // current value already in the sheet (may be empty string)
  notes: string          // col G — user fills this in
  isAccessory: boolean
  lastWeekWeight?: string // Previous week's weight for reference
}

export interface DayBlock {
  title: string          // e.g. "Primary Squat + Bench"
  dayNumber: number      // 1–4
  mainLifts: Exercise[]
  accessories: Exercise[]
}
