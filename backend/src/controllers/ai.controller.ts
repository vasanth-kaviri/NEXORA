import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/appResponse';
import { logger } from '../utils/logger';

// --- Server-Side Secure AI Chat Mentor ---------------------------------------
export const chatWithMentor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, context = 'General Engineering', history = [] } = req.body;
    if (!message || !message.trim()) {
      res.status(400).json(sendError('Message is required.', 400));
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

    if (apiKey) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [
                    {
                      text: `You are NEXORA AI, a world-class engineering mentor, technical career strategist, and coding interview expert.
Current user track/context: ${context}.
User query: ${message}`,
                    },
                  ],
                },
              ],
            }),
          }
        );

        if (response.ok) {
          const data = await response.json() as any;
          const candidateText =
            data.candidates?.[0]?.content?.parts?.[0]?.text ||
            'I have analyzed your query and prepared your engineering roadmap recommendation.';
          res.status(200).json(sendSuccess({ reply: candidateText }, 'AI reply generated successfully.'));
          return;
        }
      } catch (geminiErr: any) {
        logger.warn('[AIController] Gemini API call fallback:', geminiErr?.message || geminiErr);
      }
    }

    // Intelligent local fallback mentor if Gemini key is unset or rate limited
    const lower = message.toLowerCase();
    let reply = `As your NEXORA Career Mentor for **${context}**, here is an architectural breakdown of your inquiry:\n\n`;

    if (lower.includes('interview') || lower.includes('prepare') || lower.includes('dsa')) {
      reply += `1. **Technical Depth**: Focus on core invariants (time/space complexity, trade-offs).\n2. **STAR Articulation**: Frame behavioral answers with Situation, Task, Action, and Quantifiable Results.\n3. **Proctoring Readiness**: Take a test in the **Mock Interview Lab** to evaluate your live verbal delivery and gaze tracking under pressure.`;
    } else if (lower.includes('resume') || lower.includes('ats')) {
      reply += `1. **Keyword Density**: Ensure your technical skills section matches modern industry taxonomy.\n2. **Action Verbs**: Begin bullet points with strong verbs ("Architected", "Reduced p99 latency by 40%").\n3. **Validation**: Run your resume through the **Resume Analyzer** to benchmark your ATS match score.`;
    } else if (lower.includes('roadmap') || lower.includes('learn')) {
      reply += `1. Follow your **DAG Career Roadmap** node by node.\n2. Complete active sprint objectives to unlock advanced nodes.\n3. Build full-stack capstone projects and join cohort study rooms in **Peer Learning**.`;
    } else {
      reply += `To excel in this area, master the foundational system design patterns, prioritize write/read path optimizations, and validate your code through automated integration testing. What specific implementation trade-off would you like to explore next?`;
    }

    res.status(200).json(sendSuccess({ reply }, 'AI reply generated.'));
  } catch (err: any) {
    logger.error('[AIController] Error handling chat:', err?.message || err);
    res.status(500).json(sendError('Failed to generate AI mentor response.', 500));
  }
};
