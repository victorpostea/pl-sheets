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
  weightUsed: string     // current value already in the sheet (may be empty string)
  actualRpe: string      // current value already in the sheet (may be empty string)
  isAccessory: boolean
  lastWeekWeight?: string // Previous week's weight for reference
  lastWeekRpe?: string    // Previous week's RPE/RIR for reference
}

export interface DayBlock {
  title: string          // e.g. "Primary Squat + Bench"
  dayNumber: number      // 1–4
  mainLifts: Exercise[]
  accessories: Exercise[]
}
