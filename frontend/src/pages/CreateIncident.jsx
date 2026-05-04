import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTheme } from "../context/ThemeContext"
import API from "../api"

export default function CreateIncident() {
  const navigate = useNavigate()
  const { dark } = useTheme()
  const [saving, setSaving] = useState(false)

  const [data, setData] = useState({
    title: "",
    description: "",
    status: "OPEN"
  })

  const colors = dark
    ? {
        bg: "#0f172a",
        card: "rgba(30, 41, 59, 0.8)",
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
        secondary: "#64748b",
        secondaryHover: "#475569",
        secondaryGlow: "rgba(100, 116, 139, 0.2)",
      }
    : {
        bg: "#f8fafc",
        card: "rgba(255, 255, 255, 0.9)",
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
        secondary: "#6b7280",
        secondaryHover: "#4b5563",
        secondaryGlow: "rgba(107, 114, 128, 0.15)",
      }

  const handleSubmit = async () => {
    if (!data.title || !data.description) {
      alert("Fill all fields")
      return
    }

    try {
      setSaving(true)
      await API.post("/incidents", {
        title: data.title,
        description: data.description,
        status: data.status
      })
      navigate("/incidents")
    } catch (e) {
      console.error(e)
      alert("Create failed")
    } finally {
      setSaving(false)
    }
  }

  const inputStyle = {
    width: "100%",
    padding: "14px 18px",
    fontSize: "15px",
    fontWeight: "500",
    borderRadius: "12px",
    border: `1px solid ${colors.inputBorder}`,
    background: colors.input,
    backdropFilter: "blur(8px)",
    color: colors.text,
    outline: "none",
    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    boxSizing: "border-box",
  }

  const btnBase = {
    padding: "14px 28px",
    fontSize: "14px",
    fontWeight: "600",
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    letterSpacing: "0.01em",
  }

  return (
    <div style={{ padding: "32px 32px 48px", maxWidth: "640px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "36px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "8px" }}>
          <div style={{
            width: "48px",
            height: "48px",
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryHover} 100%)`,
            borderRadius: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 8px 24px ${colors.primaryGlow}`,
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </div>
          <div>
            <h1 style={{ 
              fontSize: "28px", 
              fontWeight: "700", 
              color: colors.text, 
              margin: 0,
              letterSpacing: "-0.02em",
            }}>
              Create Incident
            </h1>
          </div>
        </div>
        <p style={{ fontSize: "15px", color: colors.textSecondary, margin: 0, paddingLeft: "62px" }}>
          Fill in the details to create a new incident report
        </p>
      </div>

      {/* Form Card */}
      <div
        style={{
          background: colors.card,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRadius: "20px",
          padding: "36px",
          boxShadow: dark
            ? "0 16px 48px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255,255,255,0.05)"
            : "0 16px 48px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255,255,255,0.8)",
          border: `1px solid ${colors.cardBorder}`,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Title */}
          <div>
            <label style={{ 
              display: "block", 
              fontSize: "13px", 
              fontWeight: "600", 
              color: colors.text, 
              marginBottom: "10px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}>
              Title
            </label>
            <input
              placeholder="Enter incident title"
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = colors.primary
                e.target.style.boxShadow = `0 0 0 4px ${colors.primaryGlow}`
                e.target.style.transform = "scale(1.01)"
              }}
              onBlur={(e) => {
                e.target.style.borderColor = colors.inputBorder
                e.target.style.boxShadow = "none"
                e.target.style.transform = "scale(1)"
              }}
            />
          </div>

          {/* Description */}
          <div>
            <label style={{ 
              display: "block", 
              fontSize: "13px", 
              fontWeight: "600", 
              color: colors.text, 
              marginBottom: "10px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}>
              Description
            </label>
            <textarea
              placeholder="Describe the incident in detail..."
              value={data.description}
              onChange={(e) => setData({ ...data, description: e.target.value })}
              style={{ 
                ...inputStyle, 
                height: "140px", 
                resize: "vertical",
                lineHeight: "1.6",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = colors.primary
                e.target.style.boxShadow = `0 0 0 4px ${colors.primaryGlow}`
              }}
              onBlur={(e) => {
                e.target.style.borderColor = colors.inputBorder
                e.target.style.boxShadow = "none"
              }}
            />
          </div>

          {/* Status */}
          <div>
            <label style={{ 
              display: "block", 
              fontSize: "13px", 
              fontWeight: "600", 
              color: colors.text, 
              marginBottom: "10px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}>
              Status
            </label>
            <select
              value={data.status}
              onChange={(e) => setData({ ...data, status: e.target.value })}
              style={{ ...inputStyle, cursor: "pointer" }}
              onFocus={(e) => {
                e.target.style.borderColor = colors.primary
                e.target.style.boxShadow = `0 0 0 4px ${colors.primaryGlow}`
              }}
              onBlur={(e) => {
                e.target.style.borderColor = colors.inputBorder
                e.target.style.boxShadow = "none"
              }}
            >
              <option value="OPEN">OPEN</option>
              <option value="CLOSED">CLOSED</option>
            </select>
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: "14px", marginTop: "12px" }}>
            <button
              disabled={saving}
              onClick={handleSubmit}
              style={{
                ...btnBase,
                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryHover} 100%)`,
                color: "#ffffff",
                opacity: saving ? 0.7 : 1,
                cursor: saving ? "not-allowed" : "pointer",
                boxShadow: `0 4px 16px ${colors.primaryGlow}`,
              }}
              onMouseEnter={(e) => {
                if (!saving) {
                  e.currentTarget.style.transform = "translateY(-2px) scale(1.02)"
                  e.currentTarget.style.boxShadow = `0 12px 32px ${colors.primaryGlow}`
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)"
                e.currentTarget.style.boxShadow = `0 4px 16px ${colors.primaryGlow}`
              }}
              onMouseDown={(e) => {
                if (!saving) e.currentTarget.style.transform = "translateY(0) scale(0.98)"
              }}
              onMouseUp={(e) => {
                if (!saving) e.currentTarget.style.transform = "translateY(-2px) scale(1.02)"
              }}
            >
              {saving ? (
                <>
                  <div
                    style={{
                      width: "16px",
                      height: "16px",
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTopColor: "#ffffff",
                      borderRadius: "50%",
                      animation: "spin 0.8s linear infinite",
                    }}
                  />
                  Creating...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Create Incident
                </>
              )}
            </button>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

            <button
              onClick={() => navigate("/incidents")}
              style={{
                ...btnBase,
                background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.secondaryHover} 100%)`,
                color: "#ffffff",
                boxShadow: `0 4px 12px ${colors.secondaryGlow}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px) scale(1.02)"
                e.currentTarget.style.boxShadow = `0 12px 24px ${colors.secondaryGlow}`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)"
                e.currentTarget.style.boxShadow = `0 4px 12px ${colors.secondaryGlow}`
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
