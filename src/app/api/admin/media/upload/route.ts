import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { v2 as cloudinary } from 'cloudinary'
import { Readable } from 'stream'

async function ensureAdmin(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }
  return null
}

function configCloudinary() {
  // Allow either the single CLOUDINARY_URL or the 3-part config.
  // The Cloudinary SDK will read CLOUDINARY_URL from env when present.
  if (process.env.CLOUDINARY_URL) {
    cloudinary.config({
      secure: true,
    })
    return true
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  if (!cloudName || !apiKey || !apiSecret) {
    return false
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  })

  return true
}

function uploadBuffer(buffer: Buffer, folder: string) {
  return new Promise<{
    public_id: string
    secure_url: string
    width?: number
    height?: number
    bytes?: number
  }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error('Cloudinary upload failed'))
          return
        }

        resolve({
          public_id: result.public_id,
          secure_url: result.secure_url,
          width: result.width,
          height: result.height,
          bytes: result.bytes,
        })
      },
    )

    Readable.from(buffer).pipe(stream)
  })
}

export async function POST(request: NextRequest) {
  const unauthorized = await ensureAdmin(request)
  if (unauthorized) return unauthorized

  try {
    if (!configCloudinary()) {
      return NextResponse.json(
        { success: false, error: 'Cloudinary env vars are not configured yet.' },
        { status: 400 },
      )
    }

    const formData = await request.formData()
    const file = formData.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json({ success: false, error: 'file is required.' }, { status: 400 })
    }

    const folder = String(formData.get('folder') || 'mih-admin')
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const upload = await uploadBuffer(buffer, folder)

    return NextResponse.json({
      success: true,
      upload,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to upload media asset.'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
