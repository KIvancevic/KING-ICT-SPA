import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  fetchProducts,
  fetchCategories,
  setFilter,
  setSort,
  setSearchTerm,
} from "../redux/actions/productActions";
import { logout } from "../redux/actions/userActions";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";
import Filter from "../components/Filter";
import Sort from "../components/Sort";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import Loader from "../components/Loader";
import CartImg from "../assets/cart.svg";
import UserImg from "../assets/user.svg";
import Toast from "../components/Toast";
import "./ProductList.css";

const ProductList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
  const user = useSelector((state) => state.user.user);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" });

  useEffect(() => {
    if (!categories.length) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  useEffect(() => {
    dispatch(fetchProducts(searchTerm, currentPage, filter, sort));
  }, [dispatch, searchTerm, currentPage, filter, sort]);

  useEffect(() => {
    if (user) {
      dispatch(setFilter("", [0, Infinity]));
      dispatch(setSort("", ""));
      dispatch(setSearchTerm(""));
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (isLoggedOut && !user) {
      setToast({ message: "Successfully logged out!", type: "success" });
      setTimeout(() => navigate("/"), 2000);
    }
  }, [user, isLoggedOut, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    setIsLoggedOut(true);
  };

  const navigateToLogin = () => {
    navigate("/login");
  };

  const handleDetailsClick = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const totalPages = Math.ceil(totalProducts / productsPerPage);

  return (
    <div className="product-list">
      {toast.message && (
        <Toast data-testid="toast" message={toast.message} type={toast.type} />
      )}
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
            <img src={CartImg} className="navbar-cart-img" alt="Cart" />
          </Link>
          <Link to={"profile"}>
            <img src={UserImg} className="navbar-cart-img" alt="User" />
          </Link>
          <button
            data-testid="auth-button"
            onClick={!user ? navigateToLogin : handleLogout}
          >
            {!user ? "Log in" : "Logout"}
          </button>
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
