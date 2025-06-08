import createError from "http-errors";

import { HTTP_STATUS, MESSAGES } from "../../config/constants.js";

const validateEditRequest = (req, _res, next) => {
  const { trim, email, side } = req.body;

  if (trim.length !== 2 || !email || !side) {
    return next(
      createError(
        HTTP_STATUS.BAD_REQUEST,
        MESSAGES.ERROR.MISSING_REQUIRED_FIELD
      )
    );
  }

  const [start, end] = trim.map(Number);

  if (start >= end) {
    return next(
      createError(HTTP_STATUS.BAD_REQUEST, MESSAGES.ERROR.INVALID_TRIM)
    );
  }

  next();
};

export default validateEditRequest;
