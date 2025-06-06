import createError from "http-errors";

import { MESSAGES } from "../config/constants.js";

const validateReqBody = (reqBody) => {
  if (reqBody === undefined) {
    const error = new createError.BadRequest(
      MESSAGES.ERROR.MISSING_REQUIRED_FIELD
    );
    error.details = { body: null };

    throw error;
  }
};

const validateFields = (reqBody, requiredFields) => {
  requiredFields.forEach((field) => {
    if (reqBody[field] === undefined || reqBody[field].trim() === "") {
      const error = new createError.BadRequest(
        MESSAGES.ERROR.MISSING_REQUIRED_FIELD
      );
      error.details = { invalid_field: field };

      throw error;
    }
  });
};

export { validateReqBody, validateFields };
