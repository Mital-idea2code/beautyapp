const jwt = require("jsonwebtoken");
const Beautician = require("../models/Beautician");
const { queryErrorRelatedResponse } = require("./sendResponse");

module.exports = async function (req, res, next) {
  let token = req.header("Authorization");
  if (token) {
    token = req.header("Authorization").replace("Bearer ", "");
  }
  if (!token) return queryErrorRelatedResponse(req, res, 402, "Access Denied.");
  try {
    const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    let beautician = await Beautician.findOne({ email: verified.email });
    if (!beautician) {
      return queryErrorRelatedResponse(req, res, 402, "Access Denied.");
    }
    req.beautician = beautician;
    req.token = token;
    next();
  } catch (error) {
    queryErrorRelatedResponse(req, res, 402, "Invalid Token.");
  }
};
