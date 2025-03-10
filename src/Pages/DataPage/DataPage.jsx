import { useEffect, useState } from "react";
import styles from "./DataPage.module.css";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Checkbox, Divider } from "antd";
import {
  capitalizeFirstLetter,
  formatPrice,
  ordenedDate,
} from "../../functions/generalFunctions";

const DataPage = () => {
  const { category } = useParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [checkedList, setCheckedList] = useState([]); // Lista de proveedores seleccionados
  const [options, setOptions] = useState([]); // Lista de opciones de proveedores

  const CheckboxGroup = Checkbox.Group;

  const handleData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `http://localhost:3020/api/data/${category}`
      );
      setData(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // const capitalizeFirstLetter = (text) => {
  //   if (!text) return text;
  //   return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  // };

  // const ordenedDate = (date) => {
  //   if (!date) return date;
  //   return date.slice(6) + "/" + date.slice(4, 6) + "/" + date.slice(0, 4);
  // };

  useEffect(() => {
    if (category) {
      handleData();
    }
  }, [category]);

  useEffect(() => {
    if (data) {
      // Extraer todos los proveedores de los datos y establecer las opciones del CheckboxGroup
      const proveedores = [];
      Object.values(data).forEach((productos) => {
        productos.forEach((item) => {
          if (!proveedores.includes(item.proveedor)) {
            proveedores.push(item.proveedor);
          }
        });
      });

      // Establecer las opciones y por defecto marcar todos los proveedores
      setOptions(proveedores);
      setCheckedList(proveedores); // Marca todos por defecto
    }
  }, [data]);

  const handleCheckboxChange = (checkedValues) => {
    setCheckedList(checkedValues);
  };

  const formatDataForChart = (productData) => {
    return productData.map((item) => ({
      date: ordenedDate(item.fecha),
      price: parseFloat(
        item.precio
          .replace(/[^\d,.-]/g, "")
          .replace(".", "")
          .replace(",", ".")
      ),
      // Asegúrate de que el campo 'precioParaGrafico' sea válido si lo usas en el Tooltip
      precioParaGrafico: parseFloat(
        item.precio
          .replace(/[^\d,.-]/g, "")
          .replace(".", "")
          .replace(",", ".")
      ),
    }));
  };

  // const formatPrice = (value) => {
  //   return `$${value.toLocaleString()}`; // Formatea el valor con el signo de pesos y separador de miles
  // };

  const getYAxisDomain = (data) => {
    const prices = data.map((item) => item.precioParaGrafico); // Suponiendo que "precioParaGrafico" es el campo de los precios.
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    // Redondeamos el mínimo y máximo a múltiplos de 500 (sin decimales)
    const roundedMinPrice = Math.floor(minPrice / 500) * 500; // Redondea hacia abajo al múltiplo de 500
    const roundedMaxPrice = Math.ceil(maxPrice / 500) * 500; // Redondea hacia arriba al múltiplo de 500

    return [roundedMinPrice, roundedMaxPrice];
  };

  const CustomTooltip = ({ payload, label }) => {
    if (!payload || payload.length === 0) return null;

    // Asegurarnos de que el precio existe en el payload
    const price = payload[0].payload
      ? payload[0].payload.precioParaGrafico
      : null;

    if (price === null || price === undefined) {
      return (
        <div
          style={{
            backgroundColor: "#fff",
            padding: "10px",
            border: "1px solid #ccc",
          }}
        >
          <p>
            <strong>Fecha:</strong> {ordenedDate(label)}
          </p>
          <p>
            <strong>Precio:</strong> No disponible
          </p>
        </div>
      );
    }

    // Si el precio existe, lo formateamos
    return (
      <div
        style={{
          backgroundColor: "#fff",
          padding: "10px",
          border: "1px solid #ccc",
        }}
      >
        <p>
          <strong>Fecha:</strong> {ordenedDate(label)}
        </p>
        <p>
          <strong>Precio:</strong> {formatPrice(price)}
        </p>
      </div>
    );
  };

  const filterDataByProveedor = (data, checkedList) => {
    if (checkedList.length === 0) return {}; // Si no hay proveedores seleccionados, retornamos un objeto vacío

    return Object.keys(data).reduce((filteredData, key) => {
      const filteredProducts = data[key].filter((item) =>
        checkedList.includes(item.proveedor)
      );

      if (filteredProducts.length > 0) {
        filteredData[key] = filteredProducts;
      }

      return filteredData;
    }, {});
  };

  const filteredData = filterDataByProveedor(data, checkedList);

  // Condición para mostrar los mensajes
  const noProviderSelected = !loading && checkedList.length === 0;
  const noDataFound =
    !loading &&
    Object.keys(filteredData).length === 0 &&
    checkedList.length > 0;

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
      <div className={styles.containerSelectSupplier}>
        <h3>Proveedores</h3>
        <CheckboxGroup
          options={options.map((proveedor) => ({
            label: proveedor,
            value: proveedor,
          }))}
          value={checkedList} // Establece el valor de los checkboxes seleccionados
          onChange={handleCheckboxChange}
          className={styles.checkboxGroup}
        />
      </div>

      {loading && <p>Cargando Datos...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {noProviderSelected && (
        <p style={{ color: "red" }}>
          Por favor, seleccione al menos un proveedor
        </p>
      )}

      {noDataFound && <p style={{ color: "red" }}>No se encontraron datos</p>}

      <div className={styles.containerData}>
        {Object.keys(filteredData).length > 0
          ? Object.keys(filteredData).map((productKey, productIndex) => {
              const productData = filteredData[productKey];
              const chartData = formatDataForChart(productData);

              return (
                <div key={productIndex} className={styles.gridItem}>
                  <div className={styles.containerTableAndTitle}>
                    <h3>{capitalizeFirstLetter(productKey)}</h3>

                    <div className={styles.gridContainer}>
                      <div className={styles.containerTitleColumn1}>
                        <h3>Empresa</h3>
                      </div>
                      <div className={styles.containerTitleColumn2}>
                        <h3>Fecha</h3>
                      </div>
                      <div className={styles.containerTitleColumn3}>
                        <h3>Precio</h3>
                      </div>

                      <div className={styles.proveedor}>
                        <p>{capitalizeFirstLetter(productData[0].proveedor)}</p>
                      </div>

                      <div className={styles.datesRow}>
                        {productData.map((item, index) => (
                          <div
                            key={`date-${index}`}
                            className={styles.dateColumn}
                          >
                            {ordenedDate(item.fecha)}
                          </div>
                        ))}
                      </div>

                      <div className={styles.pricesRow}>
                        {productData.map((item, index) => (
                          <div
                            key={`price-${index}`}
                            className={styles.priceColumn}
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
                  <div className={styles.chartContainer}>
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="date"
                          label={{
                            value: "Fecha",
                            position: "insideBottom",
                            offset: 35,
                          }}
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis
                          tick={{ fontSize: 12 }}
                          domain={getYAxisDomain(chartData)}
                          tickFormatter={(value) =>
                            `$${value.toLocaleString("es-AR")}`
                          }
                        />
                        <Tooltip content={<CustomTooltip />} />

                        <Line
                          type="monotone"
                          dataKey="price"
                          stroke="#8884d8"
                          dot={{
                            fill: "blue",
                            stroke: "white",
                            strokeWidth: 2,
                            r: 6,
                          }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              );
            })
          : !loading &&
            !noProviderSelected && (
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
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import { Checkbox, Divider } from "antd";

// const DataPage = () => {
//   const { category } = useParams();
//   const [data, setData] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [checkedList, setCheckedList] = useState([]);
//   const [options, setOptions] = useState([]);

//   const CheckboxGroup = Checkbox.Group;

//   const handleData = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await axios.get(
//         `http://localhost:3020/api/graphics/${category}`
//       );
//       setData(response.data);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const capitalizeFirstLetter = (text) => {
//     if (!text) return text;
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

//   const handleCheckboxChange = (checkedValues) => {
//     setCheckedList(checkedValues);
//   };

//   const formatDataForChart = (productData) => {
//     return productData.map((item) => ({
//       date: ordenedDate(item.fecha),
//       price: parseFloat(
//         item.precio
//           .replace(/[^\d,.-]/g, "")
//           .replace(".", "")
//           .replace(",", ".")
//       ),
//       // Asegúrate de que el campo 'precioParaGrafico' sea válido si lo usas en el Tooltip
//       precioParaGrafico: parseFloat(
//         item.precio
//           .replace(/[^\d,.-]/g, "")
//           .replace(".", "")
//           .replace(",", ".")
//       ),
//     }));
//   };

//   const formatPrice = (value) => {
//     return `$${value.toLocaleString()}`; // Formatea el valor con el signo de pesos y separador de miles
//   };

//   const getYAxisDomain = (data) => {
//     const prices = data.map((item) => item.precioParaGrafico); // Suponiendo que "precioParaGrafico" es el campo de los precios.
//     const minPrice = Math.min(...prices);
//     const maxPrice = Math.max(...prices);

//     // Redondeamos el mínimo y máximo a múltiplos de 500 (sin decimales)
//     const roundedMinPrice = Math.floor(minPrice / 500) * 500; // Redondea hacia abajo al múltiplo de 500
//     const roundedMaxPrice = Math.ceil(maxPrice / 500) * 500; // Redondea hacia arriba al múltiplo de 500

//     return [roundedMinPrice, roundedMaxPrice];
//   };

//   const CustomTooltip = ({ payload, label }) => {
//     if (!payload || payload.length === 0) return null;

//     // Asegurarnos de que el precio existe en el payload
//     const price = payload[0].payload
//       ? payload[0].payload.precioParaGrafico
//       : null;

//     if (price === null || price === undefined) {
//       return (
//         <div
//           style={{
//             backgroundColor: "#fff",
//             padding: "10px",
//             border: "1px solid #ccc",
//           }}
//         >
//           <p>
//             <strong>Fecha:</strong> {ordenedDate(label)}
//           </p>
//           <p>
//             <strong>Precio:</strong> No disponible
//           </p>
//         </div>
//       );
//     }

//     // Si el precio existe, lo formateamos
//     return (
//       <div
//         style={{
//           backgroundColor: "#fff",
//           padding: "10px",
//           border: "1px solid #ccc",
//         }}
//       >
//         <p>
//           <strong>Fecha:</strong> {ordenedDate(label)}
//         </p>
//         <p>
//           <strong>Precio:</strong> {formatPrice(price)}
//         </p>
//       </div>
//     );
//   };

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
//           ? Object.keys(data).map((productKey, productIndex) => {
//               const productData = data[productKey];

//               // Verificar si hay al menos un proveedor
//               const hasProveedor = productData.some((item) => item.proveedor);

//               const chartData = formatDataForChart(productData);

//               return (
//                 <div key={productIndex} className={styles.gridItem}>
//                   <div className={styles.containerTableAndTitle}>
//                     <h3>{capitalizeFirstLetter(productKey)}</h3>
//                     <div
//                       className={`${styles.gridContainer} ${
//                         hasProveedor ? "" : styles.noProveedor
//                       }`}
//                     >
//                       {/* {hasProveedor && (
//                       <div className={styles.containerTitleColumn1}>
//                         <h3>Empresa</h3>
//                       </div>
//                     )} */}
//                       <div
//                         className={
//                           hasProveedor
//                             ? styles.containerTitleColumn1
//                             : styles.containerTitleColumn1Hidden
//                         }
//                       >
//                         {hasProveedor && <h3>Empresa</h3>}
//                       </div>
//                       {/* <div className={styles.containerTitleColumn2}>
//                       <h3>Fecha</h3>
//                     </div> */}
//                       <div
//                         className={
//                           hasProveedor
//                             ? styles.containerTitleColumn2
//                             : styles.containerTitleColumn2Shifted
//                         }
//                       >
//                         <h3>Fecha</h3>
//                       </div>
//                       {/* <div className={styles.containerTitleColumn3}>
//                       <h3>Precio</h3>
//                     </div> */}
//                       <div
//                         className={
//                           hasProveedor
//                             ? styles.containerTitleColumn3
//                             : styles.containerTitleColumn3Shifted
//                         }
//                       >
//                         <h3>Precio</h3>
//                       </div>
//                       {/* Mostrar proveedor si existe */}
//                       {hasProveedor && (
//                         <div className={styles.proveedor}>
//                           <p>
//                             {capitalizeFirstLetter(productData[0].proveedor)}
//                           </p>
//                         </div>
//                       )}

//                       {/* Fila de fechas */}
//                       <div className={styles.datesRow}>
//                         {productData.map((item, index) => (
//                           <div
//                             key={`date-${index}`}
//                             className={`${styles.dateColumn} ${
//                               hasProveedor ? "" : styles.noProveedor
//                             }`}
//                           >
//                             {ordenedDate(item.fecha)}
//                           </div>
//                         ))}
//                       </div>

//                       {/* Fila de precios */}
//                       <div className={styles.pricesRow}>
//                         {productData.map((item, index) => (
//                           <div
//                             key={`price-${index}`}
//                             className={`${styles.priceColumn} ${
//                               hasProveedor ? "" : styles.noProveedor
//                             }`}
//                           >
//                             $
//                             {parseFloat(
//                               item.precio
//                                 .replace(/[^\d,.-]/g, "")
//                                 .replace(".", "")
//                                 .replace(",", ".")
//                             ).toLocaleString("es-AR", {
//                               minimumFractionDigits: 2,
//                               maximumFractionDigits: 2,
//                             })}
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                   <div className={styles.chartContainer}>
//                     <ResponsiveContainer width="100%" height={400}>
//                       <LineChart data={chartData}>
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis
//                           dataKey="date"
//                           label={{
//                             value: "Fecha",
//                             position: "insideBottom",
//                             offset: 35,
//                           }}
//                           tick={{ fontSize: 12 }}
//                         />
//                         <YAxis
//                           tick={{ fontSize: 12 }}
//                           domain={getYAxisDomain(chartData)}
//                         />
//                         <Tooltip content={<CustomTooltip />} />

//                         <Line
//                           type="monotone"
//                           dataKey="price"
//                           stroke="#8884d8"
//                           dot={{
//                             fill: "blue",
//                             stroke: "white",
//                             strokeWidth: 2,
//                             r: 6,
//                           }}
//                         />
//                       </LineChart>
//                     </ResponsiveContainer>
//                   </div>
//                 </div>
//               );
//             })
//           : !loading && (
//               <p>No se encontraron datos para el prefijo seleccionado</p>
//             )}
//       </div>
//     </div>
//   );
// };

// export default DataPage;
