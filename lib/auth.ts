import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { timingSafeEqual } from 'crypto'
import { User, SessionData } from './types'

if (!process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET environment variable is required')
}

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

function safePinsEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  return timingSafeEqual(Buffer.from(a), Buffer.from(b))
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
  const match = users.find(u => safePinsEqual(u.pin, pin))
  return match ? { name: match.name, sheetId: match.sheetId } : null
}
