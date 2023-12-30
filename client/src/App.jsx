import { useState } from "react";
import "./App.css";
import EmployeeLogin from "./components/pages/EmployeeLogin";
import ManagerLogin from "./components/pages/ManagerLogin";
import ManagerDashboard from "./components/pages/ManagerDashboard";
import EmployeeDashboard from "./components/pages/EmployeeDashboard";
import ManageEmployeeProfile from "./components/pages/ManageEmployeeProfile";
import { Route, Routes } from "react-router-dom";
import {
  EmployeePrivateRoutes,
  ManagerPrivateRoutes,
} from "./components/common/PrivateRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<EmployeeLogin />} />
        <Route path="/manager/login" element={<ManagerLogin />} />
        <Route element={<ManagerPrivateRoutes />}>
          <Route path="/dashboard" element={<ManagerDashboard />} />
          <Route
            path="/manage/employee/:employeeId"
            element={<ManageEmployeeProfile />}
          />
        </Route>
        <Route element={<EmployeePrivateRoutes />}>
          <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
        </Route>
      </Routes>
      {/* <Login /> */}
      {/* <Dashboard /> */}
      {/* <EmployeeProfile
        employeeData={{
          firstName: "Montana",
          lastName: "Kulas",
          email: "Gregorio.Bahringer@hotmail.com",
          position: "MANAGER",
          contactNumber: "+92-343-1284832",
          address: "47718 Lincoln Street Apt. 439",
        }}
        scheduleData={{
          employee: "60f3b8b6f0c4d3c6b8b6f0c4",
          weekStartDate: "2021-07-18T00:00:00.000Z",
          weekEndDate: "2021-07-24T00:00:00.000Z",
          monHrs: 8,
          tuesHrs: 8,
          wedHrs: 8,
          thursHrs: 8,
          friHrs: 8,
          satHrs: 0,
          sunHrs: 0,
        }}
      /> */}
    </>
  );
}

export default App;
