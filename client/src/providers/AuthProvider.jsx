import React, { useContext, createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

const AuthContext = createContext();

const AuthProvider = (props) => {
  const [loading, setLoading] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const [isEmployee, setIsEmployee] = useState(false);
  const [accountDetail, setAccountDetail] = useState({});

  // Show Push Notification
  const notify = (type, message) => {
    toast(message, {
      type,
      theme: "dark",
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  const getEmployeeDetails = async () => {
    try {
      const response = await fetch(
        import.meta.env.VITE_BASE_URL + "/api/employees/profile",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      const data = await response.json();

      if (data.status === "SUCCESS") {
        setAccountDetail(data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getManagerDetails = async () => {
    try {
      const response = await fetch(
        import.meta.env.VITE_BASE_URL + "/api/managers/profile",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      const data = await response.json();

      if (data.status === "SUCCESS") {
        setAccountDetail(data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setLoading(true);
    if (localStorage.getItem("userRole") === "EMPLOYEE") {
      getEmployeeDetails();
      setIsEmployee(true);
    } else if (localStorage.getItem("userRole") === "MANAGER") {
      getManagerDetails();
      setIsManager(true);
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        notify,
        loading,
        setLoading,
        accountDetail,
        setAccountDetail,
        isManager,
        setIsManager,
        isEmployee,
        setIsEmployee,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);

export default AuthProvider;
