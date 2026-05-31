import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import AdminOtpChallenge from '@/lib/models/AdminOtpChallenge'
import {
  generateResetToken,
  hashResetToken,
  verifyOtp,
  OTP_MAX_ATTEMPTS,
  RESET_TOKEN_EXPIRY_MINUTES,
} from '@/lib/security'

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() || 'unknown'
  }
  return request.headers.get('x-real-ip') || 'unknown'
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const adminId = typeof body?.adminId === 'string' ? body.adminId.trim().toLowerCase() : ''
    const otp = typeof body?.otp === 'string' ? body.otp.trim() : ''

    if (!adminId || !otp) {
      return NextResponse.json({ success: false, error: 'Admin ID and OTP are required.' }, { status: 400 })
    }

    await dbConnect()

    const challenge = await AdminOtpChallenge.findOne({ adminId, purpose: 'password_reset' })
    if (!challenge) {
      return NextResponse.json({ success: false, error: 'Invalid or expired OTP.' }, { status: 400 })
    }

    const now = new Date()

    if (challenge.consumedAt) {
      return NextResponse.json({ success: false, error: 'OTP has already been used.' }, { status: 400 })
    }

    if (!challenge.expiresAt || new Date(challenge.expiresAt) <= now) {
      return NextResponse.json({ success: false, error: 'OTP expired. Please request a new OTP.' }, { status: 400 })
    }

    const maxAttempts = challenge.maxAttempts || OTP_MAX_ATTEMPTS
    if ((challenge.attemptCount || 0) >= maxAttempts) {
      return NextResponse.json({ success: false, error: 'Maximum OTP attempts reached. Request a new OTP.' }, { status: 429 })
    }

    const isValidOtp = await verifyOtp(otp, challenge.otpHash)
    if (!isValidOtp) {
      await AdminOtpChallenge.updateOne(
        { _id: challenge._id },
        {
          $inc: { attemptCount: 1 },
          $set: { lastAttemptByIp: getClientIp(request) },
        }
      )
      return NextResponse.json({ success: false, error: 'Invalid OTP.' }, { status: 400 })
    }

    const resetToken = generateResetToken()
    const resetTokenHash = await hashResetToken(resetToken)
    const resetTokenExpiresAt = new Date(now.getTime() + RESET_TOKEN_EXPIRY_MINUTES * 60 * 1000)

    await AdminOtpChallenge.updateOne(
      { _id: challenge._id },
      {
        $set: {
          verifiedAt: now,
          resetTokenHash,
          resetTokenExpiresAt,
        },
      }
    )

    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully.',
      resetToken,
      resetTokenExpiresInSeconds: RESET_TOKEN_EXPIRY_MINUTES * 60,
    })
  } catch (error) {
    console.error('Verify OTP failed:', error)
    return NextResponse.json({ success: false, error: 'Unable to verify OTP.' }, { status: 500 })
  }
}
