const bcrypt = require("bcrypt");
const generateToken = require("../helpers/generateToken.helper.js");
const throwError = require("../helpers/throwError.helper.js");
const Manager = require("../models/manager.model.js");

const registerManager = async (req, res, next) => {
  try {
    const { email } = req.body;

    const managerExist = await Manager.getManagerByEmail(email);

    if (managerExist.status === "SUCCESS") {
      throwError("FAILED", 409, "Email already exists", "0x000A04");
    }

    const newManager = await Manager.createManager(req.body);

    if (newManager.status === "FAILED") {
      throwError(
        newManager.status,
        newManager.error.statusCode,
        newManager.error.message,
        newManager.error.identifier
      );
    }

    const signedToken = await generateToken(newManager.data._id, "MANAGER");

    newManager.data.password = undefined;
    newManager.data.isDeleted = undefined;

    res.status(201).json({
      status: "SUCCESS",
      data: newManager.data,
      token: signedToken,
    });
  } catch (error) {
    next(error);
  }
};

const loginManager = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const projection = { password: 1 };
    const manager = await Manager.getManagerByEmail(email, projection);

    if (manager.status === "FAILED") {
      throwError(
        manager.status,
        401,
        "Invalid credentials",
        manager.error.identifier
      );
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      manager.data.password
    );

    if (!isPasswordValid) {
      throwError("FAILED", 401, "Invalid credentials", "0x000A05");
    }

    const signedToken = await generateToken(manager.data._id, "MANAGER");

    res.status(200).json({
      status: "SUCCESS",
      token: signedToken,
    });
  } catch (error) {
    next(error);
  }
};

const getManagerProfile = async (req, res, next) => {
  try {
    const managerId = req.user._id;

    const projection = { password: 0, isDeleted: 0 };
    const manager = await Manager.getManagerById(managerId, projection);

    if (manager.status === "FAILED") {
      throwError(
        manager.status,
        manager.error.statusCode,
        manager.error.message,
        manager.error.identifier
      );
    }

    res.status(200).json({
      status: "SUCCESS",
      data: manager.data,
    });
  } catch (error) {
    next(error);
  }
};

const updateManagerProfile = async (req, res, next) => {
  try {
    const managerId = req.user._id;

    if (req.body.password) {
      let manager = await Manager.getManagerById(managerId, { password: 1 });

      if (manager.status === "FAILED") {
        throwError(
          manager.status,
          manager.error.statusCode,
          manager.error.message,
          manager.error.identifier
        );
      }

      const isPasswordCorrect = await bcrypt.compare(
        req.body.oldPassword,
        manager.data.password
      );

      if (!isPasswordCorrect) {
        throwError("FAILED", 401, "Invalid credentials", "0x000F01");
      }
    }

    const options = { new: true, fields: { password: 0, isDeleted: 0 } };
    const updatedManager = await Manager.updateManager(
      managerId,
      req.body,
      options
    );

    if (updatedManager.status === "FAILED") {
      throwError(
        updatedManager.status,
        updatedManager.error.statusCode,
        updatedManager.error.message,
        updatedManager.error.identifier
      );
    }

    res.status(200).json({
      status: "SUCCESS",
      data: updatedManager.data,
    });
  } catch (error) {
    next(error);
  }
};

const deleteManagerProfile = async (req, res, next) => {
  try {
    const managerId = req.user._id;

    const deletedManager = await Manager.deleteManager(managerId);

    if (deletedManager.status === "FAILED") {
      throwError(
        deletedManager.status,
        deletedManager.error.statusCode,
        deletedManager.error.message,
        deletedManager.error.identifier
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
  registerManager,
  loginManager,
  getManagerProfile,
  updateManagerProfile,
  deleteManagerProfile,
};
