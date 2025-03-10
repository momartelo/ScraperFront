import { capitalizeFirstLetter } from "./generalFunctions";

export const getYAxisDomain = (data) => {
  // Extraemos todos los valores de precios en un solo array
  const prices = data
    .flatMap((item) => [
      item.imepho,
      item.rutenia,
      item.marchal,
      item.vega,
      item.easy,
    ])
    .filter((price) => price !== null); // Filtramos los nulls para evitar errores en los cálculos

  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  // Redondeamos el mínimo y máximo a múltiplos de 500
  const roundedMinPrice = Math.floor(minPrice / 1000) * 1000; // Redondea hacia abajo al múltiplo de 500
  const roundedMaxPrice = Math.ceil(maxPrice / 1000) * 1000; // Redondea hacia arriba al múltiplo de 500

  return [roundedMinPrice, roundedMaxPrice];
};

export const CustomTooltipManySuppliers = ({ payload, label }) => {
  if (!payload || payload.length === 0) return null;

  return (
    <div
      style={{
        backgroundColor: "#fff",
        padding: "10px",
        border: "1px solid #ccc",
      }}
    >
      <p>
        <strong>Fecha:</strong> {label}
      </p>
      {payload.map((entry, index) => {
        const providerName = entry.name; // Obtener el nombre del proveedor
        const price = entry.payload[providerName]; // Obtener el precio del proveedor correspondiente

        // Si el precio es null o undefined, mostrar "No disponible"
        if (price === null || price === undefined) {
          return (
            <p key={index}>
              <strong>{capitalizeFirstLetter(providerName)}:</strong> No
              disponible
            </p>
          );
        }

        // Mostrar el precio formateado si está disponible
        return (
          <p key={index}>
            <strong>{capitalizeFirstLetter(providerName)}:</strong> $
            {price.toLocaleString()}
          </p>
        );
      })}
    </div>
  );
};

export const CustomLegend = (props) => {
  const { payload } = props;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      {payload.map((entry, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            alignItems: "center",
            marginRight: "20px",
            marginBottom: "10px",
          }}
        >
          <div
            style={{
              width: "12px",
              height: "12px",
              backgroundColor: entry.color,
              marginRight: "8px",
              borderRadius: "50%",
            }}
          />
          <span style={{ fontSize: "14px", fontWeight: "bold" }}>
            {capitalizeFirstLetter(entry.value)}{" "}
            {/* Aquí puedes personalizar el texto */}
          </span>
        </div>
      ))}
    </div>
  );
};
