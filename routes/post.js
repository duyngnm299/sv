const express = require("express");
const router = express.Router();

const { upload } = require("../helpers/filehelper");

const {
  createPost,
  getAllPost,
  updatePost,
  getPostOfUser,
} = require("../controllers/post");

router.post("/", upload.array("images"), createPost);
router.post("/:id", upload.array("images"), updatePost);
router.get("/", getAllPost);
router.get("/:id", getPostOfUser);
// router.get("/images", getImageOnPost);

module.exports = router;
