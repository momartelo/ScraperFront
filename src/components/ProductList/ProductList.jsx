// src/components/ProductList.jsx
import React from 'react';
import styles from "./ProductList.module.css"

const ProductList = ({ products }) => {
  return (
    <div className={styles.productList}>
      {products.length > 0 ? (
        products.map((product, index) => (
          <div key={index} className={styles.productItem}>
            <h3>{product.nombre}</h3>
            <p>Precio: {product.precio}</p>
          </div>
        ))
      ) : (
        <p>No hay productos disponibles.</p>
      )}
    </div>
  );
};

export default ProductList;
