import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getVehiculos } from "../../api";

export default function CochesList() {
  const [coches, setCoches] = useState([]);

  useEffect(() => {
    getVehiculos({ page: 1, page_size: 20 })
      .then((data) => setCoches(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2>Listado de Coches</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Fabricante</th>
            <th>Modelo</th>
            <th>Precio</th>
            <th>Provincia</th>
            <th>Detalles</th>
          </tr>
        </thead>
        <tbody>
          {coches.map((coche) => (
            <tr key={coche.id}>
              <td>{coche.id}</td>
              <td>{coche.fabricante}</td>
              <td>{coche.modelo}</td>
              <td>{coche.precio} €</td>
              <td>{coche.provincia}</td>
              <td>
                <Link to={`/coches/${coche.id}`} className="btn btn-primary btn-sm">
                  Ver
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}