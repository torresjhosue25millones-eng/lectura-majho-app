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

    const chart = calculateChart(year, month, day, hour, birthCity.toLowerCase(), birthCountry.toLowerCase());
    const childType = determineChildType(answers, year);

    const pdfBuffer = await generatePDF({
      momName,
      childName,
      childSex,
      birthDate,
      birthTime,
      birthCity,
      birthCountry,
      chart,
      childType,
    });

    await sendEmail(momEmail, childName, momName, pdfBuffer);

    return res.json({ success: true, message: 'Lectura generada y enviada con éxito.' });
  } catch (err) {
    console.error('Error al generar lectura:', err);
    return res.status(500).json({ error: 'Error interno al generar la lectura. Por favor intenta nuevamente.' });
  }
});

export default router;
