const express = require("express");
const router = express.Router();

const EmployeeController = require("../controllers/employee.controller");
const ScheduleController = require("../controllers/schedule.controller");
const validate = require("../middlewares/validateReq.middleware");
const Validation = require("../validators/employee.validator");
const authenticate = require("../middlewares/authenticate.middleware");
const Authorize = require("../middlewares/authorize.middleware");

// Register employee
router.post(
  "/register",
  validate(Validation.registerSchema, "BODY"),
  authenticate,
  Authorize.isManager,
  EmployeeController.registerEmployee
);

// Login employee
router.post(
  "/login",
  validate(Validation.loginSchema, "BODY"),
  EmployeeController.loginEmployee
);

// Get all employees
router.get(
  "/",
  validate(Validation.getAllSchema, "QUERY"),
  authenticate,
  Authorize.isManager,
  EmployeeController.getAllEmployees
);

// Get employee profile by employee
router.get(
  "/profile",
  authenticate,
  Authorize.isEmployee,
  EmployeeController.getEmployeeProfile
);

// Get employee schedule
router.get(
  "/schedule",
  authenticate,
  Authorize.isEmployee,
  ScheduleController.getScheduleByEmployeeId
);

// Get employee schedule
router.get(
  "/schedule/:employeeId",
  validate(Validation.validateId, "PARAMS"),
  authenticate,
  Authorize.isManager,
  ScheduleController.getScheduleByEmployeeId
);

// Get employee profile by manager
router.get(
  "/:employeeId",
  validate(Validation.validateId, "PARAMS"),
  authenticate,
  Authorize.isManager,
  EmployeeController.getEmployeeProfile
);

// Update employee profile by employee
router.patch(
  "/profile",
  validate(Validation.updateProfileSchemaForEmployee, "BODY"),
  authenticate,
  Authorize.isEmployee,
  EmployeeController.updateEmployeeProfile
);

// Update employee profile by manager
router.patch(
  "/:employeeId",
  validate(Validation.validateId, "PARAMS"),
  validate(Validation.updateProfileSchemaForManager, "BODY"),
  authenticate,
  Authorize.isManager,
  EmployeeController.updateEmployeeProfile
);

// Delete employee profile
router.delete(
  "/:employeeId",
  validate(Validation.validateId, "PARAMS"),
  authenticate,
  Authorize.isManager,
  EmployeeController.deleteEmployeeProfile
);

module.exports = router;
