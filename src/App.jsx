import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import ProductList from "./pages/ProductList";
import Cart from "./pages/Cart";
import ProfilePage from "./pages/ProfilePage";
import LoginForm from "./pages/LoginForm";
import "./App.css";

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/login" element={<LoginForm />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
};

export default App;
1;
