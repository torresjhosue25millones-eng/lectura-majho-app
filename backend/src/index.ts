import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import readingRoutes from './routes/reading';
import { startQueueProcessor } from './services/emailQueue';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '10mb' }));

app.use('/api', readingRoutes);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Serve React frontend in production
const publicDir = path.join(__dirname, '../../public');
app.use(express.static(publicDir));
app.get('*', (_req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor MAJHO corriendo en http://localhost:${PORT}`);
  startQueueProcessor();
});
