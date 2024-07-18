import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../redux/actions/userActions";
import Toast from "../components/Toast";
import "./LoginForm.css";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ message: "", type: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const error = useSelector((state) => state.user.error);
  const user = useSelector((state) => state.user.user);
  const usernameRef = useRef(null);

  const validateForm = () => {
    const errors = {};
    if (!username) errors.username = "Username is required";
    if (!password) errors.password = "Password is required";
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0) {
      dispatch(login(username, password));
    } else {
      setErrors(formErrors);
    }
  };

  useEffect(() => {
    if (error) {
      setToast({ message: error.message || "Login failed", type: "error" });
      setErrors({
        username:
          "Invalid credentials, make sure username and/or password is correct",
        password:
          "Invalid credentials, make sure password and/or username is correct",
      });
    } else if (user) {
      setToast({ message: "Successfully logged in!", type: "success" });
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }
  }, [error, user, navigate]);

  useEffect(() => {
    if (usernameRef.current) {
      usernameRef.current.focus();
    }
  }, []);

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      {toast.message && <Toast message={toast.message} type={toast.type} />}
      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          value={username}
          ref={usernameRef}
          onChange={(e) => setUsername(e.target.value)}
        />
        {errors.username && <span className="error">{errors.username}</span>}
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && <span className="error">{errors.password}</span>}
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
