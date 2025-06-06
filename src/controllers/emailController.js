/* eslint-disable consistent-return */
import { publishToQueue } from "../utils/rabbitmqService.js";

const notifySubmissionSuccess = async (req, res, next) => {
  try {
    const downloadLink = "https://www.example.com";
    const obj = {
      to: "chosungkyung1601@gmail.com",
      subject: "test email",
      downloadLink,
    };
    await publishToQueue("email_queue", obj);
    return res.status(200).json({ message: "메일이 발송 되었습니다." });
  } catch (err) {
    next(err);
  }
};

export default notifySubmissionSuccess;
