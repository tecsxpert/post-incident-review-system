import { useState } from "react"
import API from "../api"

export default function AIPanel(){

 const [input,setInput]=useState("")
 const [response,setResponse]=useState("")
 const [loading,setLoading]=useState(false)

 const handleAsk = async () => {

  if(!input) return

  try{
   setLoading(true)
   setResponse("")

   const res = await API.post("/ai/analyze", {
    prompt: input
   })

   setResponse(res.data)

  }catch(e){
   setResponse("❌ Failed to fetch AI response")
  }finally{
   setLoading(false)
  }
 }

 return(
  <div style={{ padding:"30px", maxWidth:"700px", margin:"auto" }}>

   <h2>🤖 AI Assistant</h2>

   <textarea
    placeholder="Ask something about incidents..."
    value={input}
    onChange={(e)=>setInput(e.target.value)}
    style={{
     width:"100%",
     height:"100px",
     marginBottom:"10px",
     padding:"10px",
     borderRadius:"8px"
    }}
   />

   <button onClick={handleAsk}>
    Ask AI
   </button>

   {/* 🔄 LOADING SPINNER */}
   {loading && (
    <div style={{ marginTop:"20px" }}>
     <p>⏳ Generating response...</p>
    </div>
   )}

   {/* 📦 FORMATTED RESPONSE CARD */}
   {response && !loading && (
    <div style={{
     marginTop:"20px",
     padding:"15px",
     borderRadius:"10px",
     background:"#f3f4f6",
     border:"1px solid #ddd"
    }}>
     <h4>Response</h4>
     <pre style={{ whiteSpace:"pre-wrap" }}>
      {response}
     </pre>
    </div>
   )}

  </div>
 )
}