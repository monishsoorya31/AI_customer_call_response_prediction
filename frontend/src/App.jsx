import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import RecordRTC from 'recordrtc';
import MicrophoneController from './components/MicrophoneController';
import EmotionDisplay from './components/EmotionDisplay';
import RecommendationPanel from './components/RecommendationPanel';
import './index.css';

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [captions, setCaptions] = useState([]);
  const [emotionData, setEmotionData] = useState({
    emotion: '',
    confidence: '',
    recommendation: 'Awaiting call start...',
  });

  const mediaRecorderRef = useRef(null);
  const captionsEndRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    captionsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [captions]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const recorder = new RecordRTC(stream, {
        type: 'audio',
        mimeType: 'audio/wav',
        recorderType: RecordRTC.StereoAudioRecorder,
        numberOfAudioChannels: 1,
        desiredSampRate: 16000
      });

      mediaRecorderRef.current = recorder;
      recorder.startRecording();
      setIsRecording(true);

      intervalRef.current = setInterval(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.getState() === "recording") {
          mediaRecorderRef.current.stopRecording(() => {
            const blob = mediaRecorderRef.current.getBlob();
            sendAudioData(blob);
            mediaRecorderRef.current.startRecording();
          });
        }
      }, 5000);

    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Microphone access is required for this app to work.");
    }
  };

  const stopRecording = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stopRecording(() => {
        const stream = mediaRecorderRef.current.stream;
        if (stream) stream.getTracks().forEach(track => track.stop());
      });
    }
    setIsRecording(false);
  };

  const sendAudioData = async (audioBlob) => {
    if (!audioBlob) return;

    setIsProcessing(true);
    const formData = new FormData();
    formData.append('audio', audioBlob, 'record.wav');

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/analyze-emotion/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data) {
        setEmotionData({
          emotion: response.data.emotion,
          confidence: response.data.confidence,
          recommendation: response.data.recommendation,
        });

        if (response.data.transcription && response.data.transcription.trim() !== '') {
          setCaptions(prev => [...prev, response.data.transcription]);
        }
      }
    } catch (error) {
      console.error("Error analyzing audio:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    /* Full-page light background */
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-6 font-sans">

      {/* Main card */}
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden flex flex-col">

        {/* Top header bar */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-3">
            {/* Logo mark */}
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-200">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4M9 11V7a3 3 0 016 0v4" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800 leading-tight">Call Intelligence</h1>
              <p className="text-xs text-slate-400 leading-tight">Real-time mood & strategy</p>
            </div>
          </div>

          {/* Status pill */}
          <div className={`flex items-center gap-2 text-sm font-medium px-4 py-1.5 rounded-full border transition-all duration-300 ${isRecording
            ? 'bg-red-50 border-red-200 text-red-600'
            : isProcessing
              ? 'bg-amber-50 border-amber-200 text-amber-600'
              : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}>
            <span className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : isProcessing ? 'bg-amber-400 animate-pulse' : 'bg-slate-300'
              }`} />
            {isRecording ? 'Recording' : isProcessing ? 'Analyzing...' : 'Idle'}
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col lg:flex-row flex-1 min-h-0">

          {/* Left: main panels */}
          <div className="flex-1 p-4 lg:p-8 flex flex-col gap-6">

            {/* Top row: Emotion + Microphone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6 hover:shadow-md transition-shadow duration-200">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Detected Emotion</p>
                <EmotionDisplay
                  emotion={emotionData.emotion}
                  confidence={emotionData.confidence}
                />
              </div>

              <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6 flex flex-col items-center justify-center hover:shadow-md transition-shadow duration-200">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Microphone</p>
                <MicrophoneController
                  isRecording={isRecording}
                  onStart={startRecording}
                  onStop={stopRecording}
                />
              </div>
            </div>

            {/* Bottom: Recommendation */}
            <div className="bg-indigo-50 rounded-2xl border border-indigo-100 p-6 hover:shadow-md transition-shadow duration-200">
              <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-4">Strategy Recommendation</p>
              <RecommendationPanel
                recommendation={emotionData.recommendation}
                emotion={emotionData.emotion}
              />
            </div>

          </div>

          {/* Right: Live Captions sidebar */}
          <div className="w-full lg:w-80 bg-slate-50 border-t lg:border-t-0 lg:border-l border-slate-100 flex flex-col max-h-[300px] lg:max-h-full">
            <div className="px-6 pt-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Live Captions</span>
                <span className="text-[10px] bg-indigo-100 text-indigo-600 font-semibold px-2 py-0.5 rounded-full">CC</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
              {captions.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-3 py-12">
                  <div className="w-12 h-12 rounded-2xl bg-slate-200 flex items-center justify-center">
                    <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                  <p className="text-sm text-slate-400 italic">Awaiting speech...</p>
                </div>
              ) : (
                captions.map((text, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-xl px-4 py-3 text-sm text-slate-700 leading-relaxed border border-slate-100 shadow-sm border-l-4 border-l-indigo-400"
                  >
                    <span className="block text-[10px] text-slate-400 mb-1 font-medium">#{idx + 1}</span>
                    {text}
                  </div>
                ))
              )}
              <div ref={captionsEndRef} />
            </div>

            {/* Caption count footer */}
            {captions.length > 0 && (
              <div className="px-6 py-3 border-t border-slate-100 text-xs text-slate-400 text-center">
                {captions.length} caption{captions.length !== 1 ? 's' : ''} captured
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;