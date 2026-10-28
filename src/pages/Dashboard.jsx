import { useMemo } from "react";
import Layout from "../components/Layout";
import MetricCard from "../components/MetricCard";
import HistoryChart from "../components/HistoryChart";
import BalancaCard from "../components/BalancaCard";
import ControlsPanel from "../components/ControlsPanel";
import { PERFIS, FOLGA_TEMP, FOLGA_UMID } from "../constants/filament";
import { useEstufaControls } from "../hooks/useEstufaControls";

function formatTempoRestante(minutes) {
  const total = Math.max(0, Math.ceil(Number(minutes) || 0));
  const hours = Math.floor(total / 60);
  const mins = total % 60;
  return `Resta: ${hours}h ${mins} min`;
}

function checkRange(value, min, max) {
  return value >= min && value <= max;
}

function badge(ok, ativo) {
  if (!ativo) return { status: "—", statusClass: "ok" };
  return ok
    ? { status: "OK", statusClass: "ok" }
    : { status: "FORA", statusClass: "error" };
}

export default function Dashboard() {
  const {
    sensor,
    online,
    lastUpdate,
    poll,
    material,
    ativo,
    ...controls
  } = useEstufaControls();

  const perfil = PERFIS[material] ?? PERFIS.PLA;

  const values = useMemo(() => {
    if (!sensor) {
      return { temperature: 0, humidity: 0, setpoint: 0, validade: null };
    }
    return {
      temperature: Number(sensor.temp ?? sensor.temperature ?? 0),
      humidity: Number(sensor.umid ?? sensor.humidity ?? sensor.hum ?? 0),
      setpoint: Number(sensor.setpoint ?? 0),
      validade: sensor.validade,
    };
  }, [sensor]);

  const chartHistory = useMemo(() => {
    const temps = sensor?.historico?.temp;
    if (!temps?.length) return [];
    const umids = sensor.historico.umid ?? [];
    return temps.map((t, i) => ({
      time: "",
      temperature: Number(t),
      humidity: Number(umids[i] ?? 0),
    }));
  }, [sensor]);

  const modoSecagem =
    String(sensor?.modo ?? "").toLowerCase() === "secagem";

  // Faixas de referência seguem o modo atual (secagem ou armazenamento),
  // usando o setpoint enviado pelo firmware e a umidade alvo do material.
  const tempMin = values.setpoint - FOLGA_TEMP;
  const tempMax = values.setpoint + FOLGA_TEMP;
  const umidMax = perfil.umidadeAlvo + FOLGA_UMID;

  const states = {
    temperature: checkRange(values.temperature, tempMin, tempMax),
    humidity: values.humidity <= umidMax,
  };

  const allOk = Object.values(states).every(Boolean);
  const status = !sensor
    ? {
        title: "CARREGANDO...",
        details: "Aguarde enquanto coletamos dados dos sensores",
        className: "ideal",
      }
    : !ativo
      ? {
          title: "SISTEMA DESLIGADO",
          details: `Material selecionado: ${material}`,
          className: "ideal",
        }
    : allOk
      ? {
          title: "AMBIENTE IDEAL",
          details: `Parâmetros adequados para ${material}`,
          className: "ideal",
        }
      : {
          title: "ATENÇÃO",
          details: `Um ou mais parâmetros estão fora do ideal para ${material}`,
          className: "ruim",
        };

  const tempoRestante = Number(sensor?.tempoRestante ?? 0);
  const resistencia = !!sensor?.resistencia;
  const ventoinha = !!sensor?.ventoinha;

  return (
    <Layout title="🖨️ PRINTSAFE" dashboard>
      <a href="#main-content" className="skip-link">
        Pular para conteúdo principal
      </a>

      <main id="main-content" className="container">
        <div className={`card status-card ${status.className}`}>
          <h2>{status.title}</h2>
          <p>{status.details}</p>
        </div>

        <div className="dashboard-grid">
          <MetricCard
            icon="🌡️"
            label="Temperatura"
            value={sensor ? `${values.temperature.toFixed(1)} °C` : "--"}
            range={sensor ? `Ideal: ${tempMin.toFixed(0)}–${tempMax.toFixed(0)} °C` : "--"}
            {...badge(states.temperature, ativo)}
          />
          <MetricCard
            icon="💧"
            label="Umidade"
            value={sensor ? `${values.humidity.toFixed(1)} %` : "--"}
            range={`Ideal: até ${umidMax} %`}
            {...badge(states.humidity, ativo)}
          />
          <MetricCard
            icon="🎯"
            label="Setpoint"
            value={sensor ? `${values.setpoint.toFixed(1)} °C` : "--"}
            range={`Secagem ${perfil.tempSecagem} °C · Armaz. ${perfil.tempArmazenamento} °C`}
            status={modoSecagem ? "SECAGEM" : "ARMAZ."}
            statusClass="ok"
          />
          <MetricCard
            icon="📅"
            label="Validade"
            value={
              sensor && values.validade !== undefined && values.validade !== null
                ? `${values.validade} dias`
                : "--"
            }
            range="Dias"
            status="—"
            statusClass="ok"
          />
        </div>

        <div className="dashboard-bottom">
          <div className="card chart-card">
            <h3>📊 HISTÓRICO EM TEMPO REAL</h3>
            <div className="chart-container">
              <HistoryChart history={chartHistory} />
            </div>
          </div>

          <div className="card controls-card">
            <h3>⚙️ CONTROLES</h3>
            <ControlsPanel material={material} ativo={ativo} {...controls} />
          </div>
        </div>

        <div className="card controls-card">
          <h3>📡 STATUS</h3>

          <div className="status-buttons">
            <button
              type="button"
              className={`button-status${resistencia ? " active" : ""}`}
            >
              ⚡ Resistência
            </button>

            <button
              type="button"
              className={`button-status${ventoinha ? " active" : ""}`}
            >
              🌀 Ventoinha
            </button>

            <button
              type="button"
              className={`button-status${ativo ? " active" : ""}`}
            >
              {modoSecagem ? "🔥 Secagem" : "🟢 Armazenamento"}
              {tempoRestante > 0 ? (
                <p>{formatTempoRestante(tempoRestante)}</p>
              ) : (
                <p>Modo atual</p>
              )}
            </button>
          </div>
        </div>

        <BalancaCard
          pesoAtual={sensor?.pesoAtual}
          pesoMaximo={sensor?.pesoMaximo}
          tara={sensor?.tara}
          onRefresh={poll}
        />

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
