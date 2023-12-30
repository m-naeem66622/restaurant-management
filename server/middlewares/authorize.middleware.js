// Middleware for authorizing user roles (Manager, Employee)

const isManager = (req, res, next) => {
  if (req.user.role !== "MANAGER") {
    return res.status(403).json({
      status: "FAILED",
      error: {
        statusCode: 403,
        message: "Forbidden",
        identifier: "0x001300",
      },
    });
  }
  next();
};

const isEmployee = (req, res, next) => {
  if (req.user.role !== "EMPLOYEE") {
    return res.status(403).json({
      status: "FAILED",
      error: {
        statusCode: 403,
        message: "Forbidden",
        identifier: "0x001301",
      },
    });
  }
  next();
};

module.exports = { isManager, isEmployee };
