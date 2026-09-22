import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { getCalibration, saveCalibration } from "../services/api";

const initial = {
  tempOffset: 0,
  humOffset: 0,
  weightOffset: 0,
};

export default function Calibration() {
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCalibration()
      .then((data) => setForm({
        tempOffset: data.tempOffset ?? 0,
        humOffset: data.humOffset ?? 0,
        weightOffset: data.weightOffset ?? 0,
      }))
      .catch(() => alert("Erro ao carregar calibração"))
      .finally(() => setLoading(false));
  }, []);

  function update(field, value) {
    setForm((old) => ({ ...old, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await saveCalibration({
        tempOffset: Number(form.tempOffset),
        humOffset: Number(form.humOffset),
        weightOffset: Number(form.weightOffset),
      });
      alert("✅ Calibração salva com sucesso!");
    } catch (error) {
      console.error(error);
      alert("❌ Erro ao salvar calibração");
    }
  }

  return (
    <Layout title="🧪 CALIBRAÇÃO">
      <main className="page-container">
        <form onSubmit={handleSubmit}>
          <CalibrationCard icon="🌡️" title="Temperatura">
            <Field label="Offset" value={form.tempOffset} onChange={(v) => update("tempOffset", v)} />
          </CalibrationCard>

          <CalibrationCard icon="💧" title="Umidade">
            <Field label="Offset" value={form.humOffset} onChange={(v) => update("humOffset", v)} />
          </CalibrationCard>

          <CalibrationCard icon="⚖️" title="Peso do filamento">
            <Field label="Offset" value={form.weightOffset} onChange={(v) => update("weightOffset", v)} />
          </CalibrationCard>

          <button className="btn btn-primary save-button" type="submit" disabled={loading}>
            💾 Salvar Calibração
          </button>
        </form>
      </main>
    </Layout>
  );
}

function CalibrationCard({ icon, title, children }) {
  return (
    <section className="card">
      <h2>{icon} {title}</h2>
      <div className="form-grid">{children}</div>
    </section>
  );
}

function Field({ label, value, onChange }) {
  return (
    <div>
      <label>{label}</label>
      <input
        type="number"
        step="any"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}