import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export async function sendLeadNotification(lead: any) {
  const adminEmail = process.env.ADMIN_EMAIL || 'mohit@mihinteriors.in';
  
  const mailOptions = {
    from: '"MIH Website" <no-reply@mihinteriors.in>',
    to: adminEmail,
    subject: `New Lead: ${lead.name} (${lead.projectType || 'General Inquiry'})`,
    html: `
      <h2>New Lead Received from Chatbot</h2>
      <p><strong>Name:</strong> ${lead.name}</p>
      <p><strong>Phone:</strong> ${lead.phone}</p>
      <p><strong>City:</strong> ${lead.city}</p>
      <p><strong>Project Type:</strong> ${lead.projectType}</p>
      <p><strong>BHK/Space:</strong> ${lead.bhkType}</p>
      <p><strong>Area:</strong> ${lead.areaSqft ? `${lead.areaSqft} sq.ft.` : 'N/A'}</p>
      <p><strong>Budget:</strong> ${lead.budget}</p>
      <p><strong>Service Page:</strong> ${lead.serviceSlug || 'Home'}</p>
      <hr />
      <p>View full details in the admin dashboard.</p>
    `,
  };

  try {
    // Only send if credentials are provided
    if (process.env.EMAIL_SERVER_USER) {
      await transporter.sendMail(mailOptions);
      console.log(`Email notification sent for lead: ${lead._id}`);
    } else {
      console.log('Skipping email notification: No credentials provided.');
    }
  } catch (error) {
    console.error('Failed to send lead notification email:', error);
  }
}
