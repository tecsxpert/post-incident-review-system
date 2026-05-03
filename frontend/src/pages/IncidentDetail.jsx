import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api";

export default function IncidentDetail() {

 const { id } = useParams();
 const navigate = useNavigate();

 const [loading, setLoading] = useState(true);

 const [title, setTitle] = useState("");
 const [description, setDescription] = useState("");
 const [status, setStatus] = useState("OPEN");

 const isDark = document.body.classList.contains("dark");

 const colors = {
  text: isDark ? "#f9fafb" : "#111827",
  input: isDark ? "#0f172a" : "#ffffff",
  border: isDark ? "#334155" : "#e5e7eb",
  card: isDark ? "rgba(30,41,59,0.6)" : "#ffffff"
 };

 const inputStyle = {
  padding: "10px 14px",
  borderRadius: "8px",
  border: `1px solid ${colors.border}`,
  background: colors.input,
  color: colors.text,
  width: "100%"
 };

 const smallBtn = {
  padding: "6px 14px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  width: "fit-content"
 };

 // 🔹 FETCH INCIDENT
 useEffect(() => {
  const fetchData = async () => {
   try {
    const res = await API.get(`/incidents/${id}`);
    setTitle(res.data.title || "");
    setDescription(res.data.description || "");
    setStatus(res.data.status || "OPEN");
   } catch {
    alert("Failed to load incident");
   }
   setLoading(false);
  };

  fetchData();
 }, [id]);

 // 🔹 SAVE UPDATE
 const handleSave = async () => {
  try {
   await API.put(`/incidents/${id}`, {
    title,
    description,
    status
   });

   navigate("/incidents"); // ✅ go back
  } catch {
   alert("Update failed");
  }
 };

 // 🔹 CANCEL
 const handleCancel = () => {
  navigate("/incidents");
 };

 if (loading) return <h3 style={{ padding: "20px" }}>Loading...</h3>;

 return (
  <div style={{ padding: "30px", maxWidth: "600px" }}>

   <h2 style={{ color: colors.text, marginBottom: "20px" }}>
    Edit Incident
   </h2>

   <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    background: colors.card,
    padding: "20px",
    borderRadius: "12px"
   }}>

    {/* TITLE */}
    <input
     value={title}
     onChange={(e) => setTitle(e.target.value)}
     placeholder="Title"
     style={inputStyle}
    />

    {/* DESCRIPTION */}
    <textarea
     value={description}
     onChange={(e) => setDescription(e.target.value)}
     placeholder="Description"
     style={{ ...inputStyle, height: "100px" }}
    />

    {/* STATUS */}
    <select
     value={status}
     onChange={(e) => setStatus(e.target.value)}
     style={inputStyle}
    >
     <option value="OPEN">OPEN</option>
     <option value="CLOSED">CLOSED</option>
    </select>

    {/* BUTTONS */}
    <div style={{ display: "flex", gap: "10px" }}>

     <button
      onClick={handleSave}
      style={{
       ...smallBtn,
       background: "#6366f1",
       color: "white"
      }}
     >
      Save
     </button>

     <button
      onClick={handleCancel}
      style={{
       ...smallBtn,
       background: "#6b7280",
       color: "white"
      }}
     >
      Cancel
     </button>

    </div>

   </div>
  </div>
 );
}