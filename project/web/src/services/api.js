import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/coches";

export const getVehiculos = async (params) => {
  const res = await axios.get(`${API_URL}/vehiculos`, { params });
  return res.data;
};

export const getStatsPrecio = async (marca, modelo) => {
  const res = await axios.get(`${API_URL}/stats/precio`, { params: { marca, modelo } });
  return res.data;
};