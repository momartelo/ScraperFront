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
        <p>&#10148;</p>
        <p>Si desea extraer los precios de Econ</p>
        <Link to={"/pageECON"}>Ir a la pagina</Link>
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
