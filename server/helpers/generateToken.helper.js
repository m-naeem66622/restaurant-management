const JWT = require("jsonwebtoken");

const generateToken = async (_id, role) => {
  const tokenData = { _id, role };

  const signedToken = await JWT.sign(tokenData, process.env.JWT_SECRET);
  return signedToken;
};

module.exports = generateToken;
