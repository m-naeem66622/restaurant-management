import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../providers/AuthProvider";

const LoginPage = () => {
  const navigate = useNavigate();
  const { notify, setIsEmployee } = useAuthContext();
  const [serverErrors, setServerErrors] = useState({});
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        import.meta.env.VITE_BASE_URL + "/api/employees/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        }
      );
      const data = await response.json();

      if (data.status === "SUCCESS") {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userRole", "EMPLOYEE");
        setIsEmployee(true);
        navigate("/employee/dashboard");
        notify("success", "Logged in successfully");
      } else {
        if (response.status === 400) {
          setServerErrors(data.error);
        } else {
          notify("error", data.error.message);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full sm:w-96">
        <h2 className="text-3xl font-semibold mb-4 text-center text-gray-800">
          Employee Login
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-800 font-semibold mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-purple-500"
              onChange={handleChange}
              value={credentials.email}
            />
            {serverErrors.email && (
              <p className="text-red-500 text-sm mt-1">{serverErrors.email}</p>
            )}
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-800 font-semibold mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-purple-500"
              onChange={handleChange}
              value={credentials.password}
            />
            {serverErrors.password && (
              <p className="text-red-500 text-sm mt-1">
                {serverErrors.password}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white font-semibold py-2 rounded hover:bg-purple-700 focus:outline-none focus:bg-purple-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
