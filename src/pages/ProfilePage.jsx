import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/actions/userActions";
import Toast from "../components/Toast";
import "./ProfilePage.css";

const ProfilePage = () => {
  const [toast, setToast] = useState({ message: "", type: "" });
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const error = useSelector((state) => state.user.error);
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      setToast({ message: error.message, type: "error" });
    } else if (isLoggedOut && !user) {
      setToast({ message: "Successfully logged out!", type: "success" });
      setTimeout(() => navigate("/"), 2000);
    }
  }, [user, error, navigate, isLoggedOut]);

  const handleLogout = () => {
    dispatch(logout());
    setIsLoggedOut(true);
  };

  const navigateToLogin = () => {
    navigate("/login");
  };
  return (
    <div className="profile-page" data-testid="profile-page">
      {toast.message && (
        <Toast data-testid="toast" message={toast.message} type={toast.type} />
      )}
      <h2>User Profile</h2>
      <>
        <p>Name: {!user ? "Anonymous" : `${user.firstName}`}</p>
        <p>Email: {!user ? "Anonymous" : `${user.email}`}</p>
        {!user && (
          <p data-testid="not-logged-in-message" className="not-logged-in">
            Your are not logged in
          </p>
        )}
        <button
          data-testid="auth-button"
          onClick={!user ? navigateToLogin : handleLogout}
        >
          {!user ? "Log in" : "Logout"}
        </button>
      </>
    </div>
  );
};

export default ProfilePage;
