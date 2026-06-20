import { useMemo, useState } from "react";
import {
    FaPlus,
    FaClock,
    FaHistory,
    FaPaperPlane,
    FaRegFileAlt,
    FaSearch,
    FaInfoCircle,
} from "react-icons/fa";

export default function ChatBoard() {
    // Theme
    const INK = "#0f172a";
    const TEAL = "#21c7b8";
    const LINE = "#e6edf4";
    const BG = "#f9fafb";

    const [tab, setTab] = useState("recent"); // 'recent' | 'history'
    const [input, setInput] = useState("");

    // Sidebar lists
    const recentThreads = useMemo(
        () => [
            { id: "t1", title: "Summarize the key points", date: "2024-01-20" },
            { id: "t2", title: "Extract all the names and…", date: "2024-01-19" },
            { id: "t3", title: "Translate the document", date: "2024-01-18" },
            { id: "t4", title: "Generate a table of conte…", date: "2024-01-17" },
            { id: "t5", title: "Identify main topics", date: "2024-01-16" },
        ],
        []
    );

    const history = useMemo(
        () => ({
            today: [
                { id: "h1", title: "Document Summary", sub: "Summarize the key points of the document", time: "10:24 AM" },
                { id: "h2", title: "Document Translation", sub: "Translate the document into Spanish", time: "9:15 AM" },
                { id: "h3", title: "Date Extraction", sub: "Extract all the dates from the document", time: "8:00 AM" },
            ],
            yesterday: [
                { id: "h4", title: "Action Items", sub: "Generate a list of action items from the document", time: "4:30 PM" },
                { id: "h5", title: "Entity Recognition", sub: "Identify the main entities in the document", time: "2:15 PM" },
            ],
        }),
        []
    );

    // Conversation (4 initial alternating messages)
    const [messages, setMessages] = useState([
        { id: 1, role: "ai", text: "Hi! How can I help today? Upload a file or ask anything about your document." },
    ]);

    const send = () => {
        if (!input.trim()) return;
        const userMsg = { id: Date.now(), role: "user", text: input.trim() };
        setMessages((m) => [...m, userMsg]);
        setInput("");
        // demo AI reply
        setTimeout(() => {
            setMessages((m) => [
                ...m,
                {
                    id: Date.now() + 1,
                    role: "ai",
                    text:
                        "Noted. I’ll scan the file for key points and highlight dates/names. You can upload it now.",
                },
            ]);
        }, 350);
    };

    return (
        <div className="container-fluid py-3 text-start" style={{ background: BG, minHeight: "100vh" }}>
            <style>{`
        :root { --ink:${INK}; --teal:${TEAL}; --line:${LINE}; }
        .shell{display:grid;grid-template-columns:280px 1fr;gap:18px}
        @media(max-width:992px){ .shell{grid-template-columns:1fr} }

        /* LEFT RAIL */
        .rail{background:#fff;border:1px solid var(--line);border-radius:4px;
              box-shadow:0 6px 18px rgba(2,8,23,.05);padding:16px;position:sticky;top:16px;
              height:calc(100vh - 32px);overflow:auto}
        .btn{display:flex;align-items:center;gap:8px;border:none;border-radius:3px;padding:10px 14px;font-weight:700;cursor:pointer;font-size:.95rem}
        .btn-primary{background:var(--teal);color:#fff;width:100%;justify-content:center;box-shadow:0 2px 10px rgba(33,199,184,.25)}
        .tab{display:flex;align-items:center;gap:8px;padding:10px 12px;border-radius:2px;cursor:pointer;font-weight:700;color:#334155;margin-top:6px}
        .tab.active{background:rgba(33,199,184,.10);color:var(--teal);border:1px solid var(--line)}
        .item{display:flex;align-items:center;gap:12px;padding:10px;border-radius:3px;cursor:pointer;transition:.18s}
        .item:hover{background:#f3f4f6}
        .date{font-size:.78rem;color:#6b7280}
        .docIcon{width:32px;height:32px;border:1px solid var(--line);border-radius:2px;display:grid;place-items:center;color:var(--teal);background:#ecfdf5}
        .search{display:flex;align-items:center;gap:8px;border:1px solid var(--line);border-radius:3px;padding:10px 12px;margin:12px 0}
        .search input{border:none;outline:none;flex:1;background:#fff;color:#111}

        /* RIGHT PANEL */
        .panel{display:grid;grid-template-columns:1fr 320px;gap:18px}
        @media(max-width:1200px){ .panel{grid-template-columns:1fr} }
        .card{background:#fff;border:1px solid var(--line);border-radius:4px;box-shadow:0 6px 18px rgba(2,8,23,.05)}

        /* CHAT LAYOUT */
        .chat{display:flex;flex-direction:column;height:calc(100vh - 140px)}
        .chat-head{padding:16px;border-bottom:1px solid var(--line);font-weight:900;color:var(--ink)}
        .chat-body{
          flex:1;
          overflow:auto;
          padding:18px;
          background:#fff;
        }

        /* One row per message using floats (robust against global flex rules) */
        .msg{width:100%; margin:10px 0; }
        .msg::after{content:""; display:block; clear:both;}

        .bubble{
          display:inline-block;
          max-width:70%;
          padding:10px 14px;
          border-radius:4px;
          font-size:.95rem;
          line-height:1.5;
          box-shadow:0 1px 2px rgba(0,0,0,0.08);
          word-wrap:break-word;
          white-space:pre-wrap;
        }

        /* Left = AI */
        .msg.ai .bubble{
          float:left;
          background:#ffffff;
          border:1px solid #e5e7eb;
          color:#111827;
          border-bottom-left-radius:6px;
        }
        /* Right = User */
        .msg.user .bubble{
          float:right;
          background:#dcf8c6;        /* WhatsApp green */
          border:1px solid #c5e1a5;
          color:#111827;
          border-bottom-right-radius:6px;
        }

        .chat-input{border-top:1px solid var(--line);padding:12px;display:flex;align-items:center;gap:10px;background:#fff}
        .chat-input input{
          flex:1;padding:12px 14px;border:1px solid var(--line);border-radius:3px;outline:none;
          background:#fff;color:#111;box-shadow:inset 0 0 0 1px transparent;
        }
        .chat-input input:focus{border-color:var(--teal);box-shadow:0 0 0 3px rgba(33,199,184,.15)}
        .send{background:var(--teal);color:#fff;width:42px;height:42px;border-radius:3px;display:grid;place-items:center;border:none;cursor:pointer}

        /* HELP */
        .help{padding:16px}
        .help-title{font-weight:900;color:var(--ink);font-size:1.05rem}
        .pill{padding:6px 12px;border:1px solid var(--line);border-radius:999px;font-weight:700;color:#0f172a;background:#fff;cursor:pointer;font-size:.85rem}
        .pill.active{background:var(--teal);color:#fff;border-color:transparent}

        /* HISTORY CARDS */
        .history-card{background:#fff;border:1px solid var(--line);border-radius:4px;padding:16px;box-shadow:0 4px 12px rgba(2,8,23,.05)}
        .hist-item{display:flex;align-items:center;justify-content:space-between;border:1px solid var(--line);border-radius:3px;padding:12px 14px;background:#fff;transition:.15s}
        .hist-item:hover{background:#f9fafb}
      `}</style>

            <div className="shell">
                {/* LEFT RAIL */}
                <div className="rail">
                    <button className="btn btn-primary mb-3" onClick={() => setTab("recent")}>
                        <FaPlus /> New Chat
                    </button>

                    <div className={`tab ${tab === "recent" ? "active" : ""}`} onClick={() => setTab("recent")}>
                        <FaClock /> Recent
                    </div>
                    <div className={`tab ${tab === "history" ? "active" : ""}`} onClick={() => setTab("history")}>
                        <FaHistory /> History
                    </div>

                    {tab === "recent" && (
                        <>
                            <div className="search">
                                <FaSearch color="#94a3b8" />
                                <input placeholder="Search chats…" />
                            </div>
                            <div className="d-flex flex-column gap-1">
                                {recentThreads.map((t) => (
                                    <div key={t.id} className="item">
                                        <div className="docIcon"><FaRegFileAlt size={16} /></div>
                                        <div>
                                            <div style={{ fontWeight: 800, color: INK }}>{t.title}</div>
                                            <div className="date">{t.date}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* RIGHT CONTENT */}
                {tab === "recent" ? (
                    <div className="panel">
                        {/* CHAT */}
                        <div className="card chat">
                            <div className="chat-head">Arohio AI</div>

                            <div className="chat-body">
                                {messages.map((m) => (
                                    <div key={m.id} className={`msg ${m.role}`}>
                                        <div className="bubble">{m.text}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="chat-input">
                                <input
                                    placeholder="Type a message…"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && send()}
                                />
                                <button className="send" onClick={send}>
                                    <FaPaperPlane />
                                </button>
                            </div>
                        </div>

                        {/* CONTEXTUAL HELP */}
                        <div className="card">
                            <div className="help">
                                <div className="d-flex align-items-center gap-2 mb-2">
                                    <FaInfoCircle color={TEAL} />
                                    <div className="help-title">Contextual Help</div>
                                </div>
                                <div className="d-flex gap-2 mb-3">
                                    <button className="pill active">WCAG</button>
                                    <button className="pill">SEO</button>
                                </div>
                                <div style={{ color: "#475569", fontSize: ".95rem", lineHeight: "1.55", display: "flex", flexDirection: "column", gap: "12px" }}>
                                    <p>WCAG (Web Content Accessibility Guidelines) improve access for people with disabilities. Following them helps your content be usable by more people.</p>
                                    <p>Accessible design ensures that individuals with visual, auditory, motor, or cognitive impairments can interact effectively with your product.</p>
                                    <p>Contrast ratios are vital. Use sufficient contrast between text and background colors to improve readability for users with low vision.</p>
                                    <p>Keyboard accessibility means every feature should be usable without a mouse, supporting those with mobility challenges.</p>
                                </div>
                            </div>
                        </div>

                    </div>
                ) : (
                    // HISTORY
                    <div className="d-flex flex-column gap-3">
                        <div className="history-card">
                            <div style={{ fontWeight: 900, color: INK, marginBottom: 10 }}>Today</div>
                            <div className="d-flex flex-column gap-2">
                                {history.today.map((h) => (
                                    <div key={h.id} className="hist-item">
                                        <div>
                                            <div style={{ fontWeight: 800, color: INK }}>{h.title}</div>
                                            <div style={{ color: "#64748b", fontSize: ".9rem" }}>{h.sub}</div>
                                        </div>
                                        <div style={{ color: "#94a3b8", fontWeight: 800 }}>{h.time}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="history-card">
                            <div style={{ fontWeight: 900, color: INK, marginBottom: 10 }}>Yesterday</div>
                            <div className="d-flex flex-column gap-2">
                                {history.yesterday.map((h) => (
                                    <div key={h.id} className="hist-item">
                                        <div>
                                            <div style={{ fontWeight: 800, color: INK }}>{h.title}</div>
                                            <div style={{ color: "#64748b", fontSize: ".9rem" }}>{h.sub}</div>
                                        </div>
                                        <div style={{ color: "#94a3b8", fontWeight: 800 }}>{h.time}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
