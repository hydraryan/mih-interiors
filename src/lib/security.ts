import bcrypt from 'bcrypt'
import { randomBytes } from 'crypto'

const PASSWORD_SALT_ROUNDS = 12
const OTP_SALT_ROUNDS = 10
const RESET_TOKEN_SALT_ROUNDS = 10

export const OTP_LENGTH = 6
export const OTP_EXPIRY_MINUTES = 10
export const OTP_RESEND_COOLDOWN_SECONDS = 60
export const OTP_MAX_ATTEMPTS = 5
export const RESET_TOKEN_EXPIRY_MINUTES = 10

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, PASSWORD_SALT_ROUNDS)
}

export async function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
  return bcrypt.compare(password, passwordHash)
}

export async function hashOtp(otp: string): Promise<string> {
  return bcrypt.hash(otp, OTP_SALT_ROUNDS)
}

export async function verifyOtp(otp: string, otpHash: string): Promise<boolean> {
  return bcrypt.compare(otp, otpHash)
}

export async function hashResetToken(token: string): Promise<string> {
  return bcrypt.hash(token, RESET_TOKEN_SALT_ROUNDS)
}

export async function verifyResetToken(token: string, tokenHash: string): Promise<boolean> {
  return bcrypt.compare(token, tokenHash)
}

export function generateNumericOtp(length = OTP_LENGTH): string {
  const min = Math.pow(10, length - 1)
  const max = Math.pow(10, length) - 1
  return Math.floor(min + Math.random() * (max - min + 1)).toString()
}

export function generateResetToken(): string {
  return randomBytes(24).toString('hex')
}

export function validatePasswordStrength(password: string): string | null {
  if (password.length < 8) return 'Password must be at least 8 characters long.'
  if (!/[A-Z]/.test(password)) return 'Password must include at least one uppercase letter.'
  if (!/[a-z]/.test(password)) return 'Password must include at least one lowercase letter.'
  if (!/[0-9]/.test(password)) return 'Password must include at least one number.'
  if (!/[^A-Za-z0-9]/.test(password)) return 'Password must include at least one special character.'
  return null
}
