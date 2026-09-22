import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { getConfig, getSystem, saveConfig, saveSystem } from "../services/api";

const initialConfig = {
  tempMin: "",
  tempMax: "",
  humMin: "",
  humMax: "",
  weightMin: "",
};

const initialSystem = {
  machineName: "",
  interval: "",
  alertLimit: "",
  logs: true,
};

export default function Config() {
  const [config, setConfig] = useState(initialConfig);
  const [system, setSystem] = useState(initialSystem);

  useEffect(() => {
    Promise.all([getConfig(), getSystem()])
      .then(([data, systemData]) => {
        setConfig({
          tempMin: data.temperatura?.min ?? data.tempMin ?? "",
          tempMax: data.temperatura?.max ?? data.tempMax ?? "",
          humMin: data.umidade?.min ?? data.humMin ?? "",
          humMax: data.umidade?.max ?? data.humMax ?? "",
          weightMin: data.peso?.min ?? data.weightMin ?? "",
          weightMax: data.peso?.max ?? data.weightMax ?? "",
        });

        setSystem({
          machineName: systemData.machineName ?? "",
          interval: systemData.interval ?? "",
          alertLimit: systemData.alertLimit ?? "",
          logs: Boolean(systemData.logs),
        });
      })
      .catch((error) => {
        console.error(error);
        alert("Erro ao carregar configurações");
      });
  }, []);

  const setConfigField = (field, value) =>
    setConfig((old) => ({ ...old, [field]: value }));

  const setSystemField = (field, value) =>
    setSystem((old) => ({ ...old, [field]: value }));

  async function handleConfig(e) {
    e.preventDefault();

    try {
      await saveConfig({
        tempMin: Number(config.tempMin),
        tempMax: Number(config.tempMax),
        humMin: Number(config.humMin),
        humMax: Number(config.humMax),
        weightMin: Number(config.weightMin),
        weightMax: Number(config.weightMax),
      });
      alert("✅ Configuração salva com sucesso!");
    } catch (error) {
      console.error(error);
      alert("❌ Erro ao salvar configuração");
    }
  }

  async function handleSystem(e) {
    e.preventDefault();

    try {
      await saveSystem({
        machineName: system.machineName,
        interval: Number(system.interval),
        logs: system.logs,
        alertLimit: Number(system.alertLimit),
      });
      alert("✅ Sistema salvo com sucesso!");
    } catch (error) {
      console.error(error);
      alert("❌ Erro ao salvar sistema");
    }
  }

  return (
    <Layout title="⚙️ CONFIG AVANÇADA">
      <main className="page-container">
        <section className="card">
          <h3>📊 Ajuste de Limites</h3>
          <form onSubmit={handleConfig}>
            <div className="form-grid two-columns">
              <NumberField label="Temperatura Mínima" value={config.tempMin} onChange={(v) => setConfigField("tempMin", v)} />
              <NumberField label="Temperatura Máxima" value={config.tempMax} onChange={(v) => setConfigField("tempMax", v)} />
              <NumberField label="Umidade Mínima" value={config.humMin} onChange={(v) => setConfigField("humMin", v)} />
              <NumberField label="Umidade Máxima" value={config.humMax} onChange={(v) => setConfigField("humMax", v)} />
              <NumberField label="Peso Mínimo" value={config.weightMin} onChange={(v) => setConfigField("weightMin", v)} />
              <NumberField label="Peso Máximo" value={config.weightMax} onChange={(v) => setConfigField("weightMax", v)} />
            </div>
            <button className="btn btn-primary" type="submit">💾 Salvar Configuração</button>
          </form>
        </section>

        <section className="card">
          <h3>⚙️ Sistema</h3>
          <form onSubmit={handleSystem}>
            <div className="form-stack">
              <TextField label="Nome da Máquina" value={system.machineName} onChange={(v) => setSystemField("machineName", v)} />
              <NumberField label="Intervalo de Leitura (segundos)" value={system.interval} onChange={(v) => setSystemField("interval", v)} />
              <NumberField label="Limite de Alertas" value={system.alertLimit} onChange={(v) => setSystemField("alertLimit", v)} />

              <div>
                <label htmlFor="logs">Status dos Logs</label>
                <select
                  id="logs"
                  value={String(system.logs)}
                  onChange={(e) => setSystemField("logs", e.target.value === "true")}
                >
                  <option value="true">Logs ON</option>
                  <option value="false">Logs OFF</option>
                </select>
              </div>
            </div>

            <button className="btn btn-primary" type="submit">
              💾 Salvar Sistema
            </button>
          </form>
        </section>
      </main>
    </Layout>
  );
}

function NumberField({ label, value, onChange }) {
  return (
    <div>
      <label>{label}</label>
      <input type="number" step="any" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function TextField({ label, value, onChange }) {
  return (
    <div>
      <label>{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}