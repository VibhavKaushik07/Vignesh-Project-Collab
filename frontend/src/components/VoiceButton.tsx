import React, { useState } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  language?: string;
}

export const VoiceInputButton: React.FC<VoiceInputProps> = ({ onTranscript, language = 'en' }) => {
  const [isListening, setIsListening] = useState(false);
  const [supported, setSupported] = useState(true);

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      // Select speech recognition language
      if (language === 'kn') recognition.lang = 'kn-IN';
      else if (language === 'hi') recognition.lang = 'hi-IN';
      else recognition.lang = 'en-IN';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          onTranscript(transcript);
        }
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  if (!supported) return null;

  return (
    <button
      type="button"
      onClick={startListening}
      title={isListening ? 'Listening...' : 'Voice Input (Click to speak)'}
      className={`p-2.5 rounded-xl transition-all duration-200 flex items-center justify-center ${
        isListening
          ? 'bg-rose-500 text-white animate-pulse shadow-md ring-2 ring-rose-300'
          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
      }`}
    >
      {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
    </button>
  );
};

interface VoiceSpeakProps {
  text: string;
  language?: string;
}

export const VoiceSpeakButton: React.FC<VoiceSpeakProps> = ({ text, language = 'en' }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Strip markdown formatting for cleaner speech
    const cleanText = text
      .replace(/(\*\*|__)(.*?)\1/g, '$2')
      .replace(/(\*|_)(.*?)\1/g, '$2')
      .replace(/#+\s/g, '')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/- /g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    if (language === 'kn') utterance.lang = 'kn-IN';
    else if (language === 'hi') utterance.lang = 'hi-IN';
    else utterance.lang = 'en-IN';

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      type="button"
      onClick={speak}
      title={isSpeaking ? 'Stop audio' : 'Listen to response'}
      className={`p-1.5 rounded-lg transition-colors text-xs flex items-center gap-1 ${
        isSpeaking
          ? 'bg-emerald-600 text-white font-medium shadow-xs'
          : 'text-emerald-700 hover:bg-emerald-100 bg-emerald-50/70 border border-emerald-200'
      }`}
    >
      {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
      <span>{isSpeaking ? 'Mute' : 'Listen'}</span>
    </button>
  );
};
