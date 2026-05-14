import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export async function sendEmail(
  to: string,
  childName: string,
  momName: string,
  pdfBuffer: Buffer
): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Método MAJHO" <noreply@metodomajho.com>',
    to,
    subject: `✨ La Lectura Astral de ${childName} está lista — Método MAJHO`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #F5EFE0; padding: 40px 30px; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #7B5EA7; font-size: 28px; margin-bottom: 8px;">✦ Método MAJHO ✦</h1>
          <p style="color: #5C8A6E; font-size: 14px; letter-spacing: 2px; text-transform: uppercase;">Lectura Astral Personalizada</p>
        </div>

        <p style="color: #4a3728; font-size: 17px; line-height: 1.7;">Querida <strong>${momName}</strong>,</p>

        <p style="color: #4a3728; font-size: 16px; line-height: 1.8; margin: 20px 0;">
          Con mucho amor y dedicación, hemos preparado la <strong>Lectura Astral Personalizada</strong> de
          <strong style="color: #7B5EA7;">${childName}</strong>. Este reporte contiene la sabiduría de los astros
          traducida en una guía práctica y amorosa para acompañar a tu hijo/a en su misión de vida.
        </p>

        <div style="background: linear-gradient(135deg, #7B5EA7, #C9A84C); padding: 2px; border-radius: 10px; margin: 30px 0;">
          <div style="background: #F5EFE0; padding: 24px; border-radius: 9px; text-align: center;">
            <p style="color: #7B5EA7; font-size: 15px; margin: 0;">📎 Encontrarás el reporte completo adjunto a este correo</p>
          </div>
        </div>

        <p style="color: #4a3728; font-size: 16px; line-height: 1.8;">
          En la lectura encontrarás:<br>
          ✨ Carta astral completa de ${childName}<br>
          🌙 Sol, Luna y Ascendente con sus significados<br>
          🔮 Tipo de vibración (Índigo, Cristal, Arcoíris o Diamante)<br>
          💫 Propósito de vida y misión de alma<br>
          🌿 Consejos prácticos del Método MAJHO
        </p>

        <p style="color: #4a3728; font-size: 16px; line-height: 1.8; margin-top: 24px;">
          Recuerda: este niño/a eligió nacer en este momento preciso, en este lugar, en esta familia.
          No es casualidad que seas su mamá. Eres exactamente quien necesita para cumplir su misión. 💛
        </p>

        <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #C9A84C; text-align: center;">
          <p style="color: #7B5EA7; font-size: 15px; font-style: italic;">Con amor y gratitud,</p>
          <p style="color: #C9A84C; font-size: 18px; font-weight: bold; margin-top: 4px;">✦ El equipo del Método MAJHO ✦</p>
        </div>
      </div>
    `,
    attachments: [
      {
        filename: `Lectura-Astral-${childName.replace(/\s+/g, '-')}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  };

  await transporter.sendMail(mailOptions);
}
