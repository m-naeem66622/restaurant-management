import React, { useEffect, useState } from "react";
import Modal from "../common/Modal";
import EditEmployee from "../common/EditEmployee";
import { possiblePositions } from "../../config/config";
import { useNavigate, useParams } from "react-router-dom";
import ManageSchedule from "../common/ManageSchedule";
import LogoutButton from "../common/LogoutButton";
import Button from "../common/Button";
import DeleteSchedule from "../common/DeleteSchedule";

const ManageEmployeeProfilePage = () => {
  document.title = "Manage Employee Profile | Restaurant Management System";
  const navigate = useNavigate();
  const { employeeId } = useParams();
  const [isScheduleAvailable, setIsScheduleAvailable] = useState(false);
  const [employeeData, setEmployeeData] = useState({});
  const [scheduleData, setScheduleData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isDeletingSchedule, setIsDeletingSchedule] = useState(false);
  const [isManagingSchedule, setIsManagingSchedule] = useState(false);

  const closeModalHandle = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "unset";
  };

  const handleEditUser = (updatedUser) => {
    closeModalHandle();
    setEmployeeData(updatedUser);
  };

  const handleManageSchedule = (updatedSchedule) => {
    setScheduleData(updatedSchedule);
    closeModalHandle();
    setIsManagingSchedule(false);
    setIsScheduleAvailable(true);
  };

  const handleEditProfileClick = () => {
    setIsEditingProfile(true);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const handleEditScheduleClick = () => {
    setIsManagingSchedule(true);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const handleDeleteScheduleClick = () => {
    setIsDeletingSchedule(true);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const handleDeleteSchedule = (deletedSchedule) => {
    setScheduleData({});
    setIsScheduleAvailable(false);
    setIsDeletingSchedule(false);
    closeModalHandle();
  };

  const getEmployeeDetails = async () => {
    try {
      const response = await fetch(
        import.meta.env.VITE_BASE_URL + "/api/employees/" + employeeId,
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
        setEmployeeData(data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getSchedule = async () => {
    try {
      const response = await fetch(
        import.meta.env.VITE_BASE_URL + "/api/employees/schedule/" + employeeId,
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
        setScheduleData(data.data);
        setIsScheduleAvailable(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (employeeId) {
      getEmployeeDetails();
      getSchedule();
    }
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between">
        <h2 className="text-2xl font-semibold mb-4">Employee Profile</h2>
        <div className="">
          <LogoutButton />
          <Button className="ml-2" onClick={() => navigate("/dashboard")}>
            Dashboard
          </Button>
        </div>
      </div>

      {/* Display Employee Details */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Employee Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="text-gray-500">First Name</span>
            <p className="font-semibold">{employeeData.firstName}</p>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500">Last Name</span>
            <p className="font-semibold">{employeeData.lastName}</p>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500">Email</span>
            <p className="font-semibold">{employeeData.email}</p>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500">Position</span>
            <p className="font-semibold">{employeeData.position}</p>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500">Contact Number</span>
            <p className="font-semibold">{employeeData.contactNumber}</p>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500">Address</span>
            <p className="font-semibold">{employeeData.address}</p>
          </div>
        </div>

        <Button onClick={handleEditProfileClick} className="mt-4">
          Edit Profile
        </Button>
      </div>

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <EditEmployee
          isModalOpen={isModalOpen}
          closeModalHandle={() => {
            closeModalHandle();
            setIsEditingProfile(false);
          }}
          selectedUser={employeeData}
          handleEditUser={handleEditUser}
          possiblePositions={possiblePositions}
        />
      )}

      {/* Display Employee Schedule */}
      <div className="bg-gray-100 rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Employee Schedule</h3>
        {isScheduleAvailable && (
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <span className="text-gray-500">Week Start Date</span>
              <p className="font-semibold">
                {new Date(scheduleData.weekStartDate).toLocaleString("en-US", {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })}
              </p>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500">Week End Date</span>
              <p className="font-semibold">
                {new Date(scheduleData.weekEndDate).toLocaleString("en-US", {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })}
              </p>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500">Monday Hours</span>
              <p className="font-semibold">{scheduleData.monHrs}</p>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500">Tuesday Hours</span>
              <p className="font-semibold">{scheduleData.tuesHrs}</p>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500">Wednesday Hours</span>
              <p className="font-semibold">{scheduleData.wedHrs}</p>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500">Thursday Hours</span>
              <p className="font-semibold">{scheduleData.thursHrs}</p>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500">Friday Hours</span>
              <p className="font-semibold">{scheduleData.friHrs}</p>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500">Saturday Hours</span>
              <p className="font-semibold">{scheduleData.satHrs}</p>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500">Sunday Hours</span>
              <p className="font-semibold">{scheduleData.sunHrs}</p>
            </div>
          </div>
        )}
        <Button onClick={handleEditScheduleClick} className="mt-4 mr-2">
          {isScheduleAvailable ? "Edit" : "Add"} Schedule
        </Button>

        {isScheduleAvailable && (
          <Button
            onClick={handleDeleteScheduleClick}
            variant="danger"
            className="mt-4"
          >
            Delete Schedule
          </Button>
        )}
      </div>

      {/* Edit Schedule Modal */}
      {isManagingSchedule && (
        <ManageSchedule
          isModalOpen={isModalOpen}
          closeModalHandle={() => {
            closeModalHandle();
            setIsManagingSchedule(false);
          }}
          selectedSchedule={isScheduleAvailable ? scheduleData : null}
          handleManageSchedule={handleManageSchedule}
          employeeId={employeeId}
          setIsScheduleAvailable={setIsScheduleAvailable}
        />
      )}

      {/* Delete Schedule Modal */}
      {isDeletingSchedule && (
        <DeleteSchedule
          isOpen={isModalOpen}
          closeModal={() => {
            closeModalHandle();
            setIsDeletingSchedule(false);
          }}
          handleDeleteSchedule={handleDeleteSchedule}
          selectedSchedule={scheduleData}
        />
      )}
    </div>
  );
};

export default ManageEmployeeProfilePage;
