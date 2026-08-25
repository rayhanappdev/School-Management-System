import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const START_PORT = Number(process.env.PORT || 3000);
  const MAX_PORT_ATTEMPTS = 10;

  const listenOnAvailablePort = (port: number, attempt = 0) => {
    const server = app.listen(port, '0.0.0.0', () => {
      console.log(`Apex School Management System running on http://0.0.0.0:${port}`);
    });

    server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE' && attempt < MAX_PORT_ATTEMPTS) {
        const nextPort = port + 1;
        console.warn(`Port ${port} is busy. Retrying on ${nextPort}...`);
        server.close();
        listenOnAvailablePort(nextPort, attempt + 1);
        return;
      }

      console.error('Failed to start server:', error);
      process.exit(1);
    });
  };

  app.use(express.json());

  // Lazy Gemini client helper
  let aiClient: GoogleGenAI | null = null;
  function getGeminiClient(): GoogleGenAI | null {
    if (!aiClient && process.env.GEMINI_API_KEY) {
      aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    return aiClient;
  }

  // API 1: AI Study / Homework Helper
  app.post('/api/ai/study-helper', async (req, res) => {
    try {
      const { prompt, subject, grade, language } = req.body;
      const ai = getGeminiClient();

      if (ai) {
        const systemInstruction = `You are the friendly, expert AI Academic Tutor for Apex International Academy.
Help the student solve academic problems with step-by-step clarity, intuitive examples, and encouraging tone.
Target Grade: ${grade || 'Grade 10'}. Subject: ${subject || 'General Science'}.
Language: ${language === 'bn' ? 'Bengali (বাংলা)' : 'English with Bengali terminology where helpful'}.
Provide structured explanations with bullet points and equations.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: prompt,
          config: {
            systemInstruction,
            temperature: 0.6,
          },
        });

        return res.json({ success: true, answer: response.text });
      }

      // Offline / Fallback Intelligent Educator response
      return res.json({
        success: true,
        answer: `[Apex Academic AI]: Here is a structured step-by-step solution for your query regarding "${prompt}":\n\n1. **Core Concept Overview**: Understanding the fundamental laws and definitions associated with ${subject || 'this topic'}.\n2. **Step-by-Step Breakdown**: Applied systematic formulas to derive the result.\n3. **Key Takeaway**: Remember to verify units and standard notations in board examinations!\n\n*(Note: For real-time live AI synthesis, connect your GEMINI_API_KEY in the workspace settings)*`,
      });
    } catch (err: any) {
      console.error('AI Study Helper Error:', err);
      res.status(500).json({
        success: false,
        error: err.message || 'Failed to process AI study request',
      });
    }
  });

  // API 2: Teacher Question Paper Generator
  app.post('/api/ai/question-maker', async (req, res) => {
    try {
      const { topic, subject, grade, questionType, count } = req.body;
      const ai = getGeminiClient();

      if (ai) {
        const systemInstruction = `You are the Senior Academic Examiner & Question Paper Author for Apex International Academy.
Create high-quality exam questions strictly following NCTB / Cambridge curriculum standards.
Subject: ${subject}, Topic: ${topic}, Grade: ${grade}, Question Type: ${questionType} (e.g. MCQ, Creative Questions CQ with stem, or Short Questions), Count: ${count || 3}.
Include answer keys and marks distributions.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: `Generate ${count || 3} ${questionType} examination questions on the topic: ${topic}.`,
          config: {
            systemInstruction,
            temperature: 0.5,
          },
        });

        return res.json({ success: true, content: response.text });
      }

      // Fallback structured template
      return res.json({
        success: true,
        content: `### 📝 Certified Examination Paper - Apex Academy\n**Subject:** ${subject} | **Grade:** ${grade} | **Topic:** ${topic}\n\n**Q1 (MCQ - 1 Mark):** What is the fundamental unit of ${topic}?\n- A) Option Alpha\n- B) Option Beta (Correct Answer)\n- C) Option Gamma\n- D) Option Delta\n\n**Q2 (Creative Question - 10 Marks):**\n*Stem:* In an institutional laboratory experiment on ${topic}...\na) Define ${topic} (1 Mark)\nb) Explain the core principle involved (2 Marks)\nc) Calculate the resultant value from the data (3 Marks)\nd) Critically evaluate the outcome based on experimental limitations (4 Marks)\n\n*(Configure GEMINI_API_KEY for dynamic customized outputs)*`,
      });
    } catch (err: any) {
      console.error('AI Question Maker Error:', err);
      res.status(500).json({
        success: false,
        error: err.message || 'Failed to generate question paper',
      });
    }
  });

  // API 3: Teacher Lesson Plan Generator
  app.post('/api/ai/lesson-planner', async (req, res) => {
    try {
      const { topic, subject, grade, duration } = req.body;
      const ai = getGeminiClient();

      if (ai) {
        const response = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: `Create a professional, modern 45-minute lesson plan for teaching ${topic} in ${subject} (${grade}). Include: 1) Learning Objectives, 2) 5-min Warm-up/Hook, 3) 20-min Concept Direct Instruction, 4) 15-min Interactive Student Group Activity, 5) 5-min Wrap-up Exit Ticket Assessment.`,
          config: {
            temperature: 0.6,
          },
        });

        return res.json({ success: true, plan: response.text });
      }

      return res.json({
        success: true,
        plan: `### 📋 45-Minute Lesson Plan: ${topic}\n**Subject:** ${subject} | **Grade:** ${grade}\n\n- **Learning Objectives**: Students will define ${topic} and solve real-world problems.\n- **00-05 min (Hook)**: Real-life demonstration & inquiry question.\n- **05-25 min (Instruction)**: Core theory, visual whiteboard diagrams, and guided examples.\n- **25-40 min (Group Activity)**: Peer problem solving & worksheet worksheet exercise.\n- **40-45 min (Exit Ticket)**: 2 quick formative questions to assess understanding.`,
      });
    } catch (err: any) {
      console.error('AI Lesson Plan Error:', err);
      res.status(500).json({
        success: false,
        error: err.message || 'Failed to generate lesson plan',
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  listenOnAvailablePort(START_PORT);
}

startServer();
