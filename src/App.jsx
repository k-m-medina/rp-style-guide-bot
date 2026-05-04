import { useState, useRef, useEffect } from "react";

const ILLINI_BLUE = "#13294B";
const ILLINI_ORANGE = "#FF5F05";
const LIGHT_BG = "#F5F4F1";
const WHITE = "#FFFFFF";
const SIDEBAR_BG = "#0f2038";
const SIDEBAR_ACTIVE = "#1e3a5f";

const BLOCK_I = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAABQCAMAAAB7/0YbAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAFKUExURf///wAAAP/////////////////////////////////////////////////8+v/r4P/o3P/p3P/v5f/+/v/t4/9+Nv9rHP9sHP9qG/+TWf/6+f9uH/9aAf9bAf9YAP+GRf/6+P/s4P9wH/9bAv9cA/9ZAv+GRv9vIP+HRv9wIP9tHP9ZAP9aAP9cAv9XAP+FQ//17/+1jf+rfv+pev+KSf9hCv9mE/+TWP+qfv/Bof/8+//38v+4jv9iDP9bA/9oFf/Fpv/7+f/59f+LSf9aAv+cZf/9/P+lcf+7mv+lc//Fp/+mc//Ep/+mcv9cBP+lcv+7mf/49v+KSv+bZP/38/+1jv9iDf9oF//HqP+0i/+qfP+rfP+peP9gCv9mEv+SVv+qe//Bn//r3/+EQ/9vHv+FRf9+N/9sHf9tHf+TWv/s4f/p3f/v5wAAAF6s4gcAAAANdFJOUwAAr7Lr2wMLv44Ivo3FuIE+AAAAAWJLR0QB/wIt3gAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+oFARYVE6D3AlkAAAESelRYdFJhdyBwcm9maWxlIHR5cGUgOGJpbQAAOI2VU1GOhSAM/O8p9ggFgeJxxEqyH3v/3y1raot5bt6bTNQZaSm1Qm3fP/A1kDHCUlNMa2IkRkwZS6BUKp4InORa8A3ACy+9E+gQXaL+B3unOlBcKbr38hyPLDQvZdozwd2Yg9S7ir1pTWpHi7b7R7j696pHD33QanYKwruWRGXpQlswgmokjMW8DQ+h0+so38dIoha60My21WWrz3pspN5CnHkfGmZj3QdNjyDi2tmtyT0InS6VS4U5KB2D5mkfnvT5KT9pNs5H0hExDafBYRPOM3SMitm8/+9wBj1NtkKT+up082uOtDzFrK+fujU30TKI7geHX+KR8M9NpEuDAAABgklEQVRYw2PgJRMwUKCRj19AkCQgICQM1igiKiZOEpCQlAJr5JeWkSUJyMkrgDUqKimrkARU1SAa+dVJ1agxYDZqjgAbSdaoRq5GjQFLAFpy2lCgo4tbuTJMkbaePkSjgaERFBibmOK0XNnMHKbMwtIKvQSwtrG1w6HP3sERX9Hh5OyCXaOLqxta0cGEAMwsvLzuqtg12nnw8rIiqWViYEMAdg5eXk8cGlW8eHk5kdSyMSABLm5eXm9cGn14eXmQFTMwIgBIIz4beZDUMqJrxGmjAwGNvjg0+hGy0ZPaNoIDhyY24gocP7JtJDs66G8j2fFI/wQwmuRGRpLzHgFlzuBJcgOQAKhnI7EVqxd6xYpWleNLcqhVOVrjwR9X4yEAvfGA2ggJDHLBrtElGL25gsILCQ3D1UAKj5BC12gQGRUNATFBsbibZHHxCVBlUYmQJlkSyY3A5KHXmKe7jUOpNzcS+o8ppHbnUyEaRdLSM0gCYpmOkCGLrGwSQY4wZYMk5AEAsLzlZpsQElwAAAAVdEVYdHRpZmY6YWxwaGEAYXNzb2NpYXRlZGh/o/4AAAAPdEVYdHRpZmY6ZW5kaWFuAGxzYlW3F0MAAAAYdEVYdHRpZmY6cGhvdG9tZXRyaWMAcGFsZXR0ZTl5t2sAAAAWdEVYdHRpZmY6cm93cy1wZXItc3RyaXAAMTaoFYfwAAAAAElFTkSuQmCC";

const EXAMPLE_PROMPTS = [
  { label: "Naming", prompt: "EnterpriseWorks startup Cache Energy (CE) recently won a pitch competition at UIUC's Research Park." },
  { label: "AP Style", prompt: "The event runs from 8:00 a.m. - 9:00 a.m. on Sept. 3rd. Join us this morning at the Atkins Building." },
  { label: "Grammar", prompt: "Join us at UIUC's Research Park for the annual AgTech Summit in August, 2025. Additionally, we'll be announcing award winners." },
  { label: "Style question", prompt: "Can I use 'Dr.' for someone with a Ph.D.? And should I capitalize 'university' in the middle of a sentence?" },
];

// ── storage helpers (localStorage) ──────────────────────────────────────────
function loadChats() {
  try {
    const raw = localStorage.getItem("rp-style-bot-chats");
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

function saveChats(chats) {
  try {
    localStorage.setItem("rp-style-bot-chats", JSON.stringify(chats));
  } catch {}
}

// ── helpers ──────────────────────────────────────────────────────────────────
function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function truncate(str, n) {
  return str.length > n ? str.slice(0, n) + "\u2026" : str;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 640 : false
  );
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 5, alignItems: "center", padding: "14px 18px" }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: 7, height: 7, borderRadius: "50%", background: ILLINI_ORANGE,
            animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

// ── main component ────────────────────────────────────────────────────────────
export default function StyleBot() {
  const isMobile = useIsMobile();

  const [chats, setChats] = useState(() => {
    const saved = loadChats();
    if (saved && saved.length > 0) return saved;
    return [{ id: genId(), name: "New chat", messages: [] }];
  });

  const [activeChatId, setActiveChatId] = useState(() => {
    const saved = loadChats();
    return saved && saved.length > 0 ? saved[0].id : chats[0].id;
  });

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState("");

  const endRef = useRef(null);
  const taRef = useRef(null);
  const renameRef = useRef(null);

  const activeChat = chats.find((c) => c.id === activeChatId) || chats[0];
  const messages = activeChat?.messages || [];

  // Persist chats to localStorage on every change
  useEffect(() => {
    if (chats.length > 0) saveChats(chats);
  }, [chats]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (taRef.current) {
      taRef.current.style.height = "auto";
      taRef.current.style.height = Math.min(taRef.current.scrollHeight, 160) + "px";
    }
  }, [input]);

  useEffect(() => {
    if (renamingId && renameRef.current) renameRef.current.focus();
  }, [renamingId]);

  // ── chat management ─────────────────────────────────────────────────────────
  const newChat = () => {
    const chat = { id: genId(), name: "New chat", messages: [] };
    setChats((prev) => [chat, ...prev]);
    setActiveChatId(chat.id);
    setInput("");
  };

  const deleteChat = (id) => {
    setChats((prev) => {
      const next = prev.filter((c) => c.id !== id);
      if (next.length === 0) {
        const fresh = { id: genId(), name: "New chat", messages: [] };
        setActiveChatId(fresh.id);
        return [fresh];
      }
      if (activeChatId === id) setActiveChatId(next[0].id);
      return next;
    });
  };

  const startRename = (id, name) => { setRenamingId(id); setRenameValue(name); };

  const commitRename = () => {
    if (!renameValue.trim()) { setRenamingId(null); return; }
    setChats((prev) => prev.map((c) => c.id === renamingId ? { ...c, name: renameValue.trim() } : c));
    setRenamingId(null);
  };

  const updateMessages = (chatId, msgs, autoName) => {
    setChats((prev) =>
      prev.map((c) => {
        if (c.id !== chatId) return c;
        return { ...c, messages: msgs, name: c.name === "New chat" && autoName ? autoName : c.name };
      })
    );
  };

  // ── send ────────────────────────────────────────────────────────────────────
  const send = async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || loading) return;
    setInput("");
    const userMsg = { role: "user", content: trimmed };
    const nextMsgs = [...messages, userMsg];
    const autoName = truncate(trimmed, 40);
    updateMessages(activeChatId, nextMsgs, autoName);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMsgs }),
      });
      const data = await res.json();
      const reply =
        data.content?.find((b) => b.type === "text")?.text ||
        "Something went wrong. Please try again.";
      updateMessages(activeChatId, [...nextMsgs, { role: "assistant", content: reply }], autoName);
    } catch {
      updateMessages(
        activeChatId,
        [...nextMsgs, { role: "assistant", content: "Error reaching the API. Please try again." }],
        autoName
      );
    } finally {
      setLoading(false);
    }
  };

  const onKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  // ── render ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", fontFamily: "'Source Sans 3', sans-serif", background: LIGHT_BG }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700&family=Source+Sans+3:wght@300;400;600&display=swap');
        @keyframes bounce { 0%,80%,100%{transform:translateY(0);opacity:.4} 40%{transform:translateY(-5px);opacity:1} }
        .chat-item:hover { background: #1a3050 !important; }
        .chat-item:hover .chat-actions { opacity: 1 !important; }
      `}</style>

      {/* ── Header ── */}
      <div style={{
        background: ILLINI_BLUE, borderBottom: `4px solid ${ILLINI_ORANGE}`,
        padding: isMobile ? "10px 14px" : "14px 20px",
        display: "flex", alignItems: "center", gap: isMobile ? 8 : 12, flexShrink: 0, zIndex: 10,
      }}>
        <button
          onClick={() => setSidebarOpen((o) => !o)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 6, marginRight: 4, color: "#8BAAC8", display: "flex", flexDirection: "column", gap: 4, flexShrink: 0 }}
        >
          {[0,1,2].map(i => <div key={i} style={{ width: 18, height: 2, background: "#8BAAC8", borderRadius: 1 }} />)}
        </button>

        <img src={BLOCK_I} alt="Block I" style={{ height: isMobile ? 30 : 40, width: "auto", display: "block", flexShrink: 0, marginRight: isMobile ? 2 : 6 }} />

        <div style={{ overflow: "hidden" }}>
          <div style={{ color: WHITE, fontFamily: "Montserrat, sans-serif", fontSize: isMobile ? 13 : 16, fontWeight: 700, letterSpacing: "0.01em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            Research Park Style Guide Assistant
          </div>
          {!isMobile && (
            <div style={{ color: "#8BAAC8", fontSize: 11, fontFamily: "'Source Sans 3', sans-serif", marginTop: 2, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Naming Conventions · AP Style · Grammar · Spelling · & More
            </div>
          )}
        </div>

        <button
          onClick={newChat}
          style={{ marginLeft: "auto", background: ILLINI_ORANGE, border: "none", borderRadius: 4, color: WHITE, padding: isMobile ? "7px 10px" : "7px 14px", fontFamily: "Montserrat, sans-serif", fontSize: isMobile ? 16 : 12, fontWeight: 700, cursor: "pointer", flexShrink: 0, lineHeight: 1 }}
        >
          {isMobile ? "+" : "+ New Chat"}
        </button>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden", position: "relative" }}>

        {/* Mobile backdrop */}
        {isMobile && sidebarOpen && (
          <div onClick={() => setSidebarOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 15 }} />
        )}

        {/* ── Sidebar ── */}
        {sidebarOpen && (
          <div style={{
            width: 240, background: SIDEBAR_BG, display: "flex", flexDirection: "column",
            flexShrink: 0, overflowY: "auto", borderRight: "1px solid rgba(255,255,255,0.06)",
            ...(isMobile ? { position: "absolute", top: 0, left: 0, height: "100%", zIndex: 20 } : {}),
          }}>
            <div style={{ padding: "12px 10px 6px", fontSize: 10, color: "#4a6a8a", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>
              Chats
            </div>

            {chats.map((chat) => (
              <div
                key={chat.id}
                className="chat-item"
                onClick={() => { setActiveChatId(chat.id); setInput(""); if (isMobile) setSidebarOpen(false); }}
                style={{
                  padding: "9px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
                  background: chat.id === activeChatId ? SIDEBAR_ACTIVE : "transparent",
                  borderLeft: chat.id === activeChatId ? `3px solid ${ILLINI_ORANGE}` : "3px solid transparent",
                  transition: "background 0.12s",
                }}
              >
                <div style={{ color: "#8BAAC8", fontSize: 13, flexShrink: 0 }}>✦</div>

                {renamingId === chat.id ? (
                  <input
                    ref={renameRef}
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onBlur={commitRename}
                    onKeyDown={(e) => { if (e.key === "Enter") commitRename(); if (e.key === "Escape") setRenamingId(null); }}
                    onClick={(e) => e.stopPropagation()}
                    style={{ flex: 1, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 3, color: WHITE, fontSize: 13, padding: "2px 6px", outline: "none" }}
                  />
                ) : (
                  <span style={{ flex: 1, fontSize: 13, color: chat.id === activeChatId ? WHITE : "#8BAAC8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {chat.name}
                  </span>
                )}

                <div
                  className="chat-actions"
                  style={{ display: "flex", gap: 4, opacity: isMobile ? 1 : 0, transition: "opacity 0.12s", flexShrink: 0 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button title="Rename" onClick={() => startRename(chat.id, chat.name)} style={{ background: "none", border: "none", color: "#6a8aaa", cursor: "pointer", fontSize: 12, padding: 2, lineHeight: 1 }}>✎</button>
                  <button title="Delete" onClick={() => deleteChat(chat.id)} style={{ background: "none", border: "none", color: "#6a8aaa", cursor: "pointer", fontSize: 13, padding: 2, lineHeight: 1 }}>✕</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Main area ── */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "16px 12px" : "24px 20px", display: "flex", flexDirection: "column", gap: 18 }}>

            {messages.length === 0 && !loading && (
              <div style={{ margin: isMobile ? "0 auto" : "auto", textAlign: "center", maxWidth: isMobile ? "100%" : 480, padding: isMobile ? "0 4px" : 0 }}>
                <div style={{ fontSize: isMobile ? 17 : 20, color: ILLINI_BLUE, fontFamily: "Montserrat, sans-serif", fontWeight: 700, marginBottom: 10 }}>
                  Paste your copy or ask a style question
                </div>
                <div style={{ fontSize: 14, color: "#777", lineHeight: 1.7, marginBottom: 20 }}>
                  This tool checks for naming convention issues, AP Style violations, grammar errors, spelling mistakes, and more -- all based on Research Park and EnterpriseWorks style guidelines.
                </div>
                <div style={{ fontSize: 11, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10, fontWeight: 600 }}>
                  Try an example
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
                  {EXAMPLE_PROMPTS.map(({ label, prompt }) => (
                    <button
                      key={label}
                      onClick={() => send(prompt)}
                      style={{ background: WHITE, border: "1px solid #ccc", borderRadius: 4, padding: "8px 14px", fontSize: 12, color: ILLINI_BLUE, cursor: "pointer", textAlign: "left", lineHeight: 1.4, width: isMobile ? "100%" : "auto", maxWidth: isMobile ? "100%" : 210, display: "flex", flexDirection: "column", gap: 3, transition: "border-color 0.15s" }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = ILLINI_ORANGE; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#ccc"; }}
                    >
                      <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: ILLINI_ORANGE }}>{label}</span>
                      <span style={{ color: ILLINI_BLUE }}>{prompt}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", maxWidth: isMobile ? "95%" : "85%", alignSelf: m.role === "user" ? "flex-end" : "flex-start", alignItems: m.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "#999", marginBottom: 4, fontWeight: 700 }}>
                  {m.role === "user" ? "You" : "Style Assistant"}
                </div>
                <div style={{ padding: "13px 17px", borderRadius: 4, fontSize: 14, lineHeight: 1.7, whiteSpace: "pre-wrap", wordBreak: "break-word", ...(m.role === "user" ? { background: ILLINI_BLUE, color: WHITE } : { background: WHITE, color: "#222", borderLeft: `3px solid ${ILLINI_ORANGE}`, boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }) }}>
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: "flex", flexDirection: "column", maxWidth: isMobile ? "95%" : "85%", alignSelf: "flex-start", alignItems: "flex-start" }}>
                <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "#999", marginBottom: 4, fontWeight: 700 }}>Style Assistant</div>
                <div style={{ background: WHITE, borderLeft: `3px solid ${ILLINI_ORANGE}`, borderRadius: 4, boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
                  <TypingDots />
                </div>
              </div>
            )}

            <div ref={endRef} />
          </div>

          {/* Input */}
          <div style={{ flexShrink: 0, borderTop: "1px solid #ddd", background: WHITE, padding: isMobile ? "10px 12px" : "14px 20px" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-end", maxWidth: 860, margin: "0 auto" }}>
              <textarea
                ref={taRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKey}
                placeholder="Paste copy to review, or ask a style question..."
                rows={2}
                style={{ flex: 1, resize: "none", border: "1px solid #ccc", borderRadius: 4, padding: "11px 14px", fontSize: 14, lineHeight: 1.5, color: "#222", outline: "none", minHeight: 48, maxHeight: 160, overflowY: "auto", transition: "border-color 0.15s" }}
                onFocus={(e) => { e.target.style.borderColor = ILLINI_BLUE; }}
                onBlur={(e) => { e.target.style.borderColor = "#ccc"; }}
              />
              <button
                onClick={() => send()}
                disabled={!input.trim() || loading}
                style={{ background: input.trim() && !loading ? ILLINI_ORANGE : "#ccc", color: WHITE, border: "none", borderRadius: 4, padding: "12px 20px", cursor: input.trim() && !loading ? "pointer" : "not-allowed", fontSize: 14, fontWeight: 700, height: 48, whiteSpace: "nowrap", transition: "background 0.15s", flexShrink: 0 }}
              >
                Review
              </button>
            </div>
            {!isMobile && (
              <div style={{ textAlign: "center", fontSize: 11, color: "#aaa", marginTop: 7, letterSpacing: "0.02em" }}>
                Shift + Enter for new line · Enter to submit
              </div>
            )}
            <div style={{ textAlign: "center", fontSize: 11, color: "#bbb", marginTop: 6, lineHeight: 1.5 }}>
              🔒 Your chat history is saved only in your own browser -- no one else can see it.
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
