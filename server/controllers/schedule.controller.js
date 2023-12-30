const throwError = require("../helpers/throwError.helper.js");
const Schedule = require("../models/schedule.model.js");

const createSchedule = async (req, res, next) => {
  try {
    const { employee } = req.body;

    const schedule = await Schedule.getScheduleByEmployeeId(employee);
    if (schedule.status === "SUCCESS") {
      throwError(
        "FAILED",
        409,
        "Schedule already exist with this employee",
        "0x000C04"
      );
    }

    const newSchedule = await Schedule.createSchedule(req.body);

    if (newSchedule.status === "FAILED") {
      throwError(
        newSchedule.status,
        newSchedule.error.statusCode,
        newSchedule.error.message,
        newSchedule.error.identifier
      );
    }

    // soft delete properties
    newSchedule.data.isDeleted = undefined;

    res.status(201).json({
      status: "SUCCESS",
      data: newSchedule.data,
    });
  } catch (error) {
    next(error);
  }
};

const getAllSchedules = async (req, res, next) => {
  try {
    const { page, limit, ...restQuery } = req.query;

    const filter = { isDeleted: false, ...restQuery };

    const countSchedules = await Schedule.countSchedules(filter);
    const schedules = await Schedule.getSchedules(
      filter,
      parseInt(page),
      parseInt(limit)
    );

    if (schedules.status === "FAILED") {
      throwError(
        schedules.status,
        schedules.error.statusCode,
        schedules.error.message,
        schedules.error.identifier
      );
    }

    res.status(200).json({
      status: "SUCCESS",
      data: {
        metadata: {
          total: countSchedules.data,
          returned: schedules.data.length,
          limit: parseInt(limit),
          page: parseInt(page),
        },
        documents: schedules.data,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getScheduleById = async (req, res, next) => {
  try {
    const { scheduleId } = req.params;
    const schedule = await Schedule.getScheduleById(scheduleId);

    if (schedule.status === "FAILED") {
      throwError(
        schedule.status,
        schedule.error.statusCode,
        schedule.error.message,
        schedule.error.identifier
      );
    }

    res.status(200).json({
      status: "SUCCESS",
      data: schedule.data,
    });
  } catch (error) {
    next(error);
  }
};

const getScheduleByEmployeeId = async (req, res, next) => {
  try {
    let employeeId;
    if (req.user.role === "EMPLOYEE") {
      employeeId = req.user._id;
    } else {
      employeeId = req.params.employeeId;
    }

    const schedule = await Schedule.getScheduleByEmployeeId(employeeId);

    if (schedule.status === "FAILED") {
      throwError(
        schedule.status,
        schedule.error.statusCode,
        schedule.error.message,
        schedule.error.identifier
      );
    }

    res.status(200).json({
      status: "SUCCESS",
      data: schedule.data,
    });
  } catch (error) {
    next(error);
  }
};

const updateSchedule = async (req, res, next) => {
  try {
    const { scheduleId } = req.params;
    const updatedSchedule = await Schedule.updateSchedule(scheduleId, req.body);

    if (updatedSchedule.status === "FAILED") {
      throwError(
        updatedSchedule.status,
        updatedSchedule.error.statusCode,
        updatedSchedule.error.message,
        updatedSchedule.error.identifier
      );
    }

    res.status(200).json({
      status: "SUCCESS",
      data: updatedSchedule.data,
    });
  } catch (error) {
    next(error);
  }
};

const deleteSchedule = async (req, res, next) => {
  try {
    const { scheduleId } = req.params;
    const deletedSchedule = await Schedule.deleteSchedule(scheduleId);

    if (deletedSchedule.status === "FAILED") {
      throwError(
        deletedSchedule.status,
        deletedSchedule.error.statusCode,
        deletedSchedule.error.message,
        deletedSchedule.error.identifier
      );
    }

    res.status(200).json({
      status: "SUCCESS",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSchedule,
  getAllSchedules,
  getScheduleById,
  getScheduleByEmployeeId,
  updateSchedule,
  deleteSchedule,
};
