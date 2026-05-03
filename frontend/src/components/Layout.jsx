import { Outlet,useNavigate,useLocation } from "react-router-dom"
import { useTheme } from "../context/ThemeContext"
import { useAuth } from "../context/AuthContext"
import "./layout.css"

export default function Layout(){

 const { dark,toggleTheme } = useTheme()
 const { logout } = useAuth()
 const navigate = useNavigate()
 const location = useLocation()

 return(
  <div className="layout">

   <div className="sidebar">

    <h2>PIR System</h2>

    <button className={location.pathname==="/dashboard"?"active":""}
     onClick={()=>navigate("/dashboard")}>
     Dashboard
    </button>

    <button className={location.pathname==="/incidents"?"active":""}
     onClick={()=>navigate("/incidents")}>
     Incidents
    </button>
<button onClick={()=>navigate("/ai")}>
 🤖 AI Assistant
</button>
    <button onClick={toggleTheme}>
     {dark ? "☀ Light" : "🌙 Dark"}
    </button>

    <button className="logout" onClick={()=>{
     logout()
     navigate("/login")
    }}>
     Logout
    </button>

   </div>

   <div className="content">
    <Outlet/>
   </div>

  </div>
 )
}