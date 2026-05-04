import { useState } from "react"
import { useTheme } from "../context/ThemeContext"
import API from "../api"

export default function AIPanel() {
  const { dark } = useTheme()

  const [input, setInput] = useState("")
  const [response, setResponse] = useState("")
  const [loading, setLoading] = useState(false)

  const colors = dark
    ? {
        bg: "#0f172a",
        card: "rgba(30, 41, 59, 0.8)",
        cardHover: "rgba(51, 65, 85, 0.8)",
        cardBorder: "rgba(51, 65, 85, 0.6)",
        text: "#f8fafc",
        textSecondary: "#94a3b8",
        textMuted: "#64748b",
        border: "rgba(51, 65, 85, 0.6)",
        input: "rgba(15, 23, 42, 0.8)",
        inputBorder: "rgba(51, 65, 85, 0.8)",
        primary: "#818cf8",
        primaryHover: "#6366f1",
        primaryGlow: "rgba(129, 140, 248, 0.25)",
        responseCard: "rgba(15, 23, 42, 0.6)",
        responseBorder: "rgba(129, 140, 248, 0.2)",
      }
    : {
        bg: "#f8fafc",
        card: "rgba(255, 255, 255, 0.9)",
        cardHover: "rgba(241, 245, 249, 0.9)",
        cardBorder: "rgba(226, 232, 240, 0.8)",
        text: "#0f172a",
        textSecondary: "#64748b",
        textMuted: "#94a3b8",
        border: "rgba(226, 232, 240, 0.8)",
        input: "rgba(255, 255, 255, 0.9)",
        inputBorder: "rgba(226, 232, 240, 1)",
        primary: "#6366f1",
        primaryHover: "#4f46e5",
        primaryGlow: "rgba(99, 102, 241, 0.15)",
        responseCard: "rgba(99, 102, 241, 0.04)",
        responseBorder: "rgba(99, 102, 241, 0.12)",
      }

  const handleAsk = async () => {
    if (!input) return

    try {
      setLoading(true)
      setResponse("")

      const res = await API.post("/ai/analyze", {
        prompt: input
      })

      setResponse(res.data)
    } catch (e) {
      setResponse("Failed to fetch AI response")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && e.ctrlKey) handleAsk()
  }

  const BotIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v4" />
      <line x1="8" y1="16" x2="8" y2="16" />
      <line x1="16" y1="16" x2="16" y2="16" />
    </svg>
  )

  const SparkleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
      <path d="M5 19l.5 1.5L7 21l-1.5.5L5 23l-.5-1.5L3 21l1.5-.5L5 19z" />
      <path d="M19 11l.5 1.5L21 13l-1.5.5-.5 1.5-.5-1.5L17 13l1.5-.5.5-1.5z" />
    </svg>
  )

  const inputStyle = {
    width: "100%",
    padding: "18px 22px",
    fontSize: "15px",
    fontWeight: "500",
    borderRadius: "16px",
    border: `1px solid ${colors.inputBorder}`,
    background: colors.input,
    backdropFilter: "blur(8px)",
    color: colors.text,
    outline: "none",
    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    boxSizing: "border-box",
    resize: "vertical",
    minHeight: "140px",
    fontFamily: "inherit",
    lineHeight: "1.6",
  }

  const cardStyle = {
    background: colors.card,
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderRadius: "20px",
    padding: "32px",
    boxShadow: dark
      ? "0 16px 48px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255,255,255,0.05)"
      : "0 16px 48px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255,255,255,0.8)",
    border: `1px solid ${colors.cardBorder}`,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  }

  return (
    <div style={{ padding: "32px 32px 48px", maxWidth: "860px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "36px", display: "flex", alignItems: "flex-start", gap: "18px" }}>
        <div
          style={{
            width: "64px",
            height: "64px",
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryHover} 100%)`,
            borderRadius: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            boxShadow: `0 12px 32px ${colors.primaryGlow}, inset 0 1px 0 rgba(255,255,255,0.2)`,
            flexShrink: 0,
          }}
        >
          <BotIcon />
        </div>
        <div>
          <h1 style={{ 
            fontSize: "32px", 
            fontWeight: "700", 
            color: colors.text, 
            margin: "0 0 8px 0",
            letterSpacing: "-0.02em",
          }}>
            AI Assistant
          </h1>
          <p style={{ fontSize: "15px", color: colors.textSecondary, margin: 0, lineHeight: "1.5" }}>
            Ask questions about incidents and get AI-powered insights and analysis
          </p>
        </div>
      </div>

      {/* Input Card */}
      <div style={{ ...cardStyle, marginBottom: "28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <SparkleIcon />
          <label style={{ 
            fontSize: "14px", 
            fontWeight: "600", 
            color: colors.text,
            letterSpacing: "-0.01em",
          }}>
            Your Question
          </label>
        </div>
        <textarea
          placeholder="Ask something about incidents... (Ctrl+Enter to send)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          style={inputStyle}
          onFocus={(e) => {
            e.target.style.borderColor = colors.primary
            e.target.style.boxShadow = `0 0 0 4px ${colors.primaryGlow}`
          }}
          onBlur={(e) => {
            e.target.style.borderColor = colors.inputBorder
            e.target.style.boxShadow = "none"
          }}
        />

        <button
          onClick={handleAsk}
          disabled={loading || !input}
          style={{
            marginTop: "20px",
            padding: "14px 28px",
            fontSize: "14px",
            fontWeight: "600",
            borderRadius: "12px",
            border: "none",
            cursor: loading || !input ? "not-allowed" : "pointer",
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryHover} 100%)`,
            color: "#ffffff",
            transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
            opacity: loading || !input ? 0.5 : 1,
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            boxShadow: `0 4px 16px ${colors.primaryGlow}`,
            letterSpacing: "0.01em",
          }}
          onMouseEnter={(e) => {
            if (!loading && input) {
              e.currentTarget.style.transform = "translateY(-2px) scale(1.02)"
              e.currentTarget.style.boxShadow = `0 12px 32px ${colors.primaryGlow}`
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0) scale(1)"
            e.currentTarget.style.boxShadow = `0 4px 16px ${colors.primaryGlow}`
          }}
          onMouseDown={(e) => {
            if (!loading && input) e.currentTarget.style.transform = "translateY(0) scale(0.98)"
          }}
          onMouseUp={(e) => {
            if (!loading && input) e.currentTarget.style.transform = "translateY(-2px) scale(1.02)"
          }}
        >
          {loading ? (
            <>
              <div
                style={{
                  width: "18px",
                  height: "18px",
                  border: "2px solid rgba(255,255,255,0.3)",
                  borderTopColor: "#ffffff",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                }}
              />
              Analyzing...
            </>
          ) : (
            <>
              <SparkleIcon />
              Ask AI
            </>
          )}
        </button>
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        `}</style>
      </div>

      {/* Loading State */}
      {loading && (
        <div style={{ ...cardStyle, textAlign: "center", padding: "64px 32px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              border: `3px solid ${colors.border}`,
              borderTopColor: colors.primary,
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 24px",
              boxShadow: `0 0 24px ${colors.primaryGlow}`,
            }}
          />
          <p style={{ 
            color: colors.text, 
            fontSize: "16px", 
            fontWeight: "600", 
            margin: "0 0 8px 0",
          }}>
            Analyzing your question
          </p>
          <p style={{ 
            color: colors.textSecondary, 
            fontSize: "14px", 
            margin: 0,
            animation: "pulse 1.5s ease-in-out infinite",
          }}>
            Please wait while AI processes your request...
          </p>
        </div>
      )}

      {/* Response Card */}
      {response && !loading && (
        <div style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                background: `linear-gradient(135deg, ${colors.primary}25 0%, ${colors.primaryHover}20 100%)`,
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: colors.primary,
                border: `1px solid ${colors.responseBorder}`,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div>
              <h3 style={{ 
                fontSize: "16px", 
                fontWeight: "600", 
                color: colors.text, 
                margin: 0,
                letterSpacing: "-0.01em",
              }}>
                AI Response
              </h3>
              <p style={{ fontSize: "12px", color: colors.textMuted, margin: "2px 0 0 0" }}>
                Generated analysis
              </p>
            </div>
          </div>

          <div
            style={{
              background: colors.responseCard,
              borderRadius: "14px",
              padding: "24px",
              border: `1px solid ${colors.responseBorder}`,
            }}
          >
            <pre
              style={{
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
                margin: 0,
                fontSize: "14px",
                lineHeight: "1.75",
                color: colors.text,
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              }}
            >
              {response}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}
