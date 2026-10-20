import { useState } from "react";
import { setPesoMax, tarar } from "../services/api";
import { useDialog } from "../context/DialogContext";

function badgeForPct(pct, mx) {
  if (pct > 25) return { text: "OK", className: "ok" };
  if (pct > 10) return { text: "ATENÇÃO", className: "warning" };
  if (pct > 0) return { text: "CRÍTICO", className: "error" };
  if (mx > 0) return { text: "VAZIO", className: "error" };
  return { text: "OK", className: "ok" };
}

export default function BalancaCard({
  pesoAtual = 0,
  pesoMaximo = 0,
  tara = 0,
  onRefresh,
}) {
  const [maxInput, setMaxInput] = useState("");
  const { showAlert, showConfirm } = useDialog();

  const g = Math.max(0, Number(pesoAtual) || 0);
  const mx = Number(pesoMaximo) || 0;
  const pct = mx > 0 ? Math.min(100, (g / mx) * 100) : 0;
  const low = pct <= 15;
  const badge = badgeForPct(pct, mx);

  async function definirMax() {
    const v = parseFloat(maxInput);
    if (!v || v <= 0 || v > 5000) {
      await showAlert("Informe um valor entre 1 e 5000 gramas.", {
        variant: "warning",
        title: "Peso inválido",
      });
      return;
    }
    try {
      await setPesoMax(v);
      setMaxInput("");
      await onRefresh?.();
      await showAlert("Peso máximo do carretel atualizado.", {
        variant: "success",
        title: "Peso definido",
      });
    } catch {
      await showAlert("Não foi possível salvar o peso máximo.", {
        variant: "error",
      });
    }
  }

  async function fazerTara() {
    const ok = await showConfirm(
      "Coloque o carretel vazio na balança antes de continuar.",
      {
        title: "Tarar balança",
        icon: "⚖️",
        confirmLabel: "Tarar agora",
        cancelLabel: "Cancelar",
      }
    );
    if (!ok) return;
    try {
      await tarar();
      await onRefresh?.();
      await showAlert("Tara zerada com sucesso.", {
        variant: "success",
        title: "Balança tarada",
      });
    } catch {
      await showAlert("Não foi possível tarar a balança.", {
        variant: "error",
      });
    }
  }

  return (
    <div className="card balanca-card">
      <div className="balanca-header">
        <h3>⚖️ QUANTIDADE DE FILAMENTO</h3>
        <span className={`badge-status ${badge.className}`}>{badge.text}</span>
      </div>

      <div className="balanca-row">
        <div className="balanca-gramas-wrap">
          <div
            className={`balanca-gramas${low && pct > 0 ? " low" : ""}${pct === 0 && mx > 0 ? " empty" : ""}`}
          >
            {mx > 0 || g > 0 ? g.toFixed(0) : "---"}
          </div>
          <div className="balanca-sublabel">gramas restantes</div>
        </div>

        <div className="balanca-barra-wrap">
          <div className="balanca-barra-bg">
            <div
              className={`balanca-barra-fill${low ? " low" : ""}`}
              style={{ width: `${pct.toFixed(1)}%` }}
            />
          </div>
          <div className="balanca-barra-labels">
            <span>0 g</span>
            <span>{mx > 0 ? `${mx.toFixed(0)} g` : "--- g"}</span>
          </div>
        </div>

        <div className={`balanca-pct${low ? " low" : ""}`}>
          {mx > 0 ? `${pct.toFixed(1)}%` : "--%"}
        </div>
      </div>

      <div className="balanca-config">
        <div className="balanca-input-group">
          <label htmlFor="bal-inp-max">Peso total do carretel (g)</label>
          <div className="balanca-input-row">
            <input
              id="bal-inp-max"
              type="number"
              className="balanca-input"
              placeholder="ex: 1000"
              min={1}
              max={5000}
              value={maxInput}
              onChange={(e) => setMaxInput(e.target.value)}
            />
            <button type="button" className="btn btn-amber" onClick={definirMax}>
              Definir
            </button>
          </div>
        </div>

        <div className="balanca-tara-group">
          <div className="balanca-tara-info">
            <span className="balanca-tara-label">TARA ATUAL</span>
            <span className="balanca-tara-valor">
              {Number(tara).toFixed(1)} g
            </span>
          </div>
          <button type="button" className="btn btn-outline-cyan" onClick={fazerTara}>
            ⚖ Tarar balança
          </button>
        </div>
      </div>
    </div>
  );
}
