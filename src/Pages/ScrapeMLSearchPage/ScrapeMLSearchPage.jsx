import styles from "./ScrapeMLSearchPage.module.css";
import axios from "axios";
import Alert from "@mui/material/Alert";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const ScrapeMLSearchPage = () => {
  const [result, setResult] = useState([]);
  const [alertMessage, setAlertMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const handleReset = async () => {
    navigate(0);
  };

  const handleScrape = async () => {
    setLoading(true);
    setAlertMessage("");
    try {
      const response = await axios.get(
        `http://localhost:3020/api/scraper/ML/${search}`
      );
      setAlertMessage(response.data.message);

      const jsonResponse = await axios.get(
        `http://localhost:3020/json/${response.data.fileName}`
      );
      setResult(jsonResponse.data);
    } catch (error) {
      console.error("Error en el scraping:", error);
      setAlertMessage("Error al realizar el scraping.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.containerPage}>
      {alertMessage && (
        <Alert
          variant="outlined"
          severity="success"
          onClose={() => setAlertMessage("")}
        >
          {alertMessage}
        </Alert>
      )}
      <div className={styles.containerTitle}>
        <h1>Extraccion de datos Mercado Libre</h1>
      </div>
      <div className={styles.containerSearch}>
        <input
          type="search"
          className={styles.formInput}
          placeholder="Palabra clave"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className={styles.containerIcon}>
          <img src="../../../public/img/buscarRelleno.png" alt="" />
        </div>
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
            {result.map((producto, index) => (
              <li key={index} className={styles.containerProductScraping}>
                <p>{producto.title}</p>
                <p>${producto.price}</p>
              </li>
            ))}
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

export default ScrapeMLSearchPage;
