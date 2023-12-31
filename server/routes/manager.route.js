const express = require("express");
const router = express.Router();

const Controller = require("../controllers/manager.controller");
const validate = require("../middlewares/validateReq.middleware");
const Validation = require("../validators/manager.validator");
const authenticate = require("../middlewares/authenticate.middleware");
const Authorize = require("../middlewares/authorize.middleware");

router.post(
  "/register",
  validate(Validation.registerSchema, "BODY"),
  authenticate,
  Authorize.isManager,
  Controller.registerManager
);

router.post(
  "/login",
  validate(Validation.loginSchema, "BODY"),
  Controller.loginManager
);

router.get(
  "/profile",
  authenticate,
  Authorize.isManager,
  Controller.getManagerProfile
);

router.patch(
  "/profile",
  validate(Validation.updateProfileSchema, "BODY"),
  authenticate,
  Authorize.isManager,
  Controller.updateManagerProfile
);

router.delete(
  "/profile",
  authenticate,
  Authorize.isManager,
  Controller.deleteManagerProfile
);

module.exports = router;
