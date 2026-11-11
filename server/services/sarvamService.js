const baseUrl = process.env.SARVAM_BASE_URL || 'https://api.sarvam.ai';

export const AGRICULTURAL_SYSTEM_PROMPT = `You are RythuMitra, a friendly AI agricultural assistant designed for Indian farmers.

Your primary language is Telugu. Understand agricultural questions and respond in simple, natural Telugu. Keep responses short and easy to understand. Give practical, actionable guidance and ask a follow-up question when important information is missing. Be polite, patient and supportive.

Never invent weather conditions, mandi prices or government scheme information. Never provide unsupported pesticide or fertilizer dosages. For potentially dangerous crop treatments, explain that the farmer should verify the crop, pest, product label and recommended dosage with a qualified agricultural expert. If uncertain, clearly say so. Never pretend to be a certified agricultural expert.

Always respond in Telugu unless the farmer explicitly requests another language.`;

export async function transcribeAudio(file) {
  if (!process.env.SARVAM_API_KEY) {
    throw new Error('SARVAM_API_KEY is not configured.');
  }

  const form = new FormData();
  form.append('file', new Blob([file.buffer], { type: file.mimetype }), file.originalname);
  form.append('model', 'saaras:v4');
  form.append('language_code', 'te-IN');
  form.append('mode', 'transcribe');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);

  try {
    const response = await fetch(`${baseUrl}/speech-to-text`, {
      method: 'POST',
      headers: { 'api-subscription-key': process.env.SARVAM_API_KEY },
      body: form,
      signal: controller.signal
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      const apiMessage = result?.error?.message || result?.message;
      throw new Error(apiMessage || `Sarvam request failed with status ${response.status}.`);
    }
    if (!result.transcript) throw new Error('Sarvam returned an empty transcription.');
    return result;
  } finally {
    clearTimeout(timeout);
  }
}

export async function generateAgriculturalReply(messages) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45_000);
  try {
    const response = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-subscription-key': process.env.SARVAM_API_KEY
      },
      body: JSON.stringify({
        model: 'sarvam-105b-conversations',
        messages,
        temperature: 0.3,
        max_tokens: 300
      }),
      signal: controller.signal
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      const apiMessage = result?.error?.message || result?.message;
      throw new Error(apiMessage || `Sarvam chat request failed with status ${response.status}.`);
    }
    const reply = result?.choices?.[0]?.message?.content?.trim();
    if (!reply) throw new Error('Sarvam returned an empty reply.');
    return reply;
  } finally {
    clearTimeout(timeout);
  }
}

export async function synthesizeTelugu(text) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45_000);
  try {
    const response = await fetch(`${baseUrl}/text-to-speech`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'api-subscription-key': process.env.SARVAM_API_KEY },
      body: JSON.stringify({ text, language_code: 'te-IN', model: 'bulbul:v3', speaker: 'shubh', pace: 0.85, speech_sample_rate: 24000, output_audio_codec: 'wav' }),
      signal: controller.signal
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result?.error?.message || result?.message || `Sarvam speech request failed with status ${response.status}.`);
    if (!result?.audios?.[0]) throw new Error('Sarvam returned no audio.');
    return result.audios[0];
  } finally { clearTimeout(timeout); }
}
