const express = require("express");
const router = express.Router();
const { upload } = require("../helpers/filehelper");

const {
  getUser,
  getUserByEmail,
  updateUser,
  updateUserSavePost,
  deleteSavePost,
  deleteUser,
} = require("../controllers/user");

router.get("/:id", getUser);
router.get("/email/:email", getUserByEmail);
router.post("/update/:id", upload.single("file"), updateUser);
router.post("/update-save-post/:id", updateUserSavePost);
router.post("/deleted-save-post/:id", deleteSavePost);
router.post("/deleted/:id", deleteUser);

module.exports = router;
