import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useTheme } from "../context/ThemeContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function HistoryChart({ history }) {
  const { lightMode } = useTheme();
  const text = lightMode ? "#1a1a1a" : "#e0f7ff";
  const grid = lightMode ? "rgba(0,0,0,.08)" : "rgba(0,217,255,.12)";

  const data = {
    labels: history.map((item) => item.time),
    datasets: [
      {
        label: "Temperatura (°C)",
        data: history.map((item) => item.temperature),
        borderColor: "#00d9ff",
        backgroundColor: "rgba(0,217,255,.15)",
        tension: 0.35,
      },
      {
        label: "Umidade (%)",
        data: history.map((item) => item.humidity),
        borderColor: "#00ff88",
        backgroundColor: "rgba(0,255,136,.15)",
        tension: 0.35,
      },
      {
        label: "Peso do filamento",
        data: history.map((item) => item.weight),
        borderColor: "#ffd700",
        backgroundColor: "rgba(255,215,0,.15)",
        tension: 0.35,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: text } },
    },
    scales: {
      x: { ticks: { color: text }, grid: { color: grid } },
      y: { ticks: { color: text }, grid: { color: grid } },
    },
  };

  return <Line data={data} options={options} />;
}