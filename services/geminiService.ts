
import { GoogleGenAI, Type } from "@google/genai";
import { 
  StartupRecord, 
  PartnerProfile, 
  MatchResult,
  ApplicantProfile,
  AnalyticalQuestion,
  ProjectEvaluationResult,
  FailureSimulation,
  GovStats
} from "../types";

const callGemini = async (params: { prompt: string; systemInstruction?: string; json?: boolean; schema?: any }) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const config: any = {
    temperature: 0.3,
    topP: 0.95,
  };

  if (params.systemInstruction) {
    config.systemInstruction = params.systemInstruction;
  }

  if (params.json && params.schema) {
    config.responseMimeType = "application/json";
    config.responseSchema = params.schema;
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: params.prompt,
    config,
  });

  if (params.json) {
    try {
      return JSON.parse(response.text || "{}");
    } catch (e) {
      console.error("JSON parse failed", response.text);
      throw e;
    }
  }

  return response.text;
};

// --- Logic Training: Sudoku Puzzle Generation ---

export const generateSudokuAI = async (difficulty: 'Easy' | 'Medium' | 'Hard') => {
  const prompt = `Generate a 9x9 Sudoku puzzle of difficulty "${difficulty}".
    - Provide a 2D array where 0 represents an empty cell.
    - Ensure the puzzle is valid and has a single unique solution.
    - Easy: ~45 numbers pre-filled.
    - Medium: ~33 numbers pre-filled.
    - Hard: ~24 numbers pre-filled.`;

  return callGemini({
    prompt,
    systemInstruction: "You are a logic puzzle master. Generate Sudoku puzzles in JSON format.",
    json: true,
    schema: {
      type: Type.OBJECT,
      properties: {
        puzzle: {
          type: Type.ARRAY,
          items: {
            type: Type.ARRAY,
            items: { type: Type.NUMBER }
          }
        },
        solution: {
          type: Type.ARRAY,
          items: {
            type: Type.ARRAY,
            items: { type: Type.NUMBER }
          }
        }
      },
      required: ["puzzle", "solution"]
    }
  });
};

// --- Logo & Image Generation Engine (Gemini 2.5 Flash Image) ---

export const generateLogoAI = async (description: string, industry: string, style: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Create a professional, modern, and minimalist business logo. 
    Project Description: ${description}. 
    Industry: ${industry}. 
    Style Preference: ${style}.
    The logo should be on a clean white background, scalable, and suitable for a tech startup website.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: [{ text: prompt }],
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      }
    }
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No image was generated.");
};

export const improveLogoAI = async (base64Image: string, mimeType: string, instructions: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const base64Data = base64Image.split(',')[1] || base64Image;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType,
          },
        },
        {
          text: `Improve this logo based on these instructions: ${instructions}. 
          Keep the core brand identity but make it look more professional, modern, and polished. 
          Return only the improved logo image on a clean background.`,
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      }
    }
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }
  throw new Error("Logo improvement failed.");
};

// --- الموجه التعليمي: توليد المادة العلمية واختبارات الفهم ---

export const generateLevelMaterial = async (levelId: number, levelTitle: string, userContext: any) => {
  const prompt = `
    أنت موجه ريادي (Executive Coach) في مسرعة أعمال نخبوية عالمية. 
    المشروع: ${userContext.startupName}.
    القطاع: ${userContext.industry}.
    المرحلة الحالية: ${levelTitle}.
    
    المطلوب: توليد "إيجاز استراتيجي" (Strategic Briefing) مكثف جداً ومهني.
    يجب أن تكون اللغة قوية، مباشرة، وتركز على بناء ميزة تنافسية مستدامة.
    
    الهيكل المطلوب (JSON):
    1. philosophy: عبارة فلسفية عميقة عن المرحلة (سطر واحد).
    2. insight: رؤية نقدية (Critical Insight) لهذا القطاع بالتحديد في هذه المرحلة.
    3. axes: (4 محاور) كل محور يحتوي على (title، description احترافي، icon تقني).
    4. tactical_steps: (3 خطوات) تكتيكية فورية للتنفيذ.
    5. expertTip: نصيحة "ذهبية" غير تقليدية للمؤسس.
  `;

  return callGemini({
    prompt,
    systemInstruction: "أنت خبير في بناء الشركات الناشئة وتصميم المحتوى التعليمي المركز. قدم مادة علمية احترافية باللغة العربية بتنسيق JSON.",
    json: true,
    schema: {
      type: Type.OBJECT,
      properties: {
        philosophy: { type: Type.STRING },
        insight: { type: Type.STRING },
        axes: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              icon: { type: Type.STRING }
            },
            required: ["title", "description", "icon"]
          }
        },
        tactical_steps: { type: Type.ARRAY, items: { type: Type.STRING } },
        expertTip: { type: Type.STRING }
      },
      required: ["philosophy", "insight", "axes", "tactical_steps", "expertTip"]
    }
  });
};

export const generateLevelQuiz = async (levelId: number, levelTitle: string) => {
  const prompt = `ولد اختباراً "سيناريوهياً" (Scenario-based) من 3 أسئلة معقدة لمرحلة: ${levelTitle}.
    يجب أن تضع الأسئلة المستخدم في موقف "صناعة قرار" صعب بدلاً من مجرد أسئلة معرفية.`;
    
  return callGemini({
    prompt,
    systemInstruction: "ولد أسئلة اختيار من متعدد ذكية تقيس القدرة الاستراتيجية والحكم المهني بتنسيق JSON باللغة العربية.",
    json: true,
    schema: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          options: { type: Type.ARRAY, items: { type: Type.STRING } },
          correctIndex: { type: Type.NUMBER },
          explanation: { type: Type.STRING }
        },
        required: ["question", "options", "correctIndex", "explanation"]
      }
    }
  });
};

export const askMentorAboutLevel = async (question: string, levelTitle: string, material: any) => {
  const prompt = `
    أنا في مرحلة: ${levelTitle}.
    لقد درست المادة التالية: ${JSON.stringify(material)}.
    سؤالي هو: "${question}"
    
    أجبني كمرشد ريادي خبير (Senior Partner) باختصار شديد وذكاء.
  `;
  return callGemini({
    prompt,
    systemInstruction: "أنت شريك إداري في صندوق استثمار جريء ومرشد ريادي. أجب على استفسارات رواد الأعمال بدقة وعمق ريادي."
  });
};

export const runPartnerMatchAI = async (startup: StartupRecord, partners: PartnerProfile[]): Promise<MatchResult[]> => {
  const prompt = `Match startup ${startup.name} with top partners.`;
  return callGemini({ prompt, json: true, schema: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, name: { type: Type.STRING }, role: { type: Type.STRING }, avatar: { type: Type.STRING }, partnerUid: { type: Type.STRING }, scores: { type: Type.OBJECT, properties: { roleFit: { type: Type.NUMBER }, experienceFit: { type: Type.NUMBER }, industryFit: { type: Type.NUMBER }, styleFit: { type: Type.NUMBER } } }, totalScore: { type: Type.NUMBER }, reason: { type: Type.STRING }, reasoning: { type: Type.ARRAY, items: { type: Type.STRING } }, risk: { type: Type.STRING } } } } });
};

export const runSmartMatchingAlgorithmAI = async (startup: StartupRecord, partners: PartnerProfile[]): Promise<MatchResult[]> => runPartnerMatchAI(startup, partners);

export const reviewDeliverableAI = async (title: string, desc: string, context: string) => {
  const prompt = `Review Deliverable: ${title}\nContext: ${context}`;
  return callGemini({ prompt, systemInstruction: "Review the deliverable and return a score and feedback.", json: true, schema: { type: Type.OBJECT, properties: { readinessScore: { type: Type.NUMBER }, criticalFeedback: { type: Type.STRING }, suggestedNextSteps: { type: Type.ARRAY, items: { type: Type.STRING } }, isReadyForHumanMentor: { type: Type.BOOLEAN } } } });
};

export const discoverOpportunities = async (name: string, desc: string, industry: string) => {
  const prompt = `Project: ${name}, Industry: ${industry}. Suggest blue ocean ideas.`;
  return callGemini({ prompt, json: true, schema: { type: Type.OBJECT, properties: { newMarkets: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { region: { type: Type.STRING }, reasoning: { type: Type.STRING }, potentialROI: { type: Type.STRING } } } }, blueOceanIdea: { type: Type.STRING } } } });
};

export const generateAnalyticalQuestions = async (profile: ApplicantProfile): Promise<AnalyticalQuestion[]> => {
  const prompt = `Generate 5 analytical questions for a ${profile.sector} startup.`;
  return callGemini({ prompt, json: true, schema: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { text: { type: Type.STRING }, options: { type: Type.ARRAY, items: { type: Type.STRING } }, correctIndex: { type: Type.NUMBER }, difficulty: { type: Type.STRING } } } } });
};

export const evaluateProjectIdea = async (text: string, profile: ApplicantProfile): Promise<ProjectEvaluationResult> => {
  const prompt = `Evaluate this idea: ${text}.`;
  return callGemini({ prompt, json: true, schema: { type: Type.OBJECT, properties: { totalScore: { type: Type.NUMBER }, classification: { type: Type.STRING }, clarity: { type: Type.NUMBER }, value: { type: Type.NUMBER }, innovation: { type: Type.NUMBER }, market: { type: Type.NUMBER }, readiness: { type: Type.NUMBER }, strengths: { type: Type.ARRAY, items: { type: Type.STRING } }, weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } }, aiOpinion: { type: Type.STRING } } } });
};

export const evaluateNominationForm = async (data: any) => ({ aiScore: 15, redFlags: [], aiAnalysis: "Success" });
export const simulateBrutalTruth = async (data: any): Promise<FailureSimulation> => ({ brutalTruth: "Hard truth", probability: 40, financialLoss: "High", operationalImpact: "Med", missingQuestions: [], recoveryPlan: [] });
export const getGovInsights = async (): Promise<GovStats> => ({ riskyMarkets: [], readySectors: [], commonFailReasons: [], regulatoryGaps: [] });
export const createPathFinderChat = () => { const ai = new GoogleGenAI({ apiKey: process.env.API_KEY }); return ai.chats.create({ model: "gemini-3-flash-preview", config: { systemInstruction: "Advisor" } }); };
export const evaluateTemplateAI = async (title: string, data: any) => ({ score: 85, feedback: "Excellent", approved: true });

export const runProjectAgents = async (name: string, desc: string, agents: string[]) => {
  const prompt = `
    Build a comprehensive startup profile for "${name}". 
    Project Description: ${desc}. 
    Focus on Vision, Market, and Users. 
    Also provide 5 core business hypotheses that need validation.
  `;
  return callGemini({ 
    prompt, 
    json: true, 
    schema: { 
      type: Type.OBJECT, 
      properties: { 
        vision: { type: Type.STRING }, 
        market: { type: Type.STRING }, 
        users: { type: Type.STRING }, 
        hypotheses: { type: Type.ARRAY, items: { type: Type.STRING } } 
      },
      required: ["vision", "market", "users", "hypotheses"]
    } 
  }); 
};

export const generatePitchDeck = async (name: string, desc: string, context: any) => {
  const prompt = `
    Generate a detailed 10-slide Pitch Deck for the startup "${name}".
    Description: ${desc}.
    Contextual Insights: ${JSON.stringify(context)}.
    
    The deck should follow this structure:
    1. Title Slide: Strong opening.
    2. Problem: The gap in the market.
    3. Solution: How "${name}" fixes it.
    4. Unique Value Proposition (UVP): Why you are the best choice.
    5. Target Market: Specific segments and size.
    6. Business Model: How you make money.
    7. Competitive Differentiation: What makes you uncopyable.
    8. Roadmap: Key milestones for the next 12 months.
    9. Financial Potential: Big picture revenue goals.
    10. Call to Action: The ask.

    Focus on "Unique Value Proposition" and "Market Differentiation". Be professional, detailed, and persuasive.
  `;

  return callGemini({
    prompt,
    systemInstruction: "أنت خبير استثمار جريء (VC) ومستشار عروض تقديمية. صغ محتوى شرائح عرض تقديمي احترافي باللغة العربية.",
    json: true,
    schema: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: { type: Type.STRING }
        },
        required: ["title", "content"]
      }
    }
  });
};

export const analyzeExportOpportunity = async (data: any) => ({ decision: "EXPORT_NOW", analysis: { demand: "High", regulations: "Clear", risks: "Low", seasonality: "Stable" }, recommendations: [] });
export const generateStartupIdea = async (form: any) => "Idea content";
export const generateFounderCV = async (form: any) => "CV content";
export const generateProductSpecs = async (form: any) => "Specs content";
export const generateLeanBusinessPlan = async (form: any) => "Plan content";
export const generatePitchDeckOutline = async (form: any) => ({ slides: [] });
export const suggestIconsForLevels = async (ctx: any) => ({ suggestions: [] });
