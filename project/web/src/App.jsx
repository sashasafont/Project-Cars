import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";

// Coches
import CochesList from "./pages/List";
import CochesDetails from "./pages/Details";

export default function App() {
  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          {/* Redirigir raíz */}
          <Route path="/" element={<Navigate to="/coches" replace />} />

          {/* Coches */}
          <Route path="/coches" element={<CochesList />} />
          <Route path="/coches/:id" element={<CochesDetails />} />
          <Route path="/coches/stats" element={<CochesStats />} />
        </Routes>
      </div>
    </>
  );
}