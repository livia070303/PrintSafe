import  React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [lightMode, setLightMode] = useState(
    () => localStorage.getItem("theme") === "light"
  );

  useEffect(() => {
    document.body.classList.toggle("light-mode", lightMode);
    localStorage.setItem("theme", lightMode ? "light" : "dark");
  }, [lightMode]);

  const toggleTheme = () => setLightMode((value) => !value);

  return (
    <ThemeContext.Provider value={{ lightMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}