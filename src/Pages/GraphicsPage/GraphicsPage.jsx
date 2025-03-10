import styles from "./GraphicsPage.module.css";
import { useEffect, useState } from "react";
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
  ordenedDate,
} from "../../functions/generalFunctions";
import {
  CustomLegend,
  CustomTooltipManySuppliers,
  getYAxisDomain,
} from "../../functions/graphicsFunctions";

const GraphicsPage = () => {
  const { category } = useParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://localhost:3020/api/data/${category}`
      );

      const apiData = response.data;

      const dataPerProvider = {};

      Object.keys(apiData).forEach((productKey) => {
        apiData[productKey].forEach((item) => {
          const providerName = item.proveedor;

          if (!dataPerProvider[providerName]) {
            dataPerProvider[providerName] = [];
          }

          dataPerProvider[providerName].push({
            date: ordenedDate(item.fecha),
            price: parseFloat(
              item.precio
                .replace(/[^\d,.-]/g, "")
                .replace(".", "")
                .replace(",", ".")
            ),
            precioParaGrafico: parseFloat(
              item.precio
                .replace(/[^\d,.-]/g, "")
                .replace(".", "")
                .replace(",", ".")
            ),
          });
        });
      });

      setData(dataPerProvider);
      console.log("apiData", apiData);
      console.log("Datos por Proveedor", dataPerProvider);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (category) {
      handleData();
    }
  }, [category]);

  const noDataFound = !loading && Object.keys(data).length === 0;

  // Ahora fusionamos todos los datos de los proveedores en un solo array
  const mergedData = () => {
    // Encontramos todas las fechas únicas de todos los proveedores
    const allDates = Array.from(
      new Set(
        Object.values(data)
          .flat()
          .map((entry) => entry.date)
      )
    );

    // Preparamos un array con las fechas y los precios correspondientes de cada proveedor
    return allDates.map((date) => {
      const combinedEntry = { date };
      Object.keys(data).forEach((provider) => {
        const entry = data[provider].find((item) => item.date === date);
        combinedEntry[provider] = entry ? entry.precioParaGrafico : null;
      });

      return combinedEntry;
    });
  };

  return (
    <div className={styles.containerPage}>
      <div className={styles.containerTitle}>
        <div className={styles.subcontainerTitle}>
          <h1>Graficos</h1>
          <Link to={"/"} className={styles.buttonHome}>
            Volver
          </Link>
        </div>
      </div>

      {loading && <p>Cargando Datos...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {noDataFound && <p style={{ color: "red" }}>No se encontraron datos</p>}

      <div className={styles.containerData}>
        {Object.keys(data).length > 0 ? (
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={mergedData()}>
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
                  label={{
                    value: "Precio",
                    angle: 270, // Aquí defines el ángulo a 90 grados
                    position: "insideTop", // Para asegurarte de que el texto se dibuje en el lugar correcto
                    offset: 50, // Para ajustar el espaciado si es necesario
                  }}
                  tick={{ fontSize: 12 }}
                  domain={getYAxisDomain(mergedData())}
                  tickFormatter={(value) => `$${value.toLocaleString("es-AR")}`}
                />
                <Tooltip content={<CustomTooltipManySuppliers />} />
                <Legend content={<CustomLegend />} />
                {/* Creando una línea para cada proveedor */}
                {Object.keys(data).map((providerKey, index) => (
                  <Line
                    key={index}
                    type="monotone"
                    dataKey={providerKey}
                    stroke={`hsl(${
                      (index * 360) / Object.keys(data).length
                    }, 70%, 50%)`}
                    dot={{
                      r: 4, // tamaño del punto
                      fill: `hsl(${
                        (index * 360) / Object.keys(data).length
                      }, 70%, 50%)`, // color del punto
                      stroke: "#fff", // color del borde del punto
                      strokeWidth: 1, // grosor del borde del punto
                    }}
                    name={providerKey}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          !loading && <p>No hay Datos</p>
        )}
      </div>
    </div>
  );
};

export default GraphicsPage;

// import styles from "./GraphicsPage.module.css";
// import { useEffect, useState } from "react";
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

// const GraphicsPage = () => {
//   const { category } = useParams();
//   const [data, setData] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleData = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axios.get(
//         `http://localhost:3020/api/data/${category}`
//       );

//       const apiData = response.data;

//       const dataPerProvider = {};

//       Object.keys(apiData).forEach((productKey) => {
//         apiData[productKey].forEach((item) => {
//           const providerName = item.proveedor;

//           if (!dataPerProvider[providerName]) {
//             dataPerProvider[providerName] = [];
//           }

//           dataPerProvider[providerName].push({
//             date: ordenedDate(item.fecha),
//             price: parseFloat(
//               item.precio
//                 .replace(/[^\d,.-]/g, "")
//                 .replace(".", "")
//                 .replace(",", ".")
//             ),
//             precioParaGrafico: parseFloat(
//               item.precio
//                 .replace(/[^\d,.-]/g, "")
//                 .replace(".", "")
//                 .replace(",", ".")
//             ),
//           });
//         });
//       });

//       setData(dataPerProvider);
//       console.log("apiData", apiData);
//       console.log("Datos por Proveedor", dataPerProvider);
//     } catch (error) {
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (category) {
//       handleData();
//     }
//   }, [category]);

//   const ordenedDate = (date) => {
//     if (!date) return date;
//     return date.slice(6) + "/" + date.slice(4, 6) + "/" + date.slice(0, 4);
//   };

//   const getYAxisDomain = (data) => {
//     // Extraemos todos los valores de precios en un solo array
//     const prices = data
//       .flatMap((item) => [
//         item.imepho,
//         item.rutenia,
//         item.marchal,
//         item.vega,
//         item.easy,
//       ])
//       .filter((price) => price !== null); // Filtramos los nulls para evitar errores en los cálculos

//     const minPrice = Math.min(...prices);
//     const maxPrice = Math.max(...prices);

//     // Redondeamos el mínimo y máximo a múltiplos de 500
//     const roundedMinPrice = Math.floor(minPrice / 1000) * 1000; // Redondea hacia abajo al múltiplo de 500
//     const roundedMaxPrice = Math.ceil(maxPrice / 1000) * 1000; // Redondea hacia arriba al múltiplo de 500

//     return [roundedMinPrice, roundedMaxPrice];
//   };

//   const capitalizeFirstLetter = (text) => {
//     if (!text) return text;
//     return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
//   };

//   const formatPrice = (value) => {
//     return `$${value.toLocaleString()}`;
//   };

//   const CustomTooltip = ({ payload, label }) => {
//     if (!payload || payload.length === 0) return null;

//     return (
//       <div
//         style={{
//           backgroundColor: "#fff",
//           padding: "10px",
//           border: "1px solid #ccc",
//         }}
//       >
//         <p>
//           <strong>Fecha:</strong> {label}
//         </p>
//         {payload.map((entry, index) => {
//           const providerName = entry.name; // Obtener el nombre del proveedor
//           const price = entry.payload[providerName]; // Obtener el precio del proveedor correspondiente

//           // Si el precio es null o undefined, mostrar "No disponible"
//           if (price === null || price === undefined) {
//             return (
//               <p key={index}>
//                 <strong>{capitalizeFirstLetter(providerName)}:</strong> No
//                 disponible
//               </p>
//             );
//           }

//           // Mostrar el precio formateado si está disponible
//           return (
//             <p key={index}>
//               <strong>{capitalizeFirstLetter(providerName)}:</strong> $
//               {price.toLocaleString()}
//             </p>
//           );
//         })}
//       </div>
//     );
//   };

//   const CustomLegend = (props) => {
//     const { payload } = props;

//     return (
//       <div
//         style={{
//           display: "flex",
//           flexDirection: "row",
//           flexWrap: "wrap",
//           justifyContent: "center",
//         }}
//       >
//         {payload.map((entry, index) => (
//           <div
//             key={index}
//             style={{
//               display: "flex",
//               alignItems: "center",
//               marginRight: "20px",
//               marginBottom: "10px",
//             }}
//           >
//             <div
//               style={{
//                 width: "12px",
//                 height: "12px",
//                 backgroundColor: entry.color,
//                 marginRight: "8px",
//                 borderRadius: "50%",
//               }}
//             />
//             <span style={{ fontSize: "14px", fontWeight: "bold" }}>
//               {capitalizeFirstLetter(entry.value)}{" "}
//               {/* Aquí puedes personalizar el texto */}
//             </span>
//           </div>
//         ))}
//       </div>
//     );
//   };

//   const noDataFound = !loading && Object.keys(data).length === 0;

//   // Ahora fusionamos todos los datos de los proveedores en un solo array
//   const mergedData = () => {
//     // Encontramos todas las fechas únicas de todos los proveedores
//     const allDates = Array.from(
//       new Set(
//         Object.values(data)
//           .flat()
//           .map((entry) => entry.date)
//       )
//     );

//     // Preparamos un array con las fechas y los precios correspondientes de cada proveedor
//     return allDates.map((date) => {
//       const combinedEntry = { date };
//       Object.keys(data).forEach((provider) => {
//         const entry = data[provider].find((item) => item.date === date);
//         combinedEntry[provider] = entry ? entry.precioParaGrafico : null;
//       });
//       return combinedEntry;
//     });
//   };

//   return (
//     <div className={styles.containerPage}>
//       <div className={styles.containerTitle}>
//         <div className={styles.subcontainerTitle}>
//           <h1>Graficos</h1>
//           <Link to={"/"} className={styles.buttonHome}>
//             Volver
//           </Link>
//         </div>
//       </div>

//       {loading && <p>Cargando Datos...</p>}
//       {error && <p style={{ color: "red" }}>Error: {error}</p>}
//       {noDataFound && <p style={{ color: "red" }}>No se encontraron datos</p>}

//       <div className={styles.containerData}>
//         {Object.keys(data).length > 0 ? (
//           <div className={styles.chartContainer}>
//             <ResponsiveContainer width="100%" height={400}>
//               <LineChart data={mergedData()}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis
//                   dataKey="date"
//                   label={{
//                     value: "Fecha",
//                     position: "insideBottom",
//                     offset: 35,
//                   }}
//                   tick={{ fontSize: 12 }}
//                 />
//                 <YAxis
//                   tick={{ fontSize: 12 }}
//                   domain={getYAxisDomain(mergedData())}
//                   tickFormatter={(value) => `$${value.toLocaleString("es-AR")}`}
//                 />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Legend content={<CustomLegend />} />
//                 {/* Creando una línea para cada proveedor */}
//                 {Object.keys(data).map((providerKey, index) => (
//                   <Line
//                     key={index}
//                     type="monotone"
//                     dataKey={providerKey}
//                     stroke={`hsl(${
//                       (index * 360) / Object.keys(data).length
//                     }, 70%, 50%)`}
//                     dot={{
//                       r: 4, // tamaño del punto
//                       fill: `hsl(${
//                         (index * 360) / Object.keys(data).length
//                       }, 70%, 50%)`, // color del punto
//                       stroke: "#fff", // color del borde del punto
//                       strokeWidth: 1, // grosor del borde del punto
//                     }}
//                     name={providerKey}
//                   />
//                 ))}
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         ) : (
//           !loading && <p>No hay Datos</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default GraphicsPage;
