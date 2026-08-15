import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'GTFPortal_SuperSecret_2025'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function signToken(payload: { id: string; email: string; role: 'agent' | 'admin' }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): { id: string; email: string; role: 'agent' | 'admin' } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: 'agent' | 'admin' }
  } catch {
    return null
  }
}

export function getTokenFromCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null
  const match = cookieHeader.match(/gtf_token=([^;]+)/)
  return match ? match[1] : null
}
