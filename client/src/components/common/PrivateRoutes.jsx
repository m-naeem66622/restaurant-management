import React from "react";
import { Outlet } from "react-router-dom";
import { useAuthContext } from "../../providers/AuthProvider";

export function EmployeePrivateRoutes() {
  const { loading, isEmployee } = useAuthContext();
  const Loading = (
    <>
      <h3 className="text-center text-light mt-5">Loading...</h3>
    </>
  );

  return (
    <>
      {isEmployee ? (
        <Outlet />
      ) : loading ? (
        Loading
      ) : isEmployee ? (
        <Outlet />
      ) : (
        <h1 className="text-center text-light mt-5 text-lg">Page Not Found</h1>
      )}
    </>
  );
}

export function ManagerPrivateRoutes() {
  const { loading, isManager } = useAuthContext();
  const Loading = (
    <>
      <h3 className="text-center text-light mt-5">Loading...</h3>
    </>
  );

  return (
    <>
      {isManager ? (
        <Outlet />
      ) : loading ? (
        Loading
      ) : isManager ? (
        <Outlet />
      ) : (
        <h1 className="text-center text-light mt-5 text-lg">Page Not Found</h1>
      )}
    </>
  );
}
