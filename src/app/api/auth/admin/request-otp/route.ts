import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import AdminUser from '@/lib/models/AdminUser'
import AdminOtpChallenge from '@/lib/models/AdminOtpChallenge'
import { getAdminNotificationEmails, sendAdminPasswordResetOtp } from '@/lib/email'
import {
  generateNumericOtp,
  hashOtp,
  OTP_EXPIRY_MINUTES,
  OTP_MAX_ATTEMPTS,
  OTP_RESEND_COOLDOWN_SECONDS,
} from '@/lib/security'

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() || 'unknown'
  }
  return request.headers.get('x-real-ip') || 'unknown'
}

function genericResponse() {
  return NextResponse.json({
    success: true,
    message: 'If the admin account exists, an OTP has been sent.',
    cooldownSeconds: OTP_RESEND_COOLDOWN_SECONDS,
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const adminId = typeof body?.adminId === 'string' ? body.adminId.trim().toLowerCase() : ''

    if (!adminId) {
      return genericResponse()
    }

    await dbConnect()

    const admin = await AdminUser.findOne({ adminId, isActive: true })
    if (!admin) {
      return genericResponse()
    }

    const now = new Date()
    const existingChallenge = await AdminOtpChallenge.findOne({ adminId, purpose: 'password_reset' })

    if (existingChallenge?.cooldownUntil && new Date(existingChallenge.cooldownUntil) > now) {
      return genericResponse()
    }

    const otp = generateNumericOtp()
    const otpHash = await hashOtp(otp)
    const expiresAt = new Date(now.getTime() + OTP_EXPIRY_MINUTES * 60 * 1000)
    const cooldownUntil = new Date(now.getTime() + OTP_RESEND_COOLDOWN_SECONDS * 1000)
    const recipients = await getAdminNotificationEmails()

    await AdminOtpChallenge.findOneAndUpdate(
      { adminId, purpose: 'password_reset' },
      {
        adminId,
        purpose: 'password_reset',
        otpHash,
        recipientEmails: recipients,
        expiresAt,
        cooldownUntil,
        attemptCount: 0,
        maxAttempts: OTP_MAX_ATTEMPTS,
        verifiedAt: null,
        resetTokenHash: null,
        resetTokenExpiresAt: null,
        consumedAt: null,
        requestedByIp: getClientIp(request),
      },
      { upsert: true, new: true }
    )

    await sendAdminPasswordResetOtp(otp, recipients)

    return genericResponse()
  } catch (error) {
    console.error('Request OTP failed:', error)
    return NextResponse.json({ success: false, error: 'Unable to process OTP request.' }, { status: 500 })
  }
}
