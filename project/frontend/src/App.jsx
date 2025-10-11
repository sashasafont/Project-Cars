import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";

// Coches
import CochesList from "./pages/List";
import CochesDetails from "./pages/Detail";
import CochesStats from "./pages/Coches/CochesStats";

// Fabricantes
import FabricantesList from "./pages/Fabricantes/FabricantesList";
import FabricanteForm from "./pages/Fabricantes/FabricanteForm";

// Modelos
import ModelosList from "./pages/Modelos/ModelosList";
import ModeloForm from "./pages/Modelos/ModeloForm";

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

          {/* Fabricantes */}
          <Route path="/fabricantes" element={<FabricantesList />} />
          <Route path="/fabricantes/nuevo" element={<FabricanteForm />} />
          <Route path="/fabricantes/edit/:id" element={<FabricanteForm />} />

          {/* Modelos */}
          <Route path="/modelos" element={<ModelosList />} />
          <Route path="/modelos/nuevo" element={<ModeloForm />} />
          <Route path="/modelos/edit/:id" element={<ModeloForm />} />
        </Routes>
      </div>
    </>
  );
}