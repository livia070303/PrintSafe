import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Calibration from "./pages/Calibration";
import Config from "./pages/Config";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/about" element={<About />} />
      <Route path="/calibration" element={<Calibration />} />
      <Route path="/config" element={<Config />} />
    </Routes>
  );
}