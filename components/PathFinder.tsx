
import React, { useState, useEffect, useRef } from 'react';
import { createPathFinderChat } from '../services/geminiService';
import { Chat } from "@google/genai";
import { playPositiveSound, playCelebrationSound } from '../services/audioService';

interface PathFinderProps {
  onApproved: () => void;
  onBack: () => void;
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface Decision {
  decision: 'APPROVED' | 'REJECTED';
  reason: string;
  feedback: string;
}

export const PathFinder: React.FC<PathFinderProps> = ({ onApproved, onBack }) => {
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [decision, setDecision] = useState<Decision | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Calculate progress based on user interaction count
  // Assuming roughly 4-5 exchanges for a full assessment
  const userMessageCount = messages.filter(m => m.role === 'user').length;
  const progressPercentage = Math.min((userMessageCount / 5) * 100, 95);

  useEffect(() => {
    // Initialize chat
    const chat = createPathFinderChat();
    setChatSession(chat);
    
    // Initial greeting from AI
    const startConversation = async () => {
      setIsLoading(true);
      try {
        const response = await chat.sendMessage({ message: "ابدأ المحادثة" });
        const text = response.text || "مرحباً! أنا هنا لمساعدتك في تحديد مسارك.";
        setMessages([{ role: 'model', text }]);
      } catch (error) {
        console.error("Failed to start chat", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    startConversation();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || !chatSession || isLoading) return;

    const userMsg = inputText.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInputText('');
    setIsLoading(true);
    playPositiveSound();

    try {
      const response = await chatSession.sendMessage({ message: userMsg });
      let aiText = response.text || "";

      // Check for hidden JSON decision block
      const jsonMatch = aiText.match(/```json([\s\S]*?)```/);
      let foundDecision: Decision | null = null;

      if (jsonMatch) {
        try {
          foundDecision = JSON.parse(jsonMatch[1]);
          // Remove the JSON block from the displayed text
          aiText = aiText.replace(/```json[\s\S]*?```/, '').trim();
        } catch (e) {
          console.error("Failed to parse decision JSON", e);
        }
      }

      setMessages(prev => [...prev, { role: 'model', text: aiText }]);
      
      if (foundDecision) {
        setDecision(foundDecision);
        if (foundDecision.decision === 'APPROVED') {
          playCelebrationSound();
        }
      }

    } catch (error) {
      console.error("Chat error", error);
      setMessages(prev => [...prev, { role: 'model', text: "عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (decision) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-10 text-center animate-fade-in-up border border-gray-100">
          {decision.decision === 'APPROVED' ? (
            <>
              <div className="relative w-28 h-28 mx-auto mb-8">
                 <div className="absolute inset-0 bg-green-200 rounded-full animate-ping opacity-25"></div>
                 <div className="relative w-full h-full bg-green-100 rounded-full flex items-center justify-center shadow-inner">
                    <svg className="w-14 h-14 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                 </div>
              </div>
              <h2 className="text-4xl font-extrabold text-gray-900 mb-4">تهانينا! أنت مؤهل</h2>
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">{decision.feedback}</p>
              <div className="bg-green-50 p-6 rounded-2xl text-green-800 text-sm mb-10 border border-green-100 shadow-sm">
                 <span className="font-bold block mb-2 text-lg">تحليل المستشار الذكي:</span>
                 {decision.reason}
              </div>
              <button 
                onClick={onApproved}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xl font-bold px-12 py-4 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all"
              >
                البدء في البرنامج التدريبي
              </button>
            </>
          ) : (
            <>
               <div className="w-28 h-28 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                <svg className="w-14 h-14 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">نشكر اهتمامك</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">{decision.feedback}</p>
              <div className="bg-orange-50 p-6 rounded-2xl text-orange-800 text-sm mb-10 text-right border border-orange-100">
                <strong className="block text-lg mb-2">السبب:</strong> {decision.reason}
              </div>
              <button 
                onClick={onBack}
                className="w-full sm:w-auto bg-white border-2 border-gray-200 hover:bg-gray-50 text-gray-800 font-bold px-10 py-3 rounded-xl transition-colors"
              >
                العودة للصفحة الرئيسية
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative overflow-hidden">
      {/* CSS Animations */}
      <style>{`
        @keyframes message-pop-in {
          0% { opacity: 0; transform: translateY(15px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-message-pop {
          animation: message-pop-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .bg-pattern {
          background-image: radial-gradient(#cbd5e1 1px, transparent 1px);
          background-size: 24px 24px;
        }
      `}</style>
      
      <div className="absolute inset-0 bg-pattern opacity-20 pointer-events-none"></div>

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h1 className="font-bold text-gray-900 text-lg">حدد مسارك</h1>
                <div className="flex items-center gap-2">
                   <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                   <p className="text-xs font-medium text-gray-500">المستشار الذكي متصل الآن</p>
                </div>
              </div>
            </div>
            <button onClick={onBack} className="group p-2 hover:bg-red-50 rounded-full transition-colors">
               <svg className="w-6 h-6 text-gray-400 group-hover:text-red-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
               </svg>
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-100">
                مرحلة التقييم
              </span>
              <span className="text-xs font-semibold inline-block text-indigo-600">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-indigo-100">
              <div 
                style={{ width: `${progressPercentage}%` }} 
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000 ease-out"
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 max-w-3xl mx-auto w-full relative z-10 pb-32">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'} animate-message-pop`}
            style={{ animationDelay: `${idx === messages.length - 1 ? 0 : 0}ms` }} 
          >
             <div className={`max-w-[85%] p-5 rounded-2xl shadow-sm text-lg leading-relaxed relative
               ${msg.role === 'user' 
                 ? 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-br-none shadow-md' 
                 : 'bg-white text-gray-800 rounded-bl-none border border-gray-100 shadow-sm'}
             `}>
               {msg.role === 'user' && (
                 <div className="absolute bottom-0 -right-2 w-4 h-4 bg-indigo-700 transform rotate-45 skew-x-12"></div>
               )}
               {msg.role === 'model' && (
                  <div className="absolute bottom-0 -left-2 w-4 h-4 bg-white border-b border-l border-gray-100 transform rotate-45 skew-x-12"></div>
               )}
               {msg.text}
             </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-end animate-message-pop">
            <div className="bg-white p-4 rounded-2xl rounded-bl-none shadow-sm border border-gray-100 inline-block">
               <div className="flex space-x-2 space-x-reverse items-center h-4">
                 <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                 <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                 <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
               </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-200 p-4 z-20">
        <div className="max-w-3xl mx-auto relative group">
          <input
            type="text"
            className="w-full bg-gray-100/50 border border-gray-200 rounded-2xl px-6 py-5 pr-16 focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-indigo-500 outline-none transition-all shadow-inner text-gray-800 placeholder-gray-400 text-lg"
            placeholder="اكتب إجابتك هنا..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            autoFocus
          />
          <button 
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isLoading}
            className="absolute left-3 top-3 bottom-3 aspect-square bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center justify-center transform active:scale-95"
          >
            <svg className="w-6 h-6 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <p className="text-center text-xs text-gray-400 mt-3 font-medium">
          مدعوم بواسطة Google Gemini AI • تقييم مبدئي
        </p>
      </div>
    </div>
  );
};
