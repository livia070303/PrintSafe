import React, { useEffect, useState } from "react";
import { fetchData } from "../services/api.js";
import SensorCard from "./SensorCard.jsx";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const d = await fetchData();
        setData(d);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  if (!data) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <h1>PrintSafe Dashboard</h1>

      <div className="grid">
        <SensorCard
          title="Temperatura"
          value={data.temperature}
          unit="°C"
        />

        <SensorCard
          title="Umidade"
          value={data.humidity}
          unit="%"
        />

        <SensorCard 
          title="Setpoint" 
          value={data.temperature} 
          unit="°C" 
        />

        <SensorCard 
          title="Validade" 
          value={data.validity} 
          unit="dias" 
        />

      </div>
    </div>
  );
}