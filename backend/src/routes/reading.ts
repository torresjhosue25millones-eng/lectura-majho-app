import { Router, Request, Response } from 'express';
import { calculateChart } from '../services/astrology';
import { determineChildType } from '../services/childType';
import { enqueueEmail } from '../services/emailQueue';

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

    enqueueEmail({ email: momEmail, momName, childName, childSex, birthDate, birthTime, birthCity, birthCountry, chart, childType });

    return res.json({ success: true });
  } catch (err) {
    console.error('[LECTURA] Error inesperado:', err);
    return res.status(500).json({ error: 'Error interno inesperado al generar la lectura.' });
  }
});

export default router;
