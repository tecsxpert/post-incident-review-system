import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function Incidents() {

 const navigate = useNavigate();

 const [data, setData] = useState([]);
 const [loading, setLoading] = useState(true);

 const [q, setQ] = useState("");
 const [status, setStatus] = useState("");
 const [start, setStart] = useState("");
 const [end, setEnd] = useState("");

 const [page, setPage] = useState(0);
 const [totalPages, setTotalPages] = useState(1);

 const isDark = document.body.classList.contains("dark");

 const colors = {
  text: isDark ? "#f9fafb" : "#111827",
  subText: isDark ? "#9ca3af" : "#6b7280",
  card: isDark ? "rgba(30,41,59,0.6)" : "#ffffff",
  input: isDark ? "#0f172a" : "#ffffff",
  border: isDark ? "#334155" : "#e5e7eb"
 };

 const inputStyle = {
  padding: "10px 14px",
  borderRadius: "8px",
  border: `1px solid ${colors.border}`,
  background: colors.input,
  color: colors.text
 };

 const cardStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "18px",
  borderRadius: "12px",
  background: colors.card,
  backdropFilter: "blur(10px)",
  boxShadow: isDark
   ? "0 4px 20px rgba(0,0,0,0.4)"
   : "0 2px 10px rgba(0,0,0,0.08)"
 };

 const createBtn = {
  background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
  color: "white",
  padding: "6px 14px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  width: "fit-content"
 };

 const smallBtn = {
  padding: "6px 14px",
  borderRadius: "8px",
  border: "none",
  background: "#6366f1",
  color: "white",
  cursor: "pointer",
  width: "fit-content"
 };

 const editBtn = {
  background: "#3b82f6",
  color: "white",
  border: "none",
  padding: "6px 10px",
  borderRadius: "6px",
  cursor: "pointer"
 };

 const deleteBtn = {
  background: "#ef4444",
  color: "white",
  border: "none",
  padding: "6px 10px",
  borderRadius: "6px",
  cursor: "pointer"
 };

 const badgeStyle = {
  padding: "5px 10px",
  borderRadius: "20px",
  color: "white",
  fontSize: "12px",
  fontWeight: "600"
 };

 // 🔥 FETCH ONLY ON PAGE CHANGE (NOT DATE CHANGE)
 useEffect(() => {
  fetchData();
 }, [page]);

 const fetchData = async () => {
  setLoading(true);
  try {
   const res = await API.get("/incidents/search", {
    params: {
     q: q || null,
     status: status || null,
     start: start || null,
     end: end || null,
     page,
     size: 5
    }
   });
   setData(res.data.content);
   setTotalPages(res.data.totalPages);
  } catch {
   alert("Server error");
  }
  setLoading(false);
 };

 // 🔥 APPLY FILTER BUTTON
 const applyFilters = () => {
  setPage(0); // reset page
  fetchData();
 };

 const handleDelete = async (id) => {
  if (!window.confirm("Delete this incident?")) return;
  await API.delete(`/incidents/${id}`);
  fetchData();
 };

 if (loading)
  return <h3 style={{ padding: "20px", color: colors.text }}>Loading...</h3>;

 return (
  <div style={{ padding: "30px" }}>

   {/* HEADER */}
   <div style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px"
   }}>
    <h2 style={{ color: colors.text }}>Incidents</h2>

    <button style={createBtn} onClick={() => navigate("/create")}>
     + Create
    </button>
   </div>

   {/* FILTER */}
<div style={{
 display: "flex",
 gap: "12px",
 marginBottom: "25px",
 flexWrap: "wrap",
 alignItems: "center"
}}>

 <input
  placeholder="Search..."
  onChange={e => setQ(e.target.value)}
  style={inputStyle}
 />

 <select onChange={e => setStatus(e.target.value)} style={inputStyle}>
  <option value="">All</option>
  <option value="OPEN">OPEN</option>
  <option value="CLOSED">CLOSED</option>
 </select>

 {/* DATE RANGE */}
{/* DATE RANGE */}
<div style={{
 display: "flex",
 alignItems: "center",
 gap: "10px",
 padding: "6px 10px",
 borderRadius: "10px",
 background: isDark ? "rgba(30,41,59,0.6)" : "#f9fafb",
 border: `1px solid ${colors.border}`
}}>

 <span style={{
  fontSize: "13px",
  fontWeight: "600",
  color: colors.subText
 }}>
  Date Range
 </span>

 <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
  <span style={{ fontSize: "12px", color: colors.subText }}>From</span>

  <input
   type="date"
   value={start}
   onChange={e => setStart(e.target.value)}
   style={{ ...inputStyle, padding: "6px 10px" }}
  />
 </div>

 <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
  <span style={{ fontSize: "12px", color: colors.subText }}>To</span>

  <input
   type="date"
   value={end}
   onChange={e => setEnd(e.target.value)}
   style={{ ...inputStyle, padding: "6px 10px" }}
  />
 </div>

</div>

 <button style={smallBtn} onClick={applyFilters}>
  Apply
 </button>

</div>

   {/* LIST */}
   {data.length === 0 ? (
    <p style={{ color: colors.subText }}>No incidents found</p>
   ) : (
    <div style={{ display: "grid", gap: "15px" }}>
     {data.map(i => (
      <div key={i.id} style={cardStyle}>

       <div onClick={() => navigate(`/incident/${i.id}`)} style={{ cursor: "pointer" }}>
        <h3 style={{ margin: 0, color: colors.text }}>{i.title}</h3>
        <p style={{ margin: "6px 0", color: colors.subText }}>{i.description}</p>
       </div>

       <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{
         ...badgeStyle,
         background: i.status === "OPEN" ? "#f59e0b" : "#22c55e"
        }}>
         {i.status}
        </span>

        <button style={editBtn} onClick={() => navigate(`/incident/${i.id}`)}>
         Edit
        </button>

        <button style={deleteBtn} onClick={() => handleDelete(i.id)}>
         Delete
        </button>
       </div>

      </div>
     ))}
    </div>
   )}

   {/* PAGINATION */}
   <div style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "15px",
    marginTop: "30px"
   }}>
    <button disabled={page === 0} onClick={() => setPage(p => p - 1)} style={smallBtn}>
     Prev
    </button>

    <span style={{ color: colors.text, fontWeight: "600" }}>
     Page {page + 1} of {totalPages}
    </span>

    <button disabled={page === totalPages - 1} onClick={() => setPage(p => p + 1)} style={smallBtn}>
     Next
    </button>
   </div>

  </div>
 );
}