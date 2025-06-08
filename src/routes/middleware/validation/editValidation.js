import createError from "http-errors";

import {
  HTTP_STATUS,
  MESSAGES,
  REQUIRED_FIELDS,
} from "../../../config/constants.js";
import { validateReqBody, validateFields } from "../../../utils/validation.js";

const validateEditRequest = (req, _res, next) => {
  try {
    validateReqBody(req.body);
    validateFields(req.body, REQUIRED_FIELDS.VIDEO_EDIT_REQUEST);

    const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;

    const { trimStart, trimEnd, email } = req.body;

    if (Number(trimStart) >= Number(trimEnd)) {
      throw createError(HTTP_STATUS.BAD_REQUEST, MESSAGES.ERROR.INVALID_TRIM);
    }

    if (pattern.test(email) === false) {
      throw createError(HTTP_STATUS.BAD_REQUEST, MESSAGES.ERROR.INVALID_EMAIL);
    }

    next();
  } catch (err) {
    next(err);
  }
};

export default validateEditRequest;
