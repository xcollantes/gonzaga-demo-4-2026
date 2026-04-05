import type { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

type ContactFormData = {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message: string;
};

type ApiResponse = {
  success: boolean;
  message: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    const { name, email, company, phone, message }: ContactFormData = req.body;

    // Validate required fields.
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Create email content.
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="font-size: 32px; font-weight: bold; background: linear-gradient(to right, #3B82F6, #8B5CF6, #EF4444); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin: 0;">
            Quantplex.AI
          </h1>
        </div>

        <h2 style="color: #8B5CF6; border-bottom: 2px solid #3B82F6; padding-bottom: 10px;">
          New Inquiry
        </h2>

        <div style="background: linear-gradient(135deg, #f0f4ff, #f3f0ff); padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #c7d2fe;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #6366f1; width: 120px;">Name:</td>
              <td style="padding: 8px 0; color: #1e1b4b;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #6366f1;">Email:</td>
              <td style="padding: 8px 0; color: #1e1b4b;">
                <a href="mailto:${email}" style="color: #3B82F6; text-decoration: none;">
                  ${email}
                </a>
              </td>
            </tr>
            ${company ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #6366f1;">Company:</td>
              <td style="padding: 8px 0; color: #1e1b4b;">${company}</td>
            </tr>
            ` : ''}
            ${phone ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #6366f1;">Phone:</td>
              <td style="padding: 8px 0; color: #1e1b4b;">
                <a href="tel:${phone}" style="color: #3B82F6; text-decoration: none;">
                  ${phone}
                </a>
              </td>
            </tr>
            ` : ''}
          </table>
        </div>

        <div style="background-color: #fff; border: 1px solid #c7d2fe; border-radius: 12px; padding: 20px; margin: 20px 0; box-shadow: 0 1px 3px rgba(59, 130, 246, 0.1);">
          <h3 style="color: #8B5CF6; margin-top: 0;">Message:</h3>
          <p style="color: #1e1b4b; line-height: 1.6; margin-bottom: 0; white-space: pre-wrap;">${message}</p>
        </div>

        <div style="color: #6366f1; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #c7d2fe;">
          <p>Sent from Quantplex.AI at ${new Date().toLocaleString()}.</p>
        </div>
      </div>
    `;

    // Send email using Resend.
    await resend.emails.send({
      from: 'Quantplex.AI <info@contact.quantplex.ai>', // You'll need to set up a custom domain later
      to: [process.env.CONTACT_EMAIL || 'your-email@gmail.com'], // Your Gmail address
      subject: `Quantplex.AI Inquiry from ${name}`,
      html: emailHtml,
      replyTo: email, // This allows you to reply directly to the person who submitted the form
    });

    res.status(200).json({
      success: true,
      message: 'Email sent successfully'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send email',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}