import styles from "./ScrapeECONPage.module.css";
import React, { useState } from "react";
import axios from "axios";

const ScrapeECONPage = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState("zingueria"); // URL por defecto

  // Opciones de scraping
  const urls = {
    aceros: "https://econ.ar/productos/aceros/",
    aceros_Inoxidables: "https://econ.ar/productos/aceros-inoxidables/",
    aislaciones: "https://econ.ar/productos/aislaciones",
    amoblamientos: "https://econ.ar/productos/amoblamiento",
    carpinterias: "https://econ.ar/productos/carpinterias/",
    construccion_en_seco: "https://econ.ar/productos/construccion-en-seco/",
    construcciones_especiales:
      "https://econ.ar/productos/construcciones-especiales/",
    electricidad: "https://econ.ar/productos/electricidad-e-iluminacion/",
    electro: "https://econ.ar/productos/Electro/",
    ferreteria: "https://econ.ar/productos/ferreteria/",
    fibra_de_vidrio: "https://econ.ar/productos/fibra-de-vidrio",
    jardineria: "https://econ.ar/productos/jardineria-y-camping/",
    maderas: "https://econ.ar/productos/maderas/",
    marmoles_granitos: "https://econ.ar/productos/marmoles-y-granitos",
    obra_gruesa: "https://econ.ar/productos/obra-gruesa/",
    pinturas: "https://econ.ar/productos/pinturas/",
    pisos_y_revestimientos: "https://econ.ar/productos/pisos-y-revestimientos/",
    refrigeracion: "https://econ.ar/productos/refrigeracion/",
    sanitarios_y_griferias: "https://econ.ar/productos/sanitarios-y-griferias/",
    techos: "https://econ.ar/productos/techos",
    vidrios: "https://econ.ar/productos/vidrios/",
    teseria: "https://econ.ar/productos/yeseria/",
    zingueria: "https://econ.ar/productos/zingueria/",
  };

  const handleScrape = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3020/api/scraper/${selectedUrl}`
      );
      alert(response.data.message); // Mostrar mensaje de éxito

      // Solicitar los datos
      const jsonResponse = await axios.get(
        `http://localhost:3020/json/${response.data.fileName}`
      );
      setResult(jsonResponse.data);
    } catch (error) {
      console.error("Error en el scraping:", error);
      alert("Error al realizar el scraping."); // Mostrar mensaje de error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.containerPage}>
      <div className={styles.containerButtonScrap}>
        <select
          onChange={(e) => setSelectedUrl(e.target.value)}
          value={selectedUrl}
        >
          {Object.keys(urls).map((key) => (
            <option key={key} value={key}>
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </option>
          ))}
        </select>
        <button onClick={handleScrape} disabled={loading}>
          {loading ? "Scraping..." : "Scrape"}
        </button>
      </div>

      {result && (
        <div className={styles.containerScraping}>
          <h2>Resultados del Scraping:</h2>
          <ul>
            {result.map((producto, index) => (
              <li key={index}>
                {producto.nombre}: {producto.precio}
              </li>
            ))}
          </ul>
        </div>
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
