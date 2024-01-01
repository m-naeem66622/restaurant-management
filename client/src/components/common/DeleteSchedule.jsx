import React from "react";
import Modal from "./Modal";
import { useAuthContext } from "../../providers/AuthProvider";
import Button from "./Button";

const DeleteSchedule = ({
  isOpen,
  closeModal,
  handleDeleteSchedule,
  selectedSchedule,
}) => {
  const { notify } = useAuthContext();
  const confirmDelete = async () => {
    const isDeleted = await handleDelete();
    if (isDeleted) {
      handleDeleteSchedule(selectedSchedule);
      notify("success", "Schedule deleted successfully");
      closeModal();
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        import.meta.env.VITE_BASE_URL +
          "/api/schedules/" +
          selectedSchedule._id,
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
        return true;
      } else {
        notify("error", data.error.message);
        return false;
      }
    } catch (error) {
      notify("error", error.message);
      return false;
    }
  };

  return (
    <Modal isOpen={isOpen} closeModal={closeModal}>
      <div className="flex flex-col items-center">
        <h2 className="text-lg font-semibold mb-4">Delete Schedule</h2>
        <p className="mb-4 text-gray-700">
          Are you sure you want to delete schedule? This action cannot be
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

export default DeleteSchedule;
