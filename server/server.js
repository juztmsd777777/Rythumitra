import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { AGRICULTURAL_SYSTEM_PROMPT, generateAgriculturalReply, synthesizeTelugu, transcribeAudio } from './services/sarvamService.js';
import { formatWeatherContext, getWeatherContext } from './services/weatherService.js';

const app = express();
const port = Number(process.env.PORT) || 5000;
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});
const conversations = new Map();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ success: true, service: 'RythuMitra API', phase: 2 });
});

app.post('/api/chat', upload.single('audio'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'ఆడియో రికార్డింగ్ అందలేదు.' });
  }

  const supportedTypes = ['audio/webm', 'audio/ogg', 'audio/mp4', 'audio/wav', 'audio/mpeg'];
  if (!supportedTypes.includes(req.file.mimetype)) {
    return res.status(415).json({ success: false, message: 'ఈ ఆడియో ఫార్మాట్‌కు మద్దతు లేదు.' });
  }

  try {
    const result = await transcribeAudio(req.file);
    const sessionId = String(req.body.sessionId || 'default');
    const history = conversations.get(sessionId) || [{ role: 'system', content: AGRICULTURAL_SYSTEM_PROMPT }];
    let weatherContext = null;
    try { weatherContext = await getWeatherContext(result.transcript); } catch (weatherError) { console.error('Weather lookup failed:', weatherError.message); }
    const turnMessages = weatherContext ? [...history, { role: 'system', content: formatWeatherContext(weatherContext) }] : [...history];
    turnMessages.push({ role: 'user', content: result.transcript });
    const reply = await generateAgriculturalReply(turnMessages);
    history.push({ role: 'assistant', content: reply });
    conversations.set(sessionId, [history[0], ...history.slice(-12)]);
    let audio = null;
    try { audio = await synthesizeTelugu(reply); } catch (speechError) { console.error('Voice generation failed:', speechError.message); }
    console.log(`Transcription completed for session ${req.body.sessionId || 'unknown'}`);
    return res.json({ success: true, phase: 5, transcription: result.transcript, reply, audio, audioMimeType: audio ? 'audio/wav' : null, languageCode: result.language_code, requestId: result.request_id });
  } catch (error) {
    console.error('Speech recognition failed:', error.message);
    const message = error.name === 'AbortError'
      ? 'స్పీచ్ గుర్తింపు ఆలస్యం అవుతోంది. మళ్లీ ప్రయత్నించండి.'
      : 'మీ ప్రశ్నకు సమాధానం ఇవ్వలేకపోయాం. దయచేసి మళ్లీ ప్రయత్నించండి.';
    return res.status(502).json({ success: false, message });
  }
});

app.use((error, _req, res, next) => {
  if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ success: false, message: 'రికార్డింగ్ 10 MB కంటే తక్కువగా ఉండాలి.' });
  }
  if (error) return res.status(400).json({ success: false, message: 'ఆడియోను పంపలేకపోయాం. మళ్లీ ప్రయత్నించండి.' });
  next();
});

app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'ఈ మార్గం అందుబాటులో లేదు.' });
});

app.listen(port, () => {
  console.log(`RythuMitra API listening on http://localhost:${port}`);
});
