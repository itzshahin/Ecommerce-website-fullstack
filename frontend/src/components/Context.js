import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const myContext = createContext();

export const MyProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [filterSearch, setFilterSearch] = useState([]);
  const [users, setUsers] = useState([]); 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/products');
        setProducts(response.data);
        setFilterSearch(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/users'); 
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchProducts();
    fetchUsers(); 
  }, []);

  const values = { products, setProducts, filterSearch, setFilterSearch, users, setUsers };

  return <myContext.Provider value={values}>{children}</myContext.Provider>;
};
