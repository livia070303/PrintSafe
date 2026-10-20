export const MATERIALS = ["PLA", "PETG", "ABS", "NYLON", "TPU"];

export const DEFAULT_LIMITS = {
  PLA: {
    tempMin: 18,
    tempMax: 28,
    humMin: 40,
    humMax: 60,
    lightMax: 3000,
    soundMaxDB: 70,
  },
  PETG: {
    tempMin: 20,
    tempMax: 30,
    humMin: 30,
    humMax: 50,
    lightMax: 3000,
    soundMaxDB: 70,
  },
  ABS: {
    tempMin: 22,
    tempMax: 32,
    humMin: 20,
    humMax: 40,
    lightMax: 3000,
    soundMaxDB: 70,
  },
  NYLON: {
    tempMin: 20,
    tempMax: 30,
    humMin: 20,
    humMax: 40,
    lightMax: 3000,
    soundMaxDB: 70,
  },
  TPU: {
    tempMin: 20,
    tempMax: 25,
    humMin: 30,
    humMax: 50,
    lightMax: 3000,
    soundMaxDB: 70,
  },
};

export function materialKey(sensor) {
  if (!sensor) return "PLA";
  const idx = sensor.materialIdx ?? 0;
  const fromApi = sensor.material;
  if (fromApi) {
    return String(fromApi).toUpperCase();
  }
  return MATERIALS[Math.min(Math.max(idx, 0), MATERIALS.length - 1)] ?? "PLA";
}
