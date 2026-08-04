import { Router, Request, Response } from 'express';
import { calculateChart } from '../services/astrology';
import { determineChildType } from '../services/childType';
import { enqueueEmail } from '../services/emailQueue';
import { verifyFormToken, markTokenUsed } from '../services/formToken';

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
  token: string;
}

router.post('/reading', async (req: Request, res: Response) => {
  try {
    const data: ReadingRequest = req.body;
    const { momName, momEmail, childName, childSex, birthDate, birthTime, birthCity, birthCountry, answers, token } = data;

    const tokenCheck = verifyFormToken(token);
    if (!tokenCheck.valid) {
      return res.status(403).json({ error: tokenCheck.reason || 'Acceso no válido. Este formulario solo está disponible para quienes ya compraron la Lectura.' });
    }

    if (!momName || !momEmail || !childName || !birthDate || !birthTime || !birthCity || !birthCountry || !answers) {
      return res.status(400).json({ error: 'Todos los campos son requeridos.' });
    }
    if (answers.length !== 12) {
      return res.status(400).json({ error: 'Se requieren exactamente 12 respuestas.' });
    }

    markTokenUsed(token);

    const [year, month, day] = birthDate.split('-').map(Number);

    let chart, childType;
    try {
      // calculateChart is now async: handles geocoding + UTC timezone conversion
      chart = await calculateChart(year, month, day, birthTime, birthCity, birthCountry);
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
