const express = require("express");

const authController = require("../controllers/auth");

const router = express.Router();

router.post("/signin", authController.signInController);
router.post("/signup", authController.signUpController);
router.post("/refresh", authController.requestRefreshToken);
router.post("/logout", authController.logoutUser);

module.exports = router;
