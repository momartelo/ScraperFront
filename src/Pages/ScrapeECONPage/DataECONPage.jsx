import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./DataECONPage.module.css";
import axios from "axios";

const DataECONPage = () => {
  const [selectedUrl, setSelectedUrl] = useState(""); // URL por defecto
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [error, setError] = useState(null);
  const [showLoading, setShowLoading] = useState(false);

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

  const handleData = async (Url) => {
    setLoading(true);
    setError(null);
    setShowLoading(true);

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
      setTimeout(() => {
        setShowLoading(false);
      }, 2000);
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
      {showLoading && (
        <div className={styles.containerLoadingData}>
          <p>Cargando Datos...</p>
        </div>
      )}
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
              {displayNames[key]}
              {/* {key.charAt(0).toUpperCase() + key.slice(1)} */}
            </option>
          ))}
        </select>
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
      {!showLoading && (
        <div className={styles.containerData}>
          {Object.keys(data).length > 0
            ? Object.keys(data).map((productKey, productIndex) => {
                const productData = data[productKey];
                const hasProveedor = productData.some((item) => item.proveedor);
                return (
                  <div
                    key={productIndex}
                    className={`${styles.gridItem} ${
                      hasProveedor ? "" : styles.noProveedor
                    }`}
                  >
                    <h3>{capitalizeFirstLetter(productKey)}</h3>
                    <div
                      className={`${styles.gridContainer} ${
                        hasProveedor ? "" : styles.noProveedor
                      }`}
                    >
                      <div
                        className={
                          hasProveedor
                            ? styles.containerTitleColumn1
                            : styles.containerTitleColumn1Hidden
                        }
                      >
                        {hasProveedor && <h3>Proveedor</h3>}
                      </div>
                      <div
                        className={
                          hasProveedor
                            ? styles.containerTitleColumn2
                            : styles.containerTitleColumn2Shifted
                        }
                      >
                        <h3>Fecha</h3>
                      </div>
                      <div
                        className={
                          hasProveedor
                            ? styles.containerTitleColumn3
                            : styles.containerTitleColumn3Shifted
                        }
                      >
                        <h3>Precio</h3>
                      </div>

                      {hasProveedor && (
                        <div className={styles.proveedor}>
                          <p>
                            {capitalizeFirstLetter(productData[0].proveedor)}
                          </p>
                        </div>
                      )}
                      <div
                        className={`${styles.supplierRow} ${
                          hasProveedor ? "" : styles.noProveedor
                        }`}
                      >
                        {productData.map((item, index) => (
                          <div
                            key={`supplier-${index}`}
                            className={`${styles.supplierColumn} ${
                              hasProveedor ? "" : styles.noProveedor
                            }`}
                          >
                            {hasProveedor && (
                              <div className={styles.proveedor}>
                                <p>
                                  {capitalizeFirstLetter(item.proveedor) ||
                                    "No disponible"}
                                </p>
                              </div>
                            )}

                            {/* {item.proveedor} */}
                          </div>
                        ))}
                      </div>
                      <div
                        className={`${styles.datesRow} ${
                          hasProveedor ? "" : styles.noProveedor
                        }`}
                      >
                        {productData.map((item, index) => (
                          <div
                            key={`date-${index}`}
                            className={`${styles.dateColumn} ${
                              hasProveedor ? "" : styles.noProveedor
                            }`}
                          >
                            {ordenedDate(item.fecha)}
                          </div>
                        ))}
                      </div>
                      <div
                        className={`${styles.pricesRow} ${
                          hasProveedor ? "" : styles.noProveedor
                        }`}
                      >
                        {productData.map((item, index) => (
                          <div
                            key={`price-${index}`}
                            className={`${styles.priceColumn} ${
                              hasProveedor ? "" : styles.noProveedor
                            }`}
                          >
                            ${" "}
                            {parseFloat(
                              item.precio
                                .replace(/[^\d,.-]/g, "")
                                .replace(".", "")
                                .replace(",", ".")
                            ).toLocaleString("es-AR", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })
            : !loading && (
                <div className={styles.containerNoSelection}>
                  <p>¡No se encontraron datos en la categoria seleccionada!</p>
                </div>
              )}
        </div>
      )}
    </div>
  );
};

export default DataECONPage;
