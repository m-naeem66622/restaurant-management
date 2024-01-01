import React, { useEffect, useState } from "react";
import LogoutButton from "../common/LogoutButton";
import { useAuthContext } from "../../providers/AuthProvider";
import Modal from "../common/Modal";
import Button from "../common/Button";
import { useNavigate } from "react-router-dom";

function ManagerProfile() {
  document.title = "Manager Profile | Restaurant Management System";
  const { notify } = useAuthContext();
  const navigate = useNavigate();
  const { accountDetail, setAccountDetail } = useAuthContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [serverErrors, setServerErrors] = useState({});
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({});
  const [credentials, setCredentials] = useState({
    oldPassword: "",
    password: "",
    confirmPassword: "",
  });

  const handleEditProfileClick = () => {
    setIsModalOpen(true);
    setIsEditing(true);
    document.body.style.overflow = "hidden";
  };

  const handleEditProfile = (updatedData) => {
    setAccountDetail(updatedData);
    closeModalHandle();
    notify("success", "Profile updated successfully.");
    setShowPasswordFields(false);
    setCredentials({
      oldPassword: "",
      password: "",
      confirmPassword: "",
    });
  };

  const closeModalHandle = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    document.body.style.overflow = "unset";
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setServerErrors({});
    const updatedData = await updateUser({ ...updatedUser, ...credentials });
    if (updatedData) {
      handleEditProfile(updatedData);
    }
  };

  const updateUser = async (updatedUser) => {
    try {
      let userData = {
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        contactNumber: updatedUser.contactNumber,
        address: updatedUser.address,
      };

      if (showPasswordFields) {
        userData = {
          ...userData,
          oldPassword: updatedUser.oldPassword,
          password: updatedUser.password,
          confirmPassword: updatedUser.confirmPassword,
        };
      }

      const response = await fetch(
        import.meta.env.VITE_BASE_URL + "/api/managers/profile/",
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
        return data.data;
      } else {
        if (response.status === 400) {
          setServerErrors(data.error);
        } else if (response.status === 401) {
          notify("error", "The old password is incorrect.");
        } else {
          notify("error", data.error.message);
        }
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  useEffect(() => {
    setUpdatedUser(accountDetail);
  }, [accountDetail]);

  return (
    <div className="p-6">
      <div className="flex justify-between">
        <h2 className="text-2xl font-semibold mb-4">Manager Profile</h2>
        <div className="">
          <Button
            onClick={() => {
              navigate("/dashboard");
            }}
            className="mr-2"
          >
            Dashboard
          </Button>
          <LogoutButton />
        </div>
      </div>

      {/* Profile Section */}
      <div className="bg-white rounded shadow-md p-4 mb-4">
        <h2 className="text-xl font-semibold mb-2">Profile</h2>
        <div>
          <p>
            <strong>Name:</strong> {accountDetail.firstName}
            {accountDetail.lastName}
          </p>
          <p>
            <strong>Email:</strong> {accountDetail.email}
          </p>
          <p>
            <strong>Contact Number:</strong> {accountDetail.contactNumber}
          </p>
          <p>
            <strong>Address:</strong> {accountDetail.address}
          </p>
        </div>
        <Button onClick={handleEditProfileClick} className="mt-2">
          Edit Profile
        </Button>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <Modal isOpen={isModalOpen} closeModal={closeModalHandle}>
          <div className="p-4">
            <h3 className="text-xl font-semibold mb-4">
              {`Editing ${accountDetail.firstName} ${accountDetail.lastName}`}
            </h3>
            <form
              onSubmit={handleUpdateUser}
              className="grid grid-cols-1 md:grid-cols-2 gap-x-4"
            >
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
                <label
                  htmlFor="contactNumber"
                  className="block font-semibold mb-1"
                >
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
                  <div className="text-red-500">
                    {serverErrors.contactNumber}
                  </div>
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

              {showPasswordFields && (
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
                      <div className="text-red-500">
                        {serverErrors.oldPassword}
                      </div>
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
                      <div className="text-red-500">
                        {serverErrors.password}
                      </div>
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
                <Button type="submit" className="w-full">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default ManagerProfile;
