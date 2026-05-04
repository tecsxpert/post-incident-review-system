import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const colors = {
    bg: "linear-gradient(135deg, #f8fafc 0%, #eef2ff 25%, #faf5ff 50%, #f0f9ff 75%, #f8fafc 100%)",
    card: "rgba(255, 255, 255, 0.95)",
    cardBorder: "rgba(226, 232, 240, 0.6)",
    text: "#0f172a",
    textSecondary: "#64748b",
    textMuted: "#94a3b8",
    border: "#e2e8f0",
    input: "rgba(255, 255, 255, 0.9)",
    inputBorder: "rgba(226, 232, 240, 1)",
    primary: "#6366f1",
    primaryHover: "#4f46e5",
    primaryGlow: "rgba(99, 102, 241, 0.2)",
  }

  const handleLogin = () => {
    setLoading(true)
    setTimeout(() => {
      const ok = login(username, password)
      if (ok) navigate("/dashboard")
      else alert("Use admin / admin")
      setLoading(false)
    }, 300)
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleLogin()
  }

  const inputStyle = {
    width: "100%",
    padding: "16px 18px 16px 52px",
    fontSize: "15px",
    fontWeight: "500",
    borderRadius: "14px",
    border: `1px solid ${colors.inputBorder}`,
    background: colors.input,
    backdropFilter: "blur(8px)",
    color: colors.text,
    outline: "none",
    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    boxSizing: "border-box",
    textAlign: "left",
  }

  const UserIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ display: "block" }}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="7" r="4" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )

  const LockIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ display: "block" }}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: colors.bg,
        padding: "24px",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative blurred circles */}
      <div style={{
        position: "absolute",
        top: "-20%",
        left: "-10%",
        width: "500px",
        height: "500px",
        background: "radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)",
        borderRadius: "50%",
        filter: "blur(60px)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute",
        bottom: "-20%",
        right: "-10%",
        width: "600px",
        height: "600px",
        background: "radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, transparent 70%)",
        borderRadius: "50%",
        filter: "blur(60px)",
        pointerEvents: "none",
      }} />

      <div
        style={{
          width: "100%",
          maxWidth: "440px",
          background: colors.card,
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderRadius: "24px",
          padding: "52px 44px",
          boxShadow: "0 32px 64px -12px rgba(0, 0, 0, 0.14), 0 16px 32px -8px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255,255,255,0.8)",
          border: `1px solid ${colors.cardBorder}`,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div
            style={{
              width: "72px",
              height: "72px",
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryHover} 100%)`,
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
              boxShadow: `0 12px 32px ${colors.primaryGlow}, inset 0 1px 0 rgba(255,255,255,0.2)`,
              transform: "rotate(-3deg)",
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <h1 style={{ 
            fontSize: "30px", 
            fontWeight: "700", 
            color: colors.text, 
            margin: "0 0 10px 0",
            letterSpacing: "-0.02em",
          }}>
            Welcome back
          </h1>
          <p style={{ fontSize: "15px", color: colors.textSecondary, margin: 0, fontWeight: "400" }}>
            Sign in to PIR System to continue
          </p>
        </div>

        {/* Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Username */}
          <div style={{ position: "relative" }}>
            <div
              style={{
                position: "absolute",
                left: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
                zIndex: 10,
                width: "20px",
                height: "20px",
              }}
            >
              <UserIcon />
            </div>
            <input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
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

          {/* Password */}
          <div style={{ position: "relative" }}>
            <div
              style={{
                position: "absolute",
                left: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
                zIndex: 10,
                width: "20px",
                height: "20px",
              }}
            >
              <LockIcon />
            </div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
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

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              width: "100%",
              padding: "16px 28px",
              fontSize: "15px",
              fontWeight: "600",
              borderRadius: "14px",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryHover} 100%)`,
              color: "#ffffff",
              transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
              opacity: loading ? 0.7 : 1,
              marginTop: "12px",
              boxShadow: `0 4px 16px ${colors.primaryGlow}`,
              letterSpacing: "0.01em",
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "translateY(-2px) scale(1.02)"
                e.currentTarget.style.boxShadow = `0 12px 32px ${colors.primaryGlow}`
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(1)"
              e.currentTarget.style.boxShadow = `0 4px 16px ${colors.primaryGlow}`
            }}
            onMouseDown={(e) => {
              if (!loading) e.currentTarget.style.transform = "translateY(0) scale(0.98)"
            }}
            onMouseUp={(e) => {
              if (!loading) e.currentTarget.style.transform = "translateY(-2px) scale(1.02)"
            }}
          >
            {loading ? (
              <span style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}>
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
                Signing in...
              </span>
            ) : (
              "Sign in"
            )}
          </button>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>

        {/* Footer */}
        <div style={{ 
          marginTop: "32px", 
          padding: "16px 20px", 
          background: "rgba(99, 102, 241, 0.06)", 
          borderRadius: "12px",
          border: "1px solid rgba(99, 102, 241, 0.1)",
        }}>
          <p style={{ 
            textAlign: "center", 
            fontSize: "13px", 
            color: colors.textSecondary, 
            margin: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={colors.primary} strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            Demo credentials: <strong style={{ color: colors.primary }}>admin / admin</strong>
          </p>
        </div>
      </div>
    </div>
  )
}
