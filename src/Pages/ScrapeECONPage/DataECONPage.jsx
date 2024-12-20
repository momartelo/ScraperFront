import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./DataECONPage.module.css";
import axios from "axios";

const DataECONPage = () => {
  const [selectedUrl, setSelectedUrl] = useState(""); // URL por defecto
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const urls = {
    aceros: "https://econ.ar/productos/aceros/",
    aceros_Inoxidables: "https://econ.ar/productos/aceros-inoxidables/",
    aislaciones: "https://econ.ar/productos/aislaciones/",
    amoblamientos: "https://econ.ar/productos/amoblamiento/",
    carpinterias: "https://econ.ar/productos/carpinterias/",
    construccion_en_seco: "https://econ.ar/productos/construccion-en-seco/",
    construcciones_especiales:
      "https://econ.ar/productos/construcciones-especiales/",
    electricidad: "https://econ.ar/productos/electricidad-e-iluminacion/",
    electro: "https://econ.ar/productos/Electro/",
    ferreteria: "https://econ.ar/productos/ferreteria/",
    fibra_de_vidrio: "https://econ.ar/productos/fibra-de-vidrio/",
    jardineria: "https://econ.ar/productos/jardineria-y-camping/",
    maderas: "https://econ.ar/productos/maderas/",
    marmoles_granitos: "https://econ.ar/productos/marmoles-y-granitos/",
    obra_gruesa: "https://econ.ar/productos/obra-gruesa/",
    pinturas: "https://econ.ar/productos/pinturas/",
    pisos_y_revestimientos: "https://econ.ar/productos/pisos-y-revestimientos/",
    refrigeracion: "https://econ.ar/productos/refrigeracion/",
    sanitarios_y_griferias: "https://econ.ar/productos/sanitarios-y-griferias/",
    techos: "https://econ.ar/productos/techos/",
    vidrios: "https://econ.ar/productos/vidrios/",
    yeseria: "https://econ.ar/productos/yeseria/",
    zingueria: "https://econ.ar/productos/zingueria/",
  };

  const handleData = async (Url) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `http://localhost:3020/api/graphics/productosECON_${Url}`
      );
      console.log("Respuesta", response.data);
      console.log("URL Seleccionada", selectedUrl);
      setData(response.data);
    } catch (error) {
      setError(error.nessage);
    } finally {
      setLoading(false);
    }
  };

  const capitalizeFirstLetter = (text) => {
    if (!text) return text;
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  const ordenedDate = (date) => {
    if (!date) return date;
    return date.slice(6) + "/" + date.slice(4, 6) + "/" + date.slice(0, 4);
  };

  useEffect(() => {
    if (selectedUrl) {
      handleData(selectedUrl);
    }
  }, [selectedUrl]);

  const handleReset = async () => {
    navigate(0);
  };

  return (
    <div className={styles.containerPage}>
      <div className={styles.containerTitle}>
        <div className={styles.subcontainerTitle}>
          <h1>Precios de Materiales</h1>
        </div>
      </div>
      {loading && <p>Cargando Datos...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      <div className={styles.containerSelect}>
        <select
          onChange={(e) => setSelectedUrl(e.target.value)}
          value={selectedUrl}
          className={styles.selectScrap}
        >
          <option value="" disabled>
            Elija categoría
          </option>
          {Object.keys(urls).map((key) => (
            <option key={key} value={key}>
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </option>
          ))}
        </select>
        {/* <button
        onClick={handleScrape}
        disabled={loading}
        className={styles.buttonScrap}
      >
        {loading ? "Scraping..." : "Scrape"}
      </button> */}

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
    </div>
  );
};

export default DataECONPage;
