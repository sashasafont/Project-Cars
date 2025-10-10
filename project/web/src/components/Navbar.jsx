import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/coches">
          🚗 CochesApp
        </Link>
        <div>
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/coches">Listado</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/coches/stats">Estadísticas</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}