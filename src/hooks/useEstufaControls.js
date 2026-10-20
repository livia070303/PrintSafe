import { useCallback, useEffect, useRef, useState } from "react";
import { getSensorData, postComando } from "../services/api";
import { MATERIALS, materialKey } from "../constants/filament";
import { useDialog } from "../context/DialogContext";

export function useEstufaControls() {
  const { showAlert, showConfirm } = useDialog();
  const [sensor, setSensor] = useState(null);
  const [online, setOnline] = useState(true);
  const [lastUpdate, setLastUpdate] = useState("--");
  const pollRef = useRef(null);

  const poll = useCallback(async () => {
    try {
      const data = await getSensorData();
      setSensor(data);
      setOnline(true);
      setLastUpdate(new Date().toLocaleTimeString("pt-BR"));
    } catch {
      setOnline(false);
    }
  }, []);

  useEffect(() => {
    pollRef.current = poll;
  }, [poll]);

  useEffect(() => {
    poll();
    const timer = setInterval(poll, 2000);
    return () => clearInterval(timer);
  }, [poll]);

  const afterComando = useCallback(
    async (fn) => {
      try {
        await fn();
        await pollRef.current?.();
      } catch {
        await showAlert("Não foi possível enviar o comando ao sistema.", {
          variant: "error",
          title: "Falha na comunicação",
        });
      }
    },
    [showAlert]
  );

  const material = materialKey(sensor);
  const ativo = !!sensor?.ativo;
  const materialSelectDisabled = !sensor && !online;

  function toggleSistema() {
    afterComando(() => postComando("TOGGLE"));
  }

  function startSecagem() {
    afterComando(() => postComando("SECAGEM"));
  }

  function startArmazenamento() {
    afterComando(() => postComando("ARMAZENAMENTO"));
  }

  async function resetValidade() {
    const ok = await showConfirm(
      "O contador de validade voltará ao valor inicial do material selecionado.",
      {
        title: "Resetar validade",
        icon: "🔄",
        confirmLabel: "Resetar",
        cancelLabel: "Cancelar",
      }
    );
    if (!ok) return;
    afterComando(() => postComando("RESET"));
  }

  function onMaterialChange(e) {
    const idx = MATERIALS.indexOf(e.target.value);
    if (idx < 0) return;
    afterComando(() => postComando("MATERIAL", idx));
  }

  return {
    sensor,
    online,
    lastUpdate,
    poll,
    material,
    ativo,
    materialSelectDisabled,
    toggleSistema,
    startSecagem,
    startArmazenamento,
    resetValidade,
    onMaterialChange,
  };
}
