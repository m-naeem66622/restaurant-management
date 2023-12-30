import React, { useState } from "react";
import Modal from "./Modal";
import { useAuthContext } from "../../providers/AuthProvider";

function EditEmployee({
  isModalOpen,
  closeModalHandle,
  selectedUser,
  handleEditUser,
  possiblePositions,
  forEmployee = false,
}) {
  console.log("EditEmployee --> forEmployee", forEmployee);
  const { notify } = useAuthContext();
  const [updatedUser, setUpdatedUser] = useState({ ...selectedUser });
  const [serverErrors, setServerErrors] = useState({});
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [credentials, setCredentials] = useState({
    oldPassword: "",
    password: "",
    confirmPassword: "",
  });

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setServerErrors({});
    const updatedData = await updateUser({ ...updatedUser, ...credentials });
    if (updatedData) {
      handleEditUser(updatedData);
    }
  };

  const updateUser = async (updatedUser) => {
    try {
      let userData = {
        contactNumber: updatedUser.contactNumber,
        address: updatedUser.address,
      };

      if (forEmployee) {
        if (showPasswordFields) {
          userData = {
            ...userData,
            oldPassword: updatedUser.oldPassword,
            password: updatedUser.password,
            confirmPassword: updatedUser.confirmPassword,
          };
        }
      } else {
        userData = {
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
          position: updatedUser.position,
        };
      }

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/employees/${
          forEmployee ? "profile" : updatedUser._id
        }`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify(userData),
        }
      );

      const data = await response.json();
      if (data.status === "SUCCESS") {
        console.log("updateUser --> data.data", data.data);
        return data.data;
      } else {
        if (response.status === 400) {
          setServerErrors(data.error);
        } else {
          notify("error", data.error.message);
        }
        return false;
      }
    } catch (error) {
      // TODO : Handle error
      console.error(error);
      return false;
    }
  };

  return (
    <Modal isOpen={isModalOpen} closeModal={closeModalHandle}>
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-4">
          {`Editing ${selectedUser.firstName} ${selectedUser.lastName}`}
        </h3>
        <form
          onSubmit={handleUpdateUser}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-4"
        >
          {!forEmployee && (
            <>
              <div className="mb-4">
                <label htmlFor="firstName" className="block font-semibold mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={updatedUser.firstName}
                  onChange={(e) =>
                    setUpdatedUser({
                      ...updatedUser,
                      firstName: e.target.value,
                    })
                  }
                  className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:border-blue-500"
                />
                {serverErrors.firstName && (
                  <div className="text-red-500">{serverErrors.firstName}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="lastName" className="block font-semibold mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={updatedUser.lastName}
                  onChange={(e) =>
                    setUpdatedUser({
                      ...updatedUser,
                      lastName: e.target.value,
                    })
                  }
                  className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:border-blue-500"
                />
                {serverErrors.lastName && (
                  <div className="text-red-500">{serverErrors.lastName}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block font-semibold mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={updatedUser.email}
                  onChange={(e) =>
                    setUpdatedUser({
                      ...updatedUser,
                      email: e.target.value,
                    })
                  }
                  className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:border-blue-500"
                />
                {serverErrors.email && (
                  <div className="text-red-500">{serverErrors.email}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="position" className="block font-semibold mb-1">
                  Position
                </label>
                <select
                  id="position"
                  value={updatedUser.position}
                  onChange={(e) =>
                    setUpdatedUser({
                      ...updatedUser,
                      position: e.target.value,
                    })
                  }
                  className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:border-blue-500"
                >
                  {possiblePositions.map((position, index) => (
                    <option key={index} value={position}>
                      {position}
                    </option>
                  ))}
                </select>
                {serverErrors.position && (
                  <div className="text-red-500">{serverErrors.position}</div>
                )}
              </div>
            </>
          )}

          <div className="mb-4">
            <label htmlFor="contactNumber" className="block font-semibold mb-1">
              Contact Number
            </label>
            <input
              type="text"
              id="contactNumber"
              value={updatedUser.contactNumber}
              onChange={(e) =>
                setUpdatedUser({
                  ...updatedUser,
                  contactNumber: e.target.value,
                })
              }
              className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:border-blue-500"
            />
            {serverErrors.contactNumber && (
              <div className="text-red-500">{serverErrors.contactNumber}</div>
            )}
          </div>
          <div className="mb-4 col-span-2">
            <label htmlFor="address" className="block font-semibold mb-1">
              Address
            </label>
            <textarea
              id="address"
              value={updatedUser.address}
              onChange={(e) =>
                setUpdatedUser({
                  ...updatedUser,
                  address: e.target.value,
                })
              }
              className="border border-gray-300 rounded px-4 py-2 w-full h-20 focus:outline-none focus:border-blue-500 resize-none"
            />
            {serverErrors.address && (
              <div className="text-red-500">{serverErrors.address}</div>
            )}
          </div>

          <div className="flex justify-start items-center gap-x-4 mb-4 col-span-2">
            <span className="text-md font-semibold">Change Password</span>
            <label className="switch">
              <input
                type="checkbox"
                onChange={() => setShowPasswordFields(!showPasswordFields)}
                checked={showPasswordFields}
              />
              <span className="slider round"></span>
            </label>
          </div>
          {forEmployee && showPasswordFields && (
            <>
              <div className="mb-4">
                <label
                  htmlFor="oldPassword"
                  className="block font-semibold mb-1"
                >
                  Old Password
                </label>
                <input
                  type="password"
                  id="oldPassword"
                  value={credentials.oldPassword}
                  onChange={(e) =>
                    setCredentials({
                      ...credentials,
                      oldPassword: e.target.value,
                    })
                  }
                  className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:border-blue-500"
                />
                {serverErrors.oldPassword && (
                  <div className="text-red-500">{serverErrors.oldPassword}</div>
                )}
              </div>
              <div className="mb-4">
                <label
                  htmlFor="newPassword"
                  className="block font-semibold mb-1"
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials({
                      ...credentials,
                      password: e.target.value,
                    })
                  }
                  className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:border-blue-500"
                />
                {serverErrors.password && (
                  <div className="text-red-500">{serverErrors.password}</div>
                )}
              </div>
              <div className="mb-4">
                <label
                  htmlFor="confirmNewPassword"
                  className="block font-semibold mb-1"
                >
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmNewPassword"
                  value={credentials.confirmPassword}
                  onChange={(e) =>
                    setCredentials({
                      ...credentials,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:border-blue-500"
                />
                {serverErrors.confirmPassword && (
                  <div className="text-red-500">
                    {serverErrors.confirmPassword}
                  </div>
                )}
              </div>
            </>
          )}

          <div className="col-span-2">
            <button
              type="submit"
              className="bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600 w-full"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default EditEmployee;
