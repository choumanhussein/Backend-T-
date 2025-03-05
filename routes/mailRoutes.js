const express = require("express");
const router = express.Router();
const { welcomeMessage, sendEmail } = require("../controllers/mailController");

router.get("/", welcomeMessage);
router.post("/", sendEmail);

module.exports = router;