// geminiService.ts
import { supabase } from "../supabase_client";

// ⭐ 使用 Vite 环境变量
const apiKey = import.meta.env.VITE_GEMINI_KEY;

if (!apiKey) {
  console.warn("⚠️ Warning: VITE_GEMINI_KEY is missing!");
}

/* -------------------------------------------------------
   🟦 SECTION 1 — 系统 Prompt（儿童情绪支持模式）
------------------------------------------------------- */
const ChildTherapySystemPrompt = `
You are a gentle, safe, emotionally supportive AI companion designed for children ages 8–12 who struggle with emotional recognition or emotional regulation.

Your responsibilities:
1. Talk kindly with the child using warm, simple, friendly language.
2. Understand their feelings—even if their expression is unclear.
3. Help them recognize and name emotions in kid-friendly ways.
4. Comfort them, validate their feelings, and be patient.
5. Ask gentle questions to understand their situation and emotions.
6. Support emotional awareness without judging or blaming.
7. Gradually guide them into a story-based emotional training scenario.
8. Never lecture or overwhelm the child.
9. Keep responses short, clear, soft, and safe.
10. Avoid complex psychological terms; use simple explanations.

Your goal is to support the child emotionally and softly lead them into story practice when they feel ready.
`.trim();

/* -------------------------------------------------------
   🟦 SECTION 2 — 导出：AI 对话
------------------------------------------------------- */
export async function getAIChatResponse(
  conversation: { role: string; content: string }[]
) {
  try {
    // 注入系统提示
    const fullConversation = [
      {
        role: "model",
        parts: [{ text: ChildTherapySystemPrompt }],
      },
      ...conversation.map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      })),
    ];

    const result = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: fullConversation,
        }),
      }
    );

    const data = await result.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

    return reply || "I'm sorry, I couldn't generate a response.";
  } catch (e) {
    console.error("Gemini API error:", e);
    return "Sorry, I encountered an error while generating a response.";
  }
}

/* -------------------------------------------------------
   🟦 SECTION 3 — 导出：本地 fallback 场景分析
------------------------------------------------------- */
export function analyzeWithFallback(context: string): string {
  const lower = context.toLowerCase();

  if (lower.includes("family") || lower.includes("parent"))
    return "family-conflict";

  if (lower.includes("work") || lower.includes("job"))
    return "workplace-feedback";

  if (lower.includes("friend") || lower.includes("trust"))
    return "friendship-betrayal";

  if (lower.includes("anxious") || lower.includes("social"))
    return "social-anxiety";

  if (lower.includes("relationship") || lower.includes("partner"))
    return "romantic-miscommunication";

  if (lower.includes("study") || lower.includes("exam"))
    return "academic-pressure";

  return "family-conflict";
}

/* -------------------------------------------------------
   🟦 SECTION 4 — 导出：从数据库推荐场景
------------------------------------------------------- */
export async function getRecommendedScenarioFromDB(
  context: string
): Promise<string> {
  try {
    const analysis = analyzeUserContext(context);

    const { data: scenarios, error } = await supabase
      .from("scenarios")
      .select("*")
      .order("created_at", { ascending: true });

    if (error || !scenarios) {
      console.error("Error fetching scenarios:", error);
      return analyzeWithFallback(context);
    }

    const best = findBestMatch(scenarios, analysis);
    return best.id;
  } catch (e) {
    console.error("Error in getRecommendedScenarioFromDB:", e);
    return analyzeWithFallback(context);
  }
}

/* -------------------------------------------------------
   🟦 SECTION 5 — 内部工具（不导出）
------------------------------------------------------- */
function analyzeUserContext(context: string) {
  const lower = context.toLowerCase();

  return {
    hasFamily: lower.includes("family") || lower.includes("parent"),
    hasWork:
      lower.includes("work") ||
      lower.includes("job") ||
      lower.includes("colleague"),
    hasFriends:
      lower.includes("friend") ||
      lower.includes("trust") ||
      lower.includes("betray"),
    hasSocialAnxiety:
      lower.includes("anxious") ||
      lower.includes("social") ||
      lower.includes("crowd"),
    hasRelationship:
      lower.includes("relationship") ||
      lower.includes("partner") ||
      lower.includes("romantic"),
    hasAcademic:
      lower.includes("study") ||
      lower.includes("exam") ||
      lower.includes("school"),
    emotions: extractEmotions(lower),
  };
}

function extractEmotions(text: string): string[] {
  const emotionKeywords: Record<string, string[]> = {
    anger: ["angry", "mad", "frustrated", "annoyed"],
    sadness: ["sad", "depressed", "unhappy", "disappointed"],
    anxiety: ["anxious", "nervous", "worried", "stressed"],
    fear: ["scared", "afraid", "fearful"],
    joy: ["happy", "excited", "joyful"],
    trust: ["trust", "betrayed", "loyal"],
    surprise: ["surprised", "shocked"],
  };

  return Object.entries(emotionKeywords).flatMap(([emotion, words]) =>
    words.some((w) => text.includes(w)) ? [emotion] : []
  );
}

function findBestMatch(scenarios: any[], analysis: any): any {
  let best = scenarios[0];
  let highest = 0;

  for (const s of scenarios) {
    let score = 0;

    if (analysis.hasFamily && s.id.includes("family")) score += 3;
    if (analysis.hasWork && s.id.includes("workplace")) score += 3;
    if (analysis.hasFriends && s.id.includes("friendship")) score += 3;
    if (analysis.hasSocialAnxiety && s.id.includes("social")) score += 3;
    if (analysis.hasRelationship && s.id.includes("romantic")) score += 3;
    if (analysis.hasAcademic && s.id.includes("academic")) score += 3;

    if (s.emotions && analysis.emotions.length > 0) {
      const match = s.emotions.filter((e: string) =>
        analysis.emotions.includes(e.toLowerCase())
      );
      score += match.length * 2;
    }

    if (
      (analysis.emotions.includes("anxiety") ||
        analysis.emotions.includes("fear")) &&
      s.difficulty === "Beginner"
    ) {
      score += 1;
    }

    if (score > highest) {
      highest = score;
      best = s;
    }
  }

  return best;
}
