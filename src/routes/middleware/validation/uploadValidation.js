import ytdl from "@distube/ytdl-core";
import createError from "http-errors";

import { MESSAGES, REQUIRED_FIELDS } from "../../../config/constants.js";
import { validateReqBody, validateFields } from "../../../utils/validation.js";

const validateMetadata = (metaData) => {
  const { isLiveContent, isShortsEligible } = metaData;

  if (isLiveContent || isShortsEligible) {
    const error = new createError.BadRequest(MESSAGES.ERROR.INVALID_VIDEO_TYPE);

    throw error;
  }
};

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

    const videoInfo = await ytdl.getBasicInfo(youtubeUrl);

    validateMetadata(videoInfo.videoDetails);

    next();
  } catch (error) {
    if (
      error.message.includes("Sign in to confirm your age") ||
      error.message.includes("Video unavailable")
    ) {
      next(new createError.BadRequest(MESSAGES.ERROR.INVALID_VIDEO_TYPE));
    } else if (error.message.includes("This is a private video")) {
      next(new createError.Forbidden(MESSAGES.ERROR.INACCESSIBLE_VIDEO));
    }

    next(error);
  }
};

export default validateUploadUrl;
