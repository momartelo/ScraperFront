const API_BASE_URL = "http://localhost:3020/api/scraper"; // Cambia esto a tu puerto

export const scrapeProducts = async () => {
  const response = await fetch(`${API_BASE_URL}/`);
  if (!response.ok) {
    throw new Error("Error al realizar el scraping");
  }
  return await response.json();
};