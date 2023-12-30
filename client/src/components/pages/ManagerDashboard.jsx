import React, { useEffect, useState } from "react";
import { faker } from "@faker-js/faker";
import Modal from "../common/Modal";
import { useNavigate } from "react-router-dom";
import EditEmployee from "../common/EditEmployee";
import { possiblePositions } from "../../config/config";

// const userData = [...Array(20)].map(() => ({
//   firstName: faker.person.firstName(),
//   lastName: faker.person.lastName(),
//   email: faker.internet.email(),
//   position:
//     possiblePositions[Math.floor(Math.random() * possiblePositions.length)],
//   contactNumber: faker.phone.number("+92-3##-#######"),
//   address: faker.location.streetAddress({ useFullAddress: true }),
// }));

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [open, setOpen] = useState(false);

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

  const handleEditUser = (updatedUser) => {
    const updatedUsers = users.map((user) =>
      user.email === updatedUser.email ? { ...user, ...updatedUser } : user
    );
    setUsers(updatedUsers);
    closeModalHandle();
  };

  const closeModalHandle = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "unset";
  };

  const getEmployees = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/employees", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      const data = await response.json();
      if (data.status === "SUCCESS") {
        setUsers(data.data.documents);
      } else {
        throw new Error(data.data.error.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getEmployees();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Employee Management</h2>

      <button
        onClick={() => handleAddClick()}
        className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600 mb-4"
      >
        Add Employee
      </button>

      {users.map((user, index) => (
        <div
          key={index}
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
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/manage/employee/${user._id}`);
                }}
                className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
              >
                View Profile
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditClick(user);
                }}
                className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
              >
                Edit
              </button>
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
            {/* Additional detailed information */}
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
            <form className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
              <div className="mb-4">
                <label htmlFor="firstName" className="block font-semibold mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="lastName" className="block font-semibold mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block font-semibold mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="position" className="block font-semibold mb-1">
                  Position
                </label>
                <select
                  id="position"
                  className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:border-blue-500"
                >
                  {possiblePositions.map((position, index) => (
                    <option key={index} value={position}>
                      {position}
                    </option>
                  ))}
                </select>
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
                  className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="mb-4 col-span-2">
                <label htmlFor="address" className="block font-semibold mb-1">
                  Address
                </label>
                <textarea
                  id="address"
                  className="border border-gray-300 rounded px-4 py-2 w-full h-20 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>
              <div className="col-span-2">
                <button
                  type="submit"
                  className="bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600 w-full"
                >
                  Add Employee
                </button>
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
        // <Modal
        //   isOpen={isModalOpen}
        //   closeModal={() => {
        //     closeModalHandle();
        //     setIsEditing(false);
        //   }}
        // >
        //   <div className="p-4">
        //     <h3 className="text-xl font-semibold mb-4">
        //       {`Editing ${selectedUser.firstName} ${selectedUser.lastName}`}
        //     </h3>
        //     <form
        //       onSubmit={(e) => handleEditUser(e, selectedUser)}
        //       className="grid grid-cols-1 md:grid-cols-2 gap-x-4"
        //     >
        //       <div className="mb-4">
        //         <label htmlFor="firstName" className="block font-semibold mb-1">
        //           First Name
        //         </label>
        //         <input
        //           type="text"
        //           id="firstName"
        //           value={selectedUser.firstName}
        //           onChange={(e) =>
        //             setSelectedUser({
        //               ...selectedUser,
        //               firstName: e.target.value,
        //             })
        //           }
        //           className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:border-blue-500"
        //         />
        //       </div>
        //       <div className="mb-4">
        //         <label htmlFor="lastName" className="block font-semibold mb-1">
        //           Last Name
        //         </label>
        //         <input
        //           type="text"
        //           id="lastName"
        //           value={selectedUser.lastName}
        //           onChange={(e) =>
        //             setSelectedUser({
        //               ...selectedUser,
        //               lastName: e.target.value,
        //             })
        //           }
        //           className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:border-blue-500"
        //         />
        //       </div>
        //       <div className="mb-4">
        //         <label htmlFor="email" className="block font-semibold mb-1">
        //           Email
        //         </label>
        //         <input
        //           type="email"
        //           id="email"
        //           value={selectedUser.email}
        //           onChange={(e) =>
        //             setSelectedUser({
        //               ...selectedUser,
        //               email: e.target.value,
        //             })
        //           }
        //           className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:border-blue-500"
        //         />
        //       </div>
        //       <div className="mb-4">
        //         <label htmlFor="position" className="block font-semibold mb-1">
        //           Position
        //         </label>
        //         <select
        //           id="position"
        //           value={selectedUser.position}
        //           onChange={(e) =>
        //             setSelectedUser({
        //               ...selectedUser,
        //               position: e.target.value,
        //             })
        //           }
        //           className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:border-blue-500"
        //         >
        //           {possiblePositions.map((position, index) => (
        //             <option key={index} value={position}>
        //               {position}
        //             </option>
        //           ))}
        //         </select>
        //       </div>
        //       <div className="mb-4">
        //         <label
        //           htmlFor="contactNumber"
        //           className="block font-semibold mb-1"
        //         >
        //           Contact Number
        //         </label>
        //         <input
        //           type="text"
        //           id="contactNumber"
        //           value={selectedUser.contactNumber}
        //           onChange={(e) =>
        //             setSelectedUser({
        //               ...selectedUser,
        //               contactNumber: e.target.value,
        //             })
        //           }
        //           className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:border-blue-500"
        //         />
        //       </div>
        //       <div className="mb-4 col-span-2">
        //         <label htmlFor="address" className="block font-semibold mb-1">
        //           Address
        //         </label>
        //         <textarea
        //           id="address"
        //           value={selectedUser.address}
        //           onChange={(e) =>
        //             setSelectedUser({
        //               ...selectedUser,
        //               address: e.target.value,
        //             })
        //           }
        //           className="border border-gray-300 rounded px-4 py-2 w-full h-20 focus:outline-none focus:border-blue-500 resize-none"
        //         />
        //       </div>
        //       <div className="col-span-2">
        //         <button
        //           type="submit"
        //           className="bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600 w-full"
        //         >
        //           Save Changes
        //         </button>
        //       </div>
        //     </form>
        //   </div>
        // </Modal>
      )}
    </div>
  );
};

export default ManagerDashboard;
