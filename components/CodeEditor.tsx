
import React, { useState } from 'react';
import Editor from "https://esm.sh/@monaco-editor/react";
import { GoogleGenAI } from "@google/genai";
import { playPositiveSound, playCelebrationSound, playErrorSound } from '../services/audioService';

interface CodeEditorProps {
  code: string;
  language?: string;
  theme?: 'vs-dark' | 'light';
  onChange?: (value: string | undefined) => void;
  height?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ 
  code, 
  language = 'typescript', 
  theme = 'vs-dark', 
  onChange,
  height = "500px"
}) => {
  const [imagePrompt, setImagePrompt] = useState('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) return;
    
    setIsGenerating(true);
    setGeneratedImageUrl(null);
    playPositiveSound();

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              text: `Generate a professional high-quality image for a tech startup: ${imagePrompt}`,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: "16:9"
          }
        }
      });

      let foundImage = false;
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64EncodeString: string = part.inlineData.data;
          setGeneratedImageUrl(`data:image/png;base64,${base64EncodeString}`);
          foundImage = true;
          playCelebrationSound();
          break;
        }
      }

      if (!foundImage) {
        throw new Error("No image data in response");
      }
    } catch (error) {
      console.error("Image generation failed", error);
      playErrorSound();
      alert("فشل توليد الصورة الذكية. حاول مرة أخرى.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full rounded-[2rem] overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xl bg-slate-900 flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between px-6 py-4 bg-slate-900 border-b border-white/5 gap-4">
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          </div>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">
            {language.toUpperCase()} Core Source
          </span>
        </div>
        
        {/* Image Generation UI */}
        <div className="flex-1 max-w-lg flex items-center gap-2">
          <div className="relative flex-1">
             <input 
               type="text" 
               className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold text-white outline-none focus:border-blue-500 transition-all placeholder-slate-600"
               placeholder="وصف الصورة (AI Image Gen)..."
               value={imagePrompt}
               onChange={(e) => setImagePrompt(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && handleGenerateImage()}
             />
             <div className="absolute left-2 top-1/2 -translate-y-1/2 text-xs opacity-30">✨</div>
          </div>
          <button 
            onClick={handleGenerateImage}
            disabled={isGenerating || !imagePrompt.trim()}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg transition-all active:scale-95 disabled:opacity-30 flex items-center gap-2 shrink-0"
          >
            {isGenerating ? (
              <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>توليد 🖼️</>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 relative flex flex-col lg:flex-row">
        {/* Editor Area */}
        <div className="flex-1">
          <Editor
            height={height}
            defaultLanguage={language}
            defaultValue={code}
            theme={theme}
            onChange={onChange}
            options={{
              minimap: { enabled: true },
              folding: true,
              fontSize: 14,
              fontFamily: 'JetBrains Mono, monospace',
              lineNumbers: 'on',
              roundedSelection: true,
              scrollBeyondLastLine: false,
              readOnly: false,
              cursorStyle: 'line',
              automaticLayout: true,
              padding: { top: 20, bottom: 20 }
            }}
          />
        </div>

        {/* AI Generated Image Overlay/Panel */}
        {(generatedImageUrl || isGenerating) && (
          <div className="lg:w-80 bg-slate-950 border-r border-white/5 p-6 flex flex-col animate-fade-in">
             <div className="flex justify-between items-center mb-4">
                <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">AI Generated Vision</span>
                <button onClick={() => setGeneratedImageUrl(null)} className="text-slate-500 hover:text-white transition-colors">✕</button>
             </div>
             
             <div className="flex-1 flex flex-col justify-center gap-4">
               {isGenerating ? (
                 <div className="aspect-video bg-white/5 rounded-2xl flex flex-col items-center justify-center border border-dashed border-white/10">
                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest animate-pulse">Dreaming Visuals...</p>
                 </div>
               ) : generatedImageUrl && (
                 <div className="space-y-4">
                   <div className="group relative rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                      <img src={generatedImageUrl} alt="AI Generated" className="w-full h-auto transition-transform group-hover:scale-105" />
                      <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                   </div>
                   <button 
                     onClick={() => {
                        const link = document.createElement('a');
                        link.href = generatedImageUrl;
                        link.download = `ai-asset-${Date.now()}.png`;
                        link.click();
                     }}
                     className="w-full py-3 bg-white/5 hover:bg-white/10 text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-xl border border-white/5 transition-all"
                   >
                     تحميل الأصل (HD)
                   </button>
                 </div>
               )}
               <p className="text-[9px] text-slate-600 font-medium italic text-center">بناءً على طلبك: "{imagePrompt}"</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
