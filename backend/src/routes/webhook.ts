import { Router, Request, Response } from 'express';
import { Resend } from 'resend';
import { generateFormToken } from '../services/formToken';

const router = Router();

router.post('/hotmart', async (req: Request, res: Response) => {
  try {
    // Verificar token de Hotmart
    const HOTMART_TOKEN = process.env.HOTMART_WEBHOOK_TOKEN;
    const token = req.headers['x-hotmart-webhook-token'];
    if (HOTMART_TOKEN && token !== HOTMART_TOKEN) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    const { event, data } = req.body;

    // Solo procesar compras aprobadas/completadas
    if (event !== 'PURCHASE_APPROVED' && event !== 'PURCHASE_COMPLETE') {
      return res.status(200).json({ message: 'Evento ignorado' });
    }

    const buyerEmail = data?.buyer?.email;
    const buyerName  = data?.buyer?.name;
    const transactionId = data?.purchase?.transaction || data?.transaction || `${buyerEmail}-${Date.now()}`;

    if (!buyerEmail) {
      return res.status(400).json({ error: 'Email no encontrado en el payload' });
    }

    const formToken = generateFormToken(buyerEmail, transactionId);

    const FORM_URL_BASE  = process.env.READING_FORM_URL;
    const FORM_URL       = FORM_URL_BASE ? `${FORM_URL_BASE}?token=${formToken}` : undefined;
    const FROM_EMAIL     = process.env.RESEND_FROM_EMAIL || 'majhoholistic@majhogroup.com';
    const FROM_NAME      = process.env.RESEND_FROM_NAME  || 'Método MAJHO';
    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    if (!RESEND_API_KEY) {
      console.error('[WEBHOOK] RESEND_API_KEY no configurada');
      return res.status(500).json({ error: 'Configuración de email incompleta' });
    }
    if (!FORM_URL) {
      console.error('[WEBHOOK] READING_FORM_URL no configurada');
      return res.status(500).json({ error: 'URL del formulario no configurada' });
    }

    const resend = new Resend(RESEND_API_KEY);

    const { error } = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: [buyerEmail],
      subject: '✨ Tu Lectura Astral MAJHO — Completa tu formulario',
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px; background: #FDFAF4; border-radius: 12px; border: 1px solid #F0E8D8;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #C9A84C; font-size: 26px; margin-bottom: 8px; letter-spacing: 2px;">✦ MÉTODO MAJHO ✦</h1>
            <p style="color: #5C8A6E; font-size: 13px; letter-spacing: 3px; text-transform: uppercase;">Lectura Astral Personalizada</p>
          </div>

          <p style="color: #3D3025; font-size: 17px; line-height: 1.7;">
            ¡Bienvenida, <strong>${buyerName || 'alma de luz'}</strong>!
          </p>

          <p style="color: #3D3025; font-size: 16px; line-height: 1.8; margin: 20px 0;">
            Tu compra fue confirmada. Para preparar la <strong>Lectura Astral Personalizada</strong>
            de tu hijo/a, necesito algunos datos de nacimiento.
          </p>

          <div style="text-align: center; margin: 36px 0;">
            <a href="${FORM_URL}"
               style="background: #C9A84C; color: white; padding: 16px 36px;
                      text-decoration: none; border-radius: 8px; font-size: 17px;
                      letter-spacing: 1px; display: inline-block;">
              Completar mi formulario ✨
            </a>
          </div>

          <p style="color: #7A6A5A; font-size: 14px; line-height: 1.8; text-align: center;">
            Una vez recibas el formulario, recibirás el reporte por este mismo correo en las próximas horas.
          </p>

          <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #C9A84C40; text-align: center;">
            <p style="color: #7A6A5A; font-size: 14px; font-style: italic;">Con amor y gratitud,</p>
            <p style="color: #C9A84C; font-size: 17px; font-weight: bold; margin-top: 4px; letter-spacing: 1px;">✦ El equipo del Método MAJHO ✦</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error(`[WEBHOOK] Error Resend al enviar a ${buyerEmail}:`, error);
      return res.status(500).json({ error: error.message });
    }

    console.log(`[WEBHOOK] ✓ Email de formulario enviado a ${buyerEmail}`);
    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('[WEBHOOK] Error inesperado:', err);
    return res.status(500).json({ error: 'Error interno' });
  }
});

export default router;
