import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/generate-problems", async (req, res) => {
    try {
      const { selectedProblems, count } = req.body;
      
      const prompt = `
        다음 수학 문제들과 비슷한 유형의 문제를 ${count}개 생성해줘.
        문제는 JSON 형식으로 응답해줘.
        응답 형식: { "problems": [ { "question": "...", "answer": "...", "explanation": "..." } ] }
        
        선택된 문제들:
        ${JSON.stringify(selectedProblems)}
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              problems: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING },
                    answer: { type: Type.STRING },
                    explanation: { type: Type.STRING }
                  },
                  required: ["question", "answer", "explanation"]
                }
              }
            }
          }
        }
      });

      res.json(JSON.parse(response.text));
    } catch (error) {
      console.error("AI Generation Error:", error);
      res.status(500).json({ error: "문항 생성 중 오류가 발생했습니다." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
