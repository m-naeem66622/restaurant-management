import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    navigate("/");
  };

  return (
    <Button onClick={handleLogout} className="mt-2">
      Logout
    </Button>
  );
}

export default LogoutButton;
