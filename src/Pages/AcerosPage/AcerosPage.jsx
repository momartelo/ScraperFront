import styles from "./AcerosPage.module.css";
import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";

const AcerosPage = () => {
  const [diameter, setDiameter] = useState("8");
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const navigate = useNavigate();

  const capitalizeFirstLetter = (text) => {
    if (!text) return text; // Asegurarse de que no esté vacío o undefined
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  const handleReset = async () => {
    navigate(0);
  };

  const handleScrape = async () => {
    setLoading(true);
    setAlertMessage("");
    try {
      const response = await axios.get(
        `http://localhost:3020/api/scraper/acero/${diameter}`
      );
      setAlertMessage(response.data.message);

      const jsonResponse = await axios.get(
        `http://localhost:3020/json/${response.data.fileName}`
      );

      setResult(jsonResponse.data);
      console.log(response);
    } catch (error) {
      console.error("Error en el scraping:", error);
      setAlertMessage("Error al realizar el scraping.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChange = (event) => {
    setDiameter(event.target.value);
  };

  return (
    <div className={styles.containerPage}>
      {alertMessage && ( // Mostrar el Alert solo si hay un mensaje
        <Alert
          variant="outlined"
          severity="success"
          onClose={() => setAlertMessage("")}
        >
          {alertMessage}
        </Alert>
      )}
      <div className={styles.containerTitle}>
        <h1>Extraccion de datos de Hierros Aletados</h1>
      </div>
      <div className={styles.containerSelect}>
        <label htmlFor="diameters">Selecciona un diametro:</label>
        <select
          id="diameters"
          name="diameters"
          value={diameter}
          onChange={handleSelectChange}
        >
          <option value="6">Ø6</option>
          <option value="8">Ø8</option>
          <option value="10">Ø10</option>
          <option value="12">Ø12</option>
          <option value="16">Ø16</option>
          <option value="20">Ø20</option>
          <option value="25">Ø25</option>
        </select>
      </div>
      <div className={styles.containerButtonsScraping}>
        <button
          onClick={handleScrape}
          disabled={loading}
          className={styles.buttonScrap}
        >
          {loading ? "Scraping..." : "Scrape"}
        </button>
        <button
          onClick={handleReset}
          disabled={loading}
          className={styles.buttonReset}
        >
          Reset
        </button>
        <Link to={"/"} className={styles.buttonHome}>
          Volver
        </Link>
      </div>
      {result.length > 0 ? (
        <div className={styles.containerScraping}>
          <div className={styles.containerTitleScraping}>
            <h2>Resultados del Scraping:</h2>
          </div>
          <ul className={styles.containerDataScraping}>
            {result.map((producto, index) => {
              // Verificamos si el producto es null
              if (producto) {
                return (
                  <li key={index} className={styles.containerProductScraping}>
                    <p>{capitalizeFirstLetter(producto.supplier)}</p>
                    <p>{capitalizeFirstLetter(producto.name)}</p>
                    <p>$ {producto.price}</p>
                  </li>
                );
              }
              return null; // Si el producto es null, no renderizamos nada para ese ítem
            })}
          </ul>
        </div>
      ) : (
        result && (
          <div className={styles.containerNoDataScraping}>
            <h2>No hay productos disponibles.</h2>
          </div>
        )
      )}
    </div>
  );
};

export default AcerosPage;
