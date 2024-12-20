import styles from "./DataECONPage.module.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Alert from "@mui/material/Alert";

const DataECONPage = () => {
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const navigate = useNavigate();

  const loadJSONFiles = () => {
    const context = require.context(
      "./data",
      false,
      /^precioCemento\d{8}\.json$/
    ); // Carpeta 'data', solo archivos que coinciden con el patrón
    const files = context.keys(); // Obtener una lista de los archivos encontrados
    return files.map((file) => context(file));
  };

  const handleReset = async () => {
    navigate(0);
  };

  const handleWriteData = async () => {
    setLoading(true);
    setAlertMessage("");
    try {
    } catch (error) {}
  };

  return (
    <div className={StyleSheet.containerPage}>
      {alertMessage && ( // Mostrar el Alert solo si hay un mensaje
        <Alert
          variant="outlined"
          severity="success"
          onClose={() => setAlertMessage("")}
        >
          {alertMessage}
        </Alert>
      )}
      <p>Por el momento NADA</p>
    </div>
  );
};

export default DataECONPage;
