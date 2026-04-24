import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { firstName, lastName, email, message } = req.body;

    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    if (!process.env.RESEND_API_KEY) {
      return res.status(500).json({ error: 'Resend API key is not configured.' });
    }

    const result = await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>',
      to: ['aleenamansurmotocross@gmail.com'],
      subject: `New Inquiry from ${firstName} ${lastName}`,
      html: `
        <h3>New Contact Request from The Paddock</h3>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Email error:', error);
    return res.status(500).json({ error: error.message || 'Failed to send email' });
  }
}
