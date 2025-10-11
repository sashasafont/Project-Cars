import { useState, useEffect } from "react";
import api from "../services/api";

export default function Filters({ onFiltersChange, currentFilters }) {
  const [fabricantes, setFabricantes] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [fuels, setFuels] = useState([]);
  const [provincias, setProvincias] = useState([]);
  
  const [filters, setFilters] = useState({
    fabricante_id: "",
    modelo_id: "",
    fuel_id: "",
    provincia_id: "",
    precio_min: "",
    precio_max: "",
    ...currentFilters
  });

  useEffect(() => {
    loadFilterOptions();
  }, []);

  const loadFilterOptions = async () => {
    try {
      const [fabricantesRes, modelosRes, fuelsRes, provinciasRes] = await Promise.all([
        api.get("/fabricantes"),
        api.get("/modelos"),
        api.get("/fuel"),
        api.get("/provincias")
      ]);
      
      setFabricantes(fabricantesRes.data);
      setModelos(modelosRes.data);
      setFuels(fuelsRes.data);
      setProvincias(provinciasRes.data);
    } catch (error) {
      console.error("Error loading filter options:", error);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      fabricante_id: "",
      modelo_id: "",
      fuel_id: "",
      provincia_id: "",
      precio_min: "",
      precio_max: ""
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h5 className="mb-0">🔍 Filtros de Búsqueda</h5>
      </div>
      <div className="card-body">
        <div className="row g-3">
          {/* Fabricante */}
          <div className="col-md-3">
            <label htmlFor="fabricante" className="form-label">Fabricante</label>
            <select
              id="fabricante"
              className="form-select"
              value={filters.fabricante_id}
              onChange={(e) => handleFilterChange("fabricante_id", e.target.value)}
            >
              <option value="">Todos los fabricantes</option>
              {fabricantes.map(f => (
                <option key={f.fabricante_id} value={f.fabricante_id}>
                  {f.fabricante}
                </option>
              ))}
            </select>
          </div>

          {/* Modelo */}
          <div className="col-md-3">
            <label htmlFor="modelo" className="form-label">Modelo</label>
            <select
              id="modelo"
              className="form-select"
              value={filters.modelo_id}
              onChange={(e) => handleFilterChange("modelo_id", e.target.value)}
            >
              <option value="">Todos los modelos</option>
              {modelos.map(m => (
                <option key={m.modelo_id} value={m.modelo_id}>
                  {m.modelo}
                </option>
              ))}
            </select>
          </div>

          {/* Combustible */}
          <div className="col-md-3">
            <label htmlFor="fuel" className="form-label">Combustible</label>
            <select
              id="fuel"
              className="form-select"
              value={filters.fuel_id}
              onChange={(e) => handleFilterChange("fuel_id", e.target.value)}
            >
              <option value="">Todos los combustibles</option>
              {fuels.map(f => (
                <option key={f.fuel_id} value={f.fuel_id}>
                  {f.fuel}
                </option>
              ))}
            </select>
          </div>

          {/* Provincia */}
          <div className="col-md-3">
            <label htmlFor="provincia" className="form-label">Provincia</label>
            <select
              id="provincia"
              className="form-select"
              value={filters.provincia_id}
              onChange={(e) => handleFilterChange("provincia_id", e.target.value)}
            >
              <option value="">Todas las provincias</option>
              {provincias.map(p => (
                <option key={p.provincia_id} value={p.provincia_id}>
                  {p.provincia}
                </option>
              ))}
            </select>
          </div>

          {/* Precio Mínimo */}
          <div className="col-md-3">
            <label htmlFor="precio_min" className="form-label">Precio Mínimo</label>
            <input
              type="number"
              id="precio_min"
              className="form-control"
              placeholder="0"
              value={filters.precio_min}
              onChange={(e) => handleFilterChange("precio_min", e.target.value)}
            />
          </div>

          {/* Precio Máximo */}
          <div className="col-md-3">
            <label htmlFor="precio_max" className="form-label">Precio Máximo</label>
            <input
              type="number"
              id="precio_max"
              className="form-control"
              placeholder="100000"
              value={filters.precio_max}
              onChange={(e) => handleFilterChange("precio_max", e.target.value)}
            />
          </div>

          {/* Botón Limpiar */}
          <div className="col-md-6 d-flex align-items-end">
            <button 
              type="button" 
              className="btn btn-outline-secondary"
              onClick={clearFilters}
            >
              🗑️ Limpiar Filtros
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
