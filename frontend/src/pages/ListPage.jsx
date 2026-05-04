import { useEffect, useState } from "react"
import { useTheme } from "../context/ThemeContext"
import api from "../services/api"

export default function ListPage() {
  const { dark } = useTheme()

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  const colors = dark
    ? {
        bg: "#0f172a",
        card: "#1e293b",
        text: "#f8fafc",
        textSecondary: "#94a3b8",
        border: "#334155",
        input: "#0f172a",
        primary: "#818cf8",
        danger: "#ef4444",
        dangerHover: "#dc2626",
        tableHeader: "#334155",
        tableRow: "#1e293b",
        tableRowHover: "#2d3a4f",
      }
    : {
        bg: "#f8fafc",
        card: "#ffffff",
        text: "#0f172a",
        textSecondary: "#64748b",
        border: "#e2e8f0",
        input: "#ffffff",
        primary: "#6366f1",
        danger: "#ef4444",
        dangerHover: "#dc2626",
        tableHeader: "#f1f5f9",
        tableRow: "#ffffff",
        tableRowHover: "#f8fafc",
      }

  const fetchData = () => {
    setLoading(true)
    api
      .get("/api/incidents/all")
      .then((res) => setData(res.data.content))
      .catch(() => setData([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSearch = (value) => {
    setSearch(value)

    if (!value) {
      fetchData()
      return
    }

    api
      .get(`/api/incidents/search?q=${value}`)
      .then((res) => setData(res.data))
      .catch(() => setData([]))
  }

  const handleDelete = (id) => {
    api.delete(`/api/incidents/${id}`).then(() => {
      setData((prev) => prev.filter((item) => item.id !== id))
    })
  }

  const inputStyle = {
    width: "100%",
    maxWidth: "400px",
    padding: "12px 16px",
    fontSize: "14px",
    borderRadius: "10px",
    border: `1px solid ${colors.border}`,
    background: colors.input,
    color: colors.text,
    outline: "none",
    transition: "all 0.2s ease",
    boxSizing: "border-box",
  }

  const cardStyle = {
    background: colors.card,
    borderRadius: "12px",
    boxShadow: dark
      ? "0 4px 6px -1px rgba(0, 0, 0, 0.3)"
      : "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
    border: `1px solid ${colors.border}`,
    overflow: "hidden",
  }

  if (loading) {
    return (
      <div style={{ padding: "40px", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              border: `3px solid ${colors.border}`,
              borderTopColor: colors.primary,
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: colors.textSecondary, fontSize: "16px" }}>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: "32px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <h1 style={{ fontSize: "28px", fontWeight: "700", color: colors.text, margin: "0 0 24px 0" }}>
        Incidents
      </h1>

      {/* Search */}
      <input
        placeholder="Search..."
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        style={{ ...inputStyle, marginBottom: "24px" }}
        onFocus={(e) => {
          e.target.style.borderColor = colors.primary
          e.target.style.boxShadow = `0 0 0 3px ${colors.primary}20`
        }}
        onBlur={(e) => {
          e.target.style.borderColor = colors.border
          e.target.style.boxShadow = "none"
        }}
      />

      {/* Empty State */}
      {data.length === 0 ? (
        <div
          style={{
            ...cardStyle,
            padding: "48px",
            textAlign: "center",
          }}
        >
          <p style={{ color: colors.textSecondary, fontSize: "16px", margin: 0 }}>
            No incidents found
          </p>
        </div>
      ) : (
        /* Table */
        <div style={cardStyle}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: colors.tableHeader }}>
                  <th style={{ padding: "14px 16px", textAlign: "left", fontSize: "13px", fontWeight: "600", color: colors.textSecondary, textTransform: "uppercase", letterSpacing: "0.5px" }}>ID</th>
                  <th style={{ padding: "14px 16px", textAlign: "left", fontSize: "13px", fontWeight: "600", color: colors.textSecondary, textTransform: "uppercase", letterSpacing: "0.5px" }}>Title</th>
                  <th style={{ padding: "14px 16px", textAlign: "left", fontSize: "13px", fontWeight: "600", color: colors.textSecondary, textTransform: "uppercase", letterSpacing: "0.5px" }}>Severity</th>
                  <th style={{ padding: "14px 16px", textAlign: "left", fontSize: "13px", fontWeight: "600", color: colors.textSecondary, textTransform: "uppercase", letterSpacing: "0.5px" }}>Status</th>
                  <th style={{ padding: "14px 16px", textAlign: "left", fontSize: "13px", fontWeight: "600", color: colors.textSecondary, textTransform: "uppercase", letterSpacing: "0.5px" }}>Date</th>
                  <th style={{ padding: "14px 16px", textAlign: "left", fontSize: "13px", fontWeight: "600", color: colors.textSecondary, textTransform: "uppercase", letterSpacing: "0.5px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr
                    key={item.id}
                    style={{
                      background: colors.tableRow,
                      borderTop: `1px solid ${colors.border}`,
                      transition: "background 0.2s ease",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = colors.tableRowHover }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = colors.tableRow }}
                  >
                    <td style={{ padding: "14px 16px", fontSize: "14px", color: colors.textSecondary }}>{item.id}</td>
                    <td style={{ padding: "14px 16px", fontSize: "14px", color: colors.text, fontWeight: "500" }}>{item.title}</td>
                    <td style={{ padding: "14px 16px", fontSize: "14px", color: colors.textSecondary }}>{item.severity}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <span
                        style={{
                          padding: "4px 10px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: "500",
                          background: item.status === "OPEN" ? "#f59e0b20" : "#22c55e20",
                          color: item.status === "OPEN" ? "#f59e0b" : "#22c55e",
                        }}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: "14px", color: colors.textSecondary }}>{item.incidentDate}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <button
                        onClick={() => handleDelete(item.id)}
                        style={{
                          padding: "6px 12px",
                          fontSize: "12px",
                          fontWeight: "500",
                          borderRadius: "6px",
                          border: "none",
                          cursor: "pointer",
                          background: `${colors.danger}15`,
                          color: colors.danger,
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = colors.danger
                          e.currentTarget.style.color = "#ffffff"
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = `${colors.danger}15`
                          e.currentTarget.style.color = colors.danger
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
