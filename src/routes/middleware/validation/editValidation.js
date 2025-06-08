import createError from "http-errors";

import {
  MESSAGES,
  REGEX_PATTERNS,
  REQUIRED_FIELDS,
} from "../../../config/constants.js";
import { validateReqBody, validateFields } from "../../../utils/validation.js";

const validateEditRequest = (req, _res, next) => {
  try {
    validateReqBody(req.body);
    validateFields(req.body, REQUIRED_FIELDS.VIDEO_EDIT_REQUEST);

    const pattern = REGEX_PATTERNS.EMAIL;

    const { trimStart, trimEnd, email } = req.body;

    if (Number(trimStart) >= Number(trimEnd)) {
      throw createError.BadRequest(MESSAGES.ERROR.INVALID_TRIM);
    }

    if (pattern.test(email) === false) {
      throw createError.BadRequest(MESSAGES.ERROR.INVALID_EMAIL);
    }

    next();
  } catch (err) {
    next(err);
  }
};

export default validateEditRequest;
