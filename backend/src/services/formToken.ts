import crypto from 'node:crypto';

/**
 * Tokens firmados de un solo uso para el formulario de Lectura.
 * Se generan cuando Hotmart confirma una compra (ver routes/webhook.ts)
 * y se exigen para poder enviar el formulario (ver routes/reading.ts).
 * Así, nadie puede llenar el formulario sin haber pagado antes.
 */

const SECRET = process.env.TOKEN_SECRET || 'cambia-esto-en-railway-variables';
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 días para llenar el formulario

// Tokens ya usados, para que el mismo link no se pueda enviar dos veces.
// Vive en memoria: se reinicia si el servidor reinicia, pero eso solo
// afecta la reutilización del MISMO link, no la protección principal
// (que nadie sin comprar pueda generar un token válido).
const usedTokens = new Set<string>();

function sign(payload: string): string {
  return crypto.createHmac('sha256', SECRET).update(payload).digest('hex');
}

export function generateFormToken(email: string, transactionId: string): string {
  const payload = `${email}|${transactionId}|${Date.now()}`;
  const payloadB64 = Buffer.from(payload).toString('base64url');
  const sig = sign(payloadB64);
  return `${payloadB64}.${sig}`;
}

export interface TokenCheckResult {
  valid: boolean;
  reason?: string;
  email?: string;
  transactionId?: string;
}

export function verifyFormToken(token: string | undefined): TokenCheckResult {
  if (!token) return { valid: false, reason: 'Falta el token de acceso.' };

  const [payloadB64, sig] = token.split('.');
  if (!payloadB64 || !sig) return { valid: false, reason: 'Token con formato inválido.' };

  const expectedSig = sign(payloadB64);
  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return { valid: false, reason: 'Token inválido o adulterado.' };
  }

  let payload: string;
  try {
    payload = Buffer.from(payloadB64, 'base64url').toString('utf-8');
  } catch {
    return { valid: false, reason: 'Token corrupto.' };
  }

  const [email, transactionId, tsStr] = payload.split('|');
  const ts = Number(tsStr);
  if (!email || !transactionId || !ts) return { valid: false, reason: 'Token incompleto.' };

  if (Date.now() - ts > MAX_AGE_MS) {
    return { valid: false, reason: 'Este enlace ya venció. Escríbenos para reenviarlo.' };
  }

  if (usedTokens.has(token)) {
    return { valid: false, reason: 'Este enlace ya fue usado para generar una lectura.' };
  }

  return { valid: true, email, transactionId };
}

export function markTokenUsed(token: string): void {
  usedTokens.add(token);
}
