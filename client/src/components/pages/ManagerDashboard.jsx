import React, { useEffect, useState } from "react";
import Modal from "../common/Modal";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import EditEmployee from "../common/EditEmployee";
import { possiblePositions } from "../../config/config";
import DeleteEmployee from "../common/DeleteEmployee";
import LogoutButton from "../common/LogoutButton";
import { useAuthContext } from "../../providers/AuthProvider";
import Button from "../common/Button";

const ManagerDashboard = () => {
  document.title = "Manager Dashboard | Restaurant Management System";
  const { notify } = useAuthContext();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    position: possiblePositions[0],
    contactNumber: "",
    address: "",
    password: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [serverErrors, setServerErrors] = useState({});
  const [metadata, setMetadata] = useState({
    total: 0,
    page: 1,
    limit: 5,
  });

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setOpen(!open);
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
    setIsEditing(true);
    document.body.style.overflow = "hidden";
  };

  const handleAddClick = () => {
    setIsModalOpen(true);
    setIsAdding(true);
    document.body.style.overflow = "hidden";
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
    setIsDeleting(true);
    document.body.style.overflow = "hidden";
  };

  const handleEditUser = (updatedUser) => {
    const updatedUsers = users.map((user) =>
      user.email === selectedUser.email ? { ...user, ...updatedUser } : user
    );
    setUsers(updatedUsers);
    closeModalHandle();
    setIsEditing(false);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    const user = await addUser(newUser);
    if (user) {
      const updatedUsers = [user, ...users];
      setUsers(updatedUsers);
      setIsAdding(false);
      closeModalHandle();
      setNewUser({
        firstName: "",
        lastName: "",
        email: "",
        position: possiblePositions[0],
        contactNumber: "",
        address: "",
        password: "",
      });
      notify("success", "Employee added successfully");
    }
  };

  const handleDeleteUser = (user) => {
    const updatedUsers = users.filter((u) => u.email !== user.email);
    setUsers(updatedUsers);
  };

  const closeModalHandle = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "unset";
  };

  const getEmployees = async (page = 1, limit = 10) => {
    try {
      const response = await fetch(
        import.meta.env.VITE_BASE_URL +
          `/api/employees?page=${page}&limit=${limit}`,
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
        setUsers(data.data.documents);
        setMetadata(data.data.metadata);
      } else {
        throw new Error(data.data.error.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addUser = async (user) => {
    try {
      setServerErrors({});

      const response = await fetch(
        import.meta.env.VITE_BASE_URL + "/api/employees/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify(user),
        }
      );

      const data = await response.json();
      if (data.status === "SUCCESS") {
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
      console.error(error);
      return false;
    }
  };

  useEffect(() => {
    const queryParams = Object.fromEntries(searchParams.entries());
    getEmployees(
      queryParams.page ? queryParams.page : metadata.page,
      queryParams.limit ? queryParams.limit : metadata.limit
    );
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between">
        <h2 className="text-2xl font-semibold mb-4">Employee Management</h2>
        <div className="">
          <Button
            onClick={() => {
              navigate("/manager/profile");
            }}
            className="mr-2"
          >
            Manage Profile
          </Button>
          <LogoutButton />
        </div>
      </div>

      <Button onClick={handleAddClick} variant="primary" className="mb-4">
        Add Employee
      </Button>

      {/* Add a pagination system here */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <p className="mr-2">Show</p>
          <select
            value={metadata.limit}
            onChange={(e) => {
              setMetadata({ ...metadata, limit: e.target.value });
              getEmployees(metadata.page, e.target.value);
            }}
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
          <p className="ml-2">entries</p>
        </div>
        <div className="flex items-center">
          <p className="mr-2">Go to page</p>
          <select
            value={metadata.page}
            onChange={(e) => {
              setMetadata({ ...metadata, page: e.target.value });
              getEmployees(e.target.value, metadata.limit);
            }}
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
          >
            {[...Array(Math.ceil(metadata.total / metadata.limit))].map(
              (_, index) => (
                <option key={index} value={index + 1}>
                  {index + 1}
                </option>
              )
            )}
          </select>
        </div>
      </div>

      {users.map((user, index) => (
        <div
          key={user._id}
          onClick={() => handleUserClick(user)}
          className={`bg-white rounded-md shadow-md p-4 cursor-pointer mb-4 overflow-hidden transition-all duration-300 ease-in-out`}
          style={{
            height: selectedUser === user ? "224px" : "70px",
          }}
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">{`${user.firstName} ${user.lastName}`}</p>
              <p className="text-gray-600">{user.email}</p>
            </div>
            <div className="flex gap-x-3">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/manage/employee/${user._id}`);
                }}
              >
                View Profile
              </Button>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditClick(user);
                }}
                variant="primary"
              >
                Edit
              </Button>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(user);
                }}
                variant="danger"
              >
                Delete
              </Button>
            </div>
          </div>
          <div className="mt-4 p-4 bg-gray-100 rounded-md">
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Position:</strong> {user.position}
            </p>
            <p>
              <strong>Contact Number:</strong> {user.contactNumber}
            </p>
            <p>
              <strong>Address:</strong> {user.address}
            </p>
          </div>
        </div>
      ))}

      {/* // Modal for adding employee */}
      {isAdding && (
        <Modal
          isOpen={isModalOpen}
          closeModal={() => {
            closeModalHandle();
            setIsAdding(false);
          }}
        >
          <div className="p-4">
            <h3 className="text-xl font-semibold mb-4">Add Employee</h3>
            <form
              className="grid grid-cols-1 md:grid-cols-2 gap-x-4"
              onSubmit={handleAddUser}
            >
              <div className="mb-4">
                <label htmlFor="firstName" className="block font-semibold mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={newUser.firstName}
                  onChange={(e) =>
                    setNewUser({ ...newUser, firstName: e.target.value })
                  }
                  className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:border-blue-500"
                />
                {serverErrors.firstName && (
                  <p className="text-red-500 text-sm mt-1">
                    {serverErrors.firstName}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="lastName" className="block font-semibold mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={newUser.lastName}
                  onChange={(e) =>
                    setNewUser({ ...newUser, lastName: e.target.value })
                  }
                  className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:border-blue-500"
                />
                {serverErrors.lastName && (
                  <p className="text-red-500 text-sm mt-1">
                    {serverErrors.lastName}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block font-semibold mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:border-blue-500"
                />
                {serverErrors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {serverErrors.email}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="position" className="block font-semibold mb-1">
                  Position
                </label>
                <select
                  id="position"
                  value={newUser.position}
                  onChange={(e) =>
                    setNewUser({ ...newUser, position: e.target.value })
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
                  <p className="text-red-500 text-sm mt-1">
                    {serverErrors.position}
                  </p>
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
                  value={newUser.contactNumber}
                  onChange={(e) =>
                    setNewUser({ ...newUser, contactNumber: e.target.value })
                  }
                  className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:border-blue-500"
                />
                {serverErrors.contactNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {serverErrors.contactNumber}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block font-semibold mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:border-blue-500"
                />
                {serverErrors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {serverErrors.password}
                  </p>
                )}
              </div>
              <div className="mb-4 col-span-2">
                <label htmlFor="address" className="block font-semibold mb-1">
                  Address
                </label>
                <textarea
                  id="address"
                  value={newUser.address}
                  onChange={(e) =>
                    setNewUser({ ...newUser, address: e.target.value })
                  }
                  className="border border-gray-300 rounded px-4 py-2 w-full h-20 focus:outline-none focus:border-blue-500 resize-none"
                />
                {serverErrors.address && (
                  <p className="text-red-500 text-sm mt-1">
                    {serverErrors.address}
                  </p>
                )}
              </div>
              <div className="col-span-2">
                <Button className="w-full" type="submit">
                  Add Employee
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      )}

      {/* // Modal for editing employee */}
      {selectedUser && isEditing && (
        <EditEmployee
          isModalOpen={isModalOpen}
          closeModalHandle={() => {
            closeModalHandle();
            setIsEditing(false);
          }}
          selectedUser={{ ...selectedUser }}
          handleEditUser={handleEditUser}
          possiblePositions={possiblePositions}
        />
      )}

      {/* // Modal for deleting employee */}
      {selectedUser && isDeleting && (
        <DeleteEmployee
          isOpen={isModalOpen}
          closeModal={() => {
            closeModalHandle();
            setIsDeleting(false);
          }}
          handleDeleteUser={handleDeleteUser}
          selectedUser={selectedUser}
        />
      )}
    </div>
  );
};

export default ManagerDashboard;
