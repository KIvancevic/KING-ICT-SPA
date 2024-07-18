import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart } from "../redux/actions/cartActions";
import { makeGetUserCart } from "../redux/selectors/cartSelectors";
import Toast from "../components/Toast";
import "./Cart.css";

const getUserCart = makeGetUserCart();

const Cart = () => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const user = useSelector((state) => state.user.user);
  const userCart = useSelector((state) => getUserCart(state, user?.id));
  const [cartItems, setCartItems] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      if (cartItems.length !== userCart.length) {
        setCartItems(userCart);
      }
    } else {
      const storedItems = JSON.parse(localStorage.getItem("cartItems")) || [];
      if (cartItems.length !== storedItems.length) {
        setCartItems(storedItems);
      }
    }
  }, [user, userCart, cartItems.length]);

  const handleRemove = useCallback(
    (id) => {
      if (user) {
        dispatch(removeFromCart(id, user.id));
        setToastMessage("Removed from cart!");
      } else {
        const updatedItems = cartItems.filter((item) => item.id !== id);
        localStorage.setItem("cartItems", JSON.stringify(updatedItems));
        setCartItems(updatedItems);
        setToastMessage("Removed from cart!");
      }
      setShowToast(true);
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    },
    [user, cartItems, dispatch]
  );

  return (
    <div className="cart">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <ul>
          {cartItems.map((item) => (
            <li key={item.id}>
              <img
                src={item.images.length > 1 ? item.images[0] : item.images}
                alt={item.title}
              />
              <div>
                <h3>{item.title}</h3>
                <p>${item.price}</p>
                <button onClick={() => handleRemove(item.id)}>Remove</button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {showToast && <Toast message={toastMessage} type="error" />}
    </div>
  );
};

export default Cart;
