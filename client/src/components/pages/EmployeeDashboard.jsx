import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../providers/AuthProvider";
import LogoutButton from "../common/LogoutButton";
import EditEmployee from "../common/EditEmployee";

const Dashboard = () => {
  const { accountDetail: employeeData, setAccountDetail } = useAuthContext();
  const [scheduleData, setScheduleData] = useState({});
  const [isScheduleAvailable, setIsScheduleAvailable] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const closeModalHandle = () => {
    console.log("closeModalHandle --> closing Modal after update");
    setIsModalOpen(false);
    document.body.style.overflow = "unset";
    setIsEditingProfile(false);
  };

  const handleEditProfileClick = () => {
    setIsEditingProfile(true);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const handleEditProfile = (updatedData) => {
    console.log("handleEditProfile --> updatedData:", updatedData)
    setAccountDetail(updatedData);
    closeModalHandle();
  };

  const getSchedule = async () => {
    try {
      const response = await fetch(
        import.meta.env.VITE_BASE_URL + "/api/employees/schedule/",
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
    getSchedule();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold mb-4">Employee Dashboard</h1>
        <LogoutButton />
      </div>

      {/* Profile Section */}
      <div className="bg-white rounded shadow-md p-4 mb-4">
        <h2 className="text-xl font-semibold mb-2">Profile</h2>
        <div>
          <p>
            <strong>Name:</strong> {employeeData.firstName}{" "}
            {employeeData.lastName}
          </p>
          <p>
            <strong>Email:</strong> {employeeData.email}
          </p>
          <p>
            <strong>Position:</strong> {employeeData.position}
          </p>
          <p>
            <strong>Contact Number:</strong> {employeeData.contactNumber}
          </p>
          <p>
            <strong>Address:</strong> {employeeData.address}
          </p>
        </div>
        <button
          onClick={handleEditProfileClick}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
        >
          Edit Profile
        </button>
      </div>

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <EditEmployee
          isModalOpen={isModalOpen}
          closeModalHandle={() => {
            closeModalHandle();
          }}
          selectedUser={employeeData}
          handleEditUser={handleEditProfile}
          forEmployee={true}
        />
      )}

      {/* Schedule Section */}
      <div className="bg-white rounded shadow-md p-4">
        <h2 className="text-xl font-semibold mb-2">Schedule</h2>
        {isScheduleAvailable ? (
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
        ) : (
          <p className="text-gray-500">
            No schedule has been decided yet for you
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
