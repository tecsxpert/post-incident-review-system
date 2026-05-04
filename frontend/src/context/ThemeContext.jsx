import { createContext,useContext,useState,useEffect } from "react"

const ThemeContext=createContext()

export function ThemeProvider({children}){

 const [dark,setDark]=useState(localStorage.getItem("theme")==="dark")

 useEffect(()=>{
  const root=document.documentElement
  if(dark){
   root.setAttribute("data-theme","dark")
  }else{
   root.removeAttribute("data-theme")
  }
  localStorage.setItem("theme",dark?"dark":"light")
 },[dark])

 return(
  <ThemeContext.Provider value={{dark,toggleTheme:()=>setDark(!dark)}}>
   {children}
  </ThemeContext.Provider>
 )
}

export const useTheme=()=>useContext(ThemeContext)