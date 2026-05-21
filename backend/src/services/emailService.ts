import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'majhoholistic@majhogroup.com';
const FROM_NAME = process.env.RESEND_FROM_NAME || 'Método MAJHO';

export async function sendEmail(
  to: string,
  childName: string,
  momName: string,
  pdfBuffer: Buffer
): Promise<void> {
  const { error } = await resend.emails.send({
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: [to],
    subject: `✨ La Lectura Astral de ${childName} está lista — Método MAJHO`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #FDFAF4; padding: 40px 30px; border-radius: 12px; border: 1px solid #F0E8D8;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #C9A84C; font-size: 26px; margin-bottom: 8px; letter-spacing: 2px;">✦ MÉTODO MAJHO ✦</h1>
          <p style="color: #5C8A6E; font-size: 13px; letter-spacing: 3px; text-transform: uppercase;">Lectura Astral Personalizada</p>
        </div>

        <p style="color: #3D3025; font-size: 17px; line-height: 1.7;">Querida <strong>${momName}</strong>,</p>

        <p style="color: #3D3025; font-size: 16px; line-height: 1.8; margin: 20px 0;">
          Con mucho amor y dedicación, hemos preparado la <strong>Lectura Astral Personalizada</strong> de
          <strong style="color: #5C8A6E;">${childName}</strong>. Este reporte contiene la sabiduría de los astros
          traducida en una guía práctica y amorosa para acompañar a tu hijo/a en su misión de vida.
        </p>

        <div style="background: #F0E8D8; border-left: 3px solid #C9A84C; padding: 20px 24px; border-radius: 8px; margin: 28px 0;">
          <p style="color: #5C8A6E; font-size: 15px; margin: 0; text-align: center;">📎 El reporte completo está adjunto a este correo</p>
        </div>

        <p style="color: #3D3025; font-size: 15px; line-height: 1.9;">
          En la lectura encontrarás:<br>
          ✨ Carta astral completa de ${childName}<br>
          🌙 Sol, Luna y Ascendente con sus significados<br>
          🔮 Tipo de vibración (Índigo, Cristal, Arcoíris o Diamante)<br>
          💫 Propósito de vida y misión de alma<br>
          🌿 Consejos prácticos del Método MAJHO
        </p>

        <p style="color: #3D3025; font-size: 15px; line-height: 1.8; margin-top: 24px;">
          Recuerda: este niño/a eligió nacer en este momento preciso, en este lugar, en esta familia.
          No es casualidad que seas su mamá. Eres exactamente quien necesita para cumplir su misión. 💛
        </p>

        <div style="background: #FEF3C7; border: 1px solid #D97706; border-radius: 8px; padding: 16px 20px; margin-top: 28px;">
          <p style="color: #92400E; font-size: 13px; text-align: center; margin: 0; line-height: 1.6;">
            ⚠️ Una vez recibida tu lectura, no aplican reembolsos.
          </p>
        </div>

        <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #C9A84C40; text-align: center;">
          <p style="color: #7A6A5A; font-size: 14px; font-style: italic;">Con amor y gratitud,</p>
          <p style="color: #C9A84C; font-size: 17px; font-weight: bold; margin-top: 4px; letter-spacing: 1px;">✦ El equipo del Método MAJHO ✦</p>
        </div>
      </div>
    `,
    attachments: [
      {
        filename: `Lectura-Astral-${childName.replace(/\s+/g, '-')}.pdf`,
        content: pdfBuffer.toString('base64'),
      },
    ],
  });

  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }
}
