import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/coches";

export default function CochesDetails() {
  const { id } = useParams();
  const [coche, setCoche] = useState(null);

  useEffect(() => {
    axios.get(`${API_URL}/vehiculos/${id}`)
      .then((res) => setCoche(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!coche) return <p>Cargando...</p>;

  return (
    <div>
      <h2>Detalles del Coche</h2>
      <ul className="list-group">
        <li className="list-group-item"><b>ID:</b> {coche.id}</li>
        <li className="list-group-item"><b>Fabricante:</b> {coche.fabricante}</li>
        <li className="list-group-item"><b>Modelo:</b> {coche.modelo}</li>
        <li className="list-group-item"><b>Precio:</b> {coche.precio} €</li>
        <li className="list-group-item"><b>Provincia:</b> {coche.provincia}</li>
        <li className="list-group-item"><b>Fuel:</b> {coche.fuel}</li>
        <li className="list-group-item"><b>Cliente:</b> {coche.cliente}</li>
        <li className="list-group-item"><b>Fecha:</b> {coche.fecha?.slice(0, 10)}</li>
      </ul>
      <Link to="/coches" className="btn btn-secondary mt-3">Volver</Link>
    </div>
  );
}