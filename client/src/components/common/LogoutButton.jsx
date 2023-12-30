import React from "react";
import { useNavigate } from "react-router-dom";

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    navigate("/");
  };

  return (
    <div>
      <button
        onClick={handleLogout}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
      >
        Logout
      </button>
    </div>
  );
}

export default LogoutButton;
