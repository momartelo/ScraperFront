import styles from "./ScrapeECONPage.module.css"
import React, { useState } from 'react';
import axios from 'axios';

const ScrapeECONPage = () => {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    // const [filename, setFilename] = useState('');
  
    const handleScrape = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:3020/api/scraper');
        alert(response.data.message); // Mostrar mensaje de éxito
  
        // // Guarda el nombre del archivo
        // setFilename(response.data.fileName);
  
        // Si el scraping es exitoso, solicita los datos
        const jsonResponse = await axios.get(`http://localhost:3020/json/${response.data.fileName}`);
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
        <button onClick={handleScrape} disabled={loading}>
          {loading ? 'Scraping...' : 'Scrape'}
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
