const { Resend } = require('resend');

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, message: 'Method not allowed' });
  }

  const { name, email, phone, service, area, message } = req.body || {};

  if (!name || !String(name).trim() || !email || !String(email).trim() || !message || !String(message).trim()) {
    return res.status(400).json({ ok: false, message: 'Name, email and message are required.' });
  }

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(String(email).trim())) {
    return res.status(400).json({ ok: false, message: 'Invalid email address.' });
  }

  const rows = [
    `<tr><td style="padding:8px 0;border-bottom:1px solid #eee;white-space:nowrap;vertical-align:top"><strong>Name</strong></td><td style="padding:8px 0 8px 16px;border-bottom:1px solid #eee">${escapeHtml(name)}</td></tr>`,
    `<tr><td style="padding:8px 0;border-bottom:1px solid #eee;white-space:nowrap;vertical-align:top"><strong>Email</strong></td><td style="padding:8px 0 8px 16px;border-bottom:1px solid #eee">${escapeHtml(email)}</td></tr>`,
    phone ? `<tr><td style="padding:8px 0;border-bottom:1px solid #eee;white-space:nowrap;vertical-align:top"><strong>Phone</strong></td><td style="padding:8px 0 8px 16px;border-bottom:1px solid #eee">${escapeHtml(phone)}</td></tr>` : '',
    service ? `<tr><td style="padding:8px 0;border-bottom:1px solid #eee;white-space:nowrap;vertical-align:top"><strong>Service</strong></td><td style="padding:8px 0 8px 16px;border-bottom:1px solid #eee">${escapeHtml(service)}</td></tr>` : '',
    area ? `<tr><td style="padding:8px 0;border-bottom:1px solid #eee;white-space:nowrap;vertical-align:top"><strong>Area</strong></td><td style="padding:8px 0 8px 16px;border-bottom:1px solid #eee">${escapeHtml(area)}</td></tr>` : '',
    `<tr><td style="padding:8px 0;white-space:nowrap;vertical-align:top"><strong>Message</strong></td><td style="padding:8px 0 8px 16px;white-space:pre-wrap">${escapeHtml(message)}</td></tr>`,
  ].filter(Boolean).join('\n');

  const htmlBody = `<!DOCTYPE html>
<html>
<body style="font-family:sans-serif;background:#f9f9f9;margin:0;padding:24px">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:8px;padding:32px;box-shadow:0 1px 4px rgba(0,0,0,.08)">
    <h2 style="margin:0 0 20px;font-size:18px;color:#0a141c">New Contact Form Submission</h2>
    <table style="width:100%;border-collapse:collapse;font-size:15px;color:#1a1a1a">
      ${rows}
    </table>
  </div>
</body>
</html>`;

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to: process.env.TO_EMAIL,
      reply_to: String(email).trim(),
      subject: `New contact form submission from ${String(name).trim()}`,
      html: htmlBody,
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Resend error:', err);
    return res.status(500).json({ ok: false, message: 'Failed to send message.' });
  }
};
