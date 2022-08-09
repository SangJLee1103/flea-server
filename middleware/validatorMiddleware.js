const { validationResult } = require("express-validator");

exports.validatorErrorChecker = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(409).json({ message: errors.array() });
  }
  next();
}
