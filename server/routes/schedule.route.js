const express = require("express");
const router = express.Router();

const Controller = require("../controllers/schedule.controller");
const validate = require("../middlewares/validateReq.middleware");
const Validation = require("../validators/schedule.validator");
const authenticate = require("../middlewares/authenticate.middleware");
const Authorize = require("../middlewares/authorize.middleware");

// Create schedule
router.post(
  "/",
  validate(Validation.createSchema, "BODY"),
  authenticate,
  Authorize.isManager,
  Controller.createSchedule
);

// Get all schedules
router.get(
  "/",
  validate(Validation.getAllSchema, "QUERY"),
  authenticate,
  Authorize.isManager,
  Controller.getAllSchedules
);

// Get schedule by id
router.get(
  "/:scheduleId",
  validate(Validation.validateId, "PARAMS"),
  authenticate,
  Authorize.isManager,
  Controller.getScheduleById
);

// Update schedule
router.patch(
  "/:scheduleId",
  validate(Validation.validateId, "PARAMS"),
  validate(Validation.updateSchema, "BODY"),
  authenticate,
  Authorize.isManager,
  Controller.updateSchedule
);

// Delete schedule
router.delete(
  "/:scheduleId",
  validate(Validation.validateId, "PARAMS"),
  authenticate,
  Authorize.isManager,
  Controller.deleteSchedule
);

module.exports = router;
