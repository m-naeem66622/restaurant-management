import React, { useState } from "react";
import Modal from "./Modal";

function ManageSchedule({
  isModalOpen,
  closeModalHandle,
  selectedSchedule,
  handleManageSchedule,
  employeeId,
  ...restProps
}) {
  const [updatedSchedule, setUpdatedSchedule] = useState(
    selectedSchedule
      ? {
          ...selectedSchedule,
          weekStartDate: selectedSchedule.weekStartDate?.slice(0, 16),
          weekEndDate: selectedSchedule.weekEndDate?.slice(0, 16),
        }
      : {
          weekStartDate: "",
          weekEndDate: "",
          monHrs: 0,
          tuesHrs: 0,
          wedHrs: 0,
          thursHrs: 0,
          friHrs: 0,
          satHrs: 0,
          sunHrs: 0,
        }
  );
  console.log("ManageSchedule --> updatedSchedule", updatedSchedule);
  const [serverErrors, setServerErrors] = useState({});

  const handleSchedule = async (e) => {
    e.preventDefault();
    setServerErrors({});
    let successfull;
    if (selectedSchedule) {
      successfull = await updateSchedule(updatedSchedule);
    } else {
      successfull = await addSchedule(updatedSchedule);
    }

    if (successfull) {
      console.log("successfull", successfull);
      handleManageSchedule(updatedSchedule);
    }
  };

  const updateSchedule = async (updatedSchedule) => {
    try {
      const scheduleData = {
        weekStartDate: updatedSchedule.weekStartDate,
        weekEndDate: updatedSchedule.weekEndDate,
        monHrs: updatedSchedule.monHrs,
        tuesHrs: updatedSchedule.tuesHrs,
        wedHrs: updatedSchedule.wedHrs,
        thursHrs: updatedSchedule.thursHrs,
        friHrs: updatedSchedule.friHrs,
        satHrs: updatedSchedule.satHrs,
        sunHrs: updatedSchedule.sunHrs,
      };

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/schedules/${updatedSchedule._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify(scheduleData),
        }
      );

      const data = await response.json();
      if (data.status === "SUCCESS") {
        console.log("updateSchedule --> data.data", data.data);
        return true;
      } else {
        setServerErrors(data.error);
        return false;
      }
    } catch (error) {
      // TODO : Handle error
      console.error(error);
      return false;
    }
  };

  const addSchedule = async (updatedSchedule) => {
    try {
      const scheduleData = {
        employee: employeeId,
        weekStartDate: updatedSchedule.weekStartDate,
        weekEndDate: updatedSchedule.weekEndDate,
        monHrs: updatedSchedule.monHrs,
        tuesHrs: updatedSchedule.tuesHrs,
        wedHrs: updatedSchedule.wedHrs,
        thursHrs: updatedSchedule.thursHrs,
        friHrs: updatedSchedule.friHrs,
        satHrs: updatedSchedule.satHrs,
        sunHrs: updatedSchedule.sunHrs,
      };

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/schedules`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify(scheduleData),
        }
      );

      const data = await response.json();
      if (data.status === "SUCCESS") {
        console.log("addSchedule --> data.data", data.data);
        return true;
      } else {
        setServerErrors(data.error);
        return false;
      }
    } catch (error) {
      // TODO : Handle error
      console.error(error);
      return false;
    }
  };

  return (
    <Modal
      isOpen={isModalOpen}
      closeModal={() => {
        closeModalHandle();
      }}
    >
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">
          {selectedSchedule ? "Edit" : "Add"} Schedule
        </h2>
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-x-4"
          onSubmit={handleSchedule}
        >
          {/* Input fields for schedule */}
          <div className="mb-4">
            <label htmlFor="weekStartDate" className="block font-semibold mb-1">
              Week Start Date
            </label>
            <input
              type="datetime-local"
              id="weekStartDate"
              name="weekStartDate"
              value={updatedSchedule.weekStartDate}
              onChange={(e) =>
                setUpdatedSchedule({
                  ...updatedSchedule,
                  weekStartDate: e.target.value,
                })
              }
              className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:border-blue-500"
            />
            {serverErrors.weekStartDate && (
              <div className="text-red-500">{serverErrors.weekStartDate}</div>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="weekEndDate" className="block font-semibold mb-1">
              Week End Date
            </label>
            <input
              type="datetime-local"
              id="weekEndDate"
              name="weekEndDate"
              value={updatedSchedule.weekEndDate}
              onChange={(e) =>
                setUpdatedSchedule({
                  ...updatedSchedule,
                  weekEndDate: e.target.value,
                })
              }
              className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:border-blue-500"
            />
            {serverErrors.weekEndDate && (
              <div className="text-red-500">{serverErrors.weekEndDate}</div>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="monHrs" className="block font-semibold mb-1">
              Monday Hours
            </label>
            <input
              type="number"
              id="monHrs"
              name="monHrs"
              value={updatedSchedule.monHrs}
              onChange={(e) =>
                setUpdatedSchedule({
                  ...updatedSchedule,
                  monHrs: e.target.value,
                })
              }
              className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:border-blue-500"
              min={0}
              max={24}
            />
            {serverErrors.monHrs && (
              <div className="text-red-500">{serverErrors.monHrs}</div>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="tuesHrs" className="block font-semibold mb-1">
              Tuesday Hours
            </label>
            <input
              type="number"
              id="tuesHrs"
              name="tuesHrs"
              value={updatedSchedule.tuesHrs}
              onChange={(e) =>
                setUpdatedSchedule({
                  ...updatedSchedule,
                  tuesHrs: e.target.value,
                })
              }
              className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:border-blue-500"
              min={0}
              max={24}
            />
            {serverErrors.tuesHrs && (
              <div className="text-red-500">{serverErrors.tuesHrs}</div>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="wedHrs" className="block font-semibold mb-1">
              Wednesday Hours
            </label>
            <input
              type="number"
              id="wedHrs"
              name="wedHrs"
              value={updatedSchedule.wedHrs}
              onChange={(e) =>
                setUpdatedSchedule({
                  ...updatedSchedule,
                  wedHrs: e.target.value,
                })
              }
              className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:border-blue-500"
              min={0}
              max={24}
            />
            {serverErrors.wedHrs && (
              <div className="text-red-500">{serverErrors.wedHrs}</div>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="thursHrs" className="block font-semibold mb-1">
              Thursday Hours
            </label>
            <input
              type="number"
              id="thursHrs"
              name="thursHrs"
              value={updatedSchedule.thursHrs}
              onChange={(e) =>
                setUpdatedSchedule({
                  ...updatedSchedule,
                  thursHrs: e.target.value,
                })
              }
              className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:border-blue-500"
              min={0}
              max={24}
            />
            {serverErrors.thursHrs && (
              <div className="text-red-500">{serverErrors.thursHrs}</div>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="friHrs" className="block font-semibold mb-1">
              Friday Hours
            </label>
            <input
              type="number"
              id="friHrs"
              name="friHrs"
              value={updatedSchedule.friHrs}
              onChange={(e) =>
                setUpdatedSchedule({
                  ...updatedSchedule,
                  friHrs: e.target.value,
                })
              }
              className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:border-blue-500"
              min={0}
              max={24}
            />
            {serverErrors.friHrs && (
              <div className="text-red-500">{serverErrors.friHrs}</div>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="satHrs" className="block font-semibold mb-1">
              Saturday Hours
            </label>
            <input
              type="number"
              id="satHrs"
              name="satHrs"
              value={updatedSchedule.satHrs}
              onChange={(e) =>
                setUpdatedSchedule({
                  ...updatedSchedule,
                  satHrs: e.target.value,
                })
              }
              className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:border-blue-500"
              min={0}
              max={24}
            />
            {serverErrors.satHrs && (
              <div className="text-red-500">{serverErrors.satHrs}</div>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="sunHrs" className="block font-semibold mb-1">
              Sunday Hours
            </label>
            <input
              type="number"
              id="sunHrs"
              name="sunHrs"
              value={updatedSchedule.sunHrs}
              onChange={(e) =>
                setUpdatedSchedule({
                  ...updatedSchedule,
                  sunHrs: e.target.value,
                })
              }
              className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:border-blue-500"
              min={0}
              max={24}
            />
            {serverErrors.sunHrs && (
              <div className="text-red-500">{serverErrors.sunHrs}</div>
            )}
          </div>

          {/* Add other schedule details similarly */}
          <div className="mb-4 flex justify-end items-end">
            <button
              type="submit"
              className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            >
              Save Schedule
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default ManageSchedule;
