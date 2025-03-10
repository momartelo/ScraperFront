export const ordenedDate = (date) => {
  if (!date) return date;
  return date.slice(6) + "/" + date.slice(4, 6) + "/" + date.slice(0, 4);
};

export const capitalizeFirstLetter = (text) => {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const formatPrice = (value) => {
  return `$${value.toLocaleString()}`;
};
