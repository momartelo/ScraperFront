import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./DataAcero.module.css";
import { useState, useEffect } from "react";
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

const DataAcero = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [error, setError] = useState(null);
  const [showLoading, setShowLoading] = useState(false);
  const [checkedList, setCheckedList] = useState([]);
  const [options, setOptions] = useState([]);
  const [selectedDiameter, setSelectedDiameter] = useState("");

  const navigate = useNavigate();
  const CheckboxGroup = Checkbox.Group;

  const capitalizerFirstLetter = (text) => {
    if (!text) return text;
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  const handleReset = async () => {
    navigate(0);
  };

  const handleData = async (diametro) => {
    setLoading(true);
    setError(null);
    setShowLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3020/api/graphics/precioAcero_${diametro}`
      );
      console.log("Respuesta", response.data);

      // Agrupar los productos por proveedor
      const groupedByProvider = Object.entries(response.data).reduce(
        (acc, [key, productos]) => {
          productos.forEach((producto) => {
            let { proveedor, precio, fecha } = producto;

            // Limpieza y conversión del precio
            precio = precio.replace(/\./g, ""); // Elimina los puntos (separadores de miles)
            precio = precio.replace(/,/g, "."); // Reemplaza las comas por puntos (separador decimal)
            const precioParaGrafico = parseFloat(precio);
            const fechaParaGrafico = fecha.replace(
              /(\d{4})-(\d{2})-(\d{2})/,
              "$3/$2/$1"
            );

            if (!acc[proveedor]) {
              acc[proveedor] = [];
            }
            acc[proveedor].push({
              ...producto,
              precioParaGrafico,
              fechaParaGrafico,
            });
          });
          return acc;
        },
        {}
      );
      console.log("Agrupados ", groupedByProvider);
      setData(groupedByProvider);
      const proveedores = Object.keys(groupedByProvider);
      setOptions(proveedores);
      setCheckedList(proveedores); // Marcar todos los checkboxes al cargar
      console.log("Proveedores ", proveedores);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
      setShowLoading(false);
    }
  };

  const ordenedDate = (date) => {
    if (!date) return date;
    return date.slice(6) + "/" + date.slice(4, 6) + "/" + date.slice(0, 4);
  };

  const formatPrice = (value) => {
    return `$${value.toLocaleString()}`; // Formatea el valor con el signo de pesos y separador de miles
  };

  useEffect(() => {
    if (selectedDiameter) {
      handleData(selectedDiameter);
    } else {
      setData({}); // Borra los datos cuando no hay diámetro seleccionado
    }
  }, [selectedDiameter]);

  const handleSelectChange = (event) => {
    setSelectedDiameter(event.target.value);
  };

  // Actualizar el estado `checkedList` con los proveedores seleccionados
  const handleCheckboxChange = (checkedValues) => {
    setCheckedList(checkedValues);
  };

  const CustomTooltip = ({ payload, label }) => {
    if (!payload || payload.length === 0) return null;

    // Extraer los datos del Tooltip
    const { precioParaGrafico } = payload[0].payload;

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
          <strong>Precio:</strong> {formatPrice(precioParaGrafico)}
        </p>
      </div>
    );
  };

  const getYAxisDomain = (data) => {
    const prices = data.map((item) => item.precioParaGrafico); // Suponiendo que "precioParaGrafico" es el campo de los precios.
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    // Redondeamos el mínimo y máximo a múltiplos de 500 (sin decimales)
    const roundedMinPrice = Math.floor(minPrice / 500) * 500; // Redondea hacia abajo al múltiplo de 500
    const roundedMaxPrice = Math.ceil(maxPrice / 500) * 500; // Redondea hacia arriba al múltiplo de 500

    return [roundedMinPrice, roundedMaxPrice];
  };

  // Filtrar los datos según los proveedores seleccionados
  const filteredData =
    checkedList.length === 0
      ? data
      : Object.keys(data)
          .filter((key) => checkedList.includes(key))
          .reduce((obj, key) => {
            obj[key] = data[key];
            return obj;
          }, {});

  return (
    <div className={styles.containerPage}>
      <div className={styles.containerTitle}>
        <div className={styles.subcontainerTitle}>
          <h1>Precios de Hierro Aleteado</h1>
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
          id="diameters"
          name="diameters"
          onChange={handleSelectChange}
          value={selectedDiameter}
          className={styles.selectDiameter}
        >
          <option value="" disabled>
            Seleccione un diametro
          </option>
          <option value="6">Ø6</option>
          <option value="8">Ø8</option>
          <option value="10">Ø10</option>
          <option value="12">Ø12</option>
          <option value="16">Ø16</option>
          <option value="20">Ø20</option>
          <option value="25">Ø25</option>
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

      {/* Mensaje cuando no se ha seleccionado un diámetro */}
      {selectedDiameter === "" ? (
        <div className={styles.noMaterialsContainer}>
          <p>Seleccione un diámetro para ver datos.</p>
        </div>
      ) : Object.keys(data).length === 0 ? (
        <div className={styles.noMaterialsContainer}>
          <p>No hay datos disponibles para el diámetro seleccionado.</p>
        </div>
      ) : (
        <div className={styles.containerCheckbox}>
          {Object.keys(data).length > 0 && selectedDiameter && (
            <div className={styles.containerSelectSupplier}>
              <CheckboxGroup
                options={options}
                value={checkedList} // Establece el valor de los checkboxes seleccionados
                onChange={handleCheckboxChange}
                className={styles.checkboxGroup}
              />
            </div>
          )}

          <div className={styles.containerData}>
            {checkedList.length === 0 && selectedDiameter ? (
              <div className={styles.noMaterialsContainer}>
                <p>
                  No hay proveedores seleccionados. Por favor, selecciona al
                  menos uno.
                </p>
              </div>
            ) : Object.keys(filteredData).length > 0 ? (
              <div className={styles.containerData}>
                {Object.entries(filteredData).map(([proveedor, productos]) =>
                  // Verifica si 'productos' existe antes de intentar hacer el mapeo
                  productos && productos.length > 0 ? (
                    <div
                      className={styles.containerProductAndGraphic}
                      key={proveedor}
                    >
                      <div className={styles.containerProductGeneral}>
                        <h3>{capitalizerFirstLetter(proveedor)}</h3>
                        <div className={styles.tableContainer}>
                          <div className={styles.tableHeader}>
                            <div className={styles.column}>Producto</div>
                            <div className={styles.column}>Fechas</div>
                            <div className={styles.column}>Precios</div>
                          </div>
                          {productos.map((producto, index) => (
                            <div key={index} className={styles.tableRow}>
                              <div className={styles.column}>
                                <p>Hierro Aletado Ø{selectedDiameter}</p>
                              </div>
                              <div className={styles.column}>
                                {ordenedDate(producto.fecha)}
                              </div>
                              <div className={styles.column}>
                                ${producto.precio}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className={styles.containerGraphic}>
                        <ResponsiveContainer width="100%" height={350}>
                          <LineChart data={productos}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                              dataKey="fechaParaGrafico"
                              label={{
                                value: "Fecha",
                                position: "insideBottom",
                                offset: 35,
                              }}
                              tickFormatter={ordenedDate}
                              tick={{ fontSize: 12 }}
                            />
                            <YAxis
                              label={{
                                value: "Precio",
                                style: { textAnchor: "start" },
                                angle: -90,
                                position: "right",
                                offset: 10,
                              }}
                              tickFormatter={formatPrice}
                              tick={{ fontSize: 12 }}
                              domain={getYAxisDomain(productos)}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Line
                              type="monotone"
                              dataKey="precioParaGrafico"
                              stroke="#8884d8"
                              name="Precio"
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
                  ) : (
                    <div className={styles.noMaterialsContainer}>
                      <p>No hay productos para este proveedor.</p>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className={styles.noMaterialsContainer}>
                <p>¡No hay materiales disponibles!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DataAcero;

// import React from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import styles from "./DataAcero.module.css";
// import { useState, useEffect } from "react";
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

// const DataAcero = () => {
//   const [loading, setLoading] = useState(false);
//   const [data, setData] = useState({});
//   const [error, setError] = useState(null);
//   const [showLoading, setShowLoading] = useState(false);
//   const [checkedList, setCheckedList] = useState("");
//   const [options, setOptions] = useState([]);
//   const [selectedDiameter, setSelectedDiameter] = useState("");
//   const [selectedSupplier, setSelectedSupplier] = useState("all");

//   const navigate = useNavigate();
//   const CheckboxGroup = Checkbox.Group;

//   const capitalizerFirstLetter = (text) => {
//     if (!text) return text;
//     return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
//   };

//   const handleReset = async () => {
//     navigate(0);
//   };

//   const handleData = async (diametro) => {
//     setLoading(true);
//     setError(null);
//     setShowLoading(true);
//     try {
//       const response = await axios.get(
//         `http://localhost:3020/api/graphics/precioAcero_${diametro}`
//       );
//       console.log("Respuesta", response.data);

//       // Agrupar los productos por proveedor
//       const groupedByProvider = Object.entries(response.data).reduce(
//         (acc, [key, productos]) => {
//           productos.forEach((producto) => {
//             let { proveedor, precio, fecha } = producto;

//             // Limpieza y conversión del precio
//             precio = precio.replace(/\./g, ""); // Elimina los puntos (separadores de miles)
//             precio = precio.replace(/,/g, "."); // Reemplaza las comas por puntos (separador decimal)
//             const precioParaGrafico = parseFloat(precio);
//             const fechaParaGrafico = fecha.replace(
//               /(\d{4})-(\d{2})-(\d{2})/,
//               "$3/$2/$1"
//             );

//             if (!acc[proveedor]) {
//               acc[proveedor] = [];
//             }
//             acc[proveedor].push({
//               ...producto,
//               precioParaGrafico,
//               fechaParaGrafico,
//             });
//           });
//           return acc;
//         },
//         {}
//       );
//       console.log("Agrupados ", groupedByProvider);
//       setData(groupedByProvider);
//       const proveedores = Object.keys(groupedByProvider);
//       setOptions(proveedores);
//       console.log("Proveedores ", proveedores);
//     } catch (error) {
//       setError(error.message);
//     } finally {
//       setLoading(false);
//       setShowLoading(false);
//     }
//   };

//   const ordenedDate = (date) => {
//     if (!date) return date;
//     return date.slice(6) + "/" + date.slice(4, 6) + "/" + date.slice(0, 4);
//   };

//   const formatPrice = (value) => {
//     return `$${value.toLocaleString()}`; // Formatea el valor con el signo de pesos y separador de miles
//   };

//   useEffect(() => {
//     if (selectedDiameter) {
//       handleData(selectedDiameter);
//     }
//   }, [selectedDiameter]);

//   useEffect(() => {
//     if (selectedDiameter) {
//       handleData(selectedDiameter);
//     }
//   }, [selectedDiameter]);

//   const handleSelectChange = (event) => {
//     setSelectedDiameter(event.target.value);
//   };

//   const handleSelectSupplierChange = (event) => {
//     setSelectedSupplier(event.target.value);
//   };

//   const CustomTooltip = ({ payload, label }) => {
//     if (!payload || payload.length === 0) return null;

//     // Extraer los datos del Tooltip
//     const { precioParaGrafico } = payload[0].payload;

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
//           <strong>Precio:</strong> {formatPrice(precioParaGrafico)}
//         </p>
//       </div>
//     );
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

//   // Filtrar los datos según el proveedor seleccionado
//   const filteredData =
//     selectedSupplier === "all"
//       ? data
//       : { [selectedSupplier]: data[selectedSupplier] };

//   return (
//     <div className={styles.containerPage}>
//       <div className={styles.containerTitle}>
//         <div className={styles.subcontainerTitle}>
//           <h1>Precios de Hierro Aleteado</h1>
//         </div>
//       </div>
//       {showLoading && (
//         <div className={styles.containerLoadingData}>
//           <p>Cargando Datos...</p>
//         </div>
//       )}
//       {error && <p style={{ color: "red" }}>Error: {error}</p>}
//       <div className={styles.containerSelect}>
//         <select
//           id="diameters"
//           name="diameters"
//           onChange={handleSelectChange}
//           value={selectedDiameter}
//           className={styles.selectDiameter}
//         >
//           <option value="">Seleccione un diametro</option>
//           <option value="6">Ø6</option>
//           <option value="8">Ø8</option>
//           <option value="10">Ø10</option>
//           <option value="12">Ø12</option>
//           <option value="16">Ø16</option>
//           <option value="20">Ø20</option>
//           <option value="25">Ø25</option>
//         </select>
//         <button
//           onClick={handleReset}
//           disabled={loading}
//           className={styles.buttonReset}
//         >
//           Reset
//         </button>
//         <Link to={"/"} className={styles.buttonHome}>
//           Volver
//         </Link>
//       </div>

//       {Object.keys(data).length > 0 && (
//         <div className={styles.containerSelectSupplier}>
//           <select
//             id="supplier"
//             name="supplier"
//             onChange={handleSelectSupplierChange}
//             value={selectedSupplier}
//             className={styles.selectDiameter}
//           >
//             <option value="all">Todas</option>
//             <option value="Hierros Caruso">Hierros Caruso</option>
//             <option value="Centrosider">Centrosider</option>
//             <option value="Plastigas">Plastigas</option>
//             <option value="Victor Vega">Victor Vega</option>
//             <option value="Red Acindar">Red Acindar</option>
//             <option value="Easy">Easy</option>
//             <option value="Itar">Itar</option>
//           </select>
//         </div>
//       )}

//       <div className={styles.containerData}>
//         {Object.keys(filteredData).length > 0 ? (
//           <div className={styles.containerData}>
//             {Object.entries(filteredData).map(([proveedor, productos]) =>
//               // Verifica si 'productos' existe antes de intentar hacer el mapeo
//               productos && productos.length > 0 ? (
//                 <div
//                   className={styles.containerProductAndGraphic}
//                   key={proveedor}
//                 >
//                   <div className={styles.containerProductGeneral}>
//                     <h3>{capitalizerFirstLetter(proveedor)}</h3>
//                     <div className={styles.tableContainer}>
//                       <div className={styles.tableHeader}>
//                         <div className={styles.column}>Producto</div>
//                         <div className={styles.column}>Fechas</div>
//                         <div className={styles.column}>Precios</div>
//                       </div>
//                       {productos.map((producto, index) => (
//                         <div key={index} className={styles.tableRow}>
//                           <div className={styles.column}>
//                             <p>Hierro Aletado Ø{selectedDiameter}</p>
//                           </div>
//                           <div className={styles.column}>
//                             {ordenedDate(producto.fecha)}
//                           </div>
//                           <div className={styles.column}>
//                             ${producto.precio}
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                   <div className={styles.containerGraphic}>
//                     <ResponsiveContainer width="100%" height={350}>
//                       <LineChart data={productos}>
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis
//                           dataKey="fechaParaGrafico"
//                           label={{
//                             value: "Fecha",
//                             position: "insideBottom",
//                             offset: 35,
//                           }}
//                           tickFormatter={ordenedDate}
//                           tick={{ fontSize: 12 }}
//                         />
//                         <YAxis
//                           label={{
//                             value: "Precio",
//                             style: { textAnchor: "start" },
//                             angle: -90,
//                             position: "right",
//                             offset: 10,
//                           }}
//                           tickFormatter={formatPrice}
//                           tick={{ fontSize: 12 }}
//                           domain={getYAxisDomain(productos)}
//                         />
//                         <Tooltip content={<CustomTooltip />} />
//                         <Line
//                           type="monotone"
//                           dataKey="precioParaGrafico"
//                           stroke="#8884d8"
//                           name="Precio"
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
//               ) : (
//                 <div className={styles.noMaterialsContainer}>
//                   <p>No hay productos para este proveedor.</p>
//                 </div>
//               )
//             )}
//           </div>
//         ) : (
//           <div className={styles.noMaterialsContainer}>
//             <p>¡No hay materiales disponibles!</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DataAcero;

// import React from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import styles from "./DataAcero.module.css";
// import { useState, useEffect } from "react";
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

// const DataAcero = () => {
//   const [loading, setLoading] = useState(false);
//   const [data, setData] = useState({});
//   const [error, setError] = useState(null);
//   const [showLoading, setShowLoading] = useState(false);
//   const [selectedDiameter, setSelectedDiameter] = useState("");

//   const navigate = useNavigate();

//   const capitalizerFirstLetter = (text) => {
//     if (!text) return text;
//     return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
//   };

//   const handleReset = async () => {
//     navigate(0);
//   };

//   const handleData = async (diametro) => {
//     setLoading(true);
//     setError(null);
//     setShowLoading(true);
//     try {
//       const response = await axios.get(
//         `http://localhost:3020/api/graphics/precioAcero_${diametro}`
//       );
//       console.log("Respuesta", response.data);

//       // Agrupar los productos por proveedor
//       const groupedByProvider = Object.entries(response.data).reduce(
//         (acc, [key, productos]) => {
//           productos.forEach((producto) => {
//             let { proveedor, precio, fecha } = producto;

//             // Limpieza y conversión del precio
//             precio = precio.replace(/\./g, ""); // Elimina los puntos (separadores de miles)
//             precio = precio.replace(/,/g, "."); // Reemplaza las comas por puntos (separador decimal)
//             const precioParaGrafico = parseFloat(precio);

//             const fechaParaGrafico = fecha.replace(
//               /(\d{4})-(\d{2})-(\d{2})/,
//               "$3/$2/$1"
//             );

//             if (!acc[proveedor]) {
//               acc[proveedor] = [];
//             }
//             acc[proveedor].push({
//               ...producto,
//               precioParaGrafico,
//               fechaParaGrafico,
//             });
//           });
//           return acc;
//         },
//         {}
//       );
//       console.log(groupedByProvider);
//       setData(groupedByProvider);
//     } catch (error) {
//       setError(error.message);
//     } finally {
//       setLoading(false);
//       setShowLoading(false);
//     }
//   };

//   const ordenedDate = (date) => {
//     if (!date) return date;
//     return date.slice(6) + "/" + date.slice(4, 6) + "/" + date.slice(0, 4);
//   };

//   const formatPrice = (value) => {
//     return `$${value.toLocaleString()}`; // Formatea el valor con el signo de pesos y separador de miles
//   };

//   useEffect(() => {
//     if (selectedDiameter) {
//       handleData(selectedDiameter);
//     }
//   }, [selectedDiameter]);

//   const handleSelectChange = (event) => {
//     setSelectedDiameter(event.target.value);
//   };

//   const CustomTooltip = ({ payload, label }) => {
//     if (!payload || payload.length === 0) return null;

//     // Extraer los datos del Tooltip
//     const { precioParaGrafico } = payload[0].payload;

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
//           <strong>Precio:</strong> {formatPrice(precioParaGrafico)}
//         </p>
//       </div>
//     );
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

//   return (
//     <div className={styles.containerPage}>
//       <div className={styles.containerTitle}>
//         <div className={styles.subcontainerTitle}>
//           <h1>Precios de Hierro Aleteado</h1>
//         </div>
//       </div>
//       {showLoading && (
//         <div className={styles.containerLoadingData}>
//           <p>Cargando Datos...</p>
//         </div>
//       )}
//       {error && <p style={{ color: "red" }}>Error: {error}</p>}
//       <div className={styles.containerSelect}>
//         <select
//           id="diameters"
//           name="diameters"
//           onChange={handleSelectChange}
//           value={selectedDiameter}
//           className={styles.selectDiameter}
//         >
//           <option value="">Seleccione un diametro</option>
//           <option value="6">Ø6</option>
//           <option value="8">Ø8</option>
//           <option value="10">Ø10</option>
//           <option value="12">Ø12</option>
//           <option value="16">Ø16</option>
//           <option value="20">Ø20</option>
//           <option value="25">Ø25</option>
//         </select>
//         <button
//           onClick={handleReset}
//           disabled={loading}
//           className={styles.buttonReset}
//         >
//           Reset
//         </button>
//         <Link to={"/"} className={styles.buttonHome}>
//           Volver
//         </Link>
//       </div>
//       <div className={styles.containerData}>
//         {Object.keys(data).length > 0 ? (
//           <div className={styles.containerData}>
//             {Object.entries(data).map(([proveedor, productos]) => (
//               <div
//                 className={styles.containerProductAndGraphic}
//                 key={proveedor}
//               >
//                 <div className={styles.containerProductGeneral}>
//                   <h3>{capitalizerFirstLetter(proveedor)}</h3>
//                   <div className={styles.tableContainer}>
//                     <div className={styles.tableHeader}>
//                       <div className={styles.column}>Producto</div>
//                       <div className={styles.column}>Fechas</div>
//                       <div className={styles.column}>Precios</div>
//                     </div>
//                     {productos.map((producto, index) => (
//                       <div key={index} className={styles.tableRow}>
//                         <div className={styles.column}>
//                           <p>Hierro Aletado Ø{selectedDiameter}</p>
//                         </div>
//                         <div className={styles.column}>
//                           {ordenedDate(producto.fecha)}
//                         </div>
//                         <div className={styles.column}>${producto.precio}</div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//                 <div className={styles.containerGraphic}>
//                   <ResponsiveContainer width="100%" height={350}>
//                     <LineChart data={productos}>
//                       <CartesianGrid strokeDasharray="3 3" />
//                       <XAxis
//                         dataKey="fechaParaGrafico"
//                         label={{
//                           value: "Fecha",
//                           position: "insideBottom",
//                           offset: 35, // Aumenta el offset para separarlo de los datos
//                         }}
//                         tickFormatter={ordenedDate}
//                         tick={{ fontSize: 12 }}
//                       />
//                       <YAxis
//                         label={{
//                           value: "Precio",
//                           style: { textAnchor: "start" },
//                           angle: -90, // Rota el texto 90 grados para que se lea verticalmente
//                           position: "right", // Usa "left" para poner la etiqueta en el costado izquierdo fuera del área del gráfico
//                           offset: 10, // Agrega un espacio adicional entre la etiqueta y el gráfico (ajústalo según sea necesario)
//                         }}
//                         tickFormatter={formatPrice}
//                         tick={{ fontSize: 12 }}
//                         domain={getYAxisDomain(productos)} // Mantiene el rango dinámico del eje Y
//                       />
//                       <Tooltip content={<CustomTooltip />} />{" "}
//                       {/* Usamos el Tooltip personalizado */}
//                       <Line
//                         type="monotone"
//                         dataKey="precioParaGrafico"
//                         stroke="#8884d8"
//                         name="Precio" // Aquí es donde se cambia el nombre de la serie
//                         dot={{
//                           fill: "blue", // Color de relleno
//                           stroke: "white", // Color del borde
//                           strokeWidth: 2, // Grosor del borde
//                           r: 6, // Radio del punto
//                         }}
//                       />
//                     </LineChart>
//                   </ResponsiveContainer>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className={styles.noMaterialsContainer}>
//             <p>¡No hay materiales disponibles!</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DataAcero;
