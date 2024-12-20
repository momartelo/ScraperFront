import { useEffect, useState } from "react";
import styles from "./DataPage.module.css";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

const DataPage = () => {
  const { category } = useParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `http://localhost:3020/api/graphics/${category}`
      );
      setData(response.data);
    } catch (err) {
      setError(err.message);
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
    if (category) {
      handleData();
    }
  }, [category]);

  return (
    <div className={styles.containerPage}>
      <div className={styles.containerTitle}>
        <div className={styles.subcontainerTitle}>
          <h1>Precios de Materiales</h1>
          <Link to={"/"} className={styles.buttonHome}>
            Volver
          </Link>
        </div>
      </div>
      {loading && <p>Cargando Datos...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      <div className={styles.containerData}>
        {Object.keys(data).length > 0
          ? Object.keys(data).map((productKey, productIndex) => {
              const productData = data[productKey];

              // Verificar si hay al menos un proveedor
              const hasProveedor = productData.some((item) => item.proveedor);

              return (
                <div key={productIndex} className={styles.gridItem}>
                  <h3>{capitalizeFirstLetter(productKey)}</h3>
                  <div
                    className={`${styles.gridContainer} ${
                      hasProveedor ? "" : styles.noProveedor
                    }`}
                  >
                    {/* {hasProveedor && (
                      <div className={styles.containerTitleColumn1}>
                        <h3>Empresa</h3>
                      </div>
                    )} */}
                    <div
                      className={
                        hasProveedor
                          ? styles.containerTitleColumn1
                          : styles.containerTitleColumn1Hidden
                      }
                    >
                      {hasProveedor && <h3>Empresa</h3>}
                    </div>
                    {/* <div className={styles.containerTitleColumn2}>
                      <h3>Fecha</h3>
                    </div> */}
                    <div
                      className={
                        hasProveedor
                          ? styles.containerTitleColumn2
                          : styles.containerTitleColumn2Shifted
                      }
                    >
                      <h3>Fecha</h3>
                    </div>
                    {/* <div className={styles.containerTitleColumn3}>
                      <h3>Precio</h3>
                    </div> */}
                    <div
                      className={
                        hasProveedor
                          ? styles.containerTitleColumn3
                          : styles.containerTitleColumn3Shifted
                      }
                    >
                      <h3>Precio</h3>
                    </div>
                    {/* Mostrar proveedor si existe */}
                    {hasProveedor && (
                      <div className={styles.proveedor}>
                        <p>{capitalizeFirstLetter(productData[0].proveedor)}</p>
                      </div>
                    )}

                    {/* Fila de fechas */}
                    <div className={styles.datesRow}>
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

                    {/* Fila de precios */}
                    <div className={styles.pricesRow}>
                      {productData.map((item, index) => (
                        <div
                          key={`price-${index}`}
                          className={`${styles.priceColumn} ${
                            hasProveedor ? "" : styles.noProveedor
                          }`}
                        >
                          $
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
              <p>No se encontraron datos para el prefijo seleccionado</p>
            )}
      </div>
    </div>
  );
};

export default DataPage;

// import { useEffect, useState } from "react";
// import styles from "./DataPage.module.css";
// import axios from "axios";
// import { Link, useParams } from "react-router-dom";

// const DataPage = () => {
//   const { category } = useParams();
//   // const [category, setCategory] = useState("");
//   const [data, setData] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [alertMessage, setAlertMessage] = useState("");
//   const [error, setError] = useState(null);

//   console.log(category);

//   const handleData = async () => {
//     setLoading(true);
//     setAlertMessage("");
//     setError(null);

//     try {
//       const response = await axios.get(
//         `http://localhost:3020/api/graphics/${category}`
//       );
//       console.log("Datos recibidos de la API", response.data);
//       setData(response.data);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // const cleanPrice = (price) => {
//   //   if (!price) return 0; // Si no hay precio, devolver 0
//   //   const cleanValue = price.replace(/[^\d.-]/g, ""); // Eliminar caracteres no numéricos
//   //   return parseFloat(cleanValue);
//   // };

//   const capitalizeFirstLetter = (text) => {
//     if (!text) return text; // Asegurarse de que no esté vacío o undefined
//     return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
//   };

//   const ordenedDate = (date) => {
//     if (!date) return date;
//     return date.slice(6) + "/" + date.slice(4, 6) + "/" + date.slice(0, 4);
//   };

//   useEffect(() => {
//     if (category) {
//       handleData();
//     }
//   }, [category]);

//   console.log(data); // Para verificar la respuesta

//   return (
//     <div className={styles.containerPage}>
//       <div className={styles.containerTitle}>
//         <div className={styles.subcontainerTitle}>
//           <h1>Precios de Materiales</h1>
//           <Link to={"/"} className={styles.buttonHome}>
//             Volver
//           </Link>
//         </div>
//       </div>
//       {loading && <p>Cargando Datos...</p>}
//       {error && <p style={{ color: "red" }}>Error: {error}</p>}
//       <div className={styles.containerData}>
//         {Object.keys(data).length > 0
//           ? Object.keys(data).map((date, dateIndex) => (
//               <div key={dateIndex} className={styles.containerItem}>
//                 <h3>{ordenedDate(date)}</h3>
//                 <table>
//                   <thead>
//                     <tr>
//                       {/* Verifica si al menos un item tiene datos de empresa o proveedor */}
//                       {data[date].some(
//                         (item) => item.empresa || item.proveedor
//                       ) && <th>Proveedor</th>}
//                       <th>Nombre del Producto</th>
//                       <th>Precio</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {data[date].map((item, itemIndex) => {
//                       // const cleanPriceValue = cleanPrice(item.precio);
//                       return (
//                         <tr key={`${dateIndex}-${itemIndex}`}>
//                           {(item.empresa || item.proveedor) && (
//                             <td>
//                               {capitalizeFirstLetter(item.empresa) ||
//                                 capitalizeFirstLetter(item.proveedor)}
//                             </td>
//                           )}
//                           <td>{capitalizeFirstLetter(item.nombre)}</td>
//                           {/* <td>{cleanPriceValue.toFixed(2)}</td> */}
//                           <td>
//                             $
//                             {parseFloat(
//                               item.precio
//                                 .replace(/[^\d,.-]/g, "") // Elimina todo excepto números, puntos y comas
//                                 .replace(".", "") // Elimina los puntos (separadores de miles)
//                                 .replace(",", ".") // Reemplaza la coma por un punto decimal
//                             ).toLocaleString("es-AR", {
//                               minimumFractionDigits: 2,
//                               maximumFractionDigits: 2,
//                             })}
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//             ))
//           : !loading && (
//               <p>No se encontraron datos para el prefijo seleccionado</p>
//             )}
//       </div>
//     </div>
//   );
// };

// export default DataPage;
