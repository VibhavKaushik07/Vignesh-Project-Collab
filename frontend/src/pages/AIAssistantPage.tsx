import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  User,
  Sparkles,
  RefreshCw,
  HelpCircle,
  BookOpen,
  Volume2,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { VoiceInputButton, VoiceSpeakButton } from '../components/VoiceButton';

interface Message {
  id?: number;
  sender: 'user' | 'assistant';
  message: string;
  sources?: string[];
  created_at?: string;
}

const DEFAULT_SUGGESTIONS = [
  'How can I prepare Jeevamrutha at home?',
  'What is the recommended pesticide dosage for Tomato Early Blight?',
  'How do yellow sticky traps work for whiteflies?',
  'What safety precautions should I take when spraying insecticides?',
  'What is the Pre-Harvest Interval (PHI) for Coragen?'
];

export const AIAssistantPage: React.FC = () => {
  const { language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      message: 'Namaste! I am your **KrishiRakshak AI Farming Assistant**.\n\nI can help you diagnose crop diseases, verify official CIBRC pesticide label instructions and safety PPE, guide organic recipes (Jeevamrutha, Neem, Panchagavya), and interpret weather spray windows.\n\nHow may I support your farm today?',
      sources: ['KrishiRakshak Knowledge Engine (ICAR / CIBRC Verified)']
    }
  ]);
  const [inputValue, setInputValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<string[]>(DEFAULT_SUGGESTIONS);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || loading) return;

    const userMsg: Message = {
      sender: 'user',
      message: text
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setLoading(true);

    try {
      const res = await api.askAssistant(text, 'default-session', language);
      const asstMsg: Message = {
        sender: 'assistant',
        message: res.response,
        sources: res.sources
      };
      setMessages((prev) => [...prev, asstMsg]);
      if (res.suggested_questions && res.suggested_questions.length > 0) {
        setSuggestions(res.suggested_questions);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          message: 'I encountered an error retrieving agricultural data. Please check your network or try asking again.',
          sources: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl flex flex-col min-h-[calc(100vh-140px)]">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-semibold mb-2">
          <Bot className="w-4 h-4 text-teal-700" />
          <span>Feature 8 & 9: KrishiRakshak AI Assistant with Voice Support</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-950">
          Intelligent Agricultural Chatbot
        </h1>
        <p className="text-xs text-gray-500 max-w-lg mx-auto mt-1">
          Grounded agronomic guidance adhering to ICAR, CIBRC, and NCOF protocols. Speak or type in English, Kannada, or Hindi.
        </p>
      </div>

      {/* Suggested Questions Pills */}
      <div className="mb-4">
        <div className="text-[11px] font-semibold text-gray-500 mb-2 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Suggested Questions:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {suggestions.slice(0, 3).map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="px-3 py-1.5 rounded-full text-xs bg-white hover:bg-emerald-50 text-gray-700 hover:text-emerald-800 border border-gray-200 transition text-left shadow-2xs"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 bg-white rounded-3xl border border-gray-200 p-4 sm:p-6 shadow-sm overflow-y-auto max-h-[550px] mb-4 space-y-4">
        {messages.map((m, idx) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={idx}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white text-xs ${
                  isUser ? 'bg-emerald-600' : 'bg-emerald-900'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-emerald-600 text-white rounded-tr-none'
                    : 'bg-gray-50 border border-gray-200 text-gray-800 rounded-tl-none space-y-2'
                }`}
              >
                <div className="whitespace-pre-line font-sans">{m.message}</div>

                {/* Sources & Read Aloud Audio for Assistant */}
                {!isUser && (
                  <div className="pt-2 border-t border-gray-200/80 flex flex-wrap items-center justify-between gap-2 text-[10px] text-gray-500">
                    {m.sources && m.sources.length > 0 && (
                      <div className="flex items-center gap-1 font-medium text-emerald-800">
                        <BookOpen className="w-3 h-3 text-emerald-600" />
                        <span>Sources: {m.sources.join(', ')}</span>
                      </div>
                    )}
                    <VoiceSpeakButton text={m.message} language={language} />
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-900 text-white flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3 text-xs text-gray-500 flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
              <span>Consulting agricultural knowledge base...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar with Voice Input */}
      <div className="bg-white p-2.5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-2">
        <VoiceInputButton
          onTranscript={(text) => setInputValue((prev) => (prev ? `${prev} ${text}` : text))}
          language={language}
        />

        <input
          type="text"
          placeholder="Ask about crop diseases, pesticide dosage, organic recipes..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 text-xs px-3 py-2.5 outline-none text-gray-800 placeholder-gray-400"
        />

        <button
          onClick={() => handleSend()}
          disabled={!inputValue.trim() || loading}
          className="p-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-xs"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
