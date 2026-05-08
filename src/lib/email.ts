import nodemailer from 'nodemailer'
import dbConnect from '@/lib/mongodb'
import Setting from '@/lib/models/Setting'

// ────────────────────────────────────────────────
// Gmail SMTP transporter
// ────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
})

// ────────────────────────────────────────────────
// Load notification email recipients from DB
// ────────────────────────────────────────────────
async function getNotificationEmails(): Promise<string[]> {
  try {
    await dbConnect()
    const setting = await Setting.findOne({ key: 'notification_emails' }).lean() as any
    if (setting?.value && Array.isArray(setting.value) && setting.value.length > 0) {
      return setting.value.slice(0, 5) // Max 5 emails
    }
  } catch (error) {
    console.error('Failed to load notification emails from DB:', error)
  }
  // Fallback
  return [process.env.ADMIN_EMAIL || 'mohit@mihinteriors.in']
}

// ────────────────────────────────────────────────
// Notification types
// ────────────────────────────────────────────────
export type NotificationType = 'contact_form' | 'chatbot_quote' | '3d_rendering'

const NOTIFICATION_TITLES: Record<NotificationType, string> = {
  contact_form: '📩 New Contact Form Submission',
  chatbot_quote: '🤖 New Chatbot Quote Request',
  '3d_rendering': '🏠 New 3D Visualization Inquiry',
}

const NOTIFICATION_SUBTITLES: Record<NotificationType, string> = {
  contact_form: 'A visitor submitted the contact form on the website.',
  chatbot_quote: 'A visitor completed the AI chatbot quote flow.',
  '3d_rendering': 'A visitor submitted the 3D home visualization form.',
}

// ────────────────────────────────────────────────
// Build a clean HTML email
// ────────────────────────────────────────────────
function buildEmailHtml(type: NotificationType, data: Record<string, any>): string {
  const title = NOTIFICATION_TITLES[type]
  const subtitle = NOTIFICATION_SUBTITLES[type]

  // Filter out nulls, undefined, empty strings, and internal fields
  const SKIP_KEYS = new Set(['_id', '__v', 'createdAt', 'updatedAt', 'deviceProfile', 'personalizationFactors', 'fullAnswers', 'conversationId'])
  const rows: string[] = []

  for (const [key, value] of Object.entries(data)) {
    if (SKIP_KEYS.has(key)) continue
    if (value === null || value === undefined || value === '') continue
    if (typeof value === 'object' && !Array.isArray(value)) continue

    const label = key
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/^\w/, (c) => c.toUpperCase())
      .trim()

    const displayValue = Array.isArray(value) ? value.join(', ') : String(value)

    rows.push(`
      <tr>
        <td style="padding: 10px 14px; font-weight: 600; color: #555; white-space: nowrap; border-bottom: 1px solid #f0ebe6; font-size: 13px; vertical-align: top;">${label}</td>
        <td style="padding: 10px 14px; color: #1a1511; border-bottom: 1px solid #f0ebe6; font-size: 13px;">${displayValue}</td>
      </tr>
    `)
  }

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8" /></head>
    <body style="margin: 0; padding: 0; background-color: #f5f1ef; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <div style="max-width: 580px; margin: 24px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1a1511 0%, #362921 100%); padding: 28px 24px; text-align: center;">
          <h1 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 700; letter-spacing: 0.02em;">${title}</h1>
          <p style="margin: 8px 0 0; color: rgba(255,255,255,0.65); font-size: 13px;">${subtitle}</p>
        </div>

        <!-- Body -->
        <div style="padding: 24px;">
          <table style="width: 100%; border-collapse: collapse;">
            ${rows.join('')}
          </table>
        </div>

        <!-- Footer -->
        <div style="padding: 16px 24px; background: #fbf4eb; text-align: center; border-top: 1px solid #f0ebe6;">
          <p style="margin: 0; font-size: 11px; color: #999;">
            This is an automated notification from MIH Interiors website.<br />
            View full details in the <a href="https://mihinteriors.in/admin/leads" style="color: #8B6914; text-decoration: none; font-weight: 600;">Admin Dashboard</a>.
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}

// ────────────────────────────────────────────────
// Main send function
// ────────────────────────────────────────────────
export async function sendNotification(type: NotificationType, data: Record<string, any>): Promise<void> {
  try {
    if (!process.env.EMAIL_SERVER_USER || !process.env.EMAIL_SERVER_PASSWORD) {
      console.log('Skipping email notification: No SMTP credentials configured.')
      return
    }

    const recipients = await getNotificationEmails()
    if (recipients.length === 0) {
      console.log('Skipping email notification: No recipient emails configured.')
      return
    }

    const subjectName = data.name || data.contact_name || 'Website Visitor'
    const subjectType = type === 'contact_form' ? 'Contact' : type === 'chatbot_quote' ? 'Chatbot Quote' : '3D Visualization'

    const mailOptions = {
      from: `"MIH Interiors" <${process.env.EMAIL_SERVER_USER}>`,
      to: recipients.join(', '),
      subject: `New ${subjectType} Lead: ${subjectName}`,
      html: buildEmailHtml(type, data),
    }

    await transporter.sendMail(mailOptions)
    console.log(`✅ Email notification sent (${type}) to: ${recipients.join(', ')}`)
  } catch (error) {
    console.error(`❌ Failed to send email notification (${type}):`, error)
  }
}

// ────────────────────────────────────────────────
// Backward-compatible wrapper (used by /api/quote)
// ────────────────────────────────────────────────
export async function sendLeadNotification(lead: any): Promise<void> {
  await sendNotification('chatbot_quote', {
    name: lead.name,
    phone: lead.phone,
    city: lead.city,
    projectType: lead.projectType,
    scope: lead.scope,
    bhkType: lead.bhkType,
    areaSqft: lead.areaSqft,
    packageTier: lead.packageTier,
    budget: lead.budget,
    serviceSlug: lead.serviceSlug,
    sourcePage: lead.sourcePage,
  })
}
