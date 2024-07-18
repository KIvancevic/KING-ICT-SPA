import React, { useState, useEffect } from "react";
import "./Toast.css";

const Toast = ({ message, type }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(timer);
  }, [message]);

  if (!visible) return null;

  return (
    <div data-testid="toast" className={`toast ${type}`}>
      {message}
    </div>
  );
};

export default Toast;
