import React from "react";
import Modal from "./Modal";
import { useAuthContext } from "../../providers/AuthProvider";
import Button from "./Button";

const DeleteEmployee = ({
  isOpen,
  closeModal,
  handleDeleteUser,
  selectedUser,
  forEmployee = false,
}) => {
  const { notify } = useAuthContext();
  const confirmDelete = () => {
    handleDelete();
    closeModal();
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        import.meta.env.VITE_BASE_URL +
          `/api/employees/${forEmployee ? "profile" : selectedUser._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      const data = await response.json();

      if (data.status === "SUCCESS") {
        if (forEmployee) {
          localStorage.removeItem("token");
          localStorage.removeItem("userRole");
          setIsEmployee(false);
          setAccountDetail({});
          notify("success", "Account deleted successfully");
        } else {
          handleDeleteUser(selectedUser);
          notify("success", "Employee deleted successfully");
        }
      } else {
        notify("error", data.error.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal isOpen={isOpen} closeModal={closeModal}>
      <div className="flex flex-col items-center">
        <h2 className="text-lg font-semibold mb-4">Delete Account</h2>
        <p className="mb-4 text-gray-700">
          Are you sure you want to delete your account? This action cannot be
          undone.
        </p>
        <div className="flex justify-between w-full">
          <Button onClick={confirmDelete} variant="danger">
            Delete
          </Button>

          <Button onClick={closeModal} variant="secondary">
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteEmployee;
