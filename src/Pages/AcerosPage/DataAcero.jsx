import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./DataAcero.module.css";
import { useState } from "react";

const DataAcero = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [error, setError] = useState(null);
  const [showLoading, setShowLoading] = useState(false);

  const navigate = useNavigate();

  return <div>DataAcero</div>;
};

export default DataAcero;
