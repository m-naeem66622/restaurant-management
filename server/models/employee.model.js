const throwError = require("../helpers/throwError.helper");
const Employee = require("../schemas/employee.schema");

const createEmployee = async (employee) => {
  try {
    const newEmployee = await Employee.create(employee);

    if (newEmployee) {
      return {
        status: "SUCCESS",
        data: newEmployee,
      };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 422,
          identifier: "0x000B00",
          message: "Failed to create employee",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000B01");
  }
};

const countEmployees = async (filter) => {
  try {
    const count = await Employee.countDocuments(filter);

    return {
      status: "SUCCESS",
      data: count,
    };
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000B08");
  }
};

const getEmployees = async (filter, projection, page, limit) => {
  try {
    const employees = await Employee.find(filter, projection, {
      skip: (page - 1) * limit,
      limit: limit,
    });

    if (employees && employees.length) {
      return {
        status: "SUCCESS",
        data: employees,
      };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 404,
          identifier: "0x000B06",
          message: "Employees not found",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000B07");
  }
};

const getEmployeeById = async (employeeId, projection) => {
  try {
    const employee = await Employee.findOne(
      { _id: employeeId, isDeleted: false },
      projection
    );

    if (employee) {
      return {
        status: "SUCCESS",
        data: employee,
      };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 404,
          identifier: "0x000B02",
          message: "Employee not found",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000B03");
  }
};

const getEmployeeByEmail = async (
  email,
  projection,
  includeDeleted = false
) => {
  try {
    // const employee = await Employee.findOne(
    //   { email, isDeleted: false },
    //   projection
    // );

    const filter = { email };
    if (!includeDeleted) {
      filter.isDeleted = false;
    }

    const employee = await Employee.findOne(filter, projection);

    if (employee) {
      return {
        status: "SUCCESS",
        data: employee,
      };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 404,
          identifier: "0x000B04",
          message: "Employee not found",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000B05");
  }
};

const updateEmployee = async (employeeId, employee, options) => {
  try {
    const updatedEmployee = await Employee.findOneAndUpdate(
      { _id: employeeId, isDeleted: false },
      employee,
      options
    );

    if (updatedEmployee) {
      return {
        status: "SUCCESS",
        data: updatedEmployee,
      };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 404,
          identifier: "0x000B0A",
          message: "Employee not found",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000B0B");
  }
};

const deleteEmployee = async (employeeId) => {
  try {
    const deletedEmployee = await Employee.findOneAndUpdate(
      { _id: employeeId, isDeleted: false },
      { isDeleted: true },
      { new: true, fields: { isDeleted: 1 } }
    );

    if (deletedEmployee?.isDeleted) {
      return {
        status: "SUCCESS",
      };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 404,
          identifier: "0x000B0C",
          message: "Employee not found",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000B0D");
  }
};

module.exports = {
  createEmployee,
  countEmployees,
  getEmployees,
  getEmployeeById,
  getEmployeeByEmail,
  updateEmployee,
  deleteEmployee,
};
