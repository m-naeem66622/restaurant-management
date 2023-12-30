const throwError = require("../helpers/throwError.helper");
const Manager = require("../schemas/manager.schema");

const createManager = async (manager) => {
  try {
    const newManager = await Manager.create(manager);

    if (newManager) {
      return {
        status: "SUCCESS",
        data: newManager,
      };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 422,
          identifier: "0x000A00",
          message: "Failed to create admin",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000A01");
  }
};

const getManagerById = async (managerId, projection) => {
  try {
    const manager = await Manager.findOne(
      { _id: managerId, isDeleted: false },
      projection
    );

    if (manager) {
      return {
        status: "SUCCESS",
        data: manager,
      };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 404,
          identifier: "0x000A02",
          message: "Manager not found",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000A03");
  }
};

const getManagerByEmail = async (email, projection) => {
  try {
    const manager = await Manager.findOne(
      { email, isDeleted: false },
      projection
    );

    if (manager) {
      return {
        status: "SUCCESS",
        data: manager,
      };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 404,
          identifier: "0x000A0A",
          message: "Manager not found",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000A0B");
  }
};

// NO need for this function
// const getManagers = async () => {
//   try {
//     const managers = await Manager.find();

//     if (managers) {
//       return {
//         status: "SUCCESS",
//         data: managers,
//       };
//     } else {
//       return {
//         status: "FAILED",
//         error: {
//           statusCode: 404,
//           identifier: "0x000A04",
//           message: "No managers found",
//         },
//       };
//     }
//   } catch (error) {
//     throwError("FAILED", 422, error.message, "0x000A05");
//   }
// };

const updateManager = async (managerId, manager, options) => {
  try {
    const updatedManager = await Manager.findOneAndUpdate(
      { _id: managerId, isDeleted: false },
      manager,
      options
    );

    if (updatedManager) {
      return {
        status: "SUCCESS",
        data: updatedManager,
      };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 404,
          identifier: "0x000A06",
          message: "Manager not found",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000A07");
  }
};

const deleteManager = async (managerId) => {
  try {
    const deletedManager = await Manager.findOneAndUpdate(
      { _id: managerId, isDeleted: false },
      {
        $set: { isDeleted: true },
      },
      { new: true, fields: { isDeleted: 1 } }
    );

    if (deletedManager?.isDeleted) {
      return {
        status: "SUCCESS",
      };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 404,
          identifier: "0x000A08",
          message: "Manager not found",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000A09");
  }
};

module.exports = {
  createManager,
  getManagerById,
  getManagerByEmail,
  updateManager,
  deleteManager,
};
