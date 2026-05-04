import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Incidents from "./pages/Incidents"
import CreateIncident from "./pages/CreateIncident"
import IncidentDetail from "./pages/IncidentDetail"
import Layout from "./components/Layout"
import ProtectedRoute from "./routes/ProtectedRoute"
import AIPanel from "./pages/AIPanel"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/incidents" element={<Incidents />} />
            <Route path="/create" element={<CreateIncident />} />
            <Route path="/incident/:id" element={<IncidentDetail />} />
            <Route path="/ai" element={<AIPanel />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}
