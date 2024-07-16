import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  fetchCategories,
  setFilter,
  setSort,
  setSearchTerm,
} from "../redux/actions/productActions";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";
import Filter from "../components/Filter";
import Sort from "../components/Sort";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import Loader from "../components/Loader";
import CartImg from "../assets/cart.svg";
import UserImg from "../assets/user.svg";
import { Link } from "react-router-dom";
import "./ProductList.css";

const ProductList = () => {
  const dispatch = useDispatch();
  const {
    products,
    categories,
    currentPage,
    loading,
    error,
    filter,
    sort,
    searchTerm,
    totalProducts,
    productsPerPage,
  } = useSelector((state) => state.products);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    if (user) {
      dispatch(setFilter("", [0, Infinity]));
      dispatch(setSort("", ""));
      dispatch(setSearchTerm(""));
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (!categories.length) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  useEffect(() => {
    searchTerm,
      currentPage,
      filter,
      sort,
      dispatch(fetchProducts(searchTerm, currentPage, filter, sort));
  }, [dispatch, searchTerm, currentPage, filter, sort]);

  const handleDetailsClick = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const totalPages = Math.ceil(totalProducts / productsPerPage);

  return (
    <div className="product-list">
      <div className="navbar">
        <div className="navbar-item search">
          <SearchBar />
        </div>
        <div className="navbar-item filter">
          <Filter categories={categories} />
        </div>
        <div className="navbar-item sort">
          <Sort />
        </div>
        <div className="navbar-item cart-navbar-item">
          <Link to={"cart"}>
            <img src={CartImg} className="navbar-cart-img" />
          </Link>
          <Link to={"profile"}>
            <img src={UserImg} className="navbar-cart-img" />
          </Link>
        </div>
      </div>
      {loading && !products.length && <Loader />}
      {error && <p>Error: {error}</p>}
      {!loading && !products.length && <p>No products found</p>}
      <div className="product-grid">
        {products.map((product, i) => (
          <ProductCard
            key={i}
            product={product}
            onDetailsClick={handleDetailsClick}
          />
        ))}
      </div>
      <Pagination totalPages={totalPages} currentPage={currentPage} />
      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default ProductList;
