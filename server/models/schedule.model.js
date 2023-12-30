const throwError = require("../helpers/throwError.helper");
const Schedule = require("../schemas/schedule.schema.js");

const createSchedule = async (schedule) => {
  try {
    const newSchedule = await (
      await Schedule.create(schedule)
    ).populate("employee", "firstName lastName position");

    if (newSchedule) {
      return {
        status: "SUCCESS",
        data: newSchedule,
      };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 422,
          identifier: "0x000B00",
          message: "Failed to create schedule",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000B01");
  }
};

const countSchedules = async (filter) => {
  try {
    const count = await Schedule.countDocuments(filter);

    return {
      status: "SUCCESS",
      data: count,
    };
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000B08");
  }
};

const getSchedules = async (filter, page, limit) => {
  try {
    const schedules = await Schedule.find(filter, undefined, {
      skip: (page - 1) * limit,
      limit: limit,
    }).populate("employee", "firstName lastName position");

    if (schedules && schedules.length) {
      return {
        status: "SUCCESS",
        data: schedules,
      };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 404,
          identifier: "0x000B06",
          message: "Schedules not found",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000B07");
  }
};

const getScheduleById = async (scheduleId) => {
  try {
    const schedule = await Schedule.findOne(
      {
        _id: scheduleId,
        isDeleted: false,
      },
      { isDeleted: 0 }
    ).populate("employee", "firstName lastName position");

    if (schedule) {
      return {
        status: "SUCCESS",
        data: schedule,
      };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 404,
          identifier: "0x000B02",
          message: "Schedule not found",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000B03");
  }
};

const getScheduleByEmployeeId = async (employeeId) => {
  try {
    const schedule = await Schedule.findOne(
      {
        employee: employeeId,
        isDeleted: false,
      },
      { isDeleted: 0 }
    ).populate("employee", "firstName lastName position");

    console.log("schedule", schedule);
    console.log("employeeId", employeeId);

    if (schedule) {
      return {
        status: "SUCCESS",
        data: schedule,
      };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 404,
          identifier: "0x000B02",
          message: "Schedule not found",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000B03");
  }
};

const updateSchedule = async (scheduleId, schedule, options) => {
  try {
    const updatedSchedule = await Schedule.findOneAndUpdate(
      { _id: scheduleId, isDeleted: false },
      schedule,
      options
    );

    if (updatedSchedule) {
      return {
        status: "SUCCESS",
        data: updatedSchedule,
      };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 404,
          identifier: "0x000B04",
          message: "Schedule not found",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000B05");
  }
};

const deleteSchedule = async (scheduleId) => {
  try {
    const deletedSchedule = await Schedule.findOneAndUpdate(
      { _id: scheduleId, isDeleted: false },
      { isDeleted: true },
      { new: true, fields: { isDeleted: 1 } }
    );

    if (deletedSchedule?.isDeleted) {
      return {
        status: "SUCCESS",
      };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 404,
          identifier: "0x000B06",
          message: "Schedule not found",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000B07");
  }
};

module.exports = {
  createSchedule,
  countSchedules,
  getSchedules,
  getScheduleById,
  getScheduleByEmployeeId,
  updateSchedule,
  deleteSchedule,
};
