import styles from "./ScrapeECONPage.module.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";

const ScrapeECONPage = () => {
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState(""); // URL por defecto
  const [search, setSearch] = useState("");
  const [filterResults, setFilterResults] = useState([]);
  const [alertMessage, setAlertMessage] = useState("");
  const [dots, setDots] = useState(".");

  const navigate = useNavigate();

  // Opciones de scraping
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

  const displayNames = {
    aceros: "Aceros",
    aceros_Inoxidables: "Aceros Inoxidables",
    aislaciones: "Aislaciones",
    amoblamientos: "Amoblamientos",
    carpinterias: "Carpinterias",
    construccion_en_seco: "Construccion en Seco",
    construcciones_especiales: "Construcciones Especiales",
    electricidad: "Electricidad",
    electro: "Electro",
    ferreteria: "Ferreteria",
    fibra_de_vidrio: "Fibra de Vidrio",
    jardineria: "Jardineria",
    maderas: "Maderas",
    marmoles_granitos: "Marmoles y Granitos",
    obra_gruesa: "Obra Gruesa",
    pinturas: "Pinturas",
    pisos_y_revestimientos: "Pisos y Revestimientos",
    refrigeracion: "Refrigeracion",
    sanitarios_y_griferias: "Sanitarios y Griferias",
    techos: "Techos",
    vidrios: "Vidrios",
    yeseria: "Yeseria",
    zingueria: "Zingueria",
  };

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setDots((prevDots) => {
          if (prevDots.length < 3) {
            return prevDots + ".";
          } else {
            return ".";
          }
        });
      }, 500); // Cambiar cada 500 ms

      return () => clearInterval(interval); // Limpiar el intervalo cuando el componente se desmonte
    }
  }, [loading]);

  useEffect(() => {
    let filtered = result.filter((r) => {
      return r.nombre.toLowerCase().includes(search.toLowerCase());
    });
    filtered = filtered.slice().sort((a, b) => {
      return (a.nombre || "").localeCompare(b.nombre || "");
    });
    setFilterResults(filtered);
  }, [search, result]);

  const handleReset = async () => {
    navigate(0);
  };

  const handleScrape = async () => {
    setResult([]);
    setFilterResults([]);
    setAlertMessage("");
    setLoading(true);

    try {
      const response = await axios.get(
        `http://localhost:3020/api/scraper/ECON/${selectedUrl}`
      );
      // alert(response.data.message);
      setAlertMessage(response.data.message);

      // Solicitar los datos
      const jsonResponse = await axios.get(
        `http://localhost:3020/json/${response.data.fileName}`
      );

      setResult(response.data.productos);
      setFilterResults(jsonResponse.data);
    } catch (error) {
      console.error("Error en el scraping:", error);
      setAlertMessage("Error al realizar el scraping."); // Mostrar mensaje de error
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
        <h1>Extraccion de datos ECON</h1>
      </div>
      <div className={styles.containerButtonScrap}>
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
              {displayNames[key]}
              {/* {key.charAt(0).toUpperCase() + key.slice(1)} */}
            </option>
          ))}
        </select>
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
      <div className={`${styles.searchContainer}`}>
        <input
          type="search"
          className={styles.formControl}
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className={styles.containerIcon}>
          <img src="../../../public/img/buscarRelleno.png" alt="" />
        </div>
      </div>

      {/* Cargando Overlay */}
      <div>
        {loading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.spinner}></div>
            <p className={styles.loadingText}>
              Loading Data
              <span className={styles.dots}>{dots}</span>
            </p>
          </div>
        )}
      </div>

      {filterResults.length > 0 ? (
        <div className={styles.containerScraping}>
          <div className={styles.containerTitleScraping}>
            <h2>Resultados del Scraping:</h2>
          </div>
          <ul className={styles.containerDataScraping}>
            {filterResults.map((producto, index) => (
              <li key={index} className={styles.containerProductScraping}>
                <p>{producto.nombre}</p>
                <p>${producto.precio}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        !loading &&
        result.length === 0 && (
          <div className={styles.containerNoDataScraping}>
            <h2>No hay productos disponibles.</h2>
          </div>
        )
      )}
    </div>
  );
};

export default ScrapeECONPage;

// const ScrapeECONPage = () => {
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   // const [filename, setFilename] = useState('');

//   const handleScrape = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get("http://localhost:3020/api/scraper");
//       alert(response.data.message); // Mostrar mensaje de éxito

//       // // Guarda el nombre del archivo
//       // setFilename(response.data.fileName);

//       // Si el scraping es exitoso, solicita los datos
//       const jsonResponse = await axios.get(
//         `http://localhost:3020/json/${response.data.fileName}`
//       );
//       setResult(jsonResponse.data);
//     } catch (error) {
//       console.error("Error en el scraping:", error);
//       alert("Error al realizar el scraping."); // Mostrar mensaje de error
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className={styles.containerPage}>
//       <div className={styles.containerButtonScrap}>
//         <button onClick={handleScrape} disabled={loading}>
//           {loading ? "Scraping..." : "Scrape"}
//         </button>
//       </div>

//       {result && (
//         <div className={styles.containerScraping}>
//           <h2>Resultados del Scraping:</h2>
//           <ul>
//             {result.map((producto, index) => (
//               <li key={index}>
//                 {producto.nombre}: {producto.precio}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ScrapeECONPage;
