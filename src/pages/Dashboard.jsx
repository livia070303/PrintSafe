import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import MetricCard from "../components/MetricCard";
import HistoryChart from "../components/HistoryChart";
import { getSensorData } from "../services/api";

const DEFAULT_LIMITS = {
  PLA: { tempMin: 18, tempMax: 28, humMin: 40, humMax: 60, lightMax: 3000, soundMaxDB: 70 },
  PETG: { tempMin: 20, tempMax: 30, humMin: 30, humMax: 50, lightMax: 3000, soundMaxDB: 70 },
  ABS: { tempMin: 22, tempMax: 32, humMin: 20, humMax: 40, lightMax: 3000, soundMaxDB: 70 },
  RESINA: { tempMin: 20, tempMax: 25, humMin: 40, humMax: 60, lightMax: 1000, soundMaxDB: 65 },
};

const MAX_DATA_POINTS = 30;

function checkRange(value, min, max) {
  return value >= min && value <= max;
}

function badge(ok) {
  return ok
    ? { status: "OK", statusClass: "ok" }
    : { status: "FORA", statusClass: "error" };
}

export default function Dashboard() {
  const [material, setMaterial] = useState(
    () => localStorage.getItem("material") || "PLA"
  );
  const [sensor, setSensor] = useState(null);
  const [history, setHistory] = useState([]);
  const [online, setOnline] = useState(true);
  const [lastUpdate, setLastUpdate] = useState("--");

  useEffect(() => {
    localStorage.setItem("material", material);
  }, [material]);

  useEffect(() => {
    let mounted = true;

    const poll = async () => {
      try {
        const data = await getSensorData();
        if (!mounted) return;

        setSensor(data);
        setOnline(true);

        const now = new Date();
        setLastUpdate(now.toLocaleTimeString("pt-BR"));

        setHistory((old) => [
          ...old,
          {
            time: now.toLocaleTimeString("pt-BR"),
            temperature: Number(data.temperature ?? data.temp ?? 0),
            humidity: Number(data.humidity ?? data.hum ?? 0),
            light: Number(data.light ?? 0),
            soundDB: Number(data.soundDB ?? data.sound ?? 0),
          },
        ].slice(-MAX_DATA_POINTS));
      } catch {
        if (mounted) setOnline(false);
      }
    };

    poll();
    const timer = setInterval(poll, 2000);
    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, []);

  const limits = DEFAULT_LIMITS[material];

  const values = useMemo(() => {
    if (!sensor) {
      return {
        temperature: 0,
        humidity: 0,
        light: 0,
        soundDB: 0,
      };
    }

    return {
      temperature: Number(sensor.temperature ?? sensor.temp ?? 0),
      humidity: Number(sensor.humidity ?? sensor.hum ?? 0),
      light: Number(sensor.light ?? 0),
      soundDB: Number(sensor.soundDB ?? sensor.sound ?? 0),
    };
  }, [sensor]);

  const states = {
    temperature: checkRange(values.temperature, limits.tempMin, limits.tempMax),
    humidity: checkRange(values.humidity, limits.humMin, limits.humMax),
    light: values.light <= limits.lightMax,
    soundDB: values.soundDB <= limits.soundMaxDB,
  };

  const allOk = Object.values(states).every(Boolean);
  const status = !sensor
    ? { title: "CARREGANDO...", details: "Aguarde enquanto coletamos dados dos sensores", className: "ideal" }
    : allOk
      ? { title: "AMBIENTE IDEAL", details: `Parâmetros adequados para ${material}`, className: "ideal" }
      : { title: "ATENÇÃO", details: `Um ou mais parâmetros estão fora do ideal para ${material}`, className: "ruim" };

  function showLogs() {
    alert("A visualização de logs pode ser conectada ao seu endpoint de logs.");
  }

  function downloadToday() {
    const csv = [
      "Horário,Temperatura,Umidade,Peso do Filamento",
      ...history.map((item) =>
        `${item.time},${item.temperature},${item.humidity},${item.weight}`
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "printsafe-hoje.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Layout title="🖨️ PRINTSAFE" dashboard>
      <a href="#main-content" className="skip-link">Pular para conteúdo principal</a>

      <main id="main-content" className="container">
        <div className="card controls-card">
          <div className="control-group">
            <label htmlFor="materialSelect">🎯 MATERIAL SELECIONADO</label>
            <select
              id="materialSelect"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
            >
              <option value="PLA">PLA</option>
              <option value="PETG">PETG</option>
              <option value="ABS">ABS</option>
              <option value="RESINA">Resina</option>
            </select>
          </div>
        </div>

        <div className={`card status-card ${status.className}`}>
          <h2>{status.title}</h2>
          <p>{status.details}</p>
        </div>

        <div className="dashboard-grid">
          <MetricCard
            icon="🌡️"
            label="Temperatura"
            value={sensor ? `${values.temperature.toFixed(1)} °C` : "--"}
            range={`Ideal: ${limits.tempMin}–${limits.tempMax} °C`}
            {...badge(states.temperature)}
          />
          <MetricCard
            icon="💧"
            label="Umidade"
            value={sensor ? `${values.humidity.toFixed(1)} %` : "--"}
            range={`Ideal: ${limits.humMin}–${limits.humMax} %`}
            {...badge(states.humidity)}
          />
          <MetricCard 
            icon="⚖️" 
            label="Peso do filamento" 
            value={sensor ? `${values.weight.toFixed(0)} g` : "--"} 
            range="Peso atual do filamento" 
            {...badge(states.weight)} 
          />
        </div>

        <div className="card chart-card">
          <h3>📊 HISTÓRICO EM TEMPO REAL</h3>
          <div className="chart-container">
            <HistoryChart history={history} />
          </div>
        </div>

        {/* <div className="card controls-card">
          <div className="control-group">
            <label>🎛️ AÇÕES</label>
            <div className="btn-group">
              <button className="btn btn-primary" onClick={showLogs}>
                <span>📁 Ver Logs</span>
              </button>
              <button className="btn btn-secondary" onClick={downloadToday}>
                <span>⬇️ Download Hoje</span>
              </button>
            </div>
          </div>
        </div> */}

        <div className="footer">
          <p>
            Status: <strong>{online ? "ONLINE" : "OFFLINE"}</strong> ·
            Última atualização: <span>{lastUpdate}</span>
          </p>
        </div>
      </main>
    </Layout>
  );
}