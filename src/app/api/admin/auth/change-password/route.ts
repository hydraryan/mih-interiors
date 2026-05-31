import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import AdminUser from '@/lib/models/AdminUser'
import { hashPassword, validatePasswordStrength, verifyPassword } from '@/lib/security'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const currentPassword = typeof body?.currentPassword === 'string' ? body.currentPassword : ''
    const newPassword = typeof body?.newPassword === 'string' ? body.newPassword : ''

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ success: false, error: 'Current and new passwords are required.' }, { status: 400 })
    }

    const passwordError = validatePasswordStrength(newPassword)
    if (passwordError) {
      return NextResponse.json({ success: false, error: passwordError }, { status: 400 })
    }

    await dbConnect()

    const adminId = String(session.user.id).trim().toLowerCase()
    const admin = await AdminUser.findOne({ adminId, isActive: true })

    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const isCurrentPasswordValid = await verifyPassword(currentPassword, admin.passwordHash)
    if (!isCurrentPasswordValid) {
      return NextResponse.json({ success: false, error: 'Current password is incorrect.' }, { status: 400 })
    }

    const isSamePassword = await verifyPassword(newPassword, admin.passwordHash)
    if (isSamePassword) {
      return NextResponse.json({ success: false, error: 'New password must be different from current password.' }, { status: 400 })
    }

    const newPasswordHash = await hashPassword(newPassword)
    await AdminUser.updateOne(
      { _id: admin._id },
      {
        $set: {
          passwordHash: newPasswordHash,
          passwordChangedAt: new Date(),
        },
      }
    )

    return NextResponse.json({ success: true, shouldLogOut: true, message: 'Password changed successfully. Please log in again with your new password.' })
  } catch (error) {
    console.error('Change password failed:', error)
    return NextResponse.json({ success: false, error: 'Unable to change password.' }, { status: 500 })
  }
}
