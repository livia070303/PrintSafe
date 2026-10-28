function getApiBase() {
  // Dev: Vite encaminha /api → http://localhost:8080 (vite.config.js)
  if (import.meta.env.DEV) {
    return "";
  }
  const host = window.location.hostname;
  if (host === "localhost" || host === "127.0.0.1") {
    return "http://localhost:8080";
  }
  // ESP32 / produção: mesma origem
  return "";
}

const API = getApiBase();

async function request(path, options = {}) {
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    let message = `HTTP ${response.status}`;
    try {
      const body = await response.json();
      message = body.error || message;
    } catch {}
    throw new Error(message);
  }

  return response.json();
}

export const getSensorData = () => request("/api/data");

export const postComando = (cmd, valor) =>
  request("/api/comando", {
    method: "POST",
    body: JSON.stringify(
      valor === undefined ? { cmd } : { cmd, valor }
    ),
  });

export const setPesoMax = (pesoMaximo) =>
  request("/api/pesomax", {
    method: "POST",
    body: JSON.stringify({ pesoMaximo }),
  });

export const tarar = () =>
  request("/api/tara", { method: "POST", body: "{}" });

// Calibra a balança com um peso conhecido colocado sobre ela (rota /api/calibrar do firmware)
export const calibrar = (pesoReferencia) =>
  request("/api/calibrar", {
    method: "POST",
    body: JSON.stringify({ pesoReferencia }),
  });
