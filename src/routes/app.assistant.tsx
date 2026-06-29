import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { askAvanya } from "@/lib/avanya.functions";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/app/assistant")({
  component: AssistantPage,
});

type Msg = { role: "user" | "assistant"; text: string; scripted?: boolean };

const SAMPLE_PROMPTS = [
  "Mujhe statement download karna hai",
  "Mera balance kitna hai?",
  "ATM PIN reset karna hai",
  "How do I start a Fixed Deposit?",
];

const SCRIPTED_FALLBACK: Record<string, string> = {
  statement:
    "Bilkul, main aapko statement download karne mein guide karti hoon — 4 simple steps mein:\n\n1. Accounts par tap karein\n2. Apna Savings Account chunein\n3. Statement period chunein (last 1 month)\n4. PDF download karein\n\nAap ye easily kar sakte hain. Kya main aapke liye Guided Flow open karoon?",
  balance:
    "Aapka available balance dashboard par dikh raha hai. Voice se bhi pucha ja sakta hai — bas mic dabaiye aur kahein 'balance dikhao'.",
  pin: "ATM PIN reset karna safe aur asaan hai:\n\n1. Cards section par jaayein\n2. Apna debit card chunein\n3. 'Reset PIN' tap karein\n4. OTP verify karein aur naya PIN set karein\n\nKabhi bhi apna PIN kisi ke saath share na karein.",
  fd: "Starting a Fixed Deposit takes 3 steps:\n\n1. Open Deposits → New FD\n2. Choose amount and tenure (6–60 months)\n3. Confirm with your YONO MPIN\n\nCurrent rate for 6 months is around 7.1% — you can do this in under a minute.",
};

function pickScripted(q: string): string {
  const t = q.toLowerCase();
  if (t.includes("statement") || t.includes("passbook")) return SCRIPTED_FALLBACK.statement;
  if (t.includes("balance")) return SCRIPTED_FALLBACK.balance;
  if (t.includes("pin")) return SCRIPTED_FALLBACK.pin;
  if (t.includes("fd") || t.includes("fixed deposit") || t.includes("deposit")) return SCRIPTED_FALLBACK.fd;
  return "Main aapki madad ke liye yahaan hoon. Aap mujhse balance, statement, FD, UPI, ya PIN ke baare mein puch sakte hain.";
}

function shouldOfferStatementFlow(q: string) {
  const t = q.toLowerCase();
  return t.includes("statement") || t.includes("passbook");
}

export default function AssistantPage() {
  const router = useRouter();
  const { demoMode } = useStore();
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      text: "Namaste 🙏 Main AVANYA hoon. Aap mujhse Hindi, English, ya Hinglish mein puch sakte hain. Try: 'Mujhe statement download karna hai.'",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [offerFlow, setOfferFlow] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const demoFired = useRef(false);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = useCallback(
    async (raw: string) => {
      const text = raw.trim();
      if (!text || loading) return;
      setInput("");
      setMessages((m) => [...m, { role: "user", text }]);
      setLoading(true);
      try {
        const res = await askAvanya({ data: { message: text } });
        const reply = res.ok ? res.reply : pickScripted(text);
        setMessages((m) => [...m, { role: "assistant", text: reply, scripted: !res.ok }]);
        if (shouldOfferStatementFlow(text)) setOfferFlow(true);
        try {
          if (typeof window !== "undefined" && "speechSynthesis" in window) {
            const u = new SpeechSynthesisUtterance(reply.replace(/\n+/g, " "));
            u.rate = 1;
            u.pitch = 1;
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(u);
          }
        } catch {
          /* tts optional */
        }
      } catch {
        const reply = pickScripted(text);
        setMessages((m) => [...m, { role: "assistant", text: reply, scripted: true }]);
        if (shouldOfferStatementFlow(text)) setOfferFlow(true);
      } finally {
        setLoading(false);
      }
    },
    [loading]
  );

  // Judge demo auto-play
  useEffect(() => {
    if (!demoMode || demoFired.current) return;
    demoFired.current = true;
    const t = setTimeout(() => send("Mujhe statement download karna hai"), 1100);
    return () => clearTimeout(t);
  }, [demoMode, send]);

  useEffect(() => {
    if (!demoMode || !offerFlow) return;
    const t = setTimeout(() => router.navigate({ to: "/app/statement" }), 3500);
    return () => clearTimeout(t);
  }, [demoMode, offerFlow, router]);

  function toggleMic() {
    const SR =
      (typeof window !== "undefined" &&
        ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)) ||
      null;
    if (!SR) {
      alert("Voice input is not supported in this browser. Please use the text input.");
      return;
    }
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const r = new SR();
    r.lang = "en-IN";
    r.interimResults = true;
    r.continuous = false;
    r.onresult = (e: any) => {
      const transcript = Array.from(e.results)
        .map((x: any) => x[0].transcript)
        .join("");
      setInput(transcript);
    };
    r.onerror = () => setListening(false);
    r.onend = () => {
      setListening(false);
      setTimeout(() => {
        setInput((cur) => {
          if (cur.trim()) void send(cur);
          return cur;
        });
      }, 200);
    };
    recognitionRef.current = r;
    setListening(true);
    r.start();
  }

  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-6">
      <section className="rounded-2xl border border-border bg-card shadow-card overflow-hidden flex flex-col min-h-[70dvh]">
        <header className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-full bg-brand text-brand-foreground font-bold flex items-center justify-center">A</div>
            <div>
              <div className="font-semibold leading-tight">AVANYA</div>
              <div className="text-xs text-muted-foreground">AI Digital Banking Companion</div>
            </div>
          </div>
          <span className="text-[11px] uppercase tracking-wider text-success font-medium flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-success" /> Online
          </span>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={"flex " + (m.role === "user" ? "justify-end" : "justify-start gap-2")}>
              {m.role === "assistant" && (
                <div className="size-7 rounded-full bg-brand-soft text-brand text-xs font-bold flex items-center justify-center shrink-0">
                  A
                </div>
              )}
              <div
                className={
                  "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap " +
                  (m.role === "user"
                    ? "bg-brand text-brand-foreground rounded-tr-sm"
                    : "bg-muted text-foreground rounded-tl-sm")
                }
              >
                {m.text}
                {m.scripted && (
                  <div className="mt-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                    Scripted fallback
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-2 items-center">
              <div className="size-7 rounded-full bg-brand-soft text-brand text-xs font-bold flex items-center justify-center">A</div>
              <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1">
                <span className="size-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="size-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "120ms" }} />
                <span className="size-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "240ms" }} />
              </div>
            </div>
          )}
          {offerFlow && (
            <div className="rounded-2xl border border-brand/30 bg-brand-soft p-4 flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-medium text-foreground">Open Guided Statement Flow</div>
                <div className="text-xs text-muted-foreground">Main aapko har step pe button highlight karke dikhaungi.</div>
              </div>
              <button
                type="button"
                onClick={() => router.navigate({ to: "/app/statement" })}
                className="shrink-0 inline-flex h-9 items-center px-4 rounded-lg bg-brand text-brand-foreground text-sm font-medium hover:opacity-90"
              >
                Open flow →
              </button>
            </div>
          )}
        </div>

        <form
          className="px-4 py-4 border-t border-border bg-card"
          onSubmit={(e) => {
            e.preventDefault();
            void send(input);
          }}
        >
          <div className="flex items-end gap-2">
            <button
              type="button"
              onClick={toggleMic}
              aria-label={listening ? "Stop listening" : "Start voice input"}
              className={
                "shrink-0 size-12 rounded-full flex items-center justify-center transition-all " +
                (listening
                  ? "bg-destructive text-white animate-pulse ring-4 ring-destructive/20"
                  : "bg-brand text-brand-foreground hover:opacity-90")
              }
            >
              <MicIcon />
            </button>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send(input);
                }
              }}
              rows={1}
              placeholder={listening ? "Listening…" : "Type or speak your question…"}
              className="flex-1 resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="shrink-0 h-12 px-4 rounded-xl bg-foreground text-background text-sm font-medium disabled:opacity-40"
            >
              Send
            </button>
          </div>
        </form>
      </section>

      <aside className="space-y-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <div className="text-xs font-medium uppercase tracking-[0.14em] text-brand">Try saying</div>
          <div className="mt-3 space-y-2">
            {SAMPLE_PROMPTS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => void send(p)}
                className="w-full text-left rounded-lg border border-border bg-background hover:bg-brand-soft hover:border-brand/30 px-3.5 py-2.5 text-sm transition-colors"
              >
                "{p}"
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card text-sm">
          <div className="text-xs font-medium uppercase tracking-[0.14em] text-brand">Responsible AI</div>
          <ul className="mt-3 space-y-2 text-muted-foreground">
            <li>• Mic only activates on your tap (consent-led).</li>
            <li>• AVANYA never asks for OTP, PIN, CVV, or password.</li>
            <li>• Voice is not stored. Transcripts stay on-device.</li>
            <li>• A human agent is one tap away if needed.</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}

function MicIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="9" y="3" width="6" height="12" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0" />
      <line x1="12" y1="18" x2="12" y2="22" />
      <line x1="9" y1="22" x2="15" y2="22" />
    </svg>
  );
}