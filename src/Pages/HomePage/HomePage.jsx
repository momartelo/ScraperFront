import React, { useState } from "react";
import { Link } from "react-router-dom";

import styles from "./HomePage.module.css";

const HomePage = () => {
  return (
    <div className={styles.containerHome}>
      <div className={styles.containerTitle}>
        <h1>Home Page de Scraping de Precios</h1>
      </div>
      <div className={styles.containerAnchor}>
        <div className={styles.anchor}>
          <p>&#10148;</p>
          <p>Econ</p>
          <Link className={styles.buttonScrapping} to={"/pageECON"}>
            Scraping
          </Link>
          <Link
            className={styles.buttonData}
            to={"/graficos/productosECON_obra_gruesa_"}
          >
            Ver datos
          </Link>
        </div>
        <div className={styles.anchor}>
          <p>&#10148;</p>
          <p>Mercado Libre</p>
          <Link className={styles.buttonScrapping} to={"/pageMLSearch"}>
            Scraping
          </Link>
          <Link className={styles.buttonData} to={"/pageMLSearch"}>
            Ver datos
          </Link>
        </div>
        <div className={styles.anchor}>
          <p>&#10148;</p>
          <p>Cemento</p>
          <Link className={styles.buttonScrapping} to={"/cementos"}>
            Scraping
          </Link>
          <Link className={styles.buttonData} to={"/graficos/precioCemento"}>
            Ver datos
          </Link>
        </div>
        <div className={styles.anchor}>
          <p>&#10148;</p>
          <p>Hormigon</p>
          <Link className={styles.buttonScrapping} to={"/hormigon"}>
            Scraping
          </Link>
          <Link className={styles.buttonData} to={"/graficos/precioHormigones"}>
            Ver datos
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

// import React, { useState } from 'react';
// import { scrapeProducts } from '../../functions/fetchAPI.js';
// import styles from "./HomePage.module.css"

// import ScrapeButton from '../../components/ScrapeButton/ScrapeButton.jsx';
// import ProductList from '../../components/ProductList/ProductList.jsx';

// const HomePage = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleScrape = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const data = await scrapeProducts();
//       setProducts(data.productos);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className={styles.app}>
//       <h1>Scraper de Productos</h1>
//       <ScrapeButton onScrape={handleScrape} />
//       {loading && <p>Cargando...</p>}
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       <ProductList products={products} />
//     </div>
//   );
// };

// export default HomePage;
