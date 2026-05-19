import { useState, useRef, useEffect } from "react";

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const SYSTEM_PROMPT = `You are CareerAI, an expert career counselling assistant for Pakistani university students. 
Help them with career guidance, skill development advice, job market insights for Pakistan, 
CV/resume tips, interview preparation, salary expectations in Pakistan, and guidance about their chosen career paths. 
Be encouraging, practical, and concise. Use bullet points when listing things. Always end with a motivating line.`;

const SUGGESTIONS = [
  "What careers suit a CS student in Pakistan?",
  "How do I prepare for my first job interview?",
  "What skills are in demand in Pakistan's tech market?",
  "How much do software engineers earn in Pakistan?",
  "How do I write a good CV as a fresh graduate?",
  "Should I freelance or do a 9-5 job?",
];

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello Sabtain! 👋 I'm **CareerAI**, your personal career counsellor.\n\nI can help you with career paths, skill advice, job market insights in Pakistan, CV tips, and much more.\n\nWhat would you like to know today? 🎯",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const msgText = text || input;
    if (!msgText.trim() || loading) return;

    setShowSuggestions(false);
    const userMsg = { role: "user", content: msgText };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(`${API}/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...updatedMessages,
          ],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessages((prev) => [...prev, {
          role: "assistant",
          content: `⚠️ Error ${response.status}: ${data?.error || data?.message || "AI service failed. Please check backend logs."}`,
        }]);
        setLoading(false);
        return;
      }

      const reply = data?.choices?.[0]?.message?.content || data?.response || data?.output || "No response received.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);

    } catch (err) {
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: `⚠️ Network Error: ${err.message}. Check your internet connection.`,
      }]);
    }

    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{
      role: "assistant",
      content: "Chat cleared! 🔄 How can I help you today?",
    }]);
    setShowSuggestions(true);
  };

  const formatMessage = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0c29 0%, #1a1a3e 50%, #0f0c29 100%)",
      fontFamily: "'Segoe UI', sans-serif",
      display: "flex",
      flexDirection: "column",
    }}>

      {/* Header */}
      <div style={{
        padding: "1.5rem 2rem",
        background: "rgba(255,255,255,0.03)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: "linear-gradient(135deg, #7F77DD, #a855f7)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, boxShadow: "0 4px 20px rgba(127,119,221,0.4)",
          }}>🤖</div>
          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 18 }}>AI Career Counsellor</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#1D9E75", animation: "pulse 2s infinite" }} />
              <span style={{ color: "#1D9E75", fontSize: 12, fontWeight: 500 }}>Online • Powered by Mistral AI</span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={clearChat} style={{
            padding: "8px 16px", borderRadius: 10,
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
            color: "#aaa", fontSize: 13, cursor: "pointer", fontWeight: 500,
            transition: "all 0.2s",
          }}
            onMouseEnter={e => e.target.style.background = "rgba(255,255,255,0.12)"}
            onMouseLeave={e => e.target.style.background = "rgba(255,255,255,0.06)"}
          >
            🔄 Clear Chat
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "1.5rem 2rem",
        maxWidth: 860,
        width: "100%",
        margin: "0 auto",
        boxSizing: "border-box",
      }}>

        {/* Messages */}
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: "flex",
            justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            marginBottom: 16,
            animation: "fadeSlideIn 0.3s ease",
          }}>
            {msg.role === "assistant" && (
              <div style={{
                width: 34, height: 34, borderRadius: 10,
                background: "linear-gradient(135deg, #7F77DD, #a855f7)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, marginRight: 10, flexShrink: 0, marginTop: 4,
              }}>🤖</div>
            )}

            <div style={{
              maxWidth: "72%",
              padding: "12px 16px",
              borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              background: msg.role === "user"
                ? "linear-gradient(135deg, #7F77DD, #6C63FF)"
                : "rgba(255,255,255,0.06)",
              color: "#fff",
              fontSize: 14,
              lineHeight: 1.7,
              boxShadow: msg.role === "user"
                ? "0 4px 20px rgba(127,119,221,0.3)"
                : "0 2px 10px rgba(0,0,0,0.2)",
              border: msg.role === "assistant" ? "1px solid rgba(255,255,255,0.08)" : "none",
            }}
              dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
            />

            {msg.role === "user" && (
              <div style={{
                width: 34, height: 34, borderRadius: 10,
                background: "linear-gradient(135deg, #1D9E75, #10b981)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, marginLeft: 10, flexShrink: 0, marginTop: 4,
                fontWeight: 700, color: "#fff",
              }}>SA</div>
            )}
          </div>
        ))}

        {/* Loading */}
        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: "linear-gradient(135deg, #7F77DD, #a855f7)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
            }}>🤖</div>
            <div style={{
              padding: "12px 18px",
              background: "rgba(255,255,255,0.06)",
              borderRadius: "18px 18px 18px 4px",
              border: "1px solid rgba(255,255,255,0.08)",
              display: "flex", gap: 5, alignItems: "center",
            }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: "#7F77DD",
                  animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                }} />
              ))}
            </div>
          </div>
        )}

        {/* Suggestions */}
        {showSuggestions && messages.length === 1 && (
          <div style={{ marginTop: 24 }}>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>
              💡 Suggested Questions
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {SUGGESTIONS.map((s, i) => (
                <button key={i} onClick={() => sendMessage(s)} style={{
                  padding: "10px 14px",
                  background: "rgba(127,119,221,0.08)",
                  border: "1px solid rgba(127,119,221,0.2)",
                  borderRadius: 10, color: "#c4c0f0",
                  fontSize: 13, cursor: "pointer", textAlign: "left",
                  transition: "all 0.2s", lineHeight: 1.4,
                }}
                  onMouseEnter={e => { e.target.style.background = "rgba(127,119,221,0.18)"; e.target.style.borderColor = "rgba(127,119,221,0.4)"; }}
                  onMouseLeave={e => { e.target.style.background = "rgba(127,119,221,0.08)"; e.target.style.borderColor = "rgba(127,119,221,0.2)"; }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div style={{
        padding: "1rem 2rem 1.5rem",
        background: "rgba(255,255,255,0.02)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(10px)",
      }}>
        <div style={{
          maxWidth: 860, margin: "0 auto",
          display: "flex", gap: 10, alignItems: "flex-end",
        }}>
          <div style={{ flex: 1, position: "relative" }}>
            <textarea
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask about careers, skills, jobs in Pakistan... (Enter to send)"
              style={{
                width: "100%", padding: "14px 16px",
                borderRadius: 14,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#fff", fontSize: 14,
                resize: "none", fontFamily: "inherit",
                outline: "none", boxSizing: "border-box",
                transition: "border-color 0.2s",
                lineHeight: 1.6,
              }}
              onFocus={e => e.target.style.borderColor = "rgba(127,119,221,0.6)"}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.12)"}
            />
          </div>
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            style={{
              padding: "14px 22px",
              borderRadius: 14,
              background: loading || !input.trim()
                ? "rgba(127,119,221,0.3)"
                : "linear-gradient(135deg, #7F77DD, #6C63FF)",
              color: "#fff", border: "none",
              fontWeight: 700, fontSize: 14,
              cursor: loading || !input.trim() ? "not-allowed" : "pointer",
              boxShadow: loading || !input.trim() ? "none" : "0 4px 20px rgba(127,119,221,0.4)",
              transition: "all 0.2s", whiteSpace: "nowrap",
            }}
          >
            {loading ? "..." : "Send ↗"}
          </button>
        </div>
        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.2)", fontSize: 11, marginTop: 10 }}>
          CareerAI • AI Guidance for Pakistani students • Free Forever
        </p>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(127,119,221,0.3); border-radius: 4px; }
        textarea::placeholder { color: rgba(255,255,255,0.3); }
      `}</style>
    </div>
  );
}