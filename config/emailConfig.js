const nodemailer = require("nodemailer");

module.exports = {
  transporter: nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "chouman.hussein7@gmail.com",
      pass: process.env.EMAIL_PASSWORD || "xwwe dkvz mijp jfrc"
    }
  }),
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || "chouman.hussein7@gmail.com"
};