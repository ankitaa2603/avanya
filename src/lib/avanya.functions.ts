import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const SYSTEM_PROMPT = `You are AVANYA, SBI's AI digital banking companion.
You help customers — especially elderly and first-time digital users — navigate SBI YONO confidently.

Rules:
- Reply in the user's language. If they mix Hindi and English (Hinglish), reply in Hinglish.
- Be warm, calm, and respectful. Use short sentences.
- For any "how do I…" banking query (statement, balance, FD, UPI, ATM PIN, password), give 3-5 numbered steps.
- End with a one-line reassurance like: "Aap ye easily kar sakte hain." / "You can do this."
- Never give financial advice. Never ask for OTP, PIN, CVV, or password.
- If unsure, suggest opening the in-app guided flow.
- Keep total reply under 90 words.`;

const Input = z.object({ message: z.string().min(1).max(800) });

export const askAvanya = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Input.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) {
      return { ok: false as const, reply: "AI service is not configured.", scripted: true };
    }
    try {
      const gateway = createLovableAiGatewayProvider(key);
      const { text } = await generateText({
        model: gateway("google/gemini-3-flash-preview"),
        system: SYSTEM_PROMPT,
        prompt: data.message,
      });
      return { ok: true as const, reply: text.trim(), scripted: false };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      return { ok: false as const, reply: `AI temporarily unavailable: ${message}`, scripted: true };
    }
  });