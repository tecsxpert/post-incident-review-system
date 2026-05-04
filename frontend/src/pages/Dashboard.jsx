import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { useTheme } from "../context/ThemeContext"
import API from "../api"

export default function Dashboard() {
  const { dark } = useTheme()

  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    closed: 0
  })

  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState("ALL")

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
        chartBar: "url(#barGradientDark)",
        chartAxis: "#64748b",
        success: "#22c55e",
        successGlow: "rgba(34, 197, 94, 0.2)",
        warning: "#f59e0b",
        warningGlow: "rgba(245, 158, 11, 0.2)",
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
        chartBar: "url(#barGradientLight)",
        chartAxis: "#94a3b8",
        success: "#22c55e",
        successGlow: "rgba(34, 197, 94, 0.1)",
        warning: "#f59e0b",
        warningGlow: "rgba(245, 158, 11, 0.1)",
      }

  useEffect(() => {
    fetchStats()
  }, [period])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const res = await API.get(`/incidents/stats?period=${period}`)
      setStats({
        total: res.data.total,
        open: res.data.open,
        closed: res.data.closed
      })
    } catch (err) {
      console.log("Error fetching stats", err)
    }
    setLoading(false)
  }

  const data = [
    { name: "Total", value: stats.total },
    { name: "Open", value: stats.open },
    { name: "Closed", value: stats.closed }
  ]

  const cardStyle = {
    background: colors.card,
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderRadius: "16px",
    padding: "28px",
    boxShadow: dark
      ? "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.05)"
      : "0 8px 32px rgba(0, 0, 0, 0.06), 0 2px 8px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255,255,255,0.8)",
    border: `1px solid ${colors.cardBorder}`,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  }

  const statCardBase = {
    ...cardStyle,
    textAlign: "center",
    flex: 1,
    minWidth: "160px",
    position: "relative",
    overflow: "hidden",
  }

  const inputStyle = {
    padding: "12px 16px",
    fontSize: "14px",
    fontWeight: "500",
    borderRadius: "12px",
    border: `1px solid ${colors.inputBorder}`,
    background: colors.input,
    backdropFilter: "blur(8px)",
    color: colors.text,
    outline: "none",
    cursor: "pointer",
    transition: "all 0.2s ease",
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
            Loading dashboard...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: "32px 32px 48px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "36px" }}>
        <h1 style={{ 
          fontSize: "32px", 
          fontWeight: "700", 
          color: colors.text, 
          margin: "0 0 8px 0",
          letterSpacing: "-0.02em",
        }}>
          Incident Dashboard
        </h1>
        <p style={{ fontSize: "15px", color: colors.textSecondary, margin: 0, fontWeight: "400" }}>
          Overview of system incidents and analytics
        </p>
      </div>

      {/* Period Filter */}
      <div style={{ marginBottom: "28px", display: "flex", alignItems: "center", gap: "14px" }}>
        <label style={{ fontWeight: "500", color: colors.textSecondary, fontSize: "14px" }}>
          Time Period:
        </label>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          style={inputStyle}
          onFocus={(e) => {
            e.target.style.borderColor = colors.primary
            e.target.style.boxShadow = `0 0 0 3px ${colors.primaryGlow}`
          }}
          onBlur={(e) => {
            e.target.style.borderColor = colors.inputBorder
            e.target.style.boxShadow = "none"
          }}
        >
          <option value="ALL">All Time</option>
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div style={{ display: "flex", gap: "24px", marginBottom: "36px", flexWrap: "wrap" }}>
        {/* Total Card */}
        <div 
          style={statCardBase}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-4px)"
            e.currentTarget.style.boxShadow = dark
              ? "0 16px 48px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.05)"
              : "0 16px 48px rgba(0, 0, 0, 0.1), 0 4px 16px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255,255,255,0.8)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)"
            e.currentTarget.style.boxShadow = dark
              ? "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.05)"
              : "0 8px 32px rgba(0, 0, 0, 0.06), 0 2px 8px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255,255,255,0.8)"
          }}
        >
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.primaryHover} 100%)`,
            borderRadius: "16px 16px 0 0",
          }} />
          <span style={{ fontSize: "13px", color: colors.textMuted, fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Total Incidents
          </span>
          <h2 style={{ 
            fontSize: "42px", 
            fontWeight: "700", 
            color: colors.text, 
            margin: "12px 0 0 0",
            letterSpacing: "-0.02em",
          }}>
            {stats.total}
          </h2>
        </div>

        {/* Open Card */}
        <div 
          style={{
            ...statCardBase,
            borderLeft: "none",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-4px)"
            e.currentTarget.style.boxShadow = dark
              ? `0 16px 48px rgba(0, 0, 0, 0.4), 0 0 0 1px ${colors.warningGlow}`
              : `0 16px 48px rgba(0, 0, 0, 0.1), 0 0 0 1px ${colors.warningGlow}`
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)"
            e.currentTarget.style.boxShadow = dark
              ? "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.05)"
              : "0 8px 32px rgba(0, 0, 0, 0.06), 0 2px 8px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255,255,255,0.8)"
          }}
        >
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: `linear-gradient(90deg, ${colors.warning} 0%, #f97316 100%)`,
            borderRadius: "16px 16px 0 0",
          }} />
          <span style={{ fontSize: "13px", color: colors.textMuted, fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Open
          </span>
          <h2 style={{ 
            fontSize: "42px", 
            fontWeight: "700", 
            color: colors.warning, 
            margin: "12px 0 0 0",
            letterSpacing: "-0.02em",
            textShadow: `0 0 24px ${colors.warningGlow}`,
          }}>
            {stats.open}
          </h2>
        </div>

        {/* Closed Card */}
        <div 
          style={statCardBase}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-4px)"
            e.currentTarget.style.boxShadow = dark
              ? `0 16px 48px rgba(0, 0, 0, 0.4), 0 0 0 1px ${colors.successGlow}`
              : `0 16px 48px rgba(0, 0, 0, 0.1), 0 0 0 1px ${colors.successGlow}`
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)"
            e.currentTarget.style.boxShadow = dark
              ? "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.05)"
              : "0 8px 32px rgba(0, 0, 0, 0.06), 0 2px 8px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255,255,255,0.8)"
          }}
        >
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: `linear-gradient(90deg, ${colors.success} 0%, #16a34a 100%)`,
            borderRadius: "16px 16px 0 0",
          }} />
          <span style={{ fontSize: "13px", color: colors.textMuted, fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Closed
          </span>
          <h2 style={{ 
            fontSize: "42px", 
            fontWeight: "700", 
            color: colors.success, 
            margin: "12px 0 0 0",
            letterSpacing: "-0.02em",
            textShadow: `0 0 24px ${colors.successGlow}`,
          }}>
            {stats.closed}
          </h2>
        </div>
      </div>

      {/* Chart */}
      <div style={cardStyle}>
        <h3 style={{ 
          fontSize: "18px", 
          fontWeight: "600", 
          color: colors.text, 
          margin: "0 0 28px 0",
          letterSpacing: "-0.01em",
        }}>
          Incident Overview
        </h3>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="barGradientDark" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
              <linearGradient id="barGradientLight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#4f46e5" />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="name" 
              stroke={colors.chartAxis} 
              fontSize={13}
              fontWeight={500}
              tickLine={false}
              axisLine={{ stroke: colors.border }}
            />
            <YAxis 
              stroke={colors.chartAxis} 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                background: dark ? "rgba(30, 41, 59, 0.95)" : "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(8px)",
                border: `1px solid ${colors.border}`,
                borderRadius: "12px",
                boxShadow: dark 
                  ? "0 8px 32px rgba(0, 0, 0, 0.4)" 
                  : "0 8px 32px rgba(0, 0, 0, 0.1)",
                padding: "12px 16px",
              }}
              labelStyle={{ color: colors.text, fontWeight: 600, marginBottom: "4px" }}
              itemStyle={{ color: colors.textSecondary }}
              cursor={{ fill: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)" }}
            />
            <Bar 
              dataKey="value" 
              fill={colors.chartBar} 
              radius={[10, 10, 0, 0]} 
              maxBarSize={80}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
