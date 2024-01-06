import nodemailer from "nodemailer";
import dotenv from "dotenv";
import Mail from "nodemailer/lib/mailer";

dotenv.config();

export const emtransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = emtransporter.sendMail;

emtransporter.sendMail = (options: Mail.Options) =>
  sendEmail({
    from: process.env.EMAIL_USER,
    ...options,
  });
