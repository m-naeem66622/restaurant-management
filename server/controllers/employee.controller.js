const bcrypt = require("bcrypt");
const generateToken = require("../helpers/generateToken.helper");
const throwError = require("../helpers/throwError.helper.js");
const Employee = require("../models/employee.model.js");

const registerEmployee = async (req, res, next) => {
  try {
    const { email } = req.body;

    const employeeExist = await Employee.getEmployeeByEmail(
      email,
      undefined,
      true
    );

    if (employeeExist.status === "SUCCESS") {
      throwError("FAILED", 409, "Email already exists", "0x000B04");
    }

    const newEmployee = await Employee.createEmployee(req.body);

    if (newEmployee.status === "FAILED") {
      throwError(
        newEmployee.status,
        newEmployee.error.statusCode,
        newEmployee.error.message,
        newEmployee.error.identifier
      );
    }

    const signedToken = await generateToken(newEmployee.data._id, "EMPLOYEE");

    newEmployee.data.password = undefined;
    newEmployee.data.isDeleted = undefined;

    res.status(201).json({
      status: "SUCCESS",
      data: newEmployee.data,
      token: signedToken,
    });
  } catch (error) {
    next(error);
  }
};

const loginEmployee = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const projection = { password: 1 };
    const employee = await Employee.getEmployeeByEmail(email, projection);

    if (employee.status === "FAILED") {
      throwError(
        employee.status,
        401,
        "Invalid credentials",
        employee.error.identifier
      );
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      employee.data.password
    );

    if (!isPasswordValid) {
      throwError("FAILED", 401, "Invalid credentials", "0x000B05");
    }

    const signedToken = await generateToken(employee.data._id, "EMPLOYEE");

    employee.data.password = undefined;
    employee.data.isDeleted = undefined;

    res.status(200).json({
      status: "SUCCESS",
      token: signedToken,
    });
  } catch (error) {
    next(error);
  }
};

const getAllEmployees = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, ...restQuery } = req.query;
    const filter = { isDeleted: false, ...restQuery };
    const projection = { password: 0, isDeleted: 0 };
    const countEmployees = await Employee.countEmployees(filter);
    const employees = await Employee.getEmployees(
      filter,
      projection,
      page,
      limit
    );

    if (employees.status === "FAILED") {
      throwError(
        employees.status,
        employees.error.statusCode,
        employees.error.message,
        employees.error.identifier
      );
    }

    res.status(200).json({
      status: "SUCCESS",
      data: {
        metadata: {
          total: countEmployees.data,
          returned: employees.data.length,
          limit: parseInt(limit),
          page: parseInt(page),
        },
        documents: employees.data,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getEmployeeProfile = async (req, res, next) => {
  try {
    let employeeId;
    if (req.user.role === "EMPLOYEE") {
      employeeId = req.user._id;
    } else {
      employeeId = req.params.employeeId;
    }

    const projection = { password: 0, isDeleted: 0 };
    const employee = await Employee.getEmployeeById(employeeId, projection);

    if (employee.status === "FAILED") {
      throwError(
        employee.status,
        employee.error.statusCode,
        employee.error.message,
        employee.error.identifier
      );
    }

    res.status(200).json({
      status: "SUCCESS",
      data: employee.data,
    });
  } catch (error) {
    next(error);
  }
};

const updateEmployeeProfile = async (req, res, next) => {
  try {
    let employeeId;
    if (req.user.role === "EMPLOYEE") {
      employeeId = req.user._id;
    } else {
      employeeId = req.params.employeeId;
    }

    if (req.body.password) {
      let employee = await Employee.getEmployeeById(employeeId, {
        password: 1,
      });

      if (employee.status === "FAILED") {
        throwError(
          employee.status,
          employee.error.statusCode,
          employee.error.message,
          employee.error.identifier
        );
      }

      const isPasswordCorrect = await bcrypt.compare(
        req.body.oldPassword,
        employee.data.password
      );

      if (!isPasswordCorrect) {
        throwError("FAILED", 401, "Invalid credentials", "0x000F01");
      }
    }

    const options = { new: true, fields: { password: 0, isDeleted: 0 } };
    const updatedEmployee = await Employee.updateEmployee(
      employeeId,
      req.body,
      options
    );

    if (updatedEmployee.status === "FAILED") {
      throwError(
        updatedEmployee.status,
        updatedEmployee.error.statusCode,
        updatedEmployee.error.message,
        updatedEmployee.error.identifier
      );
    }

    res.status(200).json({
      status: "SUCCESS",
      data: updatedEmployee.data,
    });
  } catch (error) {
    next(error);
  }
};

const deleteEmployeeProfile = async (req, res, next) => {
  try {
    const { employeeId } = req.params;

    const deletedEmployee = await Employee.deleteEmployee(employeeId);

    if (deletedEmployee.status === "FAILED") {
      throwError(
        deletedEmployee.status,
        deletedEmployee.error.statusCode,
        deletedEmployee.error.message,
        deletedEmployee.error.identifier
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
  registerEmployee,
  loginEmployee,
  getAllEmployees,
  getEmployeeProfile,
  updateEmployeeProfile,
  deleteEmployeeProfile,
};
