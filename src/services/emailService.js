import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

import ejs from "ejs";
import createError from "http-errors";
import nodemailer from "nodemailer";

import { MESSAGES } from "../config/constants.js";
import env from "../config/env.js";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.email_user,
    pass: env.email_pass,
  },
});

const readEmailTemplate = async ({ message, url }) => {
  try {
    if (url === "") {
      const filePath = path.join(dirname, "../views/errorTemplate.ejs");
      const template = await fs.readFile(filePath, "utf-8");
      const htmlContent = ejs.render(template, { message });

      return htmlContent;
    }
    const filePath = path.join(dirname, "../views/emailTemplate.ejs");
    const template = await fs.readFile(filePath, "utf-8");
    const htmlContent = ejs.render(template, { message, url });

    return htmlContent;
  } catch (err) {
    throw createError.InternalServerError(MESSAGES.ERROR.FAILED_READ_TEMPLATE);
  }
};

const sendEmail = async ({ email, message, url }) => {
  try {
    const html = await readEmailTemplate({ message, url });
    const mailOptions = {
      from: env.email_user,
      to: email,
      subject: "Command Tracker",
      html,
    };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    throw createError.InternalServerError(MESSAGES.ERROR.SERVER_ERROR);
  }
};

export { sendEmail, readEmailTemplate };
