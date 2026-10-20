import Layout from "../components/Layout";
import ControlsPanel from "../components/ControlsPanel";
import { useEstufaControls } from "../hooks/useEstufaControls";

export default function Config() {
  const controls = useEstufaControls();

  return (
    <Layout title="⚙️ CONFIGURAÇÃO">
      <main className="page-container config-page">
        <p className="config-page-lead">
          Ajuste material, modo de operação e validade do filamento.
        </p>

        <section className="card config-controls-card">
          <h3 className="config-controls-title">⚙️ Controles</h3>
          <ControlsPanel {...controls} />
        </section>

        <div className="footer config-page-footer">
          <p>
            Status: <strong>{controls.online ? "ONLINE" : "OFFLINE"}</strong> ·
            Última atualização: <span>{controls.lastUpdate}</span>
          </p>
        </div>
      </main>
    </Layout>
  );
}
