import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/actions/cartActions";
import { makeGetUserCart } from "../redux/selectors/cartSelectors";
import Toast from "./Toast";
import "./ProductCard.css";

const getUserCart = makeGetUserCart();

const ProductCard = ({ product, onDetailsClick }) => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  const userCart = useSelector((state) => getUserCart(state, user?.id));

  const images = product.images.length > 1 ? product.images[0] : product.images;

  const handleAddToCart = () => {
    if (user) {
      const isItemInCart = userCart.some((item) => item.id === product.id);

      if (isItemInCart) {
        setToastMessage("Item is already in the cart!");
      } else {
        dispatch(addToCart(product, user.id));
        setToastMessage("Added to cart!");
      }
    } else {
      const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
      const isItemInCart = cartItems.some((item) => item.id === product.id);

      if (isItemInCart) {
        setToastMessage("Item is already in the cart!");
      } else {
        localStorage.setItem(
          "cartItems",
          JSON.stringify([...cartItems, { ...product, quantity: 1 }])
        );
        setToastMessage("Added to cart!");
      }
    }

    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="product-card" data-testid={`product-card-${product.id}`}>
      <img src={images} alt={product.title} />
      <h3>{product.title}</h3>
      <p>${product.price}</p>
      <p>{product.description.slice(0, 100)}...</p>
      <div className="actions">
        <button
          data-testid={`details-button-${product.id}`}
          onClick={() => onDetailsClick(product)}
        >
          More details
        </button>
        <button
          onClick={handleAddToCart}
          aria-label={`Add ${product.title} to cart`}
        >
          Add to Cart
        </button>
        {showToast && <Toast message={toastMessage} type="success" />}
      </div>
    </div>
  );
};

export default ProductCard;
