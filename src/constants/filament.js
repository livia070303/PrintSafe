export const MATERIALS = ["PLA", "PETG", "ABS", "NYLON", "TPU"];

// Perfis iguais aos do firmware (constante PERFIS em PrintSafe.ino).
// Se mudar um valor lá, mude aqui também.
export const PERFIS = {
  PLA: { tempSecagem: 50, tempArmazenamento: 28, umidadeAlvo: 20 },
  PETG: { tempSecagem: 65, tempArmazenamento: 30, umidadeAlvo: 15 },
  ABS: { tempSecagem: 70, tempArmazenamento: 40, umidadeAlvo: 10 },
  NYLON: { tempSecagem: 80, tempArmazenamento: 45, umidadeAlvo: 10 },
  TPU: { tempSecagem: 50, tempArmazenamento: 25, umidadeAlvo: 20 },
};

// Mesmas folgas que o firmware usa para ligar a ventoinha:
// temperatura acima do setpoint + 3 °C ou umidade acima do alvo + 5 p.p.
export const FOLGA_TEMP = 3;
export const FOLGA_UMID = 5;

export function materialKey(sensor) {
  if (!sensor) return "PLA";
  const idx = sensor.materialIdx ?? 0;
  const fromApi = sensor.material;
  if (fromApi) {
    return String(fromApi).toUpperCase();
  }
  return MATERIALS[Math.min(Math.max(idx, 0), MATERIALS.length - 1)] ?? "PLA";
}
