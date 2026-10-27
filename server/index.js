import 'dotenv/config';
import dotenv from 'dotenv';
import express from 'express';
import { rateLimit } from 'express-rate-limit';
import { GoogleGenAI } from '@google/genai';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

dotenv.config({ path: '.env.local' });

const app = express();
const port = Number(process.env.PORT) || 3001;
const staticDirectory = resolve(dirname(fileURLToPath(import.meta.url)), '../dist');

app.use(express.json({ limit: '20kb' }));
app.use('/api/tutor', rateLimit({
  windowMs: 60_000,
  limit: 20,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({ error: 'Too many tutor requests. Please wait a minute and try again.' });
  },
}));

app.post('/api/tutor', async (req, res) => {
  const { message, history } = req.body ?? {};

  if (typeof message !== 'string' || !message.trim() || message.length > 4000) {
    res.status(400).json({ error: 'Enter a message between 1 and 4,000 characters.' });
    return;
  }

  if (
    history !== undefined &&
    (!Array.isArray(history) ||
      history.length > 12 ||
      history.some((entry) =>
        !entry ||
        !['user', 'model'].includes(entry.role) ||
        typeof entry.text !== 'string' ||
        !entry.text.trim() ||
        entry.text.length > 4000
      ))
  ) {
    res.status(400).json({ error: 'Chat history is invalid. Start a new conversation and try again.' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(503).json({ error: 'Gemini is not configured. Add GEMINI_API_KEY to .env.local and restart the server.' });
    return;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        ...(history ?? []).map(({ role, text }) => ({
          role,
          parts: [{ text }],
        })),
        { role: 'user', parts: [{ text: message.trim() }] },
      ],
      config: {
        systemInstruction: 'You are LearnXAI, a friendly and accurate tutor who can explain concepts across any subject, including science, math, technology, history, language, and everyday topics. Answer the learner’s actual question directly, explain ideas clearly, adapt to their level, and use concise examples. Do not assume the question is about Java or programming unless the learner asks about them.',
        maxOutputTokens: 1024,
        temperature: 0.7,
      },
    });

    const text = response.text?.trim();
    if (!text) {
      res.status(502).json({ error: 'Gemini returned an empty response. Please try asking again.' });
      return;
    }

    res.json({ text });
  } catch (error) {
    const status = typeof error === 'object' && error !== null && 'status' in error &&
      typeof error.status === 'number' ? error.status : 502;
    console.error('Gemini tutor request failed:', {
      status,
      message: error instanceof Error ? error.message : 'Unknown Gemini API error',
    });
    res.status(status >= 400 && status < 600 ? status : 502).json({
      error: status === 503
        ? 'Gemini is temporarily unavailable. Please try again shortly.'
        : status === 429
          ? 'Gemini rate limit reached. Please wait a moment and try again.'
          : `Gemini could not answer right now (HTTP ${status}). Please try again.`,
    });
  }
});

app.use(express.static(staticDirectory));
app.use((req, res, next) => {
  if (req.method !== 'GET' || req.path.startsWith('/api/')) {
    next();
    return;
  }

  res.sendFile(resolve(staticDirectory, 'index.html'), (error) => {
    if (error) next(error);
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`LearnXAI API server listening on port ${port}`);
});
