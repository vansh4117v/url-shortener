import nodemailer from "nodemailer";
import { config } from "../config/env.js";

const { SMTP_USER, SMTP_PASS } = config;
export const transporter = nodemailer.createTransport({
  host: config.SMTP_HOST,
  port: 587,
  secure: false,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});


