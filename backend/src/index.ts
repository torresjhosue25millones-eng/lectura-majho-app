import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import readingRoutes from './routes/reading';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '10mb' }));

app.use('/api', readingRoutes);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Servidor MAJHO corriendo en http://localhost:${PORT}`);
});
