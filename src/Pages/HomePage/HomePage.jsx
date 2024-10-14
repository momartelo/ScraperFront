
import React, { useState } from 'react';
import { scrapeProducts } from '../../functions/fetchAPI.js';
import styles from "./HomePage.module.css"


import ScrapeButton from '../../components/ScrapeButton/ScrapeButton.jsx';
import ProductList from '../../components/ProductList/ProductList.jsx';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleScrape = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await scrapeProducts();
      setProducts(data.productos);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.app}>
      <h1>Scraper de Productos</h1>
      <ScrapeButton onScrape={handleScrape} />
      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ProductList products={products} />
    </div>
  );
};

export default HomePage;
