/* eslint-disable consistent-return */
import { MESSAGES, HTTP_STATUS } from "../config/constants.js";
import { publishToQueue } from "../utils/rabbitmqService.js";

const notifySubmissionSuccess = async (req, res, next) => {
  try {
    const { to, downloadLink } = req.body;
    const obj = {
      to,
      subject: "Command Tracker",
      downloadLink,
    };

    await publishToQueue("email_queue", obj);

    res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES.SUCCESS.VIDEO_REQUEST,
      email: to,
    });
  } catch (err) {
    next(err);
  }
};

export default notifySubmissionSuccess;
