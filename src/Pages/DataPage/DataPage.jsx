import { useEffect, useState } from "react";
import styles from "./DataPage.module.css";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

const DataPage = () => {
  const { category } = useParams();
  // const [category, setCategory] = useState("");
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [error, setError] = useState(null);

  console.log(category);

  const handleData = async () => {
    setLoading(true);
    setAlertMessage("");
    setError(null);

    try {
      const response = await axios.get(
        `http://localhost:3020/api/graphics/${category}`
      );
      console.log("Datos recibidos de la API", response.data);
      setData(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // const cleanPrice = (price) => {
  //   if (!price) return 0; // Si no hay precio, devolver 0
  //   const cleanValue = price.replace(/[^\d.-]/g, ""); // Eliminar caracteres no numéricos
  //   return parseFloat(cleanValue);
  // };

  const capitalizeFirstLetter = (text) => {
    if (!text) return text; // Asegurarse de que no esté vacío o undefined
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

  console.log(data); // Para verificar la respuesta

  return (
    <div className={styles.containerPage}>
      <div className={styles.containerTitle}>
        <h1>Precios de Materiales</h1>
        <Link to={"/"} className={styles.buttonHome}>
          Volver
        </Link>
      </div>
      {loading && <p>Cargando Datos...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      <div className={styles.containerData}>
        {Object.keys(data).length > 0
          ? Object.keys(data).map((date, dateIndex) => (
              <div key={dateIndex} className={styles.containerItem}>
                <h3>{ordenedDate(date)}</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Proveedor</th>
                      <th>Nombre del Producto</th>
                      <th>Precio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data[date].map((item, itemIndex) => {
                      // const cleanPriceValue = cleanPrice(item.precio);
                      return (
                        <tr key={`${dateIndex}-${itemIndex}`}>
                          <td>
                            {capitalizeFirstLetter(item.empresa) ||
                              capitalizeFirstLetter(item.proveedor)}
                          </td>
                          <td>{capitalizeFirstLetter(item.nombre)}</td>
                          {/* <td>{cleanPriceValue.toFixed(2)}</td> */}
                          <td>
                            $
                            {parseFloat(
                              item.precio
                                .replace(/[^\d,.-]/g, "") // Elimina todo excepto números, puntos y comas
                                .replace(".", "") // Elimina los puntos (separadores de miles)
                                .replace(",", ".") // Reemplaza la coma por un punto decimal
                            ).toLocaleString("es-AR", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ))
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

// const DataPage = () => {
//   const [category, setCategory] = useState("");
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [alertMessage, setAlertMessage] = useState("");
//   const [error, setError] = useState(null);

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

//   const cleanPrice = (price) => {
//     if (!price) return 0; // Si no hay precio, devolver 0
//     const cleanValue = price.replace(/[^\d.-]/g, ""); // Eliminar caracteres no numéricos
//     return parseFloat(cleanValue);
//   };

//   useEffect(() => {
//     if (category) {
//       handleData();
//     }
//   }, [category]);

//   console.log(data);

//   return (
//     <div>
//       <h1>Precios de Materiales</h1>
//       <div>
//         <label htmlFor="category">Seleccionar la categorua</label>
//         <select
//           id="category"
//           value={category}
//           onChange={(e) => setCategory(e.target.value)}
//         >
//           <option value="precioCemento">Cemento</option>
//           <option value="productosECON_obra_gruesa_">ECON - Obra Gruesa</option>
//           <option value="productosECON_aceros_">ECON - Aceros</option>
//           <option value="precioHormigones">Hormigones</option>
//         </select>
//       </div>
//       {loading && <p>Cargando Datos...</p>}
//       {error && <p style={{ color: "red" }}>Error: {error}</p>}
//       <div>
//         {data.length > 0 ? (
//           <table>
//             <thead>
//               <tr>
//                 <th>Proveedor</th>
//                 <th>Nombre del Producto</th>
//                 <th>Precio</th>
//               </tr>
//             </thead>
//             <tbody>
//               {data.map((categoryData, categoryIndex) =>
//                 categoryData.map((item, itemIndex) => {
//                   const cleanPriceValue = cleanPrice(item.precio);
//                   return (
//                     <tr key={`${categoryIndex}-${itemIndex}`}>
//                       <td>{item.proveedor}</td>
//                       <td>{item.nombre}</td>
//                       <td>{cleanPriceValue.toFixed(2)}</td>{" "}
//                       <td>
//                         $
//                         {parseFloat(
//                           item.precio
//                             .replace(/[^\d,.-]/g, "") // Elimina todo excepto números, puntos y comas
//                             .replace(".", "") // Elimina los puntos (separadores de miles)
//                             .replace(",", ".") // Reemplaza la coma por un punto decimal
//                         ).toLocaleString("es-AR", {
//                           // Usamos 'es-AR' para el formato argentino
//                           minimumFractionDigits: 2,
//                           maximumFractionDigits: 2,
//                         })}
//                       </td>
//                       {/* Muestra el precio limpio */}
//                     </tr>
//                   );
//                 })
//               )}
//             </tbody>
//           </table>
//         ) : (
//           !loading && (
//             <p>No se encontraron datos para el prefijo seleccionado</p>
//           )
//         )}
//       </div>
//     </div>
//   );
// };

// export default DataPage;
