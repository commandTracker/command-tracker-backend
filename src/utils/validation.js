import createError from "http-errors";

import { MESSAGES, REQUIRED_FIELDS } from "../config/constants.js";

const validateField = (reqBody) => {
  if (reqBody === undefined) {
    const error = new createError.BadRequest(
      MESSAGES.ERROR.MISSING_REQUIRED_FIELD
    );
    error.details = { body: null };

    throw error;
  }

  REQUIRED_FIELDS.VIDEO_UPLOAD_REQUEST.forEach((field) => {
    if (reqBody[field] === undefined || reqBody[field].trim() === "") {
      const error = new createError.BadRequest(
        MESSAGES.ERROR.MISSING_REQUIRED_FIELD
      );
      error.details = { invalid_field: field };

      throw error;
    }
  });
};

export default validateField;
