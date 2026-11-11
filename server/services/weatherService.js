const WEATHER_WORDS = /\b(?:weather|forecast|temperature|rain|rains|climate|today|tomorrow|will it|how is|what is|in|at)\b|వాతావరణం|వర్షం|ఉష్ణోగ్రత|ఎండ|చలి|ఈరోజు|రేపు|లో|లోని|కు/gi;
const WEATHER_INTENT = /weather|forecast|temperature|rain|rains|climate|వాతావరణం|వర్షం|ఉష్ణోగ్రత|ఎండ|చలి|ఈరోజు|రేపు|today|tomorrow/i;
const TELUGU_PLACE_ALIASES = {
  'హైదరాబాద్': 'Hyderabad', 'హైదరాబాదు': 'Hyderabad', 'వరంగల్': 'Warangal', 'విజయవాడ': 'Vijayawada',
  'విశాఖపట్నం': 'Visakhapatnam', 'విశాఖ': 'Visakhapatnam', 'గుంటూరు': 'Guntur', 'తిరుపతి': 'Tirupati',
  'నిజామాబాద్': 'Nizamabad', 'కరీంనగర్': 'Karimnagar', 'ఖమ్మం': 'Khammam', 'నెల్లూరు': 'Nellore',
  'కర్నూలు': 'Kurnool', 'రాజమండ్రి': 'Rajahmundry', 'ఏలూరు': 'Eluru', 'అనంతపురం': 'Anantapur'
};

function cleanLocationQuery(text) {
  return text.replace(WEATHER_WORDS, ' ').replace(/[^\p{L}\p{N}\s-]/gu, ' ').replace(/\s+/g, ' ').trim();
}

function locationCandidates(text) {
  const candidates = [];
  for (const [telugu, english] of Object.entries(TELUGU_PLACE_ALIASES)) {
    if (text.includes(telugu)) candidates.push(english);
  }
  const englishMatch = text.match(/(?:weather|forecast|temperature|rain|rains|climate).*?(?:in|at|for)\s+(.+?)(?:\?|\.|$)/i);
  if (englishMatch?.[1]) candidates.push(englishMatch[1].trim());
  const cleaned = cleanLocationQuery(text);
  if (cleaned) candidates.push(cleaned);
  const words = cleaned.split(/\s+/).filter(Boolean);
  for (let count = Math.min(3, words.length); count >= 1; count -= 1) candidates.push(words.slice(-count).join(' '));
  return [...new Set(candidates)].filter((candidate) => candidate.length >= 2);
}

async function fetchJson(url, timeoutMs = 10000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url.toString(), { signal: controller.signal });
    if (!response.ok) throw new Error(`Weather service returned ${response.status}.`);
    return response.json();
  } finally { clearTimeout(timeout); }
}

export async function getWeatherContext(question) {
  if (!WEATHER_INTENT.test(question)) return null;
  let place = null;
  for (const locationQuery of locationCandidates(question)) {
    const geocodeUrl = new URL('https://geocoding-api.open-meteo.com/v1/search');
    geocodeUrl.search = new URLSearchParams({ name: locationQuery, count: '1', language: 'en', format: 'json' });
    const geocodeResult = await fetchJson(geocodeUrl);
    place = geocodeResult?.results?.[0];
    if (place) break;
  }
  if (!place) return null;

  const forecastUrl = new URL('https://api.open-meteo.com/v1/forecast');
  forecastUrl.search = new URLSearchParams({
    latitude: String(place.latitude), longitude: String(place.longitude),
    current: 'temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code,wind_speed_10m',
    daily: 'temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code',
    forecast_days: '3', timezone: 'auto'
  });
  const weather = await fetchJson(forecastUrl);
  return { place: `${place.name}, ${place.admin1 || place.country}`, timezone: weather.timezone, current: weather.current, daily: weather.daily };
}

export function formatWeatherContext(weather) {
  if (!weather) return '';
  return `Verified weather data from Open-Meteo for ${weather.place} (timezone ${weather.timezone}): ${JSON.stringify(weather)}. Use this data only for weather answers. Mention that conditions are forecast data and avoid claiming certainty.`;
}
