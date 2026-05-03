import { useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../api"
import "./incidentForm.css"

export default function CreateIncident(){

 const navigate = useNavigate()
 const [saving,setSaving]=useState(false)

 const [data,setData]=useState({
  title:"",
  description:"",
  status:"OPEN"
 })

 const handleSubmit = async () => {

  if(!data.title || !data.description){
   alert("Fill all fields")
   return
  }

  try{
   setSaving(true)

   await API.post("/incidents", {
    title: data.title,
    description: data.description,
    status: data.status
   })

   navigate("/incidents")

  }catch(e){
   console.error(e)
   alert("Create failed")
  }finally{
   setSaving(false)
  }
 }

 return(
  <div className="form-wrapper">
   <div className="form-card">

    <h2>Create Incident</h2>

    <input
     placeholder="Title"
     value={data.title}
     onChange={(e)=>setData({...data,title:e.target.value})}
    />

    <textarea
     placeholder="Description"
     value={data.description}
     onChange={(e)=>setData({...data,description:e.target.value})}
    />

    <select
     value={data.status}
     onChange={(e)=>setData({...data,status:e.target.value})}
    >
     <option value="OPEN">OPEN</option>
     <option value="CLOSED">CLOSED</option>
    </select>

    <button disabled={saving} onClick={handleSubmit}>
     {saving ? "Creating..." : "Create"}
    </button>

   </div>
  </div>
 )
}