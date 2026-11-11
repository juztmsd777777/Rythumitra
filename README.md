# RythuMitra

Phase 5 adds Sarvam Bulbul Telugu speech generation, automatic browser playback, replay, and interruption support. Weather questions can now include a city or village name; the backend geocodes that place and provides Open-Meteo forecast data to the assistant. If voice generation fails, the Telugu text reply remains available.

## Run locally

Requirements: Node.js 18+.

```bash
npm install
npm run install:all
npm run dev
```

Open `http://localhost:5173`. Tap the microphone, allow microphone access, speak, and tap again. The backend transcribes the recording, generates a Telugu agricultural reply, creates Bulbul audio, and plays it automatically. Use “మళ్లీ వినండి” to replay or tap the microphone to interrupt and ask another question.

To run each part separately, use `npm run dev --prefix server` and `npm run dev --prefix client` in separate terminals. Copy `server/.env.example` to `server/.env` when backend configuration is needed; no Sarvam credentials are required in Phase 1.
