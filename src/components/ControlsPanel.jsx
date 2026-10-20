import { MATERIALS } from "../constants/filament";

export default function ControlsPanel({
  material,
  ativo,
  materialSelectDisabled,
  onMaterialChange,
  toggleSistema,
  startSecagem,
  startArmazenamento,
  resetValidade,
}) {
  return (
    <div className="controls-panel">
      <div className="control-group">
        <label htmlFor="materialSelect">MATERIAL</label>
        <select
          id="materialSelect"
          value={material}
          onChange={onMaterialChange}
          disabled={materialSelectDisabled}
        >
          {MATERIALS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      <button className="btn btn-primary" type="button" onClick={toggleSistema}>
        {ativo ? "⏹️ DESLIGAR SISTEMA" : "⚡ LIGAR SISTEMA"}
      </button>

      <div className="control-buttons">
        <button className="btn btn-primary" type="button" onClick={startSecagem}>
          🔥 Secagem
        </button>
        <button className="btn btn-primary" type="button" onClick={startArmazenamento}>
          📦 Armazenar
        </button>
      </div>

      <button className="btn btn-secondary" type="button" onClick={resetValidade}>
        🔄 Resetar Validade
      </button>
    </div>
  );
}
