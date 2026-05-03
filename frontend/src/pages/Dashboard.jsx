import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { useTheme } from "../context/ThemeContext"
import API from "../api"
import "./dashboard.css"

export default function Dashboard(){

 const { dark } = useTheme()

 const [stats, setStats] = useState({
  total: 0,
  open: 0,
  closed: 0
 })

 const [loading, setLoading] = useState(true)

 // 🔥 FETCH FROM BACKEND
 useEffect(() => {
  fetchStats()
 }, [])

 const fetchStats = async () => {
  try {
   const res = await API.get("/incidents/stats")

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
  { name:"Total", value:stats.total },
  { name:"Open", value:stats.open },
  { name:"Closed", value:stats.closed }
 ]

 if (loading) return <h3 style={{ padding:"20px" }}>Loading...</h3>

 return(
  <div className="dashboard">

   <div className="header">
    <h1>Incident Dashboard</h1>
    <p>Overview of system incidents</p>
   </div>

   <div className="stats">

    <div className="card">
     <span>Total</span>
     <h2>{stats.total}</h2>
    </div>

    <div className="card">
     <span>Open</span>
     <h2>{stats.open}</h2>
    </div>

    <div className="card">
     <span>Closed</span>
     <h2>{stats.closed}</h2>
    </div>

   </div>

   <div className="chart-container">

    <h3>Incident Overview</h3>

    <ResponsiveContainer width="100%" height={300}>
     <BarChart data={data}>
      <XAxis dataKey="name" stroke={dark ? "#cbd5f5" : "#555"} />
      <YAxis stroke={dark ? "#cbd5f5" : "#555"} />
      <Tooltip />
      <Bar dataKey="value" fill={dark ? "#818cf8" : "#6366f1"} radius={[8,8,0,0]} />
     </BarChart>
    </ResponsiveContainer>

   </div>

  </div>
 )
}