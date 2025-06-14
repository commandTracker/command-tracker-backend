import { MESSAGES, HTTP_STATUS } from "../config/constants.js";

const notifySubmissionSuccess = async (req, res, next) => {
  try {
    const { email } = req.body;

    res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES.SUCCESS.VIDEO_REQUEST,
      email,
    });
  } catch (err) {
    next(err);
  }
};

export default notifySubmissionSuccess;
