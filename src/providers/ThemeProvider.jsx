import { createContext, useState, useContext, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isNightMode, setIsNightMode] = useState(() => {
    const savedMode = localStorage.getItem("isNightMode");
    return savedMode === "true"; // Convertir el valor guardado a booleano
  });

  const toggleTheme = () => {
    setIsNightMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem("isNightMode", newMode); // Guardar en localStorage
      return newMode;
    });
  };

  useEffect(() => {
    const body = document.body;
    if (isNightMode) {
      body.classList.add("nightMode");
      body.classList.remove("dayMode");
    } else {
      body.classList.add("dayMode");
      body.classList.remove("nightMode");
    }
  }, [isNightMode]);

  return (
    <ThemeContext.Provider value={{ isNightMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
