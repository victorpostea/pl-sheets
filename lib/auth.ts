import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { User, SessionData } from './types'

export const SESSION_OPTIONS = {
  password: process.env.SESSION_SECRET!,
  cookieName: 'pl-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 30,  // 30 days
  },
}

export async function getSession() {
  return getIronSession<SessionData>(await cookies(), SESSION_OPTIONS)
}

export function verifyPin(pin: string): User | null {
  const users = [
    {
      name: process.env.USER_1_NAME!,
      pin: process.env.USER_1_PIN!,
      sheetId: process.env.USER_1_SHEET_ID!,
    },
    {
      name: process.env.USER_2_NAME!,
      pin: process.env.USER_2_PIN!,
      sheetId: process.env.USER_2_SHEET_ID!,
    },
  ]
  const match = users.find(u => u.pin === pin)
  return match ? { name: match.name, sheetId: match.sheetId } : null
}
