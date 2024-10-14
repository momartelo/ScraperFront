import React from 'react';
import styles from "./ScapeButton.module.css"

const ScrapeButton = ({ onScrape }) => {
  return (
    <button onClick={onScrape} className={styles.scrapeButton}>
      Iniciar Scraping
    </button>
  );
};

export default ScrapeButton;