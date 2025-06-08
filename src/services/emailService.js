import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

import ejs from "ejs";
import createError from "http-errors";
import nodemailer from "nodemailer";

import { HTTP_STATUS, MESSAGES } from "../../config/constants.js";
import config from "../../config/env.js";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.email_user,
    pass: config.email_pass,
  },
});

const readEmailTemplate = async (data) => {
  try {
    const filePath = path.join(dirname, "../views/emailTemplate.ejs");
    const template = await fs.readFile(filePath, "utf-8");
    const htmlContent = ejs.render(template, data);

    return htmlContent;
  } catch (err) {
    throw createError(
      HTTP_STATUS.SERVER_ERROR,
      MESSAGES.ERROR.FAILED_READ_TEMPLATE
    );
  }
};

const sendEmail = async ({ to, subject, downloadLink }) => {
  try {
    const html = await readEmailTemplate({ downloadLink });
    const mailOptions = {
      from: config.email_user,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    throw createError(HTTP_STATUS.SERVER_ERROR, MESSAGES.ERROR.SERVER_ERROR);
  }
};

export { sendEmail, readEmailTemplate };
