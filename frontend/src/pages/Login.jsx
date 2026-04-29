import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "./login.css"

export default function Login(){

 const [email,setEmail]=useState("")
 const [password,setPassword]=useState("")
 const navigate=useNavigate()
 const { login } = useAuth()

 const handleLogin=()=>{
  const ok = login(email,password)
  if(ok) navigate("/dashboard")
  else alert("Use admin / admin")
 }

 return(
  <div className="login-page">

   <div className="login-card">

    <h1>PIR System</h1>
    <p>Sign in to your account</p>

    <div className="input-group">
     <span>📧</span>
     <input placeholder="Email" onChange={e=>setEmail(e.target.value)} />
    </div>

    <div className="input-group">
     <span>🔒</span>
     <input type="password" placeholder="Password" onChange={e=>setPassword(e.target.value)} />
    </div>

    <button onClick={handleLogin}>Login</button>

   </div>

  </div>
 )
}