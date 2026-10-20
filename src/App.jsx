import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Config from "./pages/Config";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/config" element={<Config />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
}