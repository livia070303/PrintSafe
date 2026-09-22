const API =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:8080"
    : "";

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

export const getCalibration = () => request("/api/calibration");
export const saveCalibration = (data) =>
  request("/api/calibration", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getConfig = () => request("/api/config");
export const saveConfig = (data) =>
  request("/api/config", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getSystem = () => request("/api/system");
export const saveSystem = (data) =>
  request("/api/system", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const saveMaterial = (data) =>
  request("/api/material", {
    method: "POST",
    body: JSON.stringify(data),
  });