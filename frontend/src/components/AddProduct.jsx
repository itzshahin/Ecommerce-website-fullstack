import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AddProduct.css";
import { useNavigate } from "react-router-dom";

function AddProduct() {
  const [products, setProducts] = useState([]);
  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [newProductCategory, setNewProductCategory] = useState("");
  const [newProductImage, setNewProductImage] = useState("");
  const [newProductHoverImage, setNewProductHoverImage] = useState("");
  const [newProductStock, setNewProductStock] = useState(""); 
  const [editingProductId, setEditingProductId] = useState(null);
  const [editProductName, setEditProductName] = useState("");
  const [editProductPrice, setEditProductPrice] = useState("");
  const [editProductCategory, setEditProductCategory] = useState("");
  const [editProductImage, setEditProductImage] = useState("");
  const [editProductHoverImage, setEditProductHoverImage] = useState("");
  const [editProductStock, setEditProductStock] = useState(""); 

  const [productId, setProductId] = useState(""); 
  const [newStock, setNewStock] = useState(0);

  const serverURL = "http://localhost:4000";
  const navigate = useNavigate();

  const handleUserDetail = () => {
    navigate("/UserDetails");
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${serverURL}/api/product/getproduct`);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const addProduct = async (event) => {
    event.preventDefault();
    try {
      await axios.post(`${serverURL}/api/product/addproduct`, {
        name: newProductName,
        image: newProductImage,
        hoverImage: newProductHoverImage,
        price: newProductPrice,
        category: newProductCategory,
        stock: newProductStock, 
      });
      alert("Your Product is added successfully");
      setNewProductName("");
      setNewProductPrice("");
      setNewProductCategory("");
      setNewProductImage("");
      setNewProductHoverImage("");
      setNewProductStock(""); 
      fetchProducts();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleUpdateStock = async () => {
    try {
      const response = await axios.put(`${serverURL}/api/product/updateStock`, {
        productId,
        stock: newStock,
      });
      alert("Stock updated successfully");
      fetchProducts();
    } catch (error) {
      console.error("Error updating stock", error);
      alert("Failed to update stock");
    }
  };

  const updateProduct = async (event, id) => {
    event.preventDefault();
    try {
      await axios.put(`${serverURL}/api/product/updateData/${id}`, {
        name: editProductName,
        price: editProductPrice,
        category: editProductCategory,
        image: editProductImage,
        hoverImage: editProductHoverImage,
        stock: editProductStock, 
      });
      fetchProducts();
      cancelEdit();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const startEditProduct = (product) => {
    setEditingProductId(product._id);
    setEditProductName(product.name);
    setEditProductPrice(product.price);
    setEditProductImage(product.image);
    setEditProductHoverImage(product.hoverImage);
    setEditProductCategory(product.category);
    setEditProductStock(product.stock); 
  };

  const cancelEdit = () => {
    setEditingProductId(null);
    setEditProductName("");
    setEditProductPrice("");
    setEditProductImage("");
    setEditProductHoverImage("");
    setEditProductCategory("");
    setEditProductStock(""); 
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${serverURL}/api/product/deleteData/${id}`);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div>
      <div className="admin-product">
        <button className="UserDetail" onClick={handleUserDetail}>
          USER DETAILS
        </button>
      </div>

      <div className="container">
        <form onSubmit={addProduct} className="product-form">
          <input
            type="text"
            placeholder="Product Name"
            value={newProductName}
            onChange={(e) => setNewProductName(e.target.value)}
            className="input-field"
          />
          <input
            type="number"
            placeholder="Product Price"
            value={newProductPrice}
            onChange={(e) => setNewProductPrice(e.target.value)}
            className="input-field"
          />
          <input
            type="text"
            placeholder="Product Category"
            value={newProductCategory}
            onChange={(e) => setNewProductCategory(e.target.value)}
            className="input-field"
          />
          <input
            type="url"
            value={newProductImage}
            onChange={(e) => setNewProductImage(e.target.value)}
            placeholder="Add Main Image URL"
            className="input-field"
          />
          <input
            type="url"
            value={newProductHoverImage}
            onChange={(e) => setNewProductHoverImage(e.target.value)}
            placeholder="Add Hover Image URL"
            className="input-field"
          />
          <input
            type="number"
            placeholder="Stock Quantity"
            value={newProductStock}
            onChange={(e) => setNewProductStock(e.target.value)}
            className="input-field"
          />
          <button type="submit" className="add-button">
            Add Product
          </button>
        </form>

        <div className="product-list">
          {products.map((product) => (
            <div key={product._id} className="product-item">
              {editingProductId === product._id ? (
                <form onSubmit={(e) => updateProduct(e, product._id)}>
                  <input
                    type="text"
                    value={editProductName}
                    onChange={(e) => setEditProductName(e.target.value)}
                    className="input-field"
                  />
                  <input
                    type="number"
                    value={editProductPrice}
                    onChange={(e) => setEditProductPrice(e.target.value)}
                    className="input-field"
                  />
                  <input
                    type="url"
                    value={editProductImage}
                    onChange={(e) => setEditProductImage(e.target.value)}
                    className="input-field"
                  />
                  <input
                    type="url"
                    value={editProductHoverImage}
                    onChange={(e) => setEditProductHoverImage(e.target.value)}
                    className="input-field"
                  />
                  <input
                    type="text"
                    value={editProductCategory}
                    onChange={(e) => setEditProductCategory(e.target.value)}
                    className="input-field"
                  />
                  <input
                    type="number"
                    value={editProductStock}
                    onChange={(e) => setEditProductStock(e.target.value)}
                    className="input-field"
                  />
                  <button type="submit" className="update-button">
                    Update
                  </button>
                  <button type="button" onClick={cancelEdit} className="cancel-button">
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  <span className="product-name">
                    NAME: <b>{product.name}</b>
                  </span>
                  <span className="product-category">
                    CATEGORY: <b>{product.category}</b>
                  </span>
                  <span className="product-price">
                    PRICE: <b>{product.price}</b>
                  </span>
                  <span className="product-stock">
                    STOCK: <b>{product.stock}</b>
                  </span>
                  <div className="product-image-container">
                    <img src={product.image} alt={product.name} className="product-img-front" />
                    {product.hoverImage && (
                      <img
                        src={product.hoverImage}
                        alt={`${product.name} Hover`}
                        className="product-img-back"
                      />
                    )}
                  </div>
                  <div className="button-group">
                    <button onClick={() => startEditProduct(product)} className="edit-button">
                      EDIT
                    </button>
                    <button onClick={() => deleteProduct(product._id)} className="delete-button">
                      DELETE
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {}
        <div className="stock-form">
          <h3>Update Product Stock</h3>
          <input
            type="text"
            placeholder="Product ID"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="input-field"
          />
          <input
            type="number"
            placeholder="New Stock Quantity"
            value={newStock}
            onChange={(e) => setNewStock(e.target.value)}
            className="input-field"
          />
          <button onClick={handleUpdateStock} className="update-button">
            Update Stock
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;
