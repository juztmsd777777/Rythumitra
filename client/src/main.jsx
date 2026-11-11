import React from 'react';
import { createRoot } from 'react-dom/client';
import { Mic, Volume2, LoaderCircle, Leaf, RotateCcw } from 'lucide-react';
import './styles.css';

const API_URL = import.meta.env.VITE_API_URL || `${window.location.protocol}//${window.location.hostname}:5000`;

function App() {
  const [state, setState] = React.useState('idle');
  const [apiStatus, setApiStatus] = React.useState('checking');
  const [message, setMessage] = React.useState('మీరు చెప్పిన మాట ఇక్కడ కనిపిస్తుంది.');
  const [transcription, setTranscription] = React.useState('');
  const audioRef = React.useRef(null);
  const [audioUrl, setAudioUrl] = React.useState(null);
  const recorderRef = React.useRef(null);
  const chunksRef = React.useRef([]);
  const streamRef = React.useRef(null);
  const sessionId = React.useRef(crypto.randomUUID()).current;

  React.useEffect(() => {
    fetch(`${API_URL}/api/health`)
      .then((response) => { if (!response.ok) throw new Error(); return response.json(); })
      .then(() => setApiStatus('online'))
      .catch(() => setApiStatus('offline'));
  }, []);

  const statusText = {
    idle: 'మాట్లాడటానికి మైక్‌ను నొక్కండి',
    recording: 'వింటున్నాను... మళ్లీ నొక్కితే ఆగుతుంది',
    processing: 'ఆడియోను పంపుతున్నాను...',
    speaking: 'మీకు సమాధానం చెబుతున్నాను...'
  }[state];

  const startRecording = async () => {
    try {
      if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const options = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? { mimeType: 'audio/webm;codecs=opus' } : {};
      const recorder = new MediaRecorder(stream, options);
      chunksRef.current = [];
      recorder.ondataavailable = (event) => { if (event.data.size > 0) chunksRef.current.push(event.data); };
      recorder.onstop = uploadRecording;
      recorderRef.current = recorder;
      recorder.start();
      setMessage('మీ మాటను వింటున్నాను...');
      setState('recording');
    } catch {
      setMessage('మైక్రోఫోన్ అనుమతి అవసరం. దయచేసి అనుమతించి మళ్లీ ప్రయత్నించండి.');
      setState('error');
    }
  };

  const uploadRecording = async () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    if (!chunksRef.current.length) { setMessage('రికార్డింగ్ ఖాళీగా ఉంది. మళ్లీ ప్రయత్నించండి.'); setState('error'); return; }
    setState('processing');
    const blob = new Blob(chunksRef.current, { type: recorderRef.current.mimeType || 'audio/webm' });
    const formData = new FormData();
    formData.append('audio', blob, `rythumitra-${Date.now()}.webm`);
    formData.append('sessionId', sessionId);
    try {
      const response = await fetch(`${API_URL}/api/chat`, { method: 'POST', body: formData });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      setTranscription(result.transcription);
      setMessage(result.reply);
      if (result.audio) {
        const nextAudioUrl = `data:${result.audioMimeType || 'audio/wav'};base64,${result.audio}`;
        setAudioUrl(nextAudioUrl);
        window.setTimeout(() => audioRef.current?.play().catch(() => {}), 0);
        setState('speaking');
      } else { setAudioUrl(null); setState('completed'); }
    } catch (error) {
      setMessage(error.message || 'ఆడియోను పంపలేకపోయాం. మళ్లీ ప్రయత్నించండి.');
      setState('error');
    }
  };

  const handleMic = () => {
    if (state === 'idle' || state === 'error' || state === 'speaking' || state === 'completed') startRecording();
    else if (state === 'recording') recorderRef.current?.stop();
  };

  const icon = state === 'processing' ? <LoaderCircle className="spin" /> : state === 'speaking' ? <Volume2 /> : <Mic />;

  return <main className="app-shell">
    <header className="brand"><span className="brand-mark"><Leaf size={22} /></span><div><strong>RythuMitra</strong><span>రైతు మిత్ర</span></div></header>
    <section className="hero" aria-labelledby="welcome-title">
      <p className="eyebrow">మీ వ్యవసాయ స్నేహితుడు</p>
      <h1 id="welcome-title">నమస్కారం రైతు మిత్రా!</h1>
      <p className="intro">మీ ప్రశ్నను తెలుగులో అడగండి.<br />నేను మీకు సహాయం చేస్తాను.</p>
      <button className={`mic-button ${state}`} onClick={handleMic} disabled={state === 'processing'} aria-label={state === 'recording' ? 'రికార్డింగ్ ఆపండి' : 'మాట్లాడటం ప్రారంభించండి'}>
        <span className="mic-ring">{icon}</span>
      </button>
      <p className={`status ${state}`} aria-live="polite">{statusText}</p>
      <div className="response-box" aria-live="polite">
        {transcription && <><span className="response-label">మీరు చెప్పింది</span><p className="transcription">{transcription}</p></>}
        <span className="response-label">రైతు మిత్ర సమాధానం</span>
        <p>{message}</p>
      </div>
      {audioUrl && <><audio ref={audioRef} src={audioUrl} onEnded={() => setState('completed')} /><button className="replay" onClick={() => { audioRef.current?.play(); setState('speaking'); }}><RotateCcw size={18} /> మళ్లీ వినండి</button></>}
    </section>
    <footer><span className={`dot ${apiStatus}`} /> {apiStatus === 'online' ? 'సేవ సిద్ధంగా ఉంది' : apiStatus === 'checking' ? 'సేవను పరిశీలిస్తున్నాం...' : 'సేవకు కనెక్షన్ లేదు'}</footer>
  </main>;
}

createRoot(document.getElementById('root')).render(<App />);
