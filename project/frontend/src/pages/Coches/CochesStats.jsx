import { useEffect, useState } from "react";
import Chart from "../../components/Chart";
import api from "../../services/api";

export default function CochesStats() {
  const [stats, setStats] = useState({
    byFabricante: [],
    byFuel: [],
    byProvincia: [],
    general: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      
      // Cargar estadísticas desde diferentes endpoints
      const [vehiculosRes, fabricantesRes, fuelsRes, provinciasRes] = await Promise.all([
        api.get("/vehiculos?page_size=1000"), // Obtener todos los vehículos
        api.get("/fabricantes"),
        api.get("/fuel"),
        api.get("/provincias")
      ]);

      const vehiculos = vehiculosRes.data.data || vehiculosRes.data;
      
      // Procesar estadísticas por fabricante
      const statsByFabricante = fabricantesRes.data.map(fabricante => {
        const count = vehiculos.filter(v => v.fabricante_id === fabricante.fabricante_id).length;
        return {
          label: fabricante.fabricante,
          value: count
        };
      }).filter(item => item.value > 0);

      // Procesar estadísticas por combustible
      const statsByFuel = fuelsRes.data.map(fuel => {
        const count = vehiculos.filter(v => v.fuel_id === fuel.fuel_id).length;
        return {
          label: fuel.fuel,
          value: count
        };
      }).filter(item => item.value > 0);

      // Procesar estadísticas por provincia
      const statsByProvincia = provinciasRes.data.map(provincia => {
        const count = vehiculos.filter(v => v.provincia_id === provincia.provincia_id).length;
        return {
          label: provincia.provincia,
          value: count
        };
      }).filter(item => item.value > 0).slice(0, 10); // Solo top 10

      // Estadísticas generales
      const totalVehiculos = vehiculos.length;
      const precioPromedio = vehiculos.reduce((sum, v) => sum + (v.precio || 0), 0) / totalVehiculos;
      const precioMax = Math.max(...vehiculos.map(v => v.precio || 0));
      const precioMin = Math.min(...vehiculos.map(v => v.precio || 0));

      const generalStats = [
        { label: "Total Vehículos", value: totalVehiculos },
        { label: "Precio Promedio", value: Math.round(precioPromedio) },
        { label: "Precio Máximo", value: precioMax },
        { label: "Precio Mínimo", value: precioMin }
      ];

      setStats({
        byFabricante: statsByFabricante,
        byFuel: statsByFuel,
        byProvincia: statsByProvincia,
        general: generalStats
      });

    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando estadísticas...</span>
          </div>
          <p className="mt-2">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col">
          <h2>📊 Estadísticas de Vehículos</h2>
          <p className="text-muted">Resumen y análisis de los datos de vehículos</p>
        </div>
      </div>

      {/* Estadísticas Generales */}
      <div className="row mb-4">
        <div className="col">
          <Chart 
            data={stats.general} 
            type="stats" 
            title="📈 Estadísticas Generales" 
          />
        </div>
      </div>

      {/* Gráficos de distribución */}
      <div className="row g-4">
        <div className="col-lg-6">
          <Chart 
            data={stats.byFabricante} 
            type="bar" 
            title="🏭 Vehículos por Fabricante" 
          />
        </div>
        
        <div className="col-lg-6">
          <Chart 
            data={stats.byFuel} 
            type="pie" 
            title="⛽ Distribución por Combustible" 
          />
        </div>
      </div>

      <div className="row g-4 mt-2">
        <div className="col">
          <Chart 
            data={stats.byProvincia} 
            type="bar" 
            title="🌍 Top 10 Provincias" 
          />
        </div>
      </div>

      {/* Información adicional */}
      <div className="row mt-4">
        <div className="col">
          <div className="alert alert-info">
            <h6 className="alert-heading">ℹ️ Información</h6>
            <p className="mb-0">
              Las estadísticas se actualizan automáticamente basándose en los datos actuales de vehículos.
              Los gráficos muestran solo elementos con valores mayores a cero.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}