import { createContext,useContext,useState } from "react"

const AuthContext=createContext()

export function AuthProvider({children}){

 const [user,setUser]=useState(localStorage.getItem("user"))

 const login=(email,password)=>{
  if(email==="admin" && password==="admin"){
   localStorage.setItem("user","true")
   setUser("true")
   return true
  }
  return false
 }

 const logout=()=>{
  localStorage.removeItem("user")
  setUser(null)
 }

 return(
  <AuthContext.Provider value={{user,login,logout}}>
   {children}
  </AuthContext.Provider>
 )
}

export const useAuth=()=>useContext(AuthContext)