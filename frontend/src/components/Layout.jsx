import { useState } from "react"
import { Outlet, useNavigate, useLocation } from "react-router-dom"
import { useTheme } from "../context/ThemeContext"
import { useAuth } from "../context/AuthContext"

export default function Layout() {
  const { dark, toggleTheme } = useTheme()
  const { logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [sidebarOpen, setSidebarOpen] = useState(false)

  const colors = dark
    ? {
        bg: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
        bgSolid: "#0f172a",
        sidebar: "rgba(30, 41, 59, 0.95)",
        sidebarBorder: "rgba(99, 102, 241, 0.1)",
        card: "rgba(30, 41, 59, 0.8)",
        cardHover: "rgba(51, 65, 85, 0.8)",
        text: "#ffffff",
        textSecondary: "#cbd5e1",
        border: "rgba(51, 65, 85, 0.6)",
        primary: "#818cf8",
        primaryHover: "#6366f1",
        primaryGlow: "rgba(129, 140, 248, 0.3)",
        overlay: "rgba(0, 0, 0, 0.6)",
        header: "rgba(15, 23, 42, 0.8)",
        activeGradient: "linear-gradient(135deg, rgba(129, 140, 248, 0.15) 0%, rgba(99, 102, 241, 0.1) 100%)",
      }
    : {
        bg: "linear-gradient(135deg, #f8fafc 0%, #eef2ff 50%, #f8fafc 100%)",
        bgSolid: "#f8fafc",
        sidebar: "rgba(255, 255, 255, 0.95)",
        sidebarBorder: "rgba(99, 102, 241, 0.08)",
        card: "rgba(255, 255, 255, 0.9)",
        cardHover: "rgba(241, 245, 249, 0.9)",
        text: "#0f172a",
        textSecondary: "#64748b",
        border: "rgba(226, 232, 240, 0.8)",
        primary: "#6366f1",
        primaryHover: "#4f46e5",
        primaryGlow: "rgba(99, 102, 241, 0.2)",
        overlay: "rgba(0, 0, 0, 0.4)",
        header: "rgba(255, 255, 255, 0.8)",
        activeGradient: "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(129, 140, 248, 0.05) 100%)",
      }

  const HamburgerIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={colors.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )

  const CloseIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={colors.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )

  const HomeIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9,22 9,12 15,12 15,22" />
    </svg>
  )

  const AlertIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )

  const BotIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v4" />
      <line x1="8" y1="16" x2="8" y2="16" />
      <line x1="16" y1="16" x2="16" y2="16" />
    </svg>
  )

  const SunIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={colors.textSecondary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )

  const MoonIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={colors.textSecondary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )

  const LogoutIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )

  const navItems = [
    { icon: <HomeIcon />, label: "Dashboard", path: "/dashboard" },
    { icon: <AlertIcon />, label: "Incidents", path: "/incidents" },
    { icon: <BotIcon />, label: "AI Assistant", path: "/ai" },
  ]

  const handleNavClick = (path) => {
    navigate(path)
    setSidebarOpen(false)
  }

  const handleLogout = () => {
    logout()
    navigate("/login")
    setSidebarOpen(false)
  }

  return (
    <div 
      key={dark ? "dark" : "light"}
      style={{ 
        minHeight: "100vh", 
        background: colors.bg, 
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: colors.overlay,
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            zIndex: 40,
            transition: "all 0.3s ease",
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: "280px",
          background: colors.sidebar,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRight: `1px solid ${colors.sidebarBorder}`,
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          boxShadow: sidebarOpen ? "4px 0 24px rgba(0, 0, 0, 0.15)" : "none",
        }}
      >
        {/* Sidebar Header */}
        <div style={{ 
          padding: "24px 20px", 
          borderBottom: `1px solid ${colors.border}`, 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "36px",
              height: "36px",
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryHover} 100%)`,
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 4px 12px ${colors.primaryGlow}`,
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              </svg>
            </div>
            <h1 style={{ 
              fontSize: "18px", 
              fontWeight: "700", 
              color: colors.primary,
              margin: 0,
              letterSpacing: "-0.02em",
            }}>
              PIR System
            </h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "10px",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: colors.textSecondary,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = colors.cardHover
              e.currentTarget.style.transform = "scale(1.05)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent"
              e.currentTarget.style.transform = "scale(1)"
            }}
          >
            <CloseIcon />
          </button>
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: "20px 14px" }}>
          <div style={{ marginBottom: "8px", padding: "0 12px" }}>
            <span style={{ fontSize: "11px", fontWeight: "600", color: colors.textSecondary, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Navigation
            </span>
          </div>
          {navItems.map((item, idx) => {
            const isActive = location.pathname === item.path
            return (
              <div
                key={idx}
                onClick={() => handleNavClick(item.path)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  padding: "14px 16px",
                  borderRadius: "12px",
                  marginBottom: "4px",
                  cursor: "pointer",
                  background: isActive ? colors.activeGradient : "transparent",
                  color: isActive ? colors.primary : colors.text,
                  fontWeight: isActive ? "600" : "500",
                  fontSize: "14px",
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  border: isActive ? `1px solid ${colors.primaryGlow}` : "1px solid transparent",
                  boxShadow: isActive ? `0 2px 8px ${colors.primaryGlow}` : "none",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = colors.cardHover
                    e.currentTarget.style.transform = "translateX(4px)"
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "transparent"
                    e.currentTarget.style.transform = "translateX(0)"
                  }
                }}
              >
                <div style={{ opacity: isActive ? 1 : 0.8 }}>{item.icon}</div>
                <span>{item.label}</span>
                {isActive && (
                  <div style={{
                    marginLeft: "auto",
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: colors.primary,
                    boxShadow: `0 0 8px ${colors.primary}`,
                  }} />
                )}
              </div>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        <div style={{ padding: "16px 14px", borderTop: `1px solid ${colors.border}` }}>
          {/* Theme Toggle */}
          <div
            onClick={toggleTheme}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "14px 16px",
              borderRadius: "12px",
              marginBottom: "8px",
              cursor: "pointer",
              background: colors.card,
              color: colors.text,
              fontSize: "14px",
              fontWeight: "500",
              transition: "all 0.2s ease",
              border: `1px solid ${colors.border}`,
            }}
            onMouseEnter={(e) => { 
              e.currentTarget.style.background = colors.cardHover 
              e.currentTarget.style.transform = "scale(1.02)"
              e.currentTarget.style.boxShadow = `0 4px 12px ${dark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.08)'}`
            }}
            onMouseLeave={(e) => { 
              e.currentTarget.style.background = colors.card 
              e.currentTarget.style.transform = "scale(1)"
              e.currentTarget.style.boxShadow = "none"
            }}
          >
            {dark ? <SunIcon /> : <MoonIcon />}
            <span style={{ color: colors.text }}>{dark ? "Light Mode" : "Dark Mode"}</span>
          </div>

          {/* Logout */}
          <div
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "14px 16px",
              borderRadius: "12px",
              cursor: "pointer",
              background: "linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.15) 100%)",
              color: "#ef4444",
              fontSize: "14px",
              fontWeight: "500",
              transition: "all 0.2s ease",
              border: "1px solid rgba(239, 68, 68, 0.2)",
            }}
            onMouseEnter={(e) => { 
              e.currentTarget.style.background = "linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.2) 100%)"
              e.currentTarget.style.transform = "scale(1.02)"
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(239, 68, 68, 0.2)"
            }}
            onMouseLeave={(e) => { 
              e.currentTarget.style.background = "linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.15) 100%)"
              e.currentTarget.style.transform = "scale(1)"
              e.currentTarget.style.boxShadow = "none"
            }}
          >
            <LogoutIcon />
            <span>Logout</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ width: "100%", transition: "all 0.3s ease" }}>
        {/* Top Header with Hamburger */}
        <header
          style={{
            display: "flex",
            alignItems: "center",
            padding: "16px 24px",
            borderBottom: `1px solid ${colors.border}`,
            background: colors.header,
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            position: "sticky",
            top: 0,
            zIndex: 30,
            boxShadow: dark 
              ? "0 4px 20px rgba(0, 0, 0, 0.2)" 
              : "0 4px 20px rgba(0, 0, 0, 0.03)",
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              background: colors.card,
              border: `1px solid ${colors.border}`,
              cursor: "pointer",
              padding: "10px",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: colors.textSecondary,
              transition: "all 0.2s ease",
              marginRight: "16px",
              boxShadow: dark 
                ? "0 2px 8px rgba(0,0,0,0.2)" 
                : "0 2px 8px rgba(0,0,0,0.04)",
            }}
            onMouseEnter={(e) => { 
              e.currentTarget.style.background = colors.cardHover 
              e.currentTarget.style.transform = "scale(1.05)"
              e.currentTarget.style.boxShadow = `0 4px 12px ${colors.primaryGlow}`
              e.currentTarget.style.borderColor = colors.primary
              e.currentTarget.style.color = colors.primary
            }}
            onMouseLeave={(e) => { 
              e.currentTarget.style.background = colors.card
              e.currentTarget.style.transform = "scale(1)"
              e.currentTarget.style.boxShadow = dark 
                ? "0 2px 8px rgba(0,0,0,0.2)" 
                : "0 2px 8px rgba(0,0,0,0.04)"
              e.currentTarget.style.borderColor = colors.border
              e.currentTarget.style.color = colors.textSecondary
            }}
          >
            <HamburgerIcon />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "28px",
              height: "28px",
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryHover} 100%)`,
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 2px 8px ${colors.primaryGlow}`,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              </svg>
            </div>
            <h2 style={{ 
              fontSize: "16px", 
              fontWeight: "600", 
              color: colors.text, 
              margin: 0,
              letterSpacing: "-0.01em",
            }}>
              PIR System
            </h2>
          </div>
        </header>

        {/* Page Content */}
        <div style={{ padding: "0" }}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}
