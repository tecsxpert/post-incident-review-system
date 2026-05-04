import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTheme } from "../context/ThemeContext"
import API from "../api"

export default function Incidents() {
  const navigate = useNavigate()
  const { dark } = useTheme()

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  const [q, setQ] = useState("")
  const [status, setStatus] = useState("")
  const [start, setStart] = useState("")
  const [end, setEnd] = useState("")

  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  const [file, setFile] = useState(null)

  const colors = dark
    ? {
        bg: "#0f172a",
        card: "rgba(30, 41, 59, 0.8)",
        cardHover: "rgba(51, 65, 85, 0.9)",
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
        success: "#22c55e",
        successBg: "rgba(34, 197, 94, 0.15)",
        successBorder: "rgba(34, 197, 94, 0.3)",
        warning: "#f59e0b",
        warningBg: "rgba(245, 158, 11, 0.15)",
        warningBorder: "rgba(245, 158, 11, 0.3)",
        danger: "#ef4444",
        dangerHover: "#dc2626",
        dangerGlow: "rgba(239, 68, 68, 0.2)",
        blue: "#3b82f6",
        blueHover: "#2563eb",
        blueGlow: "rgba(59, 130, 246, 0.2)",
      }
    : {
        bg: "#f8fafc",
        card: "rgba(255, 255, 255, 0.9)",
        cardHover: "rgba(248, 250, 252, 1)",
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
        success: "#16a34a",
        successBg: "rgba(34, 197, 94, 0.1)",
        successBorder: "rgba(34, 197, 94, 0.2)",
        warning: "#d97706",
        warningBg: "rgba(245, 158, 11, 0.1)",
        warningBorder: "rgba(245, 158, 11, 0.2)",
        danger: "#ef4444",
        dangerHover: "#dc2626",
        dangerGlow: "rgba(239, 68, 68, 0.15)",
        blue: "#3b82f6",
        blueHover: "#2563eb",
        blueGlow: "rgba(59, 130, 246, 0.15)",
      }

  useEffect(() => {
    fetchData()
  }, [page])

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await API.get("/incidents/search", {
        params: {
          q: q || null,
          status: status || null,
          start: start || null,
          end: end || null,
          page,
          size: 5,
        },
      })
      setData(res.data.content)
      setTotalPages(res.data.totalPages)
    } catch {
      alert("Server error")
    }
    setLoading(false)
  }

  const applyFilters = () => {
    setPage(0)
    fetchData()
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this incident?")) return
    await API.delete(`/incidents/${id}`)
    fetchData()
  }

  const handleExport = async () => {
    try {
      const res = await API.get("/incidents/export", {
        responseType: "blob",
      })
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", "incidents.csv")
      document.body.appendChild(link)
      link.click()
      alert("CSV downloaded")
    } catch {
      alert("CSV export failed")
    }
  }

  const handleUpload = async () => {
    if (!file) {
      alert("Select file first")
      return
    }

    // File type validation
    const allowedTypes = ["application/pdf", "text/plain"]
    if (!allowedTypes.includes(file.type)) {
      alert("Only TXT or PDF allowed")
      return
    }

    // File size validation (max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024
    if (file.size > MAX_SIZE) {
      alert("File too large (max 5MB)")
      return
    }

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await API.post("/incidents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      if (res.status === 200 || res.status === 201) {
        alert("File uploaded successfully")
        fetchData()
      } else {
        alert("Upload failed")
      }
    } catch (err) {
      const msg =
        err.response?.data ||
        err.response?.data?.message ||
        "Upload failed"
      alert(msg)
    }
  }

  const btnBase = {
    padding: "10px 18px",
    fontSize: "13px",
    fontWeight: "600",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    width: "auto",
    letterSpacing: "0.01em",
  }

  const primaryBtn = {
    ...btnBase,
    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryHover} 100%)`,
    color: "#ffffff",
    boxShadow: `0 2px 8px ${colors.primaryGlow}`,
  }

  const editBtn = {
    ...btnBase,
    background: `linear-gradient(135deg, ${colors.blue} 0%, ${colors.blueHover} 100%)`,
    color: "#ffffff",
    padding: "8px 14px",
    fontSize: "12px",
    boxShadow: `0 2px 6px ${colors.blueGlow}`,
  }

  const deleteBtn = {
    ...btnBase,
    background: `linear-gradient(135deg, ${colors.danger} 0%, ${colors.dangerHover} 100%)`,
    color: "#ffffff",
    padding: "8px 14px",
    fontSize: "12px",
    boxShadow: `0 2px 6px ${colors.dangerGlow}`,
  }

  const inputStyle = {
    padding: "11px 15px",
    fontSize: "14px",
    fontWeight: "500",
    borderRadius: "10px",
    border: `1px solid ${colors.inputBorder}`,
    background: colors.input,
    backdropFilter: "blur(8px)",
    color: colors.text,
    outline: "none",
    transition: "all 0.2s ease",
  }

  const cardStyle = {
    background: colors.card,
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: dark
      ? "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.05)"
      : "0 8px 32px rgba(0, 0, 0, 0.06), 0 2px 8px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255,255,255,0.8)",
    border: `1px solid ${colors.cardBorder}`,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  }

  if (loading) {
    return (
      <div style={{ padding: "40px", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              border: `3px solid ${colors.border}`,
              borderTopColor: colors.primary,
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 20px",
              boxShadow: `0 0 20px ${colors.primaryGlow}`,
            }}
          />
          <style>{`
            @keyframes spin { to { transform: rotate(360deg); } }
            @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
          `}</style>
          <p style={{ color: colors.textSecondary, fontSize: "15px", fontWeight: "500", animation: "pulse 1.5s ease-in-out infinite" }}>
            Loading incidents...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: "32px 32px 48px", maxWidth: "1400px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
        <div>
          <h1 style={{ 
            fontSize: "32px", 
            fontWeight: "700", 
            color: colors.text, 
            margin: "0 0 4px 0",
            letterSpacing: "-0.02em",
          }}>
            Incidents
          </h1>
          <p style={{ fontSize: "14px", color: colors.textSecondary, margin: 0 }}>
            Manage and track all system incidents
          </p>
        </div>
        <button
          style={{ ...primaryBtn, padding: "12px 24px", fontSize: "14px" }}
          onClick={() => navigate("/create")}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px) scale(1.02)"
            e.currentTarget.style.boxShadow = `0 8px 24px ${colors.primaryGlow}`
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0) scale(1)"
            e.currentTarget.style.boxShadow = `0 2px 8px ${colors.primaryGlow}`
          }}
          onMouseDown={(e) => { e.currentTarget.style.transform = "translateY(0) scale(0.98)" }}
          onMouseUp={(e) => { e.currentTarget.style.transform = "translateY(-2px) scale(1.02)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Create
        </button>
      </div>

      {/* Filter Card */}
      <div style={{ ...cardStyle, marginBottom: "28px" }}>
        {/* Row 1: Search + Filters */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", alignItems: "center", marginBottom: "18px" }}>
          <div style={{ position: "relative", flex: "1", maxWidth: "320px", minWidth: "200px" }}>
            <svg 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="none" 
              style={{ 
                position: "absolute", 
                left: "14px", 
                top: "50%", 
                transform: "translateY(-50%)",
                zIndex: 50,
                pointerEvents: "none",
              }}
            >
              <circle cx="11" cy="11" r="8" stroke={dark ? "#ffffff" : "#1f2937"} strokeWidth="2" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" stroke={dark ? "#ffffff" : "#1f2937"} strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              placeholder="Search incidents..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              style={{ ...inputStyle, width: "100%", paddingLeft: "44px", position: "relative", zIndex: 1 }}
              onFocus={(e) => {
                e.target.style.borderColor = colors.primary
                e.target.style.boxShadow = `0 0 0 3px ${colors.primaryGlow}`
              }}
              onBlur={(e) => {
                e.target.style.borderColor = colors.inputBorder
                e.target.style.boxShadow = "none"
              }}
            />
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{ ...inputStyle, cursor: "pointer", minWidth: "150px" }}
            onFocus={(e) => {
              e.target.style.borderColor = colors.primary
              e.target.style.boxShadow = `0 0 0 3px ${colors.primaryGlow}`
            }}
            onBlur={(e) => {
              e.target.style.borderColor = colors.inputBorder
              e.target.style.boxShadow = "none"
            }}
          >
            <option value="">All Status</option>
            <option value="OPEN">OPEN</option>
            <option value="CLOSED">CLOSED</option>
          </select>

          <span style={{ color: colors.textMuted, fontSize: "13px", fontWeight: "600" }}>
            Date Range:
          </span>

          <input
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            style={{ ...inputStyle, cursor: "pointer" }}
            onFocus={(e) => {
              e.target.style.borderColor = colors.primary
              e.target.style.boxShadow = `0 0 0 3px ${colors.primaryGlow}`
            }}
            onBlur={(e) => {
              e.target.style.borderColor = colors.inputBorder
              e.target.style.boxShadow = "none"
            }}
          />

          <span style={{ color: colors.textMuted, fontSize: "13px" }}>to</span>

          <input
            type="date"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            style={{ ...inputStyle, cursor: "pointer" }}
            onFocus={(e) => {
              e.target.style.borderColor = colors.primary
              e.target.style.boxShadow = `0 0 0 3px ${colors.primaryGlow}`
            }}
            onBlur={(e) => {
              e.target.style.borderColor = colors.inputBorder
              e.target.style.boxShadow = "none"
            }}
          />

          <button
            style={primaryBtn}
            onClick={applyFilters}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px) scale(1.02)"
              e.currentTarget.style.boxShadow = `0 6px 20px ${colors.primaryGlow}`
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(1)"
              e.currentTarget.style.boxShadow = `0 2px 8px ${colors.primaryGlow}`
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            Filter
          </button>
        </div>

        {/* Row 2: Export + Upload */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", alignItems: "center", paddingTop: "18px", borderTop: `1px solid ${colors.border}` }}>
          <button
            style={{ 
              ...btnBase, 
              background: `linear-gradient(135deg, ${colors.success} 0%, #16a34a 100%)`, 
              color: "#ffffff",
              boxShadow: `0 2px 8px ${dark ? 'rgba(34, 197, 94, 0.25)' : 'rgba(34, 197, 94, 0.2)'}`,
            }}
            onClick={handleExport}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px) scale(1.02)"
              e.currentTarget.style.boxShadow = `0 6px 20px ${dark ? 'rgba(34, 197, 94, 0.35)' : 'rgba(34, 197, 94, 0.25)'}`
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(1)"
              e.currentTarget.style.boxShadow = `0 2px 8px ${dark ? 'rgba(34, 197, 94, 0.25)' : 'rgba(34, 197, 94, 0.2)'}`
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export CSV
          </button>

          <div style={{ width: "20px" }} />

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ 
              ...inputStyle, 
              padding: "9px 14px",
              cursor: "pointer",
              fontSize: "13px",
            }}
          />

          <button
            style={{ 
              ...btnBase, 
              background: `linear-gradient(135deg, ${colors.blue} 0%, ${colors.blueHover} 100%)`, 
              color: "#ffffff",
              boxShadow: `0 2px 8px ${colors.blueGlow}`,
            }}
            onClick={handleUpload}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px) scale(1.02)"
              e.currentTarget.style.boxShadow = `0 6px 20px ${colors.blueGlow}`
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(1)"
              e.currentTarget.style.boxShadow = `0 2px 8px ${colors.blueGlow}`
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Upload
          </button>
        </div>
      </div>

      {/* Incidents List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {data.length === 0 ? (
          <div style={{ ...cardStyle, textAlign: "center", padding: "64px 32px" }}>
            <div style={{
              width: "64px",
              height: "64px",
              background: `${colors.primary}15`,
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={colors.primary} strokeWidth="1.5">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <p style={{ color: colors.text, fontSize: "16px", fontWeight: "600", margin: "0 0 6px 0" }}>
              No incidents found
            </p>
            <p style={{ color: colors.textSecondary, fontSize: "14px", margin: 0 }}>
              Try adjusting your filters or create a new incident
            </p>
          </div>
        ) : (
          data.map((item) => (
            <div
              key={item.id}
              style={cardStyle}
              onMouseEnter={(e) => { 
                e.currentTarget.style.background = colors.cardHover 
                e.currentTarget.style.transform = "translateY(-2px)"
                e.currentTarget.style.boxShadow = dark
                  ? "0 16px 48px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.05)"
                  : "0 16px 48px rgba(0, 0, 0, 0.1), 0 4px 16px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255,255,255,0.8)"
              }}
              onMouseLeave={(e) => { 
                e.currentTarget.style.background = colors.card 
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.boxShadow = dark
                  ? "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.05)"
                  : "0 8px 32px rgba(0, 0, 0, 0.06), 0 2px 8px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255,255,255,0.8)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
                <div style={{ flex: 1, minWidth: "220px" }}>
                  <h3 style={{ 
                    fontSize: "17px", 
                    fontWeight: "600", 
                    color: colors.text, 
                    margin: "0 0 8px 0",
                    letterSpacing: "-0.01em",
                  }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: "14px", color: colors.textSecondary, margin: 0, lineHeight: "1.5" }}>
                    {item.description}
                  </p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
                  <span
                    style={{
                      padding: "6px 14px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "600",
                      background: item.status === "OPEN" ? colors.warningBg : colors.successBg,
                      color: item.status === "OPEN" ? colors.warning : colors.success,
                      border: `1px solid ${item.status === "OPEN" ? colors.warningBorder : colors.successBorder}`,
                      letterSpacing: "0.02em",
                    }}
                  >
                    {item.status}
                  </span>

                  <button
                    style={editBtn}
                    onClick={() => navigate(`/incident/${item.id}`)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-1px) scale(1.05)"
                      e.currentTarget.style.boxShadow = `0 6px 16px ${colors.blueGlow}`
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0) scale(1)"
                      e.currentTarget.style.boxShadow = `0 2px 6px ${colors.blueGlow}`
                    }}
                  >
                    Edit
                  </button>

                  <button
                    style={deleteBtn}
                    onClick={() => handleDelete(item.id)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-1px) scale(1.05)"
                      e.currentTarget.style.boxShadow = `0 6px 16px ${colors.dangerGlow}`
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0) scale(1)"
                      e.currentTarget.style.boxShadow = `0 2px 6px ${colors.dangerGlow}`
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center", 
          gap: "16px", 
          marginTop: "36px",
          padding: "20px",
          background: colors.card,
          borderRadius: "14px",
          border: `1px solid ${colors.cardBorder}`,
          backdropFilter: "blur(20px)",
        }}>
          <button
            style={{
              ...btnBase,
              background: page === 0 ? colors.border : colors.card,
              color: page === 0 ? colors.textMuted : colors.text,
              border: `1px solid ${colors.border}`,
              cursor: page === 0 ? "not-allowed" : "pointer",
              opacity: page === 0 ? 0.5 : 1,
              padding: "10px 20px",
            }}
            onClick={() => page > 0 && setPage(page - 1)}
            disabled={page === 0}
            onMouseEnter={(e) => {
              if (page > 0) {
                e.currentTarget.style.transform = "translateY(-1px)"
                e.currentTarget.style.boxShadow = `0 4px 12px ${dark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.08)'}`
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.boxShadow = "none"
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Prev
          </button>

          <span style={{ 
            fontSize: "14px", 
            color: colors.textSecondary, 
            fontWeight: "600",
            padding: "8px 16px",
            background: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
            borderRadius: "8px",
          }}>
            Page {page + 1} of {totalPages}
          </span>

          <button
            style={{
              ...btnBase,
              background: page + 1 >= totalPages ? colors.border : colors.card,
              color: page + 1 >= totalPages ? colors.textMuted : colors.text,
              border: `1px solid ${colors.border}`,
              cursor: page + 1 >= totalPages ? "not-allowed" : "pointer",
              opacity: page + 1 >= totalPages ? 0.5 : 1,
              padding: "10px 20px",
            }}
            onClick={() => page + 1 < totalPages && setPage(page + 1)}
            disabled={page + 1 >= totalPages}
            onMouseEnter={(e) => {
              if (page + 1 < totalPages) {
                e.currentTarget.style.transform = "translateY(-1px)"
                e.currentTarget.style.boxShadow = `0 4px 12px ${dark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.08)'}`
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.boxShadow = "none"
            }}
          >
            Next
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
