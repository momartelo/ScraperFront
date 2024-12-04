import styles from "./HomigonPage.module.css";
import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";

const HormigonPage = () => {
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const navigate = useNavigate();

  const capitalizeFirstLetter = (text) => {
    if (!text) return text;
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
        `http://localhost:3020/api/scraper/hormigon`
      );
      console.log(response);
      setAlertMessage(response.data.message);

      //   const jsonResponse = await axios.get(
      //     `http://localhost:3020/json/${response.data.filename}`
      //   );
      //   console.log(jsonResponse);
      setResult(response.data.productos);
    } catch (error) {
      console.error("Error en el scraping:", error);
      setAlertMessage("Error al realizar el scraping.");
    } finally {
      setLoading(false);
    }
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
        <h1>Extraccion de datos de Hormigon</h1>
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
            <h2>Resultados del Scraping</h2>
          </div>
          <ul className={styles.containerDataScraping}>
            {result.map((producto, index) => (
              <li key={index} className={styles.containerProductScraping}>
                <p>{capitalizeFirstLetter(producto.empresa)}</p>
                <p>{capitalizeFirstLetter(producto.nombre)}</p>
                <p>
                  $
                  {parseFloat(
                    producto.precio
                      .replace(/[^\d,.-]/g, "") // Elimina todo excepto números, puntos y comas
                      .replace(".", "") // Elimina los puntos (separadores de miles)
                      .replace(",", ".") // Reemplaza la coma por un punto decimal
                  ).toLocaleString("es-AR", {
                    // Usamos 'es-AR' para el formato argentino
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        result && (
          <div className={styles.containerNoDataScraping}>
            <h2>No hay productos disponibles</h2>
          </div>
        )
      )}
    </div>
  );
};

export default HormigonPage;
