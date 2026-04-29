import { useEffect,useState } from "react"
import { useParams,useNavigate } from "react-router-dom"
import { API } from "../api"

export default function IncidentDetail(){

 const { id } = useParams()
 const navigate = useNavigate()

 const [incident,setIncident]=useState(null)
 const [edit,setEdit]=useState(false)

 useEffect(()=>{
  API.get(`/incidents/${id}`)
   .then(res=>setIncident(res.data))
 },[id])

 const handleDelete=()=>{
  const ok = window.confirm("Are you sure?")
  if(!ok) return

  API.delete(`/incidents/${id}`)
   .then(()=>{
    alert("Deleted")
    navigate("/incidents")
   })
 }

 const handleUpdate=()=>{
  API.put(`/incidents/${id}`,incident)
   .then(()=>setEdit(false))
 }

 if(!incident) return <h2>Loading...</h2>

 return(
  <div style={{padding:"30px"}}>

   <h2>{edit ? "Edit Incident" : incident.title}</h2>

   {edit ? (
    <>
     <input
      value={incident.title}
      onChange={(e)=>setIncident({...incident,title:e.target.value})}
     />

     <textarea
      value={incident.description}
      onChange={(e)=>setIncident({...incident,description:e.target.value})}
     />

     <button onClick={handleUpdate}>Save</button>
     <button onClick={()=>setEdit(false)}>Cancel</button>
    </>
   ) : (
    <>
     <p>{incident.description}</p>

     <button onClick={()=>setEdit(true)}>Edit</button>
     <button onClick={handleDelete}>Delete</button>
    </>
   )}

  </div>
 )
}