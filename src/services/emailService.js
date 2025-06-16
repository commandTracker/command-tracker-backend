import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

import ejs from "ejs";
import createError from "http-errors";
import mjml2html from "mjml";
import nodemailer from "nodemailer";

import { MESSAGES } from "../config/constants.js";
import config from "../config/env.js";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.email_user,
    pass: config.email_pass,
  },
});

const readEmailTemplate = async ({ message, url }) => {
  try {
    if (url === "") {
      const filePath = path.join(dirname, "../views", "errorTemplate.mjml.ejs");
      const template = await fs.readFile(filePath, "utf-8");
      const htmlContent = ejs.render(template, { message });
      const { html } = mjml2html(htmlContent, {
        validationLevel: "strict",
      });

      return html;
    }
    const filePath = path.join(dirname, "../views", "emailTemplate.mjml.ejs");
    const template = await fs.readFile(filePath, "utf-8");
    const htmlContent = ejs.render(template, { url });
    const { html } = mjml2html(htmlContent, {
      validationLevel: "strict",
    });

    return html;
  } catch (err) {
    throw createError.InternalServerError(MESSAGES.ERROR.FAILED_READ_TEMPLATE);
  }
};

const sendEmail = async ({ email, message, url }) => {
  try {
    const html = await readEmailTemplate({ message, url });
    const mailOptions = {
      from: config.email_user,
      to: email,
      subject: "Command Tracker ddd",
      html,
    };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    throw createError.InternalServerError(MESSAGES.ERROR.SERVER_ERROR);
  }
};

export { sendEmail, readEmailTemplate };
