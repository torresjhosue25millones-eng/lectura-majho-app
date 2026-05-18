import { Router, Request, Response } from 'express';
import { calculateChart } from '../services/astrology';
import { determineChildType } from '../services/childType';
import { generatePDF } from '../services/pdfGenerator';
import { sendEmail } from '../services/emailService';

const router = Router();

interface ReadingRequest {
  momName: string;
  momEmail: string;
  childName: string;
  childSex: string;
  birthDate: string;
  birthTime: string;
  birthCity: string;
  birthCountry: string;
  answers: number[];
}

router.post('/reading', async (req: Request, res: Response) => {
  try {
    const data: ReadingRequest = req.body;
    const { momName, momEmail, childName, childSex, birthDate, birthTime, birthCity, birthCountry, answers } = data;

    if (!momName || !momEmail || !childName || !birthDate || !birthTime || !birthCity || !birthCountry || !answers) {
      return res.status(400).json({ error: 'Todos los campos son requeridos.' });
    }
    if (answers.length !== 12) {
      return res.status(400).json({ error: 'Se requieren exactamente 12 respuestas.' });
    }

    const [year, month, day] = birthDate.split('-').map(Number);
    const [hourStr, minuteStr] = birthTime.split(':');
    const hour = Number(hourStr) + Number(minuteStr) / 60;

    let chart, childType;
    try {
      chart = calculateChart(year, month, day, hour, birthCity.toLowerCase(), birthCountry.toLowerCase());
      childType = determineChildType(answers, year);
    } catch (calcErr) {
      console.error('[LECTURA] Error calculando carta astral:', calcErr);
      return res.status(500).json({ error: 'Error al calcular la carta astral.' });
    }

    let pdfBuffer: Buffer;
    try {
      pdfBuffer = await generatePDF({ momName, childName, childSex, birthDate, birthTime, birthCity, birthCountry, chart, childType });
    } catch (pdfErr) {
      console.error('[LECTURA] Error generando PDF:', pdfErr);
      return res.status(500).json({ error: 'Error al generar el reporte PDF.' });
    }

    try {
      await sendEmail(momEmail, childName, momName, pdfBuffer);
    } catch (emailErr) {
      console.error('[LECTURA] Error enviando email:', emailErr);
      return res.status(500).json({ error: 'Error al enviar el correo. Verifica las credenciales SMTP en las variables de entorno.' });
    }

    return res.json({ success: true, message: 'Lectura generada y enviada con éxito.' });
  } catch (err) {
    console.error('[LECTURA] Error inesperado:', err);
    return res.status(500).json({ error: 'Error interno inesperado al generar la lectura.' });
  }
});

export default router;
