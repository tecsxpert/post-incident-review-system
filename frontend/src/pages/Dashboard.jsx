import { useState } from "react"
import { BarChart,Bar,XAxis,YAxis,Tooltip,ResponsiveContainer } from "recharts"
import { useTheme } from "../context/ThemeContext"
import "./dashboard.css"

export default function Dashboard(){

 const { dark } = useTheme()

 const [stats]=useState({
  total:2,
  open:2,
  closed:0,
  critical:1
 })

 const data=[
  { name:"Total",value:stats.total },
  { name:"Open",value:stats.open },
  { name:"Closed",value:stats.closed },
  { name:"Critical",value:stats.critical }
 ]

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

    <div className="card">
     <span>Critical</span>
     <h2>{stats.critical}</h2>
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