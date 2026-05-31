import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import AdminUser from '@/lib/models/AdminUser'
import AdminOtpChallenge from '@/lib/models/AdminOtpChallenge'
import { hashPassword, validatePasswordStrength, verifyResetToken } from '@/lib/security'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const adminId = typeof body?.adminId === 'string' ? body.adminId.trim().toLowerCase() : ''
    const resetToken = typeof body?.resetToken === 'string' ? body.resetToken.trim() : ''
    const newPassword = typeof body?.newPassword === 'string' ? body.newPassword : ''

    if (!adminId || !resetToken || !newPassword) {
      return NextResponse.json({ success: false, error: 'Admin ID, reset token and new password are required.' }, { status: 400 })
    }

    const passwordError = validatePasswordStrength(newPassword)
    if (passwordError) {
      return NextResponse.json({ success: false, error: passwordError }, { status: 400 })
    }

    await dbConnect()

    const challenge = await AdminOtpChallenge.findOne({ adminId, purpose: 'password_reset' })
    if (!challenge || challenge.consumedAt || !challenge.resetTokenHash || !challenge.resetTokenExpiresAt) {
      return NextResponse.json({ success: false, error: 'Invalid password reset session.' }, { status: 400 })
    }

    const now = new Date()
    if (new Date(challenge.resetTokenExpiresAt) <= now) {
      return NextResponse.json({ success: false, error: 'Reset session expired. Start again.' }, { status: 400 })
    }

    const isValidResetToken = await verifyResetToken(resetToken, challenge.resetTokenHash)
    if (!isValidResetToken) {
      return NextResponse.json({ success: false, error: 'Invalid password reset session.' }, { status: 400 })
    }

    const admin = await AdminUser.findOne({ adminId, isActive: true })
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unable to reset password.' }, { status: 400 })
    }

    const passwordHash = await hashPassword(newPassword)

    await AdminUser.updateOne(
      { _id: admin._id },
      {
        $set: {
          passwordHash,
          passwordChangedAt: now,
        },
      }
    )

    await AdminOtpChallenge.updateOne(
      { _id: challenge._id },
      {
        $set: {
          consumedAt: now,
        },
        $unset: {
          resetTokenHash: '',
          resetTokenExpiresAt: '',
          otpHash: '',
        },
      }
    )

    return NextResponse.json({ success: true, shouldLogOut: true, message: 'Password reset successful. Please log in with your new password.' })
  } catch (error) {
    console.error('Reset password failed:', error)
    return NextResponse.json({ success: false, error: 'Unable to reset password.' }, { status: 500 })
  }
}
