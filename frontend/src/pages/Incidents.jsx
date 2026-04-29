import { useEffect,useState } from "react"
import { useNavigate } from "react-router-dom"
import { API } from "../api"
import "./incidents.css"

export default function Incidents(){

 const [incidents,setIncidents]=useState([])
 const [page,setPage]=useState(0)
 const [loading,setLoading]=useState(true)
 const [error,setError]=useState(null)
 const [hasMore,setHasMore]=useState(true)

 const navigate = useNavigate()

 useEffect(()=>{
  setLoading(true)
  setError(null)

  API.get(`/incidents?page=${page}&size=5`)
   .then(res=>{
    setIncidents(res.data.content || [])
    setHasMore(!res.data.last)
    setLoading(false)
   })
   .catch(()=>{
    setError("Failed to load incidents")
    setLoading(false)
   })

 },[page])

 if(loading) return <p className="center">Loading...</p>
 if(error) return <p className="center error">{error}</p>

 return(
  <div className="page">

   <div className="header">
    <h1>Incidents</h1>
    <button className="create-btn" onClick={()=>navigate("/create")}>
     + Create
    </button>
   </div>

   {incidents.length===0 ? (
    <div className="empty">
     <p>No incidents found</p>
    </div>
   ) : (
    <div className="incident-grid">
     {incidents.map(item=>(
      <div
       key={item.id}
       className="card"
       onClick={()=>navigate(`/incident/${item.id}`)}
      >
       <h3>{item.title}</h3>
       <p>{item.description}</p>

       <div className="meta">
        <span className={`badge ${item.status}`}>{item.status}</span>
        <span className={`badge ${item.severity}`}>{item.severity}</span>
       </div>
      </div>
     ))}
    </div>
   )}

   <div className="pagination">
    <button
     className="page-btn"
     disabled={page===0}
     onClick={()=>setPage(p=>p-1)}
    >
     ← Prev
    </button>

    <span className="page-number">Page {page+1}</span>

    <button
     className="page-btn"
     disabled={!hasMore}
     onClick={()=>setPage(p=>p+1)}
    >
     Next →
    </button>
   </div>

  </div>
 )
}