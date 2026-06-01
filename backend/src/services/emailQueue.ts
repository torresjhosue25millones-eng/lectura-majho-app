import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { generatePDF } from './pdfGenerator';
import { sendEmail } from './emailService';
import { AstralChart } from './astrology';
import { ChildTypeResult } from './childType';
import { generateChartInterpretation } from './claudeInterpreter';

const QUEUE_FILE = path.join(process.cwd(), 'pending-emails.json');

interface QueueEntry {
  id: string;
  email: string;
  momName: string;
  childName: string;
  childSex: string;
  birthDate: string;
  birthTime: string;
  birthCity: string;
  birthCountry: string;
  chart: AstralChart;
  childType: ChildTypeResult;
  scheduledAt: string;
  sendAt: string;
  sent: boolean;
}

function readQueue(): QueueEntry[] {
  try {
    if (!fs.existsSync(QUEUE_FILE)) return [];
    const raw = fs.readFileSync(QUEUE_FILE, 'utf-8');
    const data = JSON.parse(raw) as { pending: QueueEntry[] };
    return data.pending || [];
  } catch {
    return [];
  }
}

function writeQueue(entries: QueueEntry[]): void {
  fs.writeFileSync(QUEUE_FILE, JSON.stringify({ pending: entries }, null, 2), 'utf-8');
}

export function enqueueEmail(params: {
  email: string;
  momName: string;
  childName: string;
  childSex: string;
  birthDate: string;
  birthTime: string;
  birthCity: string;
  birthCountry: string;
  chart: AstralChart;
  childType: ChildTypeResult;
}): void {
  const raw = process.env.SEND_DELAY_HOURS;
  const delayHours = raw !== undefined && raw !== '' ? Number(raw) : 48;
  const scheduledAt = new Date().toISOString();
  const sendAt = new Date(Date.now() + delayHours * 60 * 60 * 1000).toISOString();

  const entry: QueueEntry = {
    id: crypto.randomUUID(),
    ...params,
    scheduledAt,
    sendAt,
    sent: false,
  };

  const entries = readQueue();
  entries.push(entry);
  writeQueue(entries);
  console.log(`[QUEUE] Encolado para ${params.email} (${params.childName}) — envío a las ${sendAt}`);
}

async function processPending(): Promise<void> {
  const entries = readQueue();
  const now = new Date();
  const due = entries.filter(e => !e.sent && new Date(e.sendAt) <= now);

  if (due.length === 0) return;
  console.log(`[QUEUE] Procesando ${due.length} correo(s) pendiente(s)...`);

  for (const entry of due) {
    try {
      // Generate Claude interpretation (null if no API key → PDF uses static text)
      const interpretation = await generateChartInterpretation(
        entry.chart, entry.childName, entry.childSex,
        entry.childType, entry.birthDate,
        (entry.chart as any).geocodedCity || entry.birthCity
      );

      const pdfBuffer = await generatePDF({
        momName: entry.momName,
        childName: entry.childName,
        childSex: entry.childSex,
        birthDate: entry.birthDate,
        birthTime: entry.birthTime,
        birthCity: entry.birthCity,
        birthCountry: entry.birthCountry,
        chart: entry.chart,
        childType: entry.childType,
        interpretation,
      });

      await sendEmail(entry.email, entry.childName, entry.momName, pdfBuffer);
      console.log(`[QUEUE] ✓ Enviado a ${entry.email} (${entry.childName})`);

      const all = readQueue();
      const idx = all.findIndex(e => e.id === entry.id);
      if (idx !== -1) {
        all[idx].sent = true;
        writeQueue(all);
      }
    } catch (err) {
      console.error(`[QUEUE] ✗ Error enviando a ${entry.email} (${entry.childName}):`, err);
    }
  }
}

export function startQueueProcessor(): void {
  processPending().catch(err => console.error('[QUEUE] Error en procesamiento inicial:', err));

  setInterval(() => {
    processPending().catch(err => console.error('[QUEUE] Error en intervalo:', err));
  }, 5 * 60 * 1000);

  console.log('[QUEUE] Procesador iniciado — revisión cada 5 minutos');
}
