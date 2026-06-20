import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function ChatModule() {
  const teal = "#21c7b8";
  const navigate = useNavigate();

  const token =
    localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");

  const userRaw =
    localStorage.getItem("auth_user") || sessionStorage.getItem("auth_user");

  let parsedUser = null;
  try {
    parsedUser = userRaw ? JSON.parse(userRaw) : null;
  } catch {
    parsedUser = null;
  }
  const userId = parsedUser?.id || null;

  const suggestions = [
    "How to create WCAG-compliant alt text?",
    "How to convert a PDF into alt text?",
    "How to generate multilingual alt text?",
  ];

  const predefinedReplies = {
    "How to create WCAG-compliant alt text?": [
      "Upload your images or provide their URLs.",
      "Arohio analyses content and generates WCAG-compliant alt text.",
      "You can review, edit if needed, and export the results.",
    ],
    "How to convert a PDF into alt text?": [
      "Upload your PDF to Arohio.",
      "The system extracts all images and lets you select which ones to include.",
      "Alt text is generated automatically and can be refined or regenerated.",
    ],
    "How to generate multilingual alt text?": [
      "Select target languages from the list.",
      "Arohio translates alt text using accessibility-optimised rules.",
      "Preview and export in your preferred format.",
    ],
  };

  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [showIntro, setShowIntro] = useState(true);
  const [activeSuggestion, setActiveSuggestion] = useState("");
  const scrollRef = useRef(null);
  const lastMsgRef = useRef(null);

  useEffect(() => {
    if (lastMsgRef.current)
      lastMsgRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  async function askBackend(text) {
    const API_BASE = import.meta.env.VITE_API_BASE;
    const r = await fetch(`${API_BASE}/ai/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: text,
        user_id: userId,
        model: "llama3:latest",
        system: "You are an accessibility assistant.",
      }),
    });
    const data = await r.json();
    if (!r.ok || !data.ok) throw new Error(data.detail || "AI error");
    return data.reply;
  }

  function ensureLoggedIn() {
    if (!token || !userId) {
      toast.dismiss();
      toast.custom(
        (t) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 14px",
              minWidth: 320,
              background: "#fff",
              color: "#0f172a",
              borderRadius: 12,
              border: "1px solid rgba(0,0,0,0.08)",
              boxShadow:
                "0 10px 25px rgba(0,0,0,0.1), 0 3px 8px rgba(0,0,0,0.06)",
              transform: t.visible ? "translateY(0)" : "translateY(-6px)",
              opacity: t.visible ? 1 : 0,
              transition: "transform .18s ease, opacity .18s ease",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                background: "rgba(33,199,184,0.15)",
                border: "1px solid rgba(33,199,184,0.3)",
              }}
            >
              <svg width="16" height="16" fill={teal} viewBox="0 0 24 24">
                <path d="M12 2a10 10 0 00-10 10v5a3 3 0 003 3h14a3 3 0 003-3v-5A10 10 0 0012 2zM8 17v-5a4 4 0 018 0v5H8z" />
              </svg>
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>
                Please log in to use the AI chat feature.
              </div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>
                Authentication is required to continue.
              </div>
            </div>
          </div>
        ),
        { id: "chat-auth-toast", duration: 3500 }
      );
      navigate("/login", { replace: true });
      return false;
    }
    return true;
  }

  const handleSuggestion = async (q) => {
    if (!ensureLoggedIn()) return;
    setShowIntro(false);
    setActiveSuggestion(q);
    const ts = Date.now();
    const loadingId = ts + Math.random();
    setMessages((prev) => [
      ...prev,
      { id: ts + Math.random(), role: "user", content: q, ts },
      { id: loadingId, role: "assistant-loading", content: null, ts },
    ]);
    try {
      const ai = await askBackend(q);
      const steps = ai.split(/\r?\n/).filter((s) => s.trim());
      setMessages((prev) =>
        prev.map((m) =>
          m.id === loadingId
            ? { ...m, role: "assistant-steps", content: steps }
            : m
        )
      );
    } catch {
      const steps = predefinedReplies[q] || ["Please try again later."];
      setMessages((prev) =>
        prev.map((m) =>
          m.id === loadingId
            ? { ...m, role: "assistant-steps", content: steps }
            : m
        )
      );
    } finally {
      setActiveSuggestion("");
    }
  };

  const send = (e) => {
    e.preventDefault();
    if (!msg.trim()) return;
    if (!ensureLoggedIn()) return;
    setShowIntro(false);
    const text = msg.trim();
    setMsg("");
    const ts = Date.now();
    const loadingId = ts + Math.random();
    setMessages((prev) => [
      ...prev,
      { id: ts + Math.random(), role: "user", content: text, ts },
      { id: loadingId, role: "assistant-loading", content: null, ts },
    ]);
    (async () => {
      try {
        const reply = await askBackend(text);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === loadingId
              ? { ...m, role: "assistant", content: reply }
              : m
          )
        );
      } catch (err) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === loadingId
              ? { ...m, role: "assistant", content: "Error: " + err.message }
              : m
          )
        );
      }
    })();
  };

  function timeStr(t) {
    const d = new Date(t || Date.now());
    const h = d.getHours().toString().padStart(2, "0");
    const m = d.getMinutes().toString().padStart(2, "0");
    return `${h}:${m}`;
  }

  return (
    <div className="h-100 d-flex flex-column" style={{ background: "#fff" }}>
      <style>{`
        .chat-scroll { 
          flex: 1 1 auto; 
          overflow-y: auto; 
          min-height: 0; 
          max-height: 70vh; 
          scrollbar-width: thin; 
          scrollbar-color: #cbd5e1 #f8fafc; 
        }
        .chat-scroll::-webkit-scrollbar { width: 8px; }
        .chat-scroll::-webkit-scrollbar-track { background: #f8fafc; border-radius: 10px; }
        .chat-scroll::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; transition: background-color 0.3s ease; }
        .chat-scroll::-webkit-scrollbar-thumb:hover { background-color: #94a3b8; }
        .chat-scroll::-webkit-scrollbar { opacity: 0; }
        .chat-scroll:hover::-webkit-scrollbar { opacity: 1; }
        .chat-list { display: flex; flex-direction: column; gap: 6px; padding: 12px; }
        .row { display: flex; width: 100%; margin: 4px 0; }
        .row.user { justify-content: flex-end; padding-right: 8px; }
        .row.assistant { justify-content: flex-start; padding-left: 8px; }
        .bubble { position: relative; display: inline-block; max-width: 82%; min-width: 140px; border-radius: 16px; padding: 10px 12px; font-size: 14px; line-height: 1.5; word-break: break-word; overflow-wrap: anywhere; white-space: pre-wrap; margin: 0 4px; }
        .bubble-user { background: #d6f5ee; color: #0f766e; border: 1px solid #b8efe4; }
        .bubble-assistant { background: #f1f4f9; color: #111827; border: 1px solid #e6eaf2; }
        .row.user .bubble:after { content: ""; position: absolute; right: -6px; bottom: 8px; border-width: 8px 0 8px 8px; border-style: solid; border-color: transparent transparent transparent #d6f5ee; filter: drop-shadow(0 0 0 #b8efe4); }
        .row.assistant .bubble:after { content: ""; position: absolute; left: -6px; bottom: 8px; border-width: 8px 8px 8px 0; border-style: solid; border-color: transparent #f1f4f9 transparent transparent; filter: drop-shadow(0 0 0 #e6eaf2); }
        .meta { font-size: 11px; color: #6b7280; margin-top: 2px; }
        .row.user .meta { text-align: right; padding-right: 6px; }
        .row.assistant .meta { text-align: left; padding-left: 6px; }
        .steps { margin: 0; padding-left: 18px; list-style: disc; }
        .steps li { margin: 6px 0; }
        .typing { display: inline-flex; gap: 4px; align-items: center; }
        .dot { width: 8px; height: 8px; border-radius: 50%; background: ${teal}; animation: bounce 1.1s infinite ease-in-out; }
        .dot:nth-child(2) { animation-delay: .15s; }
        .dot:nth-child(3) { animation-delay: .3s; }
        @keyframes bounce { 0%,80%,100%{transform:translateY(0);opacity:.6}40%{transform:translateY(-5px);opacity:1} }
        .suggestion-btn:hover { border-color: ${teal}; box-shadow: 0 2px 8px rgba(0,0,0,.06); }
        .suggestion-btn.active { border-color: ${teal}; background: #eef7f6; color: #0f766e; transform: translateY(-1px); }
        .composer { border: 1px solid #e5e7eb; border-radius: 12px; padding: 6px; }
      `}</style>

      <div className="chat-scroll" ref={scrollRef}>
        {showIntro && (
          <div className="p-3" style={{ borderBottom: "1px solid rgba(0,0,0,.06)" }}>
            <div style={{ background: "#f6f8fb", borderRadius: 12, padding: "12px 14px", fontSize: 14, color: "#1f2937" }}>
              <strong style={{ display: "block", marginBottom: 4 }}>Hi! I’m Arohio, your AI accessibility assistant</strong>
              How can I help you today?
            </div>
            <div className="mt-4 mb-2" style={{ fontSize: 14, textAlign: "left", color: "#374151" }}>Common questions are:</div>
            <div className="d-flex flex-column gap-2">
              {suggestions.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSuggestion(q)}
                  className={`text-start suggestion-btn ${activeSuggestion === q ? "active" : ""}`}
                  style={{ borderRadius: 9999, padding: "10px 14px", border: "1px solid #e5e7eb", background: "#fff", color: "#111827", fontSize: 14, transition: "all .15s ease", display: "flex", alignItems: "center", gap: 8 }}
                >
                  {activeSuggestion === q && (
                    <span className="typing" style={{ marginRight: 4 }}>
                      <span className="dot" /><span className="dot" /><span className="dot" />
                    </span>
                  )}
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="chat-list">
          {messages.map((m, idx) => {
            const isLast = idx === messages.length - 1;
            if (m.role === "user") {
              return (
                <div key={m.id} className="row user" ref={isLast ? lastMsgRef : null}>
                  <div className="bubble bubble-user">{m.content}</div>
                  <div className="meta">{timeStr(m.ts)}</div>
                </div>
              );
            }
            if (m.role === "assistant") {
              return (
                <div key={m.id} className="row assistant" ref={isLast ? lastMsgRef : null}>
                  <div className="bubble bubble-assistant">{m.content}</div>
                  <div className="meta">{timeStr(m.ts)}</div>
                </div>
              );
            }
            if (m.role === "assistant-loading") {
              return (
                <div key={m.id} className="row assistant" ref={isLast ? lastMsgRef : null}>
                  <div className="bubble bubble-assistant" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <span className="dot" /><span className="dot" /><span className="dot" />
                  </div>
                  <div className="meta">{timeStr(m.ts)}</div>
                </div>
              );
            }
            if (m.role === "assistant-steps") {
              return (
                <div key={m.id} className="row assistant" ref={isLast ? lastMsgRef : null}>
                  <div className="bubble bubble-assistant">
                    <ul className="steps">
                      {m.content.map((step, i) => (<li key={i}>{step}</li>))}
                    </ul>
                  </div>
                  <div className="meta">{timeStr(m.ts)}</div>
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>

      <div className="px-3 pt-2 pb-2" style={{ borderTop: "1px solid rgba(0,0,0,.06)", background: "#fff" }}>
        <form onSubmit={send}>
          <div className="d-flex align-items-center composer">
            <input
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Type your message..."
              className="form-control border-0"
              style={{ fontSize: 14, boxShadow: "none", outline: "none" }}
            />
            <button
              type="submit"
              aria-label="Send"
              style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 40, height: 36, borderRadius: 10, border: "none", background: "#eef7f6", color: teal, marginLeft: 6 }}
              onMouseDown={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
            </button>
          </div>
        </form>
        <div className="mt-2 text-center" style={{ fontSize: 12, color: "#6b7280" }}>
          Responses are AI-generated by Arohio’s Virtual Assistant.
        </div>
      </div>
    </div>
  );
}
