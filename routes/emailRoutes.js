const { Router } = require("express");
const { sendEmail, verifyCode } = require("../controllers/emailControllers");

const router = Router();

router.route("/").post(sendEmail);

router.route("/confirm").post(verifyCode);

module.exports = router;
