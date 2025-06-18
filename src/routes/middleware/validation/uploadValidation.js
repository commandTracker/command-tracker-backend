import ytdl from "@distube/ytdl-core";
import createError from "http-errors";

import { MESSAGES, REQUIRED_FIELDS } from "../../../config/constants.js";
import { validateReqBody, validateFields } from "../../../utils/validation.js";

const validateUploadUrl = async (req, res, next) => {
  try {
    validateReqBody(req.body);
    validateFields(req.body, REQUIRED_FIELDS.VIDEO_UPLOAD_REQUEST);

    const { youtubeUrl } = req.body;
    const isValid = ytdl.validateURL(youtubeUrl);

    if (!isValid) {
      const error = new createError.BadRequest(MESSAGES.ERROR.INVALID_URL);
      error.details = {
        invalid_url: youtubeUrl,
      };
      throw error;
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default validateUploadUrl;
